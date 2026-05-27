import { useIndexerStore, selectVerdictDistribution } from '@/lib/pilot/indexer-store';

const SIZE = 200;
const RADIUS = 80;
const STROKE = 24;
const CENTER = SIZE / 2;

interface SliceConfig {
  readonly value: number;
  readonly color: string;
  readonly label: string;
}

function buildArc(start: number, end: number): string {
  const startAngle = (start - 0.25) * Math.PI * 2;
  const endAngle = (end - 0.25) * Math.PI * 2;
  const x1 = CENTER + RADIUS * Math.cos(startAngle);
  const y1 = CENTER + RADIUS * Math.sin(startAngle);
  const x2 = CENTER + RADIUS * Math.cos(endAngle);
  const y2 = CENTER + RADIUS * Math.sin(endAngle);
  const largeArc = end - start > 0.5 ? 1 : 0;
  return `M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2}`;
}

export function VerdictDistributionChart() {
  const events = useIndexerStore((s) => s.events);
  const dist = selectVerdictDistribution({ events } as any);

  // Sealed palette only. PASS = verdigris, FAIL + REVIEW = terracotta full.
  // Labels diferenciam REVIEW de FAIL no donut (não a cor) — user pediu
  // terracotta puro no lugar do salmon-yellow.
  const slices: SliceConfig[] = [
    { value: dist.pass, color: '#4A7C74', label: 'PASS' },
    { value: dist.review, color: '#C85C3B', label: 'REVIEW' },
    { value: dist.fail, color: '#C85C3B', label: 'FAIL' },
  ];

  if (dist.total === 0) {
    return (
      <div className="rounded-xl border border-dpo2u-ink/10 bg-white p-6 flex items-center justify-center h-72">
        <p className="text-sm text-dpo2u-ink/50 font-body italic">
          Aguardando atestações para distribuir verdicts…
        </p>
      </div>
    );
  }

  let cursor = 0;
  return (
    <div className="rounded-xl border border-dpo2u-ink/10 bg-white p-6">
      <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60 mb-3">
        Distribuição de verdicts
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="shrink-0">
          {slices.map((s, idx) => {
            if (s.value === 0) return null;
            const fraction = s.value / dist.total;
            const start = cursor;
            const end = cursor + fraction;
            cursor = end;
            // Single full-circle slice case
            if (fraction >= 0.9999) {
              return (
                <circle
                  key={s.label}
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={STROKE}
                />
              );
            }
            return (
              <path
                key={s.label}
                d={buildArc(start, end)}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE}
                strokeLinecap="butt"
              />
            );
          })}
          <text
            x={CENTER}
            y={CENTER - 4}
            textAnchor="middle"
            className="font-display fill-dpo2u-ink"
            style={{ fontSize: 28 }}
          >
            {dist.total}
          </text>
          <text
            x={CENTER}
            y={CENTER + 18}
            textAnchor="middle"
            className="font-mono fill-dpo2u-ink"
            style={{ fontSize: 10, opacity: 0.6, letterSpacing: '0.1em' }}
          >
            ATESTAÇÕES
          </text>
        </svg>

        <ul className="space-y-2 flex-1 min-w-0 w-full sm:w-auto">
          {slices.map((s) => {
            const pct = dist.total > 0 ? Math.round((s.value / dist.total) * 100) : 0;
            return (
              <li key={s.label} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="inline-block w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="font-mono text-xs text-dpo2u-ink/80">{s.label}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-display text-dpo2u-ink tabular-nums">{s.value}</span>
                  <span className="ml-2 text-xs text-dpo2u-ink/50 tabular-nums">{pct}%</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
