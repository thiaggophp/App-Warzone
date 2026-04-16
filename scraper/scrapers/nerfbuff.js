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

export async function scrapeNerfBuff() {
  console.log("[nerfbuff] Iniciando scraping...");
  const patches = [];

  try {
    const res = await axios.get(URL, { headers: HEADERS, timeout: 15000 });
    const $ = cheerio.load(res.data);

    // Estrutura: dentro de .all-balancing-container_balancing há N grupos.
    // Cada grupo = h3.balancing-date-title_balancing + div.flex-container_balancing
    // Iteramos por cada .flex-container_balancing e lemos o h3 anterior para a data.
    $(".all-balancing-container_balancing .flex-container_balancing").each((_, flex) => {
      const $flex = $(flex);
      // h3 imediatamente anterior ao flex-container
      const $h3 = $flex.prevAll("h3.balancing-date-title_balancing").first();
      const aria = $h3.attr("aria-label") || "";
      const data = parseAriaDate(aria);
      const temporada = parseSeasonFromAria(aria);

      if (!data) return;

      $flex.find(".detail-card_balancing").each((_, card) => {
        const $card = $(card);
        const arma = $card.find(".weapon-name-label_balancing").text().trim();
        if (!arma) return;
        const tipo = $card.find(".nerf-label_balancing").length ? "nerf" : "buff";

        patches.push({
          arma, tipo, data, temporada,
          imagem: "",
          link: "",
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
