const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function createSigilSVG(size) {
  const cx = size / 2;
  const cy = size / 2;
  const r1 = size * 0.42;
  const r2 = size * 0.27;
  const r3 = size * 0.10;
  const lw = Math.max(1, size * 0.055);
  const diamond = (r) =>
    `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
  return `<svg xmlns="http://www.w3.org/2000/svg"
    width="${size}" height="${size}"
    viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#080706"/>
    <polygon points="${diamond(r1)}"
      fill="none" stroke="#C8C4BC"
      stroke-width="${lw}"/>
    <polygon points="${diamond(r2)}"
      fill="none" stroke="#C8C4BC"
      stroke-width="${lw * 0.85}"/>
    <polygon points="${diamond(r3)}"
      fill="#C8C4BC"/>
  </svg>`;
}

async function fix() {
  const appDir = path.join(process.cwd(), 'src', 'app');
  const publicDir = path.join(process.cwd(), 'public');

  const svg32 = Buffer.from(createSigilSVG(32));
  await sharp(svg32)
    .png()
    .toFile(path.join(appDir, 'favicon.ico'));
  console.log('Written: src/app/favicon.ico');

  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 },
  ];
  for (const { name, size } of sizes) {
    const svg = Buffer.from(createSigilSVG(size));
    await sharp(svg).png()
      .toFile(path.join(publicDir, name));
    console.log(`Written: public/${name}`);
  }

  const svg180 = Buffer.from(createSigilSVG(180));
  await sharp(svg180)
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));
  console.log('Written: src/app/apple-icon.png');

  const svg512 = Buffer.from(createSigilSVG(512));
  await sharp(svg512)
    .png()
    .toFile(path.join(appDir, 'icon.png'));
  console.log('Written: src/app/icon.png');

  console.log('Favicon fix complete.');
}

fix().catch(console.error);
