import { NextResponse } from 'next/server';

export async function GET() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="40" fill="#000"/>
  <path d="M64 64h128v128H64z" fill="#0066CC"/>
  <text x="128" y="156" text-anchor="middle" font-size="96" fill="#fff" font-family="Inter, Arial, sans-serif">D</text>
</svg>`;
  return new NextResponse(svg, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}

