const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');

function createSigilSVG(size) {
  const cx = size / 2;
  const cy = size / 2;
  const r1 = size * 0.42;
  const r2 = size * 0.27;
  const r3 = size * 0.10;
  const lw = Math.max(1, size * 0.055);

  const diamond = (r) =>
    `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#020201"/>
  <polygon points="${diamond(r1)}" fill="none" stroke="#C8C4BC" stroke-width="${lw}"/>
  <polygon points="${diamond(r2)}" fill="none" stroke="#C8C4BC" stroke-width="${lw * 0.85}"/>
  <polygon points="${diamond(r3)}" fill="#C8C4BC"/>
</svg>`;
}

async function generateFavicons() {
  console.log('Generating Basalith sigil favicons...');

  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 },
  ];

  for (const { name, size } of sizes) {
    const svg = Buffer.from(createSigilSVG(size));
    const outputPath = path.join(publicDir, name);
    await sharp(svg).png().toFile(outputPath);
    console.log(`  ✓ ${name}`);
  }

  // favicon.ico — browsers accept PNG with .ico extension
  const svg32 = Buffer.from(createSigilSVG(32));
  await sharp(svg32).png().toFile(path.join(publicDir, 'favicon.ico'));
  console.log('  ✓ favicon.ico');

  // site.webmanifest
  const manifest = {
    name: 'Basalith AI',
    short_name: 'Basalith',
    description: 'Digital immortality. The AI entity that runs forever.',
    icons: [
      { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: '#020201',
    background_color: '#020201',
    display: 'standalone',
    start_url: '/',
  };
  fs.writeFileSync(
    path.join(publicDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('  ✓ site.webmanifest');

  console.log('\nAll favicon assets generated in /public');
}

generateFavicons().catch(console.error);
