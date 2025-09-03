import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ width: string; height: string }> }
) {
  const params = await context.params;
  const w = Math.max(1, Math.min(parseInt(params?.width || '32', 10) || 32, 512));
  const h = Math.max(1, Math.min(parseInt(params?.height || '32', 10) || 32, 512));
  const bg = '#e2e8f0';
  const fg = '#64748b';
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="${Math.floor(
    Math.min(w, h) / 3
  )}" fill="${fg}" font-family="Inter, Arial, sans-serif">D</text>
  <title>DPO2U Placeholder ${w}x${h}</title>
  <desc>Placeholder gerado dinamicamente</desc>
</svg>`;
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
