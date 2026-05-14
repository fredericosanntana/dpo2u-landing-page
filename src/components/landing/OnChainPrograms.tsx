import React, { useState, useRef, lazy, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeIn, viewportOnce } from '@/lib/animations';
import { PROGRAMS_META as PROGRAMS, explorerUrlStr as explorerUrl, truncateAddressStr as truncateAddress } from '@/lib/solana-meta';
// Live devnet widgets pull @solana/web3.js (~310 KB). Defer to keep them
// out of the initial home-route paint — they're below-the-fold anyway.
const LiveAttestationsWidget = lazy(() => import('@/components/solana/LiveAttestationsWidget'));
const AgentsRegisteredWidget = lazy(() => import('@/components/solana/AgentsRegisteredWidget'));

// Editorial placeholder for live widgets — same height, no spinner.
const WidgetSkeleton = () => (
  <div
    aria-hidden
    className="h-[360px] border border-dpo2u-ink/10 bg-dpo2u-ivory-warm/40 animate-pulse"
    style={{ animationDuration: '1.6s' }}
  />
);

// Renders the lazy widget only after its slot scrolls near the viewport.
// React.lazy() loads the chunk on first render of the lazy element, so we
// gate the render itself behind useInView. 200 px margin = preload right
// before scroll-in so users don't see the skeleton flash.
function ViewportGated({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '200px 0px' });
  return (
    <div ref={ref}>
      {inView ? <Suspense fallback={<WidgetSkeleton />}>{children}</Suspense> : <WidgetSkeleton />}
    </div>
  );
}

export default function OnChainPrograms() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyAddress = async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopied(addr);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Ignore — clipboard API unavailable
    }
  };

  return (
    <section id="programs" className="bg-dpo2u-ivory border-b border-dpo2u-ink/10">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10 py-24 md:py-32">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          variants={fadeIn}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dpo2u-indigo mb-6 inline-flex items-center gap-2.5">
            <span className="ed-live-dot" aria-hidden />
            Live on Solana devnet
          </p>
          <h2 className="font-display text-section text-dpo2u-ink font-medium max-w-[22ch]">
            Fourteen programs, live on Solana devnet.
          </h2>
          <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.14em] text-dpo2u-ink/70">
            Research operationalized. Not a product feature grid.
          </p>
        </motion.div>

        {/* Programs list — numbered editorial */}
        <div className="mt-16 divide-y divide-dpo2u-ink/10 border-t border-b border-dpo2u-ink/10">
          {PROGRAMS.map((p, i) => {
            const addr = p.programId;
            const num  = String(i + 1).padStart(2, '0');
            const isCopied = copied === addr;
            return (
              <motion.article
                key={p.key}
                initial="initial"
                whileInView="animate"
                viewport={viewportOnce}
                variants={fadeIn}
                transition={{ delay: 0.04 * i }}
                className="py-6 md:py-8 grid grid-cols-12 gap-4 md:gap-6 items-baseline"
              >
                <div className="col-span-12 md:col-span-1 font-mono text-[12px] tracking-[0.12em] text-dpo2u-indigo">
                  {num} /
                </div>
                <div className="col-span-12 md:col-span-4">
                  <h3 className="font-display text-[22px] md:text-[24px] text-dpo2u-ink font-medium leading-tight">
                    {p.displayName}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <p className="font-display italic text-[15px] text-dpo2u-ink/75 leading-snug">
                    {p.tagline}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-3 flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => copyAddress(addr)}
                    title={addr}
                    aria-label={`Copy ${p.displayName} program ID`}
                    className="font-mono text-[12px] text-dpo2u-ink/80 hover:text-dpo2u-indigo transition-colors"
                  >
                    {truncateAddress(addr)}
                    <span className="ml-1.5 text-dpo2u-ink/65">{isCopied ? '✓' : '⧉'}</span>
                  </button>
                  <a
                    href={explorerUrl(p.programId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] uppercase tracking-[0.1em] text-dpo2u-ink/70 hover:text-dpo2u-indigo transition-colors"
                  >
                    Explorer ↗
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Live widgets — editorial card treatment */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
            variants={fadeIn}
          >
            <ViewportGated>
              <LiveAttestationsWidget />
            </ViewportGated>
          </motion.div>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
            variants={fadeIn}
            transition={{ delay: 0.1 }}
          >
            <ViewportGated>
              <AgentsRegisteredWidget />
            </ViewportGated>
          </motion.div>
        </div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          variants={fadeIn}
          className="mt-14"
        >
          <Link
            to="/solana-protocol"
            className="group inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.14em] text-dpo2u-ink hover:text-dpo2u-indigo transition-colors border-b border-dpo2u-ink/30 hover:border-dpo2u-indigo pb-1"
          >
            Read the protocol
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
