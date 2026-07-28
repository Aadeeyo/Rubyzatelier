import { writeFileSync } from "node:fs";
import { join } from "node:path";

const palettes = [
  ["#1a2047", "#2c3566", "#b5502f"],
  ["#b5502f", "#c1443a", "#0b0b0d"],
  ["#2c3566", "#c1443a", "#ece5da"],
  ["#0b0b0d", "#7d8085", "#c1443a"],
  ["#1a2047", "#c1443a", "#e4e5e8"],
  ["#b5502f", "#2c3566", "#e4e5e8"],
  ["#0b0b0d", "#b5502f", "#2c3566"],
  ["#2c3566", "#e4e5e8", "#c1443a"],
];

function blob(cx, cy, r, color, opacity) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}" />`;
}

function svgFor(seed, [a, b, c]) {
  const rand = (n) => {
    const x = Math.sin(seed * 999 + n * 37.1) * 10000;
    return x - Math.floor(x);
  };
  let blobs = "";
  for (let i = 0; i < 14; i++) {
    const cx = 40 + rand(i) * 520;
    const cy = 40 + rand(i + 50) * 520;
    const r = 40 + rand(i + 100) * 140;
    const color = [a, b, c][i % 3];
    blobs += blob(cx, cy, r, color, 0.55);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="${a}" />
  <g style="mix-blend-mode:multiply">${blobs}</g>
  <filter id="blur"><feGaussianBlur stdDeviation="18" /></filter>
</svg>`;
}

for (let i = 0; i < palettes.length; i++) {
  const svg = svgFor(i + 1, palettes[i]);
  writeFileSync(join("public", "products", `placeholder-${i + 1}.svg`), svg);
}

console.log("done");
