import axios from "axios";

const BASE = "https://codmunity.gg/pt/warzone/weapons";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept-Language": "pt-BR,pt;q=0.9",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
};

const TIER_MAP = {
  "s": "S", "a": "A", "b": "B", "c": "C", "d": "C",
  "op": "S", "overpowered": "S", "broken": "S",
  "meta": "A", "strong": "A", "good": "A",
  "average": "B", "decent": "B", "viable": "B",
  "weak": "C", "bad": "C", "niche": "C",
  // Português
  "excelente": "S", "ótimo": "A", "bom": "B", "fraco": "C"
};

function normalizeTier(t) {
  const key = (t || "").toLowerCase().trim();
  return TIER_MAP[key] || "B";
}

// Busca recursiva por arrays de armas no JSON do Angular SSR
function findWeapons(data, depth = 0) {
  if (!data || typeof data !== "object" || depth > 10) return [];
  if (Array.isArray(data)) {
    // Verifica se parece um array de armas
    const first = data[0];
    if (first && typeof first === "object" && (first.name || first.weaponName || first.weapon_name || first.title)) {
      return data;
    }
    for (const item of data) {
      const r = findWeapons(item, depth + 1);
      if (r.length > 0) return r;
    }
    return [];
  }
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (typeof val === "object" && val !== null) {
      const r = findWeapons(val, depth + 1);
      if (r.length > 0) return r;
    }
  }
  return [];
}

export async function scrapeCodmunity() {
  console.log("[codmunity] Iniciando scraping...");
  const meta = [];
  try {
    const res = await axios.get(BASE, { headers: HEADERS, timeout: 20000 });
    const html = res.data;

    // Angular SSR embute o estado da aplicação num script com id="serverApp-state"
    const match = html.match(/<script id="serverApp-state"[^>]*type="application\/json"[^>]*>([^<]+)<\/script>/i)
      || html.match(/<script id="serverApp-state"[^>]*>([^<]+)<\/script>/i);

    if (!match) {
      console.log("[codmunity] serverApp-state nao encontrado — tentando cheerio fallback");
      return meta;
    }

    // Decodifica entidades HTML presentes no JSON
    const jsonStr = match[1]
      .replace(/&quot;/g, '"')
      .replace(/&#34;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");

    let data;
    try {
      data = JSON.parse(jsonStr);
    } catch {
      console.log("[codmunity] Erro ao parsear JSON do serverApp-state");
      return meta;
    }

    const weapons = findWeapons(data);
    for (const w of weapons) {
      const arma = w.name || w.weaponName || w.weapon_name || w.title || "";
      if (!arma) continue;
      meta.push({
        arma,
        tipo: w.category || w.type || w.weaponType || "Desconhecido",
        tier: normalizeTier(w.tier || w.rating || w.rank || ""),
        pickRate: parseFloat(w.pickRate || w.pick_rate || w.usage_rate || 0),
        winRate: parseFloat(w.winRate || w.win_rate || 0),
        kdRatio: parseFloat(w.kdRatio || w.kd_ratio || w.kd || 0),
        fonte: "codmunity.gg",
        atualizadoEm: new Date().toISOString()
      });
    }

    console.log(`[codmunity] ${meta.length} armas extraidas`);
  } catch (e) {
    console.error("[codmunity] Erro:", e.message);
  }
  return meta;
}
