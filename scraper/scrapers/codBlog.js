import axios from "axios";
import * as cheerio from "cheerio";

// Traduz texto EN→PT usando MyMemory (gratuita, sem chave)
async function traduzir(texto) {
  if (!texto) return texto;
  // Se tem muitos acentos/palavras PT, não traduz
  const acentos = (texto.match(/[áàãâéêíóôõúüçñ]/gi) || []).length;
  if (acentos >= 3) return texto;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|pt-BR`;
    const res = await axios.get(url, { timeout: 8000 });
    const t = res.data?.responseData?.translatedText;
    if (t && t !== texto && !t.toUpperCase().includes("PLEASE SELECT")) return t;
  } catch { /* mantém original */ }
  return texto;
}

const BASE = "https://www.callofduty.com";
const URLS = [
  `${BASE}/br/pt/blog/warzone`,
  `${BASE}/br/pt/blog/blackops7`,
];

const MESES = {
  january:"01",february:"02",march:"03",april:"04",may:"05",june:"06",
  july:"07",august:"08",september:"09",october:"10",november:"11",december:"12"
};

function parseDate(raw) {
  if (!raw) return null;
  // "March 31, 2026" → "2026-03-31"
  const m = raw.toLowerCase().match(/(\w+)\s+(\d+),\s+(\d{4})/);
  if (!m) return null;
  const mes = MESES[m[1]];
  if (!mes) return null;
  return `${m[3]}-${mes}-${m[2].padStart(2, "0")}`;
}

export async function scrapeCodBlog() {
  console.log("[codblog] Iniciando scraping...");
  const seen = new Set();
  const noticias = [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90); // últimos 90 dias

  for (const url of URLS) {
    try {
      const res = await axios.get(url, {
        timeout: 15000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          "Accept-Language": "pt-BR,pt;q=0.9"
        }
      });

      const $ = cheerio.load(res.data);

      $(".blog-card-item").each((_, el) => {
        const $el = $(el);

        // Link e título
        const $titleLink = $el.find(".title a").first();
        const href = $titleLink.attr("href") || "";
        const titulo = $titleLink.text().trim();
        if (!titulo || !href) return;

        const link = href.startsWith("http") ? href : `${BASE}${href}`;
        if (seen.has(link)) return;
        seen.add(link);

        // Data
        const dataRaw = $el.find("[data-date]").attr("data-date") || "";
        const dataIso = parseDate(dataRaw);
        if (!dataIso) return;

        // Filtro: só últimos 90 dias
        if (new Date(dataIso) < cutoff) return;

        // Imagem
        const $img = $el.find("img.blog-image").first();
        const imgSrc = $img.attr("src") || $img.attr("data-src") || "";
        const imagem = imgSrc
          ? (imgSrc.startsWith("http") ? imgSrc : `${BASE}${imgSrc}`)
          : null;

        noticias.push({
          titulo,
          resumo: null,
          url: link,
          imagem,
          publicadoEm: `${dataIso}T12:00:00.000Z`,
          fonte: "callofduty.com",
          atualizadoEm: new Date().toISOString()
        });
      });

      console.log(`[codblog] ${url.split("/").pop()}: ok`);
    } catch (e) {
      console.error(`[codblog] Erro em ${url}:`, e.message);
    }
  }

  // Traduz títulos para PT
  if (noticias.length > 0) {
    console.log("[codblog] Traduzindo titulos...");
    for (const n of noticias) {
      n.titulo = await traduzir(n.titulo);
    }
  }

  // Ordena por data decrescente, limita a 15
  noticias.sort((a, b) => new Date(b.publicadoEm) - new Date(a.publicadoEm));
  const resultado = noticias.slice(0, 15);
  console.log(`[codblog] ${resultado.length} noticias recentes`);
  return resultado;
}
