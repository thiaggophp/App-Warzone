import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import cron from "node-cron";
import PocketBase from "pocketbase";
import { writeFile, readFile, mkdir } from "fs/promises";
import { scrapeWzhub } from "./scrapers/wzhub.js";
import { scrapeCodmunity } from "./scrapers/codmunity.js";
import { scrapeWzstats } from "./scrapers/wzstats.js";
import { scrapeRSS } from "./scrapers/rss.js";
import { scrapeNerfBuff } from "./scrapers/nerfbuff.js";
import { scrapeTemporada } from "./scrapers/temporada.js";
import { scrapeCodBlog } from "./scrapers/codBlog.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// DATA_DIR pode ser sobrescrito via variável de ambiente (usado no VPS para servir via nginx)
const DATA_DIR = process.env.DATA_DIR || resolve(__dirname, "../public/data");

// Carrega .env do diretório do scraper (funciona tanto com "node index.js" quanto "npm run scrape")
config({ path: resolve(__dirname, ".env") });

const PB_URL = process.env.PB_URL || "https://api.vexasistemas.com.br";
const PB_EMAIL = process.env.PB_EMAIL || "";
const PB_PASSWORD = process.env.PB_PASSWORD || "";

// Intervalos em minutos (configuráveis via .env)
const NEWS_MIN = Math.max(15, parseInt(process.env.NEWS_INTERVAL) || 30);
const META_MIN = Math.max(60, parseInt(process.env.META_INTERVAL) || 120);

let pb = null;

async function initPocketBase() {
  if (!PB_EMAIL || !PB_PASSWORD) {
    console.log("[pb] Credenciais nao configuradas — modo so leitura (sem salvar)");
    return false;
  }
  try {
    pb = new PocketBase(PB_URL);
    await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);
    console.log("[pb] Autenticado com sucesso");
    return true;
  } catch (e) {
    console.error("[pb] Falha na autenticacao:", e.message);
    pb = null;
    return false;
  }
}

// Apaga e recria todos os registros de uma colecao
async function replaceAll(collection, records) {
  if (!pb || !records.length) return;
  try {
    const existing = await pb.collection(collection).getFullList({ fields: "id" });
    for (let i = 0; i < existing.length; i += 20) {
      await Promise.all(existing.slice(i, i + 20).map(r => pb.collection(collection).delete(r.id)));
    }
    let saved = 0;
    for (const record of records) {
      try {
        await pb.collection(collection).create(record);
        saved++;
      } catch (e) {
        console.error(`[pb] Erro ao inserir em ${collection}:`, e.message);
      }
    }
    console.log(`[pb] ${collection}: ${saved}/${records.length} registros salvos`);
  } catch (e) {
    console.error(`[pb] Erro ao atualizar ${collection}:`, e.message);
  }
}

async function saveJSON(filename, data) {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(resolve(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
    const count = Array.isArray(data) ? `${data.length} itens` : "objeto";
    console.log(`[json] Salvo: public/data/${filename} (${count})`);
  } catch (e) {
    console.error(`[json] Erro ao salvar ${filename}:`, e.message);
  }
}

async function readJSON(filename) {
  try {
    const raw = await readFile(resolve(DATA_DIR, filename), "utf-8");
    return JSON.parse(raw);
  } catch { return null; }
}

// Ciclo 1: Meta + Loadouts (sites pesados — a cada 2 horas)
async function runMeta() {
  console.log("\n[meta] Iniciando ciclo META/LOADOUTS —", new Date().toLocaleString("pt-BR"));

  const [loadoutsWzhub, metaCodmunity, metaWzstats] = await Promise.all([
    scrapeWzhub(),
    scrapeCodmunity(),
    scrapeWzstats()
  ]);

  const TIER_ORDER = { S: 0, A: 1, B: 2, C: 3 };

  // Merge inteligente: combina dados de múltiplas fontes sem duplicar armas
  // Prioridade de tier: menor número = melhor (S=0). Em empate, mantém o existente.
  // pickRate: prefere o maior valor disponível
  // tipo: prefere o que não for "Desconhecido"
  function mergeEntry(existing, novo) {
    const tierAtual = TIER_ORDER[existing.tier] ?? 9;
    const tierNovo = TIER_ORDER[novo.tier] ?? 9;
    return {
      ...existing,
      tier: tierAtual <= tierNovo ? existing.tier : novo.tier,
      pickRate: Math.max(existing.pickRate || 0, novo.pickRate || 0),
      winRate: Math.max(existing.winRate || 0, novo.winRate || 0),
      tipo: (existing.tipo && existing.tipo !== "Desconhecido") ? existing.tipo : (novo.tipo || existing.tipo),
      fonte: existing.fonte // mantém fonte primária
    };
  }

  const metaMap = new Map();

  // 1. wzhub — fonte primária (tem tipo em PT, tier por categoria)
  for (const item of loadoutsWzhub) {
    const key = item.arma.toLowerCase();
    const entry = { arma: item.arma, tipo: item.tipo, tier: item.tier, pickRate: 0, winRate: 0, fonte: item.fonte, atualizadoEm: item.atualizadoEm };
    metaMap.set(key, entry);
  }

  // 2. codmunity — complementa com pickRate/winRate/kdRatio
  for (const item of metaCodmunity) {
    const key = item.arma.toLowerCase();
    if (metaMap.has(key)) {
      metaMap.set(key, mergeEntry(metaMap.get(key), item));
    } else {
      metaMap.set(key, item);
    }
  }

  // 3. wzstats — adiciona armas ausentes e complementa pickRate
  for (const item of metaWzstats) {
    const key = item.arma.toLowerCase();
    if (metaMap.has(key)) {
      metaMap.set(key, mergeEntry(metaMap.get(key), item));
    } else {
      metaMap.set(key, item);
    }
  }

  const metaFinal = [...metaMap.values()]
    .filter(w => w.arma && w.tipo !== "Desconhecido" && Boolean(w.tipo));
  const loadoutsFinal = loadoutsWzhub.map(l => ({
    ...l,
    attachments: JSON.stringify(l.attachments || []),
    perks: JSON.stringify(l.perks || [])
  }));

  console.log(`[meta] ${metaFinal.length} armas | ${loadoutsWzhub.length} loadouts`);

  await saveJSON("meta.json", metaFinal);
  await saveJSON("loadouts.json", loadoutsWzhub);

  if (pb) {
    await replaceAll("wz_meta", metaFinal);
    await replaceAll("wz_loadouts", loadoutsFinal);
  }

  // Verifica e atualiza datas da temporada (passa patches se já disponíveis)
  const patchesAtual = await readJSON("patches.json");
  await runVerificaTemporada(patchesAtual || []);
}

// Deriva temporada atual a partir dos patches já scraped
// Retorna { numero, inicio, fim } ou null
async function derivarTemporadaDosPatches(patches) {
  if (!patches || patches.length === 0) return null;

  // Filtra patches BO7 (a partir de Dez/2025, quando BO7 lançou) com nome limpo
  // Exclui ciclos anteriores (MW3/WZ2) que têm os mesmos nomes de temporada
  const bo7 = patches.filter(p =>
    p.data >= "2025-12-01" &&
    p.temporada &&
    /^Season\s+\d+$/i.test(p.temporada.trim())
  );
  if (bo7.length === 0) return null;

  // Agrupa por temporada, pega início (data mais antiga do grupo)
  const byTemp = {};
  bo7.forEach(p => {
    const s = p.temporada.trim();
    if (!byTemp[s]) byTemp[s] = { inicio: p.data };
    if (p.data < byTemp[s].inicio) byTemp[s].inicio = p.data;
  });

  // Ordena por início decrescente — o mais recente é a temporada atual
  const sorted = Object.entries(byTemp)
    .map(([nome, v]) => ({ nome, inicio: v.inicio }))
    .sort((a, b) => b.inicio.localeCompare(a.inicio));

  if (sorted.length === 0) return null;

  const atual = sorted[0];

  // Calcula duração média entre temporadas (baseado no histórico BO7)
  let duracaoMedia = 63; // fallback: 63 dias (~2 meses, padrão Warzone)
  if (sorted.length >= 2) {
    const duracoes = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const dias = Math.round(
        (new Date(sorted[i].inicio) - new Date(sorted[i + 1].inicio)) / (1000 * 60 * 60 * 24)
      );
      if (dias >= 40 && dias <= 100) duracoes.push(dias);
    }
    if (duracoes.length > 0) duracaoMedia = Math.round(duracoes.reduce((a, b) => a + b, 0) / duracoes.length);
  }

  const fimDate = new Date(new Date(atual.inicio).getTime() + duracaoMedia * 24 * 60 * 60 * 1000);
  const fim = fimDate.toISOString().slice(0, 10);

  return { numero: `Temporada ${atual.nome.match(/\d+/)[0]}`, inicio: atual.inicio, fim };
}

async function runVerificaTemporada(patches) {
  // Tenta derivar das patches (método primário — muito confiável)
  let scraped = await derivarTemporadaDosPatches(patches);

  // Fallback: RSS (método original, menos confiável)
  if (!scraped) {
    scraped = await scrapeTemporada();
  }

  if (!scraped) {
    console.log("[temporada] Não foi possível detectar a temporada atual");
    return;
  }

  // Lê temporada atual (JSON salvo anteriormente) para comparar e preservar campos manuais
  const atual = await readJSON("temporada.json");
  const base = atual || {};

  // Detecta mudança de temporada para alertar no log
  if (base.numero && base.numero !== scraped.numero) {
    console.log(`\n⚠️  NOVA TEMPORADA DETECTADA: ${base.numero} → ${scraped.numero}`);
    console.log("   Considere atualizar: descricao, novidades, passeDeBatalha em mockData.js\n");
  }

  // Verifica se algo mudou antes de salvar
  if (base.inicio === scraped.inicio && base.fim === scraped.fim && base.numero === scraped.numero) {
    console.log(`[temporada] ${scraped.numero} — ${scraped.inicio} a ${scraped.fim} (sem alteração)`);
    return;
  }

  // Mescla: atualiza numero/inicio/fim; preserva campos descritivos manuais
  const merged = { ...base, ...scraped };
  console.log(`[temporada] Atualizado: ${scraped.numero} — ${scraped.inicio} a ${scraped.fim}`);
  await saveJSON("temporada.json", merged);

  if (pb) {
    try {
      const list = await pb.collection("wz_temporada").getFullList({ sort: "-inicio", limit: 1 });
      if (list[0]) {
        await pb.collection("wz_temporada").update(list[0].id, merged);
      } else {
        await pb.collection("wz_temporada").create(merged);
      }
      console.log("[pb] wz_temporada atualizada");
    } catch (e) {
      console.error("[pb] Erro ao atualizar wz_temporada:", e.message);
    }
  }
}

// Ciclo 2: Notícias (RSS leve — a cada 30 minutos)
async function runNoticias() {
  console.log("\n[news] Iniciando ciclo NOTICIAS —", new Date().toLocaleString("pt-BR"));

  const [noticiaRSS, codBlog, patches] = await Promise.all([
    scrapeRSS(),
    scrapeCodBlog(),
    scrapeNerfBuff()
  ]);

  // Merge e deduplica por URL, ordena por data
  const urlsSeen = new Set();
  const noticias = [...noticiaRSS, ...codBlog]
    .filter(n => { if (!n.url || urlsSeen.has(n.url)) return false; urlsSeen.add(n.url); return true; })
    .sort((a, b) => new Date(b.publicadoEm) - new Date(a.publicadoEm));

  console.log(`[news] ${noticias.length} noticias (rss:${noticiaRSS.length} + blog:${codBlog.length}) | ${patches.length} patches`);

  await saveJSON("noticias.json", noticias);
  await saveJSON("patches.json", patches);

  // Atualiza temporada usando os patches recém-scraped
  if (patches.length > 0) await runVerificaTemporada(patches);

  if (pb) {
    await replaceAll("wz_noticias", noticias);
    await replaceAll("wz_patches", patches);
  }
}

async function main() {
  console.log("=== RECON Scraper ===");
  console.log(`Backend: ${PB_URL}`);

  await initPocketBase();

  // Executa tudo imediatamente na inicialização
  await runMeta();
  await runNoticias();

  // Ciclo de notícias (intervalo configurável via NEWS_INTERVAL no .env)
  cron.schedule(`*/${NEWS_MIN} * * * *`, async () => {
    await runNoticias();
  });

  // Ciclo de meta/loadouts (intervalo configurável via META_INTERVAL no .env)
  // Converte minutos para expressão cron: se >= 60, usa hora; senão usa minuto
  const metaCron = META_MIN >= 60
    ? `0 */${Math.floor(META_MIN / 60)} * * *`
    : `*/${META_MIN} * * * *`;

  cron.schedule(metaCron, async () => {
    await runMeta();
  });

  const agora = new Date();
  const proxNews = new Date(agora.getTime() + NEWS_MIN * 60 * 1000);
  const proxMeta = new Date(agora.getTime() + META_MIN * 60 * 1000);

  console.log("\n[cron] Intervalos configurados:");
  console.log(`  Noticias:        a cada ${NEWS_MIN} min   (proxima: ${proxNews.toLocaleTimeString("pt-BR")})`);
  console.log(`  Meta + Loadouts: a cada ${META_MIN} min  (proxima: ${proxMeta.toLocaleTimeString("pt-BR")})`);
}

main().catch(console.error);
