import fs from 'fs';
import sharp from 'sharp';

async function generateAssets() {
  const svg = fs.readFileSync('public/icon.svg');

  // 1. Apple Touch Icon (180x180)
  await sharp(svg)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('✓ Generated public/apple-touch-icon.png (180x180)');

  // 2. Icon 192x192
  await sharp(svg)
    .resize(192, 192)
    .png()
    .toFile('public/icon-192.png');
  console.log('✓ Generated public/icon-192.png (192x192)');

  // 3. Icon 512x512
  await sharp(svg)
    .resize(512, 512)
    .png()
    .toFile('public/icon-512.png');
  console.log('✓ Generated public/icon-512.png (512x512)');

  // 4. iPhone 15 Pro Max Native Launch Splash Screen (1290 x 2796)
  const splashSvg = `
  <svg width="1290" height="2796" viewBox="0 0 1290 2796" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#1e1b4b" />
        <stop offset="60%" stop-color="#0f1117" />
        <stop offset="100%" stop-color="#090a0f" />
      </radialGradient>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6366f1" />
        <stop offset="50%" stop-color="#8b5cf6" />
        <stop offset="100%" stop-color="#ec4899" />
      </linearGradient>
    </defs>
    <rect width="1290" height="2796" fill="url(#bgGrad)"/>
    <g transform="translate(425, 1000) scale(0.86)">
      <!-- Book Left Page -->
      <path d="M 256 120 C 180 80 80 90 20 110 L 20 400 C 80 380 180 370 256 410 Z" fill="#f8fafc" />
      <!-- Book Right Page -->
      <path d="M 256 120 C 332 80 432 90 492 110 L 492 400 C 432 380 332 370 256 410 Z" fill="#f1f5f9" />
      <!-- Center Spine -->
      <path d="M 250 120 L 262 120 L 262 412 L 250 412 Z" fill="#94a3b8" />
      <!-- Ribbon -->
      <path d="M 240 100 L 272 100 L 272 260 L 256 240 L 240 260 Z" fill="#f59e0b" />
    </g>
    <text x="645" y="1460" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="800" font-size="64" fill="#ffffff" text-anchor="middle" letter-spacing="-1">FlipBook 3D</text>
    <text x="645" y="1525" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="500" font-size="28" fill="#a1a1aa" text-anchor="middle">iPhone 15 Pro Max Edition</text>
  </svg>
  `;

  await sharp(Buffer.from(splashSvg))
    .png()
    .toFile('public/apple-splash-1290-2796.png');
  console.log('✓ Generated public/apple-splash-1290-2796.png (1290x2796 for iPhone 15 Pro Max)');
}

generateAssets().catch(console.error);
