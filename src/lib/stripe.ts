/**
 * Stripe Checkout helper — frontend.
 *
 * Uso:
 *   import { redirectToCheckout, isStripeEnabled } from '@/lib/stripe';
 *   if (isStripeEnabled()) {
 *     await redirectToCheckout({ tier: 'builder', email: userEmail });
 *   }
 *
 * Safety:
 *   - isStripeEnabled() lê VITE_STRIPE_ENABLED flag (default false em prod)
 *   - sem flag true, pricing CTAs caem no /alpha-signup fallback
 *   - backend retorna 503 se STRIPE_SECRET_KEY missing → essa fn re-throw com msg amigável
 */

const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const ENABLED = import.meta.env.VITE_STRIPE_ENABLED === 'true';

export function isStripeEnabled(): boolean {
  return ENABLED && Boolean(PUBLISHABLE_KEY);
}

export interface RedirectToCheckoutInput {
  tier: 'builder' | 'team';
  email?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface StripeCheckoutError extends Error {
  code: string;
  status?: number;
}

/**
 * Cria session no backend + redireciona pro Stripe Checkout.
 * Throws com `code` + `status` em erro. Caller decide UI de erro.
 */
export async function redirectToCheckout(input: RedirectToCheckoutInput): Promise<never> {
  if (!isStripeEnabled()) {
    const err = new Error('Stripe Checkout não está ativo (VITE_STRIPE_ENABLED=false)') as StripeCheckoutError;
    err.code = 'stripe_disabled';
    throw err;
  }

  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'unknown', code: 'parse_failed' }));
    const err = new Error(body.error ?? 'Stripe Checkout failed') as StripeCheckoutError;
    err.code = body.code ?? 'unknown';
    err.status = response.status;
    throw err;
  }

  const { url } = (await response.json()) as { sessionId: string; url: string };
  if (!url) {
    const err = new Error('Stripe não retornou redirect URL') as StripeCheckoutError;
    err.code = 'no_redirect_url';
    throw err;
  }

  // Redirect a janela atual — Stripe lida com o resto
  window.location.href = url;
  // Unreachable, mas satisfaz TS
  return undefined as never;
}

/**
 * Health check do backend — usa em CI ou na pricing pre-flight pra avisar
 * se Stripe vai falhar antes do usuário clicar.
 */
export interface StripeStatus {
  ready: boolean;
  features: {
    secret_key_configured: boolean;
    webhook_configured: boolean;
    price_builder_configured: boolean;
    price_team_configured: boolean;
  };
}

export async function getStripeStatus(): Promise<StripeStatus> {
  const r = await fetch('/api/stripe/status');
  if (!r.ok) throw new Error('Stripe status endpoint failed');
  return r.json();
}
