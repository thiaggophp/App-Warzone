import axios from "axios";

// wzstats.gg é Angular SPA — tenta encontrar a API interna que o app consome
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "pt-BR,pt;q=0.9",
  "Referer": "https://wzstats.gg/pt"
};

const TIER_MAP = {
  s: "S", a: "A", b: "B", c: "C", d: "C",
  op: "S", overpowered: "S", broken: "S",
  meta: "A", strong: "A", good: "A",
  average: "B", decent: "B", viable: "B",
  weak: "C", bad: "C", niche: "C",
  "meta absoluta": "S", excelente: "S",
  ótimo: "A", bom: "B", fraco: "C"
};

const TIPO_MAP = {
  ar: "Rifle de Assalto",
  "assault rifle": "Rifle de Assalto",
  assault: "Rifle de Assalto",
  smg: "Submetralhadora",
  "submachine gun": "Submetralhadora",
  submachine: "Submetralhadora",
  sniper: "Franco-atirador",
  "sniper rifle": "Franco-atirador",
  lmg: "Metralhadora",
  "light machine gun": "Metralhadora",
  "light machine": "Metralhadora",
  shotgun: "Escopeta",
  pistol: "Pistola",
  handgun: "Pistola",
  "marksman rifle": "Rifle de Precisão",
  marksman: "Rifle de Precisão",
  "battle rifle": "Rifle de Precisão",
  launcher: "Lançador",
  melee: "Corpo a Corpo"
};

function normalizeTier(t) {
  const key = (t || "").toLowerCase().trim();
  return TIER_MAP[key] || "B";
}

function normalizeTipo(t) {
  const key = (t || "").toLowerCase().trim()
    .replace(/\s*warzone\s*/gi, "").trim();
  for (const [k, v] of Object.entries(TIPO_MAP)) {
    if (key === k || key.startsWith(k)) return v;
  }
  return t || "Desconhecido";
}

async function tryGet(url) {
  try {
    const res = await axios.get(url, { headers: HEADERS, timeout: 8000 });
    if (res.status === 200 && res.data) return res.data;
  } catch { /* ignora */ }
  return null;
}

// Tenta encontrar e parsear array de armas em qualquer estrutura JSON
function extractWeaponsFromJSON(data) {
  if (!data || typeof data !== "object") return [];
  if (Array.isArray(data)) {
    const first = data[0];
    if (first && typeof first === "object") {
      const keys = Object.keys(first);
      if (keys.some(k => /name|weapon|arma/i.test(k))) return data;
    }
    for (const item of data) {
      const r = extractWeaponsFromJSON(item);
      if (r.length > 0) return r;
    }
    return [];
  }
  // Tenta chaves comuns que costumam conter arrays de armas
  for (const key of ["weapons", "data", "items", "results", "loadouts", "guns", "armas"]) {
    if (Array.isArray(data[key]) && data[key].length > 0) {
      const r = extractWeaponsFromJSON(data[key]);
      if (r.length > 0) return r;
    }
  }
  // Busca recursiva em profundidade
  for (const val of Object.values(data)) {
    if (typeof val === "object" && val !== null) {
      const r = extractWeaponsFromJSON(val);
      if (r.length > 0) return r;
    }
  }
  return [];
}

function parseWeapon(w) {
  const arma = w.name || w.weaponName || w.weapon_name || w.weapon || w.arma || w.title || "";
  if (!arma || typeof arma !== "string") return null;
  if (arma.length > 50) return null; // provavelmente não é nome de arma

  return {
    arma: arma.trim(),
    tipo: normalizeTipo(w.category || w.type || w.weaponType || w.weapon_type || w.class || ""),
    tier: normalizeTier(w.tier || w.rating || w.grade || w.rank || ""),
    pickRate: parseFloat(w.pickRate || w.pick_rate || w.usageRate || w.usage_rate || w.popularity || 0) || 0,
    winRate: parseFloat(w.winRate || w.win_rate || 0) || 0,
    kdRatio: parseFloat(w.kdRatio || w.kd_ratio || w.kd || 0) || 0,
    fonte: "wzstats.gg",
    atualizadoEm: new Date().toISOString()
  };
}

export async function scrapeWzstats() {
  console.log("[wzstats] Buscando API...");
  const meta = [];

  // Endpoints candidatos — o app Angular precisa buscar dados de algum destes
  const candidates = [
    // API REST direta
    "https://wzstats.gg/api/weapons",
    "https://wzstats.gg/api/warzone/weapons",
    "https://wzstats.gg/api/v1/weapons",
    "https://wzstats.gg/api/v2/weapons",
    "https://wzstats.gg/api/warzone-2/weapons",
    // API com path de jogo
    "https://wzstats.gg/api/bo7/weapons",
    "https://wzstats.gg/api/black-ops-7/weapons",
    // API separada
    "https://api.wzstats.gg/weapons",
    "https://api.wzstats.gg/v1/weapons",
    "https://api.wzstats.gg/warzone/weapons",
    // Com parâmetros de tier list
    "https://wzstats.gg/api/weapons/tier-list",
    "https://wzstats.gg/api/warzone/tier-list",
    "https://wzstats.gg/api/loadouts/best-weapons",
  ];

  for (const url of candidates) {
    const data = await tryGet(url);
    if (!data) continue;

    const arr = extractWeaponsFromJSON(data);
    if (!arr.length) continue;

    console.log(`[wzstats] API encontrada: ${url} (${arr.length} itens)`);

    for (const w of arr) {
      const parsed = parseWeapon(w);
      if (parsed) meta.push(parsed);
    }
    break;
  }

  if (meta.length === 0) {
    console.log("[wzstats] API não acessível — sem dados extras");
  } else {
    console.log(`[wzstats] ${meta.length} armas extraídas`);
  }

  return meta;
}
