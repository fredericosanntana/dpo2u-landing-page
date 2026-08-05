/**
 * /alpha — DPO2U attestation showcase.
 *
 * Names only. Scores stay private. Proof is public.
 * (Sealed §3.2 absorbed into DPO2U canon — see brand FINAL doc 2026-04-24.)
 *
 * Re-skinned 2026-04-29 with Sealed editorial cartorial vocabulary.
 * Each dApp renders as a "stamped" card with corner stamp + verdigris check.
 */

import React, { useEffect, useState } from 'react';
import { usePageHead } from '@/lib/page-head';
import {
    SmallLabel,
    Rule,
    Button,
    Stamp,
    WaxSeal,
    FONTS,
    PALETTE,
} from '@/components/sealed/atoms';

interface AlphaItem {
    dappName: string;
    attestedAt: string;
    projectType: string | null;
    jurisdictions: string[];
}

export default function AlphaPage() {
    usePageHead({
        title: 'Alpha — Showcase | DPO2U',
        description: 'Public showcase of dApps attested through the DPO2U alpha pipeline. Names only. Scores stay private. Proof is public.',
        path: '/alpha',
    });
    const [items, setItems] = useState<AlphaItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/alpha-list')
            .then(r => r.json())
            .then(data => {
                setItems(Array.isArray(data?.items) ? data.items : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <>
            {/* Masthead */}
            <section className="px-6 lg:px-14 pt-16 lg:pt-24 pb-16 lg:pb-20" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
                <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12 items-start">
                    <div>
                        <SmallLabel style={{ marginBottom: 16 }}>§ ALPHA · SHOWCASE</SmallLabel>
                        <h1
                            style={{
                                fontFamily: FONTS.display, fontWeight: 500,
                                lineHeight: 1.02, letterSpacing: '-.035em',
                                margin: 0,
                            }}
                            className="text-[48px] sm:text-[56px] lg:text-[64px]"
                        >
                            Sealed in <span style={{ fontStyle: 'italic', color: PALETTE.terracotta }}>alpha.</span>
                        </h1>
                        <p
                            style={{
                                fontFamily: FONTS.display, fontSize: 22,
                                lineHeight: 1.45, color: PALETTE.inkSoft,
                                marginTop: 28, maxWidth: 640,
                            }}
                        >
                            DPO2U produces the documentation that mitigated risk and lifted compliance scores.
                            Below are the dApps that completed our research-led attestation track.
                        </p>
                        <p
                            style={{
                                fontFamily: FONTS.mono, fontSize: 12,
                                letterSpacing: '.18em', textTransform: 'uppercase',
                                color: PALETTE.terracotta, marginTop: 28,
                            }}
                        >
                            Names only. Scores stay private. Proof is public.
                        </p>
                    </div>
                    <div className="flex justify-center lg:justify-end pt-4">
                        <WaxSeal size={160} label="ALPHA" />
                    </div>
                </div>
            </section>

            {/* List */}
            <section className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
                <SmallLabel style={{ marginBottom: 28 }}>§ ATTESTED · NAMES ONLY</SmallLabel>

                {loading ? (
                    <p
                        style={{
                            fontFamily: FONTS.mono, fontSize: 13,
                            color: PALETTE.concrete, letterSpacing: '.14em', textTransform: 'uppercase',
                        }}
                    >
                        Loading…
                    </p>
                ) : items.length === 0 ? (
                    <div
                        style={{
                            background: PALETTE.paper2,
                            border: `.5px solid ${PALETTE.ruleStrong}`,
                            padding: '36px 32px',
                            maxWidth: 720,
                        }}
                    >
                        <h2
                            style={{
                                fontFamily: FONTS.display, fontSize: 26, fontWeight: 500,
                                color: PALETTE.ink, margin: 0, lineHeight: 1.25,
                            }}
                        >
                            No attestations published yet.
                        </h2>
                        <p
                            style={{
                                fontFamily: FONTS.body, fontSize: 16, lineHeight: 1.6,
                                color: PALETTE.inkSoft, marginTop: 16,
                            }}
                        >
                            Projects onboard through the{' '}
                            <a
                                href="/app/activate"
                                style={{
                                    color: PALETTE.terracotta,
                                    borderBottom: `.5px solid ${PALETTE.terracotta}`,
                                    textDecoration: 'none',
                                }}
                            >
                                app
                            </a>
                            . First names appear once a pipeline is active.
                        </p>
                        <div className="mt-8">
                            <Button kind="terracotta" href="/app/activate">
                                Activate a pipeline →
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((it, i) => (
                            <article
                                key={i}
                                style={{
                                    position: 'relative',
                                    background: PALETTE.paper2,
                                    border: `.5px solid ${PALETTE.ruleStrong}`,
                                    padding: '28px 22px 24px',
                                    minHeight: 200,
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Corner stamp */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 14, right: 14,
                                    }}
                                >
                                    <Stamp rotate={-6} scale={0.85}>SEALED</Stamp>
                                </div>

                                <SmallLabel style={{ fontSize: 9.5, color: PALETTE.concrete, marginBottom: 10 }}>
                                    <time dateTime={it.attestedAt}>
                                        {it.attestedAt?.slice(0, 10) || '—'}
                                    </time>
                                </SmallLabel>
                                <h2
                                    style={{
                                        fontFamily: FONTS.display, fontSize: 26, fontWeight: 500,
                                        letterSpacing: '-.018em', lineHeight: 1.2,
                                        color: PALETTE.ink, margin: 0, paddingRight: 80,
                                    }}
                                >
                                    {it.dappName}
                                </h2>

                                <div className="flex flex-wrap gap-1.5 mt-4">
                                    {it.projectType && (
                                        <span
                                            style={{
                                                fontFamily: FONTS.mono, fontSize: 9.5,
                                                letterSpacing: '.14em', textTransform: 'uppercase',
                                                padding: '3px 8px',
                                                border: `.5px solid ${PALETTE.ruleStrong}`,
                                                color: PALETTE.concrete,
                                            }}
                                        >
                                            {it.projectType}
                                        </span>
                                    )}
                                    {it.jurisdictions.map(j => (
                                        <span
                                            key={j}
                                            style={{
                                                fontFamily: FONTS.mono, fontSize: 9.5,
                                                letterSpacing: '.14em', textTransform: 'uppercase',
                                                padding: '3px 8px',
                                                border: `.5px solid ${PALETTE.terracotta}`,
                                                color: PALETTE.terracotta,
                                            }}
                                        >
                                            {j}
                                        </span>
                                    ))}
                                </div>

                                {/* Verified line */}
                                <div
                                    style={{
                                        marginTop: 24,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: FONTS.mono, fontSize: 11,
                                            color: PALETTE.verdigris, letterSpacing: '.14em',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        ✓ VERIFIED
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: FONTS.display, fontSize: 10,
                                            letterSpacing: '.3em', color: PALETTE.concrete,
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        ON STELLAR
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* Footer note */}
            <section className="px-6 lg:px-14 py-16">
                <p
                    style={{
                        fontFamily: FONTS.mono, fontSize: 12,
                        letterSpacing: '.16em', textTransform: 'uppercase',
                        color: PALETTE.concrete,
                    }}
                >
                    Seventeen jurisdictions. One primitive layer.
                    <br />
                    LGPD · GDPR · MiCAR · DPDP · PDPA · UAE · PDPL · POPIA · NDPA · CCPA · PIPEDA · LAW25 · PIPA · PDP · APPI · MEXICO · VIETNAM · MALAYSIA.
                </p>
            </section>
        </>
    );
}
