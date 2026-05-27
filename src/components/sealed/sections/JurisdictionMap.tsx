// JurisdictionMap — Natural Earth projection world atlas com 18 dots de jurisdição.
// Reconstruído 2026-05-14 (original WIP perdido, não recuperável via git).
//
// Pega world-atlas 110m via fetch (CDN); converte topojson → geojson com
// topojson-client e renderiza com d3-geo path generator. Dots terracotta
// pra privacy regimes, com tooltip on hover.

import { useEffect, useRef, useState } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection } from 'geojson';
import { PALETTE, FONTS } from '../atoms';

// 18 jurisdições com lat/lng pra plotar. Coordenadas = capital ou hub principal.
interface JurisdictionDot {
  code: string;
  region: string;
  lng: number;
  lat: number;
}

const JURISDICTION_DOTS: JurisdictionDot[] = [
  { code: 'LGPD',      region: 'Brazil',           lng: -46.6, lat: -23.5 },
  { code: 'GDPR',      region: 'EU',               lng:   8.7, lat:  50.1 },
  { code: 'MiCAR',     region: 'EU',               lng:   4.4, lat:  50.8 },
  { code: 'DPDP',      region: 'India',            lng:  77.2, lat:  28.6 },
  { code: 'PDPA',      region: 'Singapore',        lng: 103.8, lat:   1.3 },
  { code: 'UAE',       region: 'U.A.E.',           lng:  55.3, lat:  25.2 },
  { code: 'PDPL',      region: 'U.A.E. federal',   lng:  54.4, lat:  24.5 },
  { code: 'POPIA',     region: 'South Africa',     lng:  28.0, lat: -26.2 },
  { code: 'NDPA',      region: 'Nigeria',          lng:   7.5, lat:   9.1 },
  { code: 'CCPA',      region: 'California',       lng:-122.4, lat:  37.7 },
  { code: 'PIPEDA',    region: 'Canada',           lng: -79.4, lat:  43.6 },
  { code: 'LAW25',     region: 'Quebec',           lng: -73.6, lat:  45.5 },
  { code: 'PIPA',      region: 'South Korea',      lng: 127.0, lat:  37.5 },
  { code: 'PDP',       region: 'Indonesia',        lng: 106.8, lat:  -6.2 },
  { code: 'APPI',      region: 'Japan',            lng: 139.7, lat:  35.7 },
  { code: 'LFPDPPP',   region: 'Mexico',           lng: -99.1, lat:  19.4 },
  { code: 'Decree-13', region: 'Vietnam',          lng: 105.8, lat:  21.0 },
  { code: 'PDPA-MY',   region: 'Malaysia',         lng: 101.7, lat:   3.1 },
];

// ISO 3166-1 numeric country codes cobertos por alguma jurisdição DPO2U.
// world-atlas usa esses como `feature.id`. Total: 70 países (per STATUS.md).
//
// Composição (verificada contra fontes oficiais 2026-05-14):
//   65 HAIP Friends Group (Hiroshima AI Process — soumu.go.jp/hiroshimaaiprocess)
//    2 direct privacy regimes NÃO-HAIP: Brazil (LGPD), South Africa (POPIA)
//    1 EEA não-HAIP: Liechtenstein (GDPR via EEA treaty)
//    2 direct privacy regimes não-HAIP: Saudi Arabia (PDPL Saudi), Ghana (DPA 2012)
//   = 70 países
const COVERED_COUNTRY_IDS = new Set<string>([
  // ── HAIP Friends Group (65 países, lista oficial Out 2025 + adições Mar 2026)
  '032', // Argentina
  '036', // Australia
  '040', // Austria
  '056', // Belgium
  '096', // Brunei Darussalam
  '100', // Bulgaria
  '116', // Cambodia (joined 2024-09-06)
  '124', // Canada
  '152', // Chile
  '170', // Colombia
  '188', // Costa Rica
  '191', // Croatia
  '196', // Cyprus
  '203', // Czech Republic
  '208', // Denmark
  '818', // Egypt
  '233', // Estonia
  '246', // Finland
  '250', // France
  '276', // Germany
  '300', // Greece
  '348', // Hungary
  '352', // Iceland
  '356', // India
  '360', // Indonesia
  '372', // Ireland
  '376', // Israel
  '380', // Italy
  '392', // Japan
  '404', // Kenya
  '410', // Korea (South)
  '417', // Kyrgyzstan (joined 2026-03-05)
  '418', // Laos
  '428', // Latvia
  '440', // Lithuania
  '442', // Luxembourg
  '458', // Malaysia
  '470', // Malta
  '484', // Mexico
  '504', // Morocco
  '528', // Netherlands
  '554', // New Zealand
  '566', // Nigeria
  '578', // Norway
  '598', // Papua New Guinea (joined 2026-03-03)
  '604', // Peru
  '608', // Philippines
  '616', // Poland
  '620', // Portugal
  '642', // Romania
  '686', // Senegal
  '688', // Serbia
  '702', // Singapore
  '703', // Slovakia
  '705', // Slovenia
  '724', // Spain
  '752', // Sweden
  '756', // Switzerland
  '764', // Thailand
  '784', // UAE
  '792', // Turkey
  '804', // Ukraine
  '826', // United Kingdom
  '840', // USA
  '704', // Vietnam (joined 2024-12-02)

  // ── Direct privacy regimes não-HAIP (2) ──────────────────────────────────
  '076', // Brazil — LGPD (não é HAIP Friends Group, mas jurisdição direta DPO2U)
  '710', // South Africa — POPIA

  // ── EEA não-HAIP (1) ──────────────────────────────────────────────────────
  '438', // Liechtenstein — GDPR via EEA treaty

  // ── Other strong DPAs não-HAIP (2) — fecha o 70 ──────────────────────────
  '682', // Saudi Arabia — PDPL Saudi
  '288', // Ghana — DPA 2012
]);

const WIDTH = 980;
const HEIGHT = 540;

// Self-hosted em /public/atlas/ pra evitar CSP/CORS bloquear CDN externa.
// Servido pelo Express static (mesma origem); cacheável.
const TOPOJSON_URL = '/atlas/countries-110m.json';

export default function JurisdictionMap() {
  const [countries, setCountries] = useState<Feature[]>([]);
  const [hover, setHover] = useState<JurisdictionDot | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(TOPOJSON_URL)
      .then((r) => r.json())
      .then((topology) => {
        if (cancelled) return;
        const fc = feature(topology, topology.objects.countries) as unknown as FeatureCollection;
        setCountries(fc.features);
      })
      .catch((err) => {
        // Silent fail — render fallback below.
        // eslint-disable-next-line no-console
        console.warn('[JurisdictionMap] topojson fetch failed:', err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const projection = geoNaturalEarth1()
    .scale(180)
    .translate([WIDTH / 2, HEIGHT / 2 + 20]);
  const pathGen = geoPath(projection);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        height="100%"
        style={{ display: 'block' }}
        role="img"
        aria-label="World map showing 18 privacy + crypto jurisdictions covered by DPO2U"
      >
        {/* Country shapes — uncovered = paper2 light gray;
            covered (DPO2U jurisdiction) = terracotta @ 18% pra ficar
            sutil sem competir com os dots. */}
        <g stroke={PALETTE.rule} strokeWidth={0.4}>
          {countries.map((f, i) => {
            const d = pathGen(f);
            if (!d) return null;
            const id = String((f as { id?: string | number }).id ?? '').padStart(3, '0');
            const isCovered = COVERED_COUNTRY_IDS.has(id);
            return (
              <path
                key={i}
                d={d}
                fill={isCovered ? PALETTE.terracotta : PALETTE.paper2}
                fillOpacity={isCovered ? 0.18 : 1}
              />
            );
          })}
        </g>

        {/* Jurisdiction dots */}
        {JURISDICTION_DOTS.map((j) => {
          const projected = projection([j.lng, j.lat]);
          if (!projected) return null;
          const [x, y] = projected;
          const isHovered = hover?.code === j.code;
          return (
            <g
              key={j.code}
              onMouseEnter={() => setHover(j)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* outer ring (selo de cera vibe) */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 9 : 6}
                fill={PALETTE.terracotta}
                opacity={isHovered ? 0.25 : 0.15}
              />
              {/* inner dot */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 4 : 3}
                fill={PALETTE.terracotta}
              />
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hover && (() => {
          const projected = projection([hover.lng, hover.lat]);
          if (!projected) return null;
          const [x, y] = projected;
          const label = `${hover.code} · ${hover.region}`;
          const labelWidth = label.length * 6.5 + 16;
          return (
            <g pointerEvents="none">
              <rect
                x={x - labelWidth / 2}
                y={y - 30}
                width={labelWidth}
                height={20}
                fill={PALETTE.ink}
                rx={2}
              />
              <text
                x={x}
                y={y - 16}
                textAnchor="middle"
                fontFamily={FONTS.mono}
                fontSize={11}
                fill="#FFFFFF"
                letterSpacing="0.04em"
              >
                {label}
              </text>
            </g>
          );
        })()}

        {/* Counter — bottom right */}
        <text
          x={WIDTH - 16}
          y={HEIGHT - 14}
          textAnchor="end"
          fontFamily={FONTS.mono}
          fontSize={11}
          fill={PALETTE.concrete}
          letterSpacing="0.14em"
        >
          17 JURISDICTIONS · 70 COUNTRIES ADDRESSED
        </text>
      </svg>

      {/* Loading fallback (textual) — visible if topojson fetch is slow */}
      {countries.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONTS.mono,
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: PALETTE.concrete,
            pointerEvents: 'none',
          }}
        >
          Loading atlas…
        </div>
      )}
    </div>
  );
}
