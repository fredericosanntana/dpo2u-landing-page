/**
 * Stripe Checkout backend routes (ESM).
 *
 * Sprint 1 S1.9 — 2026-05-12.
 *
 * Safety design:
 *   - Sem STRIPE_SECRET_KEY no env → /api/stripe/create-checkout-session retorna 503.
 *     Não é silent fallback. Garante que pk_live em frontend NUNCA dispara cobrança real
 *     enquanto sk_live_ não estiver configurado.
 *   - Sem STRIPE_WEBHOOK_SECRET → /api/stripe/webhook retorna 503 (não-validate signature).
 *
 * Stripe lib é lazy-imported dentro das routes (não trava boot se package não instalado
 * ou se sk_ não estiver no env).
 */

const TIER_PRICE_MAP = {
  builder: () => process.env.STRIPE_PRICE_BUILDER,
  team: () => process.env.STRIPE_PRICE_TEAM,
};

let stripeSingleton = null;

/**
 * Lazy dynamic import + init Stripe SDK.
 * Throws com statusCode 503 se STRIPE_SECRET_KEY missing.
 */
async function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    const err = new Error('STRIPE_SECRET_KEY not configured');
    err.statusCode = 503;
    err.code = 'stripe_not_configured';
    throw err;
  }
  if (
    !key.startsWith('sk_live_') &&
    !key.startsWith('sk_test_') &&
    !key.startsWith('rk_live_') &&
    !key.startsWith('rk_test_')
  ) {
    const err = new Error('STRIPE_SECRET_KEY formato inválido (expected sk_live_ / sk_test_ / rk_live_ / rk_test_)');
    err.statusCode = 500;
    err.code = 'stripe_key_invalid';
    throw err;
  }
  if (stripeSingleton) return stripeSingleton;
  const stripeMod = await import('stripe');
  const Stripe = stripeMod.default ?? stripeMod;
  stripeSingleton = new Stripe(key, { apiVersion: '2024-06-20' });
  return stripeSingleton;
}

/**
 * POST /api/stripe/create-checkout-session
 * Body: { tier: 'builder' | 'team', email?, successUrl?, cancelUrl? }
 */
async function createCheckoutSession(req, res) {
  try {
    const { tier, email, successUrl, cancelUrl } = req.body ?? {};

    if (!tier || !TIER_PRICE_MAP[tier]) {
      return res.status(400).json({
        error: 'tier obrigatório: builder | team',
        code: 'invalid_tier',
      });
    }

    const priceId = TIER_PRICE_MAP[tier]();
    if (!priceId) {
      return res.status(503).json({
        error: `Price ID não configurado pro tier ${tier} (env STRIPE_PRICE_${tier.toUpperCase()})`,
        code: 'price_not_configured',
      });
    }

    const stripe = await getStripe();
    const origin = `${req.protocol}://${req.get('host')}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      success_url: successUrl || `${origin}/pricing?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/pricing?status=canceled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      automatic_tax: { enabled: false },
      metadata: {
        source: 'dpo2u-landing',
        tier,
      },
    });

    return res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    const status = err.statusCode ?? 500;
    const code = err.code ?? 'unexpected_error';
    console.error('[stripe-checkout] create-session failed:', code, err.message);
    return res.status(status).json({ error: err.message, code });
  }
}

/**
 * POST /api/stripe/webhook — raw body REQUIRED (express.raw upstream).
 * Sprint 1: só loga eventos. Sprint 2+: persistir customer + tier.
 */
async function webhookHandler(req, res) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(503).json({
      error: 'STRIPE_WEBHOOK_SECRET not configured',
      code: 'webhook_not_configured',
    });
  }

  let event;
  try {
    const stripe = await getStripe();
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('[stripe-webhook] event received:', event.type, event.id);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('[stripe-webhook] checkout completed:', {
        sessionId: session.id,
        customer: session.customer,
        email: session.customer_email,
        tier: session.metadata?.tier,
        amount_total: session.amount_total,
      });
      // TODO Sprint 2: persist customer + tier + access entitlement
      break;
    }
    case 'invoice.paid': {
      console.log('[stripe-webhook] invoice paid:', event.data.object.id);
      break;
    }
    case 'customer.subscription.deleted': {
      console.log('[stripe-webhook] subscription canceled:', event.data.object.id);
      break;
    }
    default:
      console.log('[stripe-webhook] unhandled event type:', event.type);
  }

  return res.json({ received: true });
}

/**
 * GET /api/stripe/status — pre-flight health, não expõe valores das keys.
 */
function statusHandler(req, res) {
  const features = {
    secret_key_configured: Boolean(process.env.STRIPE_SECRET_KEY),
    webhook_configured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    price_builder_configured: Boolean(process.env.STRIPE_PRICE_BUILDER),
    price_team_configured: Boolean(process.env.STRIPE_PRICE_TEAM),
  };
  const ready = Object.values(features).every(Boolean);
  return res.json({ ready, features });
}

/**
 * Wire 3 routes em uma função reusável. Caller passa `express` pra construir
 * middleware sem assumir import path.
 */
export function registerStripeRoutes(app, expressLib) {
  app.get('/api/stripe/status', statusHandler);
  app.post('/api/stripe/create-checkout-session', expressLib.json(), createCheckoutSession);
  // Webhook needs raw body — NÃO use express.json antes desse handler
  app.post(
    '/api/stripe/webhook',
    expressLib.raw({ type: 'application/json' }),
    webhookHandler,
  );
}
