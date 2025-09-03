import { NextResponse } from 'next/server';

export async function GET() {
  const w = 1200, h = 630;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#0066CC"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="46%" text-anchor="middle" font-size="84" fill="#fff" font-family="Playfair Display, serif" font-weight="700">DPO2U</text>
  <text x="50%" y="60%" text-anchor="middle" font-size="36" fill="#fff" font-family="Inter, Arial, sans-serif">Transformação Digital com Privacidade e IA</text>
</svg>`;
  return new NextResponse(svg, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}

