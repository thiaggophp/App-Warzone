import Parser from "rss-parser";
import axios from "axios";

const FEEDS = [
  { url: "https://warzoneloadout.games/feed/", fonte: "warzoneloadout.games" }
];

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*"
  },
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["enclosure", "enclosure"]
    ]
  }
});

// Detecta se o texto parece inglês (letras ASCII dominantes, sem acentos)
function pareceIngles(text) {
  const acentos = (text.match(/[áàãâéêíóôõúüçñ]/gi) || []).length;
  const palavrasEn = /\b(the|and|best|for|with|how|to|from|in|of|is|are|was|loadout|build|warzone)\b/i.test(text);
  return palavrasEn && acentos < 2;
}

// Traduz texto usando MyMemory API (gratuita, sem chave, 5000 palavras/dia)
async function traduzir(texto) {
  if (!texto || !pareceIngles(texto)) return texto;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|pt-BR`;
    const res = await axios.get(url, { timeout: 8000 });
    const traduzido = res.data?.responseData?.translatedText;
    // MyMemory às vezes retorna o texto original se não conseguir traduzir
    if (traduzido && traduzido !== texto && !traduzido.toUpperCase().includes("PLEASE SELECT")) {
      return traduzido;
    }
  } catch {
    // Falha silenciosa — mantém original
  }
  return texto;
}

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

function extractImage(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item.mediaContent?.["$"]?.url) return item.mediaContent["$"].url;
  if (item.mediaThumbnail?.["$"]?.url) return item.mediaThumbnail["$"].url;
  if (item["media:content"]?.["$"]?.url) return item["media:content"]["$"].url;
  const html = item.content || item["content:encoded"] || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

export async function scrapeRSS() {
  console.log("[rss] Iniciando scraping...");
  const noticias = [];

  for (const feed of FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      const items = (parsed.items || []).slice(0, 10);

      for (const item of items) {
        const tituloOriginal = stripHtml(item.title || "");
        if (!tituloOriginal) continue;

        const resumoOriginal = stripHtml(item.contentSnippet || item.summary || "").slice(0, 300);

        noticias.push({
          titulo: tituloOriginal,
          resumo: resumoOriginal,
          url: item.link || "",
          imagem: extractImage(item),
          publicadoEm: item.isoDate || item.pubDate || new Date().toISOString(),
          fonte: feed.fonte,
          atualizadoEm: new Date().toISOString()
        });
      }

      console.log(`[rss] ${feed.fonte}: ${items.length} noticias`);
    } catch (e) {
      console.error(`[rss] Erro em ${feed.fonte}:`, e.message);
    }
  }

  // Traduz títulos e resumos para português
  if (noticias.length > 0) {
    console.log("[rss] Traduzindo noticias para portugues...");
    for (const n of noticias) {
      n.titulo = await traduzir(n.titulo);
      if (n.resumo) n.resumo = await traduzir(n.resumo);
    }
    console.log("[rss] Traducao concluida");
  }

  // Ordena por data decrescente
  noticias.sort((a, b) => new Date(b.publicadoEm) - new Date(a.publicadoEm));

  return noticias;
}
