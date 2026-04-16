import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "https://wzhub.gg/pt/loadouts";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept-Language": "pt-BR,pt;q=0.9"
};

const TIER_MAP = {
  "novo": "S", "nova": "S", "new": "S",
  "meta absoluta": "S", "absolute meta": "S", "pure meta": "S",
  "meta": "A",
  "contenders": "B", "aceitável": "B", "acceptable": "B", "viável": "B", "viable": "B",
  "sem classificação": "C", "unranked": "C", "niche": "C"
};

const TIPO_MAP = {
  "ar": "Rifle de Assalto", "assault rifle": "Rifle de Assalto", "assault": "Rifle de Assalto",
  "smg": "Submetralhadora", "submachine gun": "Submetralhadora",
  "sniper": "Franco-atirador", "sniper rifle": "Franco-atirador",
  "lmg": "Metralhadora", "light machine gun": "Metralhadora",
  "marksman": "Rifle de Precisão", "marksman rifle": "Rifle de Precisão",
  "battle rifle": "Rifle de Precisão", "rifle": "Rifle de Assalto",
  "shotgun": "Escopeta",
  "pistol": "Pistola", "handgun": "Pistola",
  "launcher": "Lançador",
  "melee": "Corpo a Corpo",
  "special": "Especial"
};

function normalizeTier(text) {
  const t = (text || "").toLowerCase().trim();
  return TIER_MAP[t] || "B";
}

function normalizeTipo(text) {
  const t = (text || "").toLowerCase().trim()
    .replace(/\s*warzone\s*/gi, "").trim();
  for (const [key, val] of Object.entries(TIPO_MAP)) {
    if (t === key || t.startsWith(key)) return val;
  }
  return null; // retorna null se não reconhecido — card será ignorado
}

function clean(text) {
  return (text || "").replace(/[\n\r\t]/g, " ").replace(/\s{2,}/g, " ").trim();
}

// Converte slug da URL em nome de arma legível
// /pt/loadouts/bo7-strider-300 → "STRIDER 300"
// /pt/loadouts/bo7-mk.78 → "MK.78"
function slugToName(href) {
  // Extrai última parte da URL
  const slug = (href || "").split("/").pop();
  // Remove prefixo de jogo (bo7-, mw3-, mw2-)
  const withoutGame = slug.replace(/^(?:bo7|mw3|mw2|wz2|wzm)-/, "");
  // Substitui hífens por espaços e coloca em maiúsculo
  return withoutGame.replace(/-/g, " ").toUpperCase().trim();
}

// Remove duplicação de slot no nome do attachment
function cleanAttachment(nome, slot) {
  let n = clean(nome);
  if (slot && n.toLowerCase().endsWith(slot.toLowerCase())) {
    n = n.slice(0, n.length - slot.length).trim();
  }
  return n;
}

export async function scrapeWzhub() {
  console.log("[wzhub] Iniciando scraping...");
  const loadouts = [];

  try {
    const res = await axios.get(BASE, { headers: HEADERS, timeout: 15000 });
    const $ = cheerio.load(res.data);

    $(".wrap-card.loadout-card, .loadout-card").each((_, card) => {
      try {
        const $card = $(card);

        // 1. Nome da arma — extrai do href da URL (confiável no SSR)
        const $badge = $card.find("a.gun-badge").first();
        const href = $badge.attr("href") || "";

        // Só processa armas BO7 (descarta MW2/MW3/WZ2 antigas)
        if (!href.includes("/bo7-")) return;

        // Tenta pegar nome do texto primeiro (disponível para alguns cards no SSR)
        const nomeTexto = clean($badge.find(".gun-badge__text").text());
        const arma = nomeTexto || slugToName(href);
        if (!arma) return;

        // 2. Tipo da arma — div.loadout-card__type
        const tipoRaw = clean($card.find(".loadout-card__type").first().text());
        const tipo = normalizeTipo(tipoRaw);
        if (!tipo) return; // ignora cards sem tipo reconhecido

        // 3. Tier — div.loadout-card__category
        const tierRaw = clean($card.find(".loadout-card__category").first().text());
        const tier = normalizeTier(tierRaw);

        // 4. Código do loadout
        const codigo = clean($card.find(".loadout-card-code__content").first().text())
          .replace(/\s/g, "");

        // 5. Attachments
        const attachments = [];
        const seenAtt = new Set();
        $card.find(".attachment-card").each((_, att) => {
          const $att = $(att);
          const nomeRaw = clean($att.find(".attachment-card-content__name > div").first().text());
          const slot = clean($att.find(".attachment-card-content__name > span").first().text());
          const nome = cleanAttachment(nomeRaw, slot);
          if (nome && slot) {
            const key = `${slot}|${nome}`;
            if (!seenAtt.has(key)) {
              seenAtt.add(key);
              attachments.push({ slot, nome });
            }
          }
        });

        if (attachments.length > 0) {
          loadouts.push({
            arma, tipo, tier, codigo, attachments,
            fonte: "wzhub.gg",
            atualizadoEm: new Date().toISOString()
          });
        }
      } catch { /* ignora card com erro */ }
    });

    // Deduplica por arma (mantém o primeiro, que geralmente é S/A tier)
    const seen = new Set();
    const dedup = loadouts.filter(l => {
      const key = l.arma.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`[wzhub] ${dedup.length} loadouts extraídos (${loadouts.length} raw)`);
    return dedup;
  } catch (e) {
    console.error("[wzhub] Erro:", e.message);
    return [];
  }
}
