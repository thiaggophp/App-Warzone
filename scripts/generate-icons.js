// Gera icon-192.png e icon-512.png sem dependências externas
// Icone: fundo escuro (#0a0a0f) + hexágono laranja + crosshair estilizado

import zlib from "node:zlib";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../public");

// --- PNG raw builder ---
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const b of buf) {
    c ^= b;
    for (let i = 0; i < 8; i++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function u32be(n) {
  return [(n >>> 24) & 0xFF, (n >>> 16) & 0xFF, (n >>> 8) & 0xFF, n & 0xFF];
}

function pngChunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const d = Buffer.from(data);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, d])));
  const len = Buffer.alloc(4);
  len.writeUInt32BE(d.length);
  return Buffer.concat([len, t, d, crc]);
}

function buildPNG(size, pixels) {
  // pixels: Uint8Array de size*size*4 (RGBA)
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4;
      const dst = y * (size * 4 + 1) + 1 + x * 4;
      raw[dst] = pixels[src]; raw[dst+1] = pixels[src+1];
      raw[dst+2] = pixels[src+2]; raw[dst+3] = pixels[src+3];
    }
  }
  const compressed = zlib.deflateSync(raw, { level: 6 });
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = pngChunk("IHDR", [...u32be(size), ...u32be(size), 8, 6, 0, 0, 0]);
  const idat = pngChunk("IDAT", compressed);
  const iend = pngChunk("IEND", []);
  return Buffer.concat([sig, ihdr, idat, iend]);
}

// --- Funções de desenho ---
function setPixel(px, size, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= size || y < 0 || y >= size) return;
  const i = (y * size + x) * 4;
  // alpha compositing
  const fa = a / 255;
  const ba = px[i+3] / 255;
  const oa = fa + ba * (1 - fa);
  if (oa === 0) return;
  px[i]   = Math.round((r * fa + px[i]   * ba * (1 - fa)) / oa);
  px[i+1] = Math.round((g * fa + px[i+1] * ba * (1 - fa)) / oa);
  px[i+2] = Math.round((b * fa + px[i+2] * ba * (1 - fa)) / oa);
  px[i+3] = Math.round(oa * 255);
}

function fillCircle(px, size, cx, cy, r, col, aa = true) {
  const [R, G, B, A] = col;
  for (let y = Math.floor(cy - r - 1); y <= Math.ceil(cy + r + 1); y++) {
    for (let x = Math.floor(cx - r - 1); x <= Math.ceil(cx + r + 1); x++) {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (aa) {
        const alpha = Math.min(1, Math.max(0, r - d + 0.5));
        if (alpha > 0) setPixel(px, size, x, y, R, G, B, Math.round(A * alpha));
      } else if (d <= r) {
        setPixel(px, size, x, y, R, G, B, A);
      }
    }
  }
}

function fillRect(px, size, x1, y1, w, h, col) {
  const [R, G, B, A] = col;
  for (let y = y1; y < y1 + h; y++)
    for (let x = x1; x < x1 + w; x++)
      setPixel(px, size, x, y, R, G, B, A);
}

function drawLine(px, size, x1, y1, x2, y2, col, thick = 1) {
  const [R, G, B, A] = col;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx*dx + dy*dy);
  const steps = Math.ceil(len * 2);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const cx = x1 + dx * t, cy = y1 + dy * t;
    fillCircle(px, size, cx, cy, thick / 2, [R, G, B, A], true);
  }
}

// Gradiente radial laranja
function radialGrad(px, size, cx, cy, r0, r1, colInner, colOuter) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (d < r0 || d > r1) continue;
      const t = (d - r0) / (r1 - r0);
      const R = Math.round(colInner[0] * (1-t) + colOuter[0] * t);
      const G = Math.round(colInner[1] * (1-t) + colOuter[1] * t);
      const B = Math.round(colInner[2] * (1-t) + colOuter[2] * t);
      setPixel(px, size, x, y, R, G, B, 255);
    }
  }
}

// --- Geração do ícone ---
function drawIcon(size) {
  const px = new Uint8Array(size * size * 4);
  const s = size / 192; // escala
  const cx = size / 2, cy = size / 2;

  // Fundo escuro
  for (let i = 0; i < px.length; i += 4) {
    px[i] = 10; px[i+1] = 10; px[i+2] = 15; px[i+3] = 255;
  }

  // Círculo de fundo com gradiente sutil
  fillCircle(px, size, cx, cy, 84 * s, [15, 15, 22, 255], false);

  // Anel exterior laranja escuro
  const outerR = 78 * s;
  const innerR = 70 * s;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (d >= innerR && d <= outerR) {
        const alpha = Math.min(1, Math.max(0, Math.min(d - innerR, outerR - d) + 0.5));
        setPixel(px, size, x, y, 249, 115, 22, Math.round(200 * alpha));
      }
    }
  }

  // Círculo central com gradiente laranja → laranja escuro
  const gradR = 46 * s;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (d <= gradR) {
        const t = d / gradR;
        const R = Math.round(253 * (1 - t) + 234 * t);
        const G = Math.round(140 * (1 - t) + 88 * t);
        const B = Math.round(30 * (1 - t) + 12 * t);
        const alpha = Math.min(1, gradR - d + 0.5);
        setPixel(px, size, x, y, R, G, B, Math.round(255 * alpha));
      }
    }
  }

  // Crosshair — 4 linhas saindo do centro
  const gap = 16 * s;
  const len = 22 * s;
  const thick = 3 * s;
  const cc = [255, 255, 255, 230];
  drawLine(px, size, cx, cy - gap, cx, cy - gap - len, cc, thick); // cima
  drawLine(px, size, cx, cy + gap, cx, cy + gap + len, cc, thick); // baixo
  drawLine(px, size, cx - gap, cy, cx - gap - len, cy, cc, thick); // esq
  drawLine(px, size, cx + gap, cy, cx + gap + len, cy, cc, thick); // dir

  // Ponto central
  fillCircle(px, size, cx, cy, 4 * s, [255, 255, 255, 255], true);

  return px;
}

// Gera e salva
for (const size of [192, 512]) {
  const px = drawIcon(size);
  const png = buildPNG(size, px);
  const file = path.join(OUT, `icon-${size}.png`);
  fs.writeFileSync(file, png);
  console.log(`Gerado: ${file} (${png.length} bytes)`);
}
console.log("Icones gerados com sucesso!");
