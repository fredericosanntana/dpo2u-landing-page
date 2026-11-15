// AgentFuelWidget — live DUST health of the self-funding Midnight agent + a "fuel the agent"
// public-goods CTA (faucet) for the wallet-free alpha. Renders nothing if the agent is offline.
import React, { useEffect, useState } from 'react';
import { FONTS, PALETTE } from '@/components/sealed/atoms';
import { Card } from '@/components/app/ui';
import { fetchAgentStatus, type AgentStatus } from '@/lib/app/midnight-client';

export default function AgentFuelWidget() {
  const [s, setS] = useState<AgentStatus | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchAgentStatus().then((r) => { if (alive) setS(r); });
    return () => { alive = false; };
  }, []);

  if (!s) return null; // silent when the agent is unreachable

  const copy = () => {
    if (s.address) {
      navigator.clipboard?.writeText(s.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Card accent={s.lowFuel ? 'terracotta' : 'verdigris'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.lowFuel ? PALETTE.terracotta : PALETTE.verdigris, flex: 'none' }} />
        <span style={{ fontFamily: FONTS.mono, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.12em', color: PALETTE.ink }}>
          {s.lowFuel ? 'Agent low on fuel' : 'Agent self-funding ✓'}
        </span>
      </div>
      <p style={{ fontFamily: FONTS.body, fontSize: 14, color: PALETTE.ink, margin: '0 0 6px' }}>
        DUST {s.dustHuman} · {s.sealsToday ?? 0} seals today · {s.network ?? 'preview'}
      </p>
      {s.lowFuel ? (
        <p style={{ fontFamily: FONTS.body, fontSize: 14, color: PALETTE.inkSoft, margin: '0 0 12px' }}>
          Fuel the agent — it seals for everyone in the alpha (a public good). Send tNIGHT to its address via the faucet to keep the seals flowing.
        </p>
      ) : (
        <p style={{ fontFamily: FONTS.body, fontSize: 14, color: PALETTE.concrete, margin: '0 0 12px' }}>
          The agent pays its own DUST — no wallet, no fees for you. You can still top it up as a public good.
        </p>
      )}
      {s.address && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
          <code style={{ fontFamily: FONTS.mono, fontSize: 11, background: PALETTE.paper2, padding: '4px 8px', borderRadius: 4, wordBreak: 'break-all', maxWidth: '100%' }}>{s.address}</code>
          <button onClick={copy} style={{ fontFamily: FONTS.mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', color: PALETTE.ink, background: 'none', border: `1px solid ${PALETTE.rule}`, borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}>
            {copied ? 'copied ✓' : 'copy address'}
          </button>
        </div>
      )}
      <a href={s.faucetUrl} target="_blank" rel="noreferrer" style={{ fontFamily: FONTS.mono, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.1em', color: PALETTE.terracotta, borderBottom: `1px solid ${PALETTE.terracotta}`, paddingBottom: 2, textDecoration: 'none' }}>
        Fuel the agent (faucet) →
      </a>
    </Card>
  );
}
