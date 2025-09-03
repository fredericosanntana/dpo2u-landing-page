import { NextResponse } from 'next/server';

export async function GET() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <rect width="16" height="16" rx="3" fill="#0066CC"/>
  <text x="8" y="11" text-anchor="middle" font-size="9" fill="#fff" font-family="Inter, Arial, sans-serif">D</text>
</svg>`;
  return new NextResponse(svg, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}

