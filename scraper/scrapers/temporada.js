import Parser from "rss-parser";
import axios from "axios";

// Feeds que costumam publicar artigos sobre datas de temporada
const FEEDS = [
  "https://warzoneloadout.games/feed/",
  "https://charlieintel.com/feed/",
  "https://www.gamesradar.com/rss/",
];

const parser = new Parser({
  timeout: 12000,
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" }
});

// Meses EN e PT para parsing de datas em linguagem natural
const MONTHS = {
  january:1, february:2, march:3, april:4, may:5, june:6,
  july:7, august:8, september:9, october:10, november:11, december:12,
  janeiro:1, fevereiro:2, março:3, abril:4, maio:5, junho:6,
  julho:7, agosto:8, setembro:9, outubro:10, novembro:11, dezembro:12
};

// Converte data em linguagem natural ou ISO para "YYYY-MM-DD"
function parseDate(text) {
  // ISO: 2026-04-02
  let m = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  // EN: "April 2, 2026" ou "April 2 2026"
  m = text.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})\b/i);
  if (m) {
    const mm = String(MONTHS[m[1].toLowerCase()]).padStart(2, "0");
    const dd = String(m[2]).padStart(2, "0");
    return `${m[3]}-${mm}-${dd}`;
  }

  // PT: "2 de abril de 2026"
  m = text.match(/\b(\d{1,2})\s+de\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})\b/i);
  if (m) {
    const mm = String(MONTHS[m[2].toLowerCase()]).padStart(2, "0");
    const dd = String(m[1]).padStart(2, "0");
    return `${m[3]}-${mm}-${dd}`;
  }

  return null;
}

// Extrai todas as datas de uma string
function extractDates(text) {
  const found = new Set();

  // ISO
  for (const d of text.match(/\b\d{4}-\d{2}-\d{2}\b/g) || []) found.add(d);

  // EN natural
  const reEN = /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}\b/gi;
  for (const d of text.match(reEN) || []) { const p = parseDate(d); if (p) found.add(p); }

  // PT natural
  const rePT = /\b\d{1,2}\s+de\s+(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+\d{4}\b/gi;
  for (const d of text.match(rePT) || []) { const p = parseDate(d); if (p) found.add(p); }

  return [...found].sort();
}

// Extrai número da temporada (Season 3 / Temporada 3)
function extractSeasonNum(text) {
  const m = text.match(/\b(?:season|temporada)\s+(\d+)\b/i);
  return m ? parseInt(m[1]) : null;
}

// Verifica se o artigo é relevante para temporada (não apenas reloaded/patch notes)
function isSeasonArticle(title) {
  const t = title.toLowerCase();
  // Evita artigos de Reloaded, patch notes, balance updates
  if (/reloaded|patch\s*notes?|balance|nerf|buff|update\s*\d/.test(t)) return false;
  // Deve mencionar season + (start|end|date|release|quando|data|início|início|fim)
  return /\b(?:season|temporada)\s+\d+\b/i.test(t) &&
    /\b(?:start|end|date|release|launch|when|quando|data|início|inicio|fim|começa|termina|encerra)\b/i.test(t);
}

// Busca o conteúdo completo de um artigo para extrair datas
async function fetchArticleContent(url) {
  try {
    const res = await axios.get(url, { timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    // Remove tags HTML, mantém só o texto
    return res.data.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 3000);
  } catch { return ""; }
}

export async function scrapeTemporada() {
  console.log("[temporada] Verificando datas da temporada nos feeds...");
  const candidates = [];

  for (const feedUrl of FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const items = feed.items || [];

      for (const item of items.slice(0, 20)) {
        const title = (item.title || "").replace(/<[^>]+>/g, "").trim();
        if (!isSeasonArticle(title)) continue;

        const seasonNum = extractSeasonNum(title);
        if (!seasonNum) continue;

        console.log(`[temporada] Artigo relevante: "${title}"`);

        // Combina snippet + conteúdo do artigo completo para extrair datas
        const snippet = (item.contentSnippet || item.summary || "").slice(0, 500);
        let fullText = snippet;

        if (item.link) {
          const content = await fetchArticleContent(item.link);
          if (content) fullText = `${snippet} ${content}`;
        }

        const dates = extractDates(fullText);

        // Filtra datas dentro de um intervalo plausível (2025–2027)
        const validDates = dates.filter(d => d >= "2025-01-01" && d <= "2027-12-31");
        if (validDates.length < 2) continue;

        // Para artigos de "start date" temos início; de "end date" temos fim
        // Se houver 2+ datas, a menor é início e a maior é fim
        const inicio = validDates[0];
        const fim = validDates[validDates.length - 1];

        // Sanidade: temporada deve durar entre 4 e 16 semanas
        const diffDays = (new Date(fim) - new Date(inicio)) / (1000 * 60 * 60 * 24);
        if (diffDays < 28 || diffDays > 120) continue;

        candidates.push({ seasonNum, numero: `Temporada ${seasonNum}`, inicio, fim, titulo: title });
        console.log(`[temporada] Candidato: Temporada ${seasonNum} — ${inicio} a ${fim} (${Math.round(diffDays)} dias)`);
      }
    } catch (e) {
      console.log(`[temporada] Erro ao processar ${feedUrl}: ${e.message}`);
    }
  }

  if (candidates.length === 0) {
    console.log("[temporada] Nenhuma data de temporada encontrada nos feeds — mantendo dados atuais");
    return null;
  }

  // Pega a temporada com maior número (mais recente)
  candidates.sort((a, b) => b.seasonNum - a.seasonNum);
  const best = candidates[0];

  console.log(`[temporada] ✓ Dados atualizados: ${best.numero} — ${best.inicio} a ${best.fim}`);
  return { numero: best.numero, inicio: best.inicio, fim: best.fim };
}
