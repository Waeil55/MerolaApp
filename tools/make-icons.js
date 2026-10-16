/* Generates the PWA icons (PNG + SVG) without any dependencies: a blue rounded tile with a yellow star.
   Run:  node tools/make-icons.js   (writes into icons/) */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const out = path.join(__dirname, "..", "icons");
fs.mkdirSync(out, { recursive: true });

const BLUE = [28, 176, 246], BLUE_DK = [24, 153, 214], YELLOW = [255, 200, 0], YELLOW_DK = [229, 180, 0], WHITE = [255, 255, 255];

function crc32(buf) { let c, crc = 0xffffffff; for (let n = 0; n < buf.length; n++) { c = (crc ^ buf[n]) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; } return (crc ^ 0xffffffff) >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); }
function png(size, pixel) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) { raw[y * (size * 4 + 1)] = 0; for (let x = 0; x < size; x++) { const [r, g, b, a] = pixel(x + 0.5, y + 0.5); const i = y * (size * 4 + 1) + 1 + x * 4; raw[i] = r; raw[i + 1] = g; raw[i + 2] = b; raw[i + 3] = a; } }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
const starPoints = (cx, cy, R, r) => { const pts = []; for (let i = 0; i < 10; i++) { const ang = -Math.PI / 2 + (i * Math.PI) / 5; const rad = i % 2 === 0 ? R : r; pts.push([cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)]); } return pts; };
function inPoly(x, y, pts) { let inside = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside; } return inside; }
function inRoundRect(x, y, x0, y0, x1, y1, rad) { if (x < x0 || x > x1 || y < y0 || y > y1) return false; const cx = x < x0 + rad ? x0 + rad : x > x1 - rad ? x1 - rad : x; const cy = y < y0 + rad ? y0 + rad : y > y1 - rad ? y1 - rad : y; return (x - cx) ** 2 + (y - cy) ** 2 <= rad * rad; }
// supersampled pixel for smooth edges
function render(size, maskable) {
  const pad = maskable ? size * 0.1 : 0; const tileR = maskable ? 0 : size * 0.22;
  const starBig = starPoints(size / 2, size * 0.52, size * 0.3, size * 0.13), starSm = starPoints(size / 2, size * 0.52 + size * 0.02, size * 0.3, size * 0.13);
  const sample = (x, y) => {
    if (!maskable && !inRoundRect(x, y, 0, 0, size, size, tileR)) return [0, 0, 0, 0];
    let col = y > size * 0.86 && !maskable ? BLUE_DK : BLUE;
    if (inPoly(x, y, starSm)) col = YELLOW_DK;
    if (inPoly(x, y, starBig)) col = YELLOW;
    // small white highlight sparkle at top-left
    if ((x - size * 0.22) ** 2 + (y - size * 0.22) ** 2 < (size * 0.035) ** 2) col = WHITE;
    return [col[0], col[1], col[2], 255];
  };
  return (x, y) => { const acc = [0, 0, 0, 0]; const n = 3; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const s = sample(x - 0.5 + (i + 0.5) / n, y - 0.5 + (j + 0.5) / n); for (let k = 0; k < 4; k++) acc[k] += s[k]; } return acc.map((v) => Math.round(v / (n * n))); };
}
fs.writeFileSync(path.join(out, "icon-192.png"), png(192, render(192, false)));
fs.writeFileSync(path.join(out, "icon-512.png"), png(512, render(512, false)));
fs.writeFileSync(path.join(out, "icon-maskable-512.png"), png(512, render(512, true)));
fs.writeFileSync(path.join(out, "apple-touch-icon.png"), png(180, render(180, true)));
fs.writeFileSync(path.join(out, "icon.svg"), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#1CB0F6"/><rect y="86" width="100" height="14" fill="#1899D6"/><path d="M50 24l8.8 18.9 20.7 2.4-15.3 14.1 4.1 20.4L50 69.6 31.7 79.8l4.1-20.4L20.5 45.3l20.7-2.4z" fill="#E5B400" transform="translate(0 2)"/><path d="M50 22l8.8 18.9 20.7 2.4-15.3 14.1 4.1 20.4L50 67.6 31.7 77.8l4.1-20.4L20.5 43.3l20.7-2.4z" fill="#FFC800"/><circle cx="22" cy="22" r="3.5" fill="#fff"/></svg>');
console.log("icons written to", out);
