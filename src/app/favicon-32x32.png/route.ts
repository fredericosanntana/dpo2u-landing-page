import { NextResponse } from 'next/server';

export async function GET() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="5" fill="#0066CC"/>
  <text x="16" y="21" text-anchor="middle" font-size="18" fill="#fff" font-family="Inter, Arial, sans-serif">D</text>
</svg>`;
  return new NextResponse(svg, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}

