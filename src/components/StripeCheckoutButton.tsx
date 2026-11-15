/**
 * StripeCheckoutButton — botão CTA pra tier que dispara Stripe Checkout.
 *
 * Fallback: se VITE_STRIPE_ENABLED=false ou se /api/stripe/status retorna
 * !ready, link cai num href configurável (default /alpha-signup) — UX
 * não-quebra durante o gap entre pk_live live + sk_live + price IDs serem
 * todos configurados.
 *
 * Uso:
 *   <StripeCheckoutButton tier="builder" label="Start pilot →" fallbackHref="/alpha-signup" />
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { isStripeEnabled, redirectToCheckout } from '@/lib/stripe';

interface Props {
  tier: 'builder' | 'team';
  label: string;
  fallbackHref: string;
  className?: string;
  email?: string;
}

export function StripeCheckoutButton({
  tier,
  label,
  fallbackHref,
  className,
  email,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isStripeEnabled()) {
    return (
      <Link to={fallbackHref} className={className}>
        {label}
      </Link>
    );
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await redirectToCheckout({ tier, email });
      // redirect já aconteceu — nada a fazer
    } catch (err) {
      // Code interessante pra logar: stripe_not_configured | price_not_configured | invalid_tier
      const e = err as Error & { code?: string };
      console.error('[Stripe] checkout failed:', e.code, e.message);
      setError(
        e.code === 'stripe_not_configured' || e.code === 'price_not_configured'
          ? 'Stripe ainda não está totalmente configurado. Use o pilot signup.'
          : 'Não foi possível abrir Stripe Checkout. Tente novamente.',
      );
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className={className}
        aria-busy={busy}
      >
        {busy ? 'Abrindo Stripe…' : label}
      </button>
      {error && (
        <p style={{ fontSize: 12, marginTop: 8, color: '#c84a4a' }} role="alert">
          {error} · <Link to={fallbackHref}>Alternativa: pilot signup</Link>
        </p>
      )}
    </div>
  );
}
