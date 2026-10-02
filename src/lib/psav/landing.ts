// landing.ts — dados e lógica pura da landing /psav (padrão PSAV-parceiro).
// Toda data e todo número aqui carrega a fonte. Nada é estimado sem rótulo.

export interface Deadline {
  id: 'pedido' | 'vedacao';
  /** Meia-noite de Brasília do dia (UTC-3). */
  dateIso: string;
  label: string;
  rule: string;
  ruleUrl: string;
  /** Texto depois da data: prazo encerra; vedação entra em vigor. */
  pastText: string;
}

export const DEADLINES: readonly Deadline[] = [
  {
    id: 'pedido',
    dateIso: '2026-10-30T03:00:00.000Z',
    label: 'Prazo para quem já opera pedir autorização',
    rule: 'Res. BCB 520/2025, art. 88, I (270 dias da vigência)',
    ruleUrl: 'https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20BCB&numero=520',
    pastText: 'prazo encerrado',
  },
  {
    id: 'vedacao',
    dateIso: '2026-11-06T03:00:00.000Z',
    label: 'Instituições autorizadas deixam de operar com contraparte não autorizada',
    rule: 'Res. BCB 520/2025, art. 91 (redação da Res. BCB 589/2026)',
    ruleUrl: 'https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20BCB&numero=589',
    pastText: 'em vigor',
  },
];

const DAY = 86_400_000;

/** Dias inteiros que faltam (arredonda para cima); 0 no próprio dia; null se já passou. */
export function daysUntil(dateIso: string, now: Date): number | null {
  const diff = new Date(dateIso).getTime() - now.getTime();
  if (diff < -DAY) return null;
  return Math.max(0, Math.ceil(diff / DAY));
}

export function countdownText(d: Deadline, now: Date): string {
  const n = daysUntil(d.dateIso, now);
  if (n === null) return d.pastText;
  if (n === 0) return 'hoje';
  return n === 1 ? 'falta 1 dia' : `faltam ${n} dias`;
}

export interface Stat {
  value: string;
  label: string;
  source: string;
  sourceUrl: string;
  kind: 'primária' | 'secundária' | 'estimativa';
}

export const STATS: readonly Stat[] = [
  {
    value: 'R$ 283 bi',
    label: 'em cripto declarados à Receita no 1º semestre de 2026 (+21% a/a)',
    source: 'Receita Federal, dados abertos de criptoativos (26/08/2026)',
    sourceUrl: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/criptoativos',
    kind: 'primária',
  },
  {
    value: '84%',
    label: 'desse volume em stablecoins (USDT e USDC)',
    source: 'Receita Federal, mesmo conjunto (cálculo sobre o total declarado)',
    sourceUrl: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/criptoativos',
    kind: 'primária',
  },
  {
    value: 'R$ 10,8–37,2 mi',
    label: 'de capital mínimo para uma SPSAV, conforme as atividades',
    source: 'Res. Conjunta CMN/BCB 14/2025 e Res. BCB 517/2025, via Finsiders',
    sourceUrl: 'https://finsidersbrasil.com.br/?p=351149',
    kind: 'secundária',
  },
  {
    value: '< 10%',
    label: 'dos operadores protocolou pedido a quatro semanas do prazo',
    source: 'Estimativa: 5–8 pedidos (Valor, 18/09/2026) sobre 100–150 operadores (BeInCrypto, 03/09/2026)',
    sourceUrl: 'https://blueconsult.com.br/so-5-pedidos-autorizacao-psav-banco-central/',
    kind: 'estimativa',
  },
];
