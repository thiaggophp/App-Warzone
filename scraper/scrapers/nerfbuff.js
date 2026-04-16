import axios from "axios";
import * as cheerio from "cheerio";

const URL = "https://warzoneloadout.games/pt-br/nerf-buff/";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept-Language": "pt-BR,pt;q=0.9"
};

// Extrai data ISO de aria-label: "Balancing updates for April 2, 2026 in Season 3"
function parseAriaDate(aria) {
  const m = aria.match(/for\s+(.+?)\s+in\s+/i);
  if (!m) return null;
  const d = new Date(m[1]);
  return isNaN(d) ? null : d.toISOString().split("T")[0];
}

function parseSeasonFromAria(aria) {
  const m = aria.match(/in\s+(.+)$/i);
  return m ? m[1].trim() : "";
}

// Lazy-loaded images usam data-lazy-src
function getImgSrc($img) {
  return $img.attr("data-lazy-src") || $img.attr("src") || "";
}

export async function scrapeNerfBuff() {
  console.log("[nerfbuff] Iniciando scraping...");
  const patches = [];

  try {
    const res = await axios.get(URL, { headers: HEADERS, timeout: 15000 });
    const $ = cheerio.load(res.data);

    $(".all-balancing-container_balancing").each((_, container) => {
      const $c = $(container);
      const $h3 = $c.find("h3.balancing-date-title_balancing").first();
      const aria = $h3.attr("aria-label") || "";
      const data = parseAriaDate(aria);
      const temporada = parseSeasonFromAria(aria);

      if (!data) return;

      $c.find(".balancing_entry").each((_, entry) => {
        const $e = $(entry);
        const tipo = $e.hasClass("buff_entry") ? "buff" : "nerf";
        const arma = $e.find(".balancingweapon_name").text().trim();
        const imagem = getImgSrc($e.find(".balancing_icon").first());
        const link = $e.closest("a.balancing_entry_link").attr("href") || "";

        if (!arma) return;

        patches.push({
          arma, tipo, data, temporada, imagem, link,
          fonte: "warzoneloadout.games",
          atualizadoEm: new Date().toISOString()
        });
      });
    });

    console.log(`[nerfbuff] ${patches.length} entradas extraídas`);
  } catch (e) {
    console.error("[nerfbuff] Erro:", e.message);
  }

  // Mais recente primeiro
  patches.sort((a, b) => b.data.localeCompare(a.data));
  return patches;
}
