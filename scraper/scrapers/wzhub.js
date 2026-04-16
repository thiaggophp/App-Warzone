import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "https://wzhub.gg/pt/loadouts";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept-Language": "pt-BR,pt;q=0.9"
};

const TIER_MAP = {
  "novo": "S", "nova": "S", "meta absoluta": "S", "absolute meta": "S",
  "meta": "A", "contenders": "B", "aceitável": "B", "viable": "B", "sem classificação": "C"
};

const TIPO_MAP = {
  "ar": "Rifle de Assalto",
  "assault rifle": "Rifle de Assalto",
  "smg": "Submetralhadora",
  "submachine gun": "Submetralhadora",
  "sniper": "Franco-atirador",
  "sniper rifle": "Franco-atirador",
  "lmg": "Metralhadora",
  "light machine gun": "Metralhadora",
  "shotgun": "Escopeta",
  "pistol": "Pistola",
  "handgun": "Pistola",
  "rifle": "Rifle de Precisão",
  "b.rifles": "Rifle de Precisão",
  "marksman rifle": "Rifle de Precisão",
  "special": "Especial",
  "launcher": "Lançador",
  "melee": "Corpo a Corpo"
};

function normalizeTier(text) {
  const t = (text || "").toLowerCase().trim();
  return TIER_MAP[t] || "B";
}

function normalizeTipo(text) {
  // Remove sufixo " Warzone", " warzone" e normaliza
  const clean = text.replace(/\s*warzone\s*/gi, "").trim().toLowerCase();
  return TIPO_MAP[clean] || text.split(" ")[0]; // fallback: primeira palavra original
}

// Limpa texto: remove quebras de linha, espaços múltiplos
function clean(text) {
  return (text || "").replace(/[\n\r\t]/g, " ").replace(/\s{2,}/g, " ").trim();
}

// Remove o sufixo do slot que aparece duplicado no nome do attachment
// Ex: "SILENCIADOR MONOLÍTICO  Boca" → "SILENCIADOR MONOLÍTICO"
function cleanAttachmentName(nome, slot) {
  let n = clean(nome);
  // Remove o slot do final se estiver duplicado
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

    $(".loadout-card, .wrap-card").each((_, card) => {
      try {
        const $card = $(card);

        // Nome da arma
        const arma = clean($card.find(".loadout-card__title, .gun-badge, h2, h3").first().text());
        if (!arma) return;
        // Filtra slugs de promoção (tudo minúsculo + hífen = slug de URL) e nomes de jogos
        // Armas reais com hífen (ex: GPMG-7, DM-10) são maiúsculas — não devem ser filtradas
        const lowerArma = arma.toLowerCase();
        if (lowerArma.includes("warzone") || lowerArma.includes("call of duty")) return;
        if (lowerArma === arma && arma.includes("-")) return; // slug: tudo minúsculo com hífen

        // Tipo/categoria — normaliza para português
        const tipoRaw = clean($card.find(".loadout-card__type, .loadout-card__category").first().text());
        const tipoClean = tipoRaw.split(/[\n\r]/)[0].trim() || "Desconhecido";
        const tipo = normalizeTipo(tipoClean);

        // Tier
        const tierText = clean($card.find(".loadout-card__meta, .category-badge, [class*='category']").first().text());
        const tier = normalizeTier(tierText);

        // Código do loadout
        const codigo = clean($card.find(".loadout-card-code, [class*='code']").first().text()).replace(/\s/g, "");

        // Attachments — cada .attachment-card tem slot + nome
        const attachments = [];
        const seenAttachments = new Set();
        $card.find(".attachment-card, [class*='attachment']").each((_, att) => {
          const $att = $(att);
          const slot = clean($att.find("[class*='slot'], [class*='type'], span").first().text());
          const nomeRaw = clean($att.find(".attachment-card-content__name, [class*='name']").first().text());
          const nome = cleanAttachmentName(nomeRaw, slot);
          if (slot && nome) {
            const key = `${slot}|${nome}`;
            if (!seenAttachments.has(key)) {
              seenAttachments.add(key);
              attachments.push({ slot, nome });
            }
          }
        });

        // Perks
        const perks = [];
        const seenPerks = new Set();
        $card.find("[class*='perk']").each((_, p) => {
          const nome = clean($(p).text());
          if (nome && nome.length < 40 && !seenPerks.has(nome)) {
            seenPerks.add(nome);
            perks.push(nome);
          }
        });

        if (arma && attachments.length > 0) {
          loadouts.push({
            arma, tipo, tier, codigo, attachments, perks,
            fonte: "wzhub.gg",
            atualizadoEm: new Date().toISOString()
          });
        }
      } catch (e) { /* ignora card com erro */ }
    });

    console.log(`[wzhub] ${loadouts.length} loadouts extraídos`);
  } catch (e) {
    console.error("[wzhub] Erro:", e.message);
  }
  return loadouts;
}
