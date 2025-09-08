import { NextResponse } from 'next/server';

export async function GET() {
  const size = 180;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="30" fill="#0066CC"/>
  <text x="${size/2}" y="${size*0.62}" text-anchor="middle" font-size="${Math.floor(size*0.45)}" fill="#fff" font-family="Inter, Arial, sans-serif">D</text>
</svg>`;
  return new NextResponse(svg, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}

