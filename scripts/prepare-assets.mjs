// Extract existing artwork only; no generated or stock imagery.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoPath } from 'd3-geo';

const source = process.argv[2] || 'C:/Users/proje/Downloads/aigesnew';
const out = 'public/assets';
await sharp(`${out}/source-cover.jpg`).extract({ left: 1280, top: 0, width: 640, height: 990 }).webp({ quality: 90 }).toFile(`${out}/architecture.webp`);
await sharp(`${source}/29.png`).extract({ left: 810, top: 0, width: 400, height: 980 }).webp({ quality: 90 }).toFile(`${out}/hands.webp`);
await sharp(`${source}/37.png`).extract({ left: 1309, top: 319, width: 319, height: 312 }).png().toFile(`${out}/qr.png`);
const crops = [[37, 311, 554, 279], [662, 311, 565, 279], [1287, 311, 565, 279], [36, 620, 556, 277], [662, 619, 565, 278], [1287, 619, 565, 278]];
for (const [i, [left, top, width, height]] of crops.entries()) {
  await sharp(`${source}/35.png`).extract({ left, top, width, height }).webp({ quality: 95 }).toFile(`${out}/project-${i + 1}.webp`);
}
const { data, info } = await sharp(`${source}/36.png`).raw().toBuffer({ resolveWithObject: true });
const counts = new Map();
for (let i = 0; i < data.length; i += info.channels) {
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  if (b > 200 && r < 80 && g > 90 && g < 190) {
    const key = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    counts.set(key, (counts.get(key) || 0) + 1);
  }
}
console.log('Source accent:', [...counts].sort((a, b) => b[1] - a[1])[0]);
const topology = JSON.parse(await readFile('node_modules/world-atlas/land-110m.json', 'utf8'));
const land = feature(topology, topology.objects.land);
const projection = geoNaturalEarth1().scale(170).translate([500, 270]);
const path = geoPath(projection)(land);
const origin = projection([76.9, 43.2]);
const destinations = [[-100, 40], [10, 50], [45, 25], [65, 40]];
const lines = destinations.map(point => {
  const [x, y] = projection(point);
  return `<path d="M${origin} Q${(origin[0] + x) / 2},${Math.min(y, origin[1]) - 70} ${x},${y}"/><circle cx="${x}" cy="${y}" r="3" fill="#81817a"/>`;
}).join('');
await writeFile(`${out}/world.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 510"><path d="${path}" fill="#dad9d2"/><g fill="none" stroke="#9c9d94" stroke-width="1" stroke-dasharray="3 5">${lines}</g><circle cx="${origin[0]}" cy="${origin[1]}" r="13" fill="#2F5BFF" opacity=".14"/><circle cx="${origin[0]}" cy="${origin[1]}" r="5" fill="#2F5BFF"/><text x="${origin[0] + 14}" y="${origin[1] - 16}" font-family="Arial,sans-serif" font-size="13" fill="#111">ALMATY</text></svg>`);
