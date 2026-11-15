// PitchDeckModal — full-screen overlay that embeds the pitch deck PDF.
// Rebuilt 2026-05-21: the prior stub returned null, so "VIEW DECK" did
// nothing. Signature kept ({ open, onClose, deckUrl }) so Hero is unchanged.
import React, { useEffect } from 'react';
import { PALETTE, FONTS } from './atoms';

interface PitchDeckModalProps {
  open: boolean;
  onClose: () => void;
  deckUrl?: string;
}

const DEFAULT_DECK = '/downloads/pitch/dpo2u-pitch-deck.pdf';

export default function PitchDeckModal({ open, onClose, deckUrl }: PitchDeckModalProps) {
  const url = deckUrl || DEFAULT_DECK;

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="DPO2U pitch deck"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(12,13,16,.78)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px clamp(16px, 4vw, 64px)',
      }}
    >
      {/* Header bar — stops click-through so the overlay click only closes
          from the backdrop. */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            letterSpacing: '.15em',
            textTransform: 'uppercase',
            color: PALETTE.paper,
          }}
        >
          § PITCH DECK · 13 SLIDES
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: PALETTE.paper,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          Open / Download PDF ↗
        </a>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            marginLeft: 'auto',
            background: 'transparent',
            border: `.5px solid ${PALETTE.paper}`,
            color: PALETTE.paper,
            fontFamily: FONTS.mono,
            fontSize: 11,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            padding: '6px 14px',
            cursor: 'pointer',
          }}
        >
          Close ✕
        </button>
      </div>

      {/* PDF viewer */}
      <iframe
        onClick={(e) => e.stopPropagation()}
        src={`${url}#view=FitH`}
        title="DPO2U pitch deck"
        style={{
          flex: 1,
          width: '100%',
          border: `.5px solid ${PALETTE.ruleStrong}`,
          background: PALETTE.paper,
        }}
      />
    </div>
  );
}
