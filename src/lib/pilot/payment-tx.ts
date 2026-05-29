// x402 — cola de protocolo no cliente (parse do desafio 402 oficial + encode do
// header X-PAYMENT). PURO e testável. A construção on-chain do pagamento USDC
// (transfer no SAC + assinatura Freighter) é o seam de go-live: deve usar o
// `@x402/stellar` exact/client contra o facilitator real (ver shake-down). Aqui
// montamos o PaymentPayload OFICIAL @x402 a partir de um XDR já assinado.

export interface X402Challenge {
  readonly scheme: string;
  readonly network: string;
  readonly asset: string;
  readonly amount: string;
  readonly payTo: string;
  readonly resource?: string;
  readonly maxTimeoutSeconds: number;
  readonly extra?: Record<string, unknown>;
}

/** Lê o corpo 402 oficial ({ x402Version, accepts:[PaymentRequirements] }). */
export function parseX402Challenge(body: unknown): X402Challenge | null {
  const b = body as { x402Version?: number; accepts?: unknown[] } | null;
  if (!b || !Array.isArray(b.accepts) || b.accepts.length === 0) return null;
  const a = b.accepts[0] as Record<string, unknown>;
  if (!a.payTo || !a.asset || !a.amount) return null;
  const extra = (a.extra as Record<string, unknown> | undefined) ?? undefined;
  return {
    scheme: String(a.scheme ?? 'exact'),
    network: String(a.network ?? ''),
    asset: String(a.asset),
    amount: String(a.amount),
    payTo: String(a.payTo),
    resource: a.resource ? String(a.resource) : (extra?.resource ? String(extra.resource) : undefined),
    maxTimeoutSeconds: Number(a.maxTimeoutSeconds) || 120,
    extra,
  };
}

/** Monta o header `X-PAYMENT` (base64 do PaymentPayload oficial) a partir do XDR assinado. */
export function encodePaymentHeader(args: {
  challenge: X402Challenge;
  payer: string;
  signedXdr: string;
}): string {
  const payload = {
    x402Version: 1,
    accepted: {
      scheme: args.challenge.scheme,
      network: args.challenge.network,
      asset: args.challenge.asset,
      amount: args.challenge.amount,
      payTo: args.challenge.payTo,
      maxTimeoutSeconds: args.challenge.maxTimeoutSeconds,
      extra: args.challenge.extra ?? {},
    },
    payload: { signedXdr: args.signedXdr, payer: args.payer },
  };
  const json = JSON.stringify(payload);
  // btoa existe no browser e no Node ≥18 (vitest).
  return typeof btoa === 'function'
    ? btoa(unescape(encodeURIComponent(json)))
    : Buffer.from(json, 'utf8').toString('base64');
}

/**
 * Seam de go-live: dado o desafio + uma função que constrói+assina o pagamento USDC
 * (via @x402/stellar exact/client + Freighter), devolve o header X-PAYMENT pronto.
 * `signPayment` recebe o challenge e o payer e retorna o XDR assinado.
 */
export async function buildX402PaymentHeader(args: {
  challenge: X402Challenge;
  payer: string;
  signPayment: (challenge: X402Challenge, payer: string) => Promise<string>;
}): Promise<string> {
  const signedXdr = await args.signPayment(args.challenge, args.payer);
  return encodePaymentHeader({ challenge: args.challenge, payer: args.payer, signedXdr });
}
