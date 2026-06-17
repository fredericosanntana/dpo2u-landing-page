/**
 * /dsr — Data Subject Rights portal v0 (read-only history).
 *
 * Sprint 2 milestone S2.5. Done criteria: "React UI consumes /api/v1/dsr, lists
 * the tenant's tickets. PASS = dummy login shows 1 fake ticket."
 *
 * Spec basis:
 *   - LGPD Art. 18 (Brazil) — 6 data-subject rights, 15 business-day deadline (ANPD)
 *   - GDPR Arts. 15-22 (EU) — 8 rights, 30-day deadline (Art. 12(3))
 *   - CCPA §1798.110-130 (California) — 45 days with a 45-day extension
 *
 * v0 scope:
 *   - Dummy login (email → localStorage)
 *   - GET /api/v1/dsr/tickets?tenantId={email} — falls back to SAMPLE on 401/404
 *   - Read-only table
 *
 * v1 (next sprint): POST /api/v1/dsr/:request_type submission form, real auth.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import {
    type DSRTicket,
    type DSRStatus,
    type DSRRequestType,
    SAMPLE_DSR_TICKETS,
} from '@/types/dsr';

// ─── constants ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'dpo2u_dsr_dummy_email';
const MCP_BASE = 'https://mcp.dpo2u.com';

const TYPE_LABEL: Record<DSRRequestType, string> = {
    access: 'Access',
    correction: 'Rectification',
    erasure: 'Erasure',
    portability: 'Portability',
    objection: 'Objection',
    restriction: 'Restriction',
};

const STATUS_LABEL: Record<DSRStatus, string> = {
    received: 'Received',
    processing: 'Processing',
    resolved: 'Resolved',
    rejected: 'Rejected',
};

const STATUS_COLOR: Record<DSRStatus, string> = {
    received: PALETTE.concrete,
    processing: PALETTE.terracotta,
    resolved: PALETTE.verdigris,
    rejected: PALETTE.ink,
};

// ─── helpers ───────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
    try {
        return new Date(iso).toISOString().slice(0, 10);
    } catch {
        return iso.slice(0, 10);
    }
}

function fmtSla(submittedAt: string, dueAt: string): string {
    const submitted = new Date(submittedAt).getTime();
    const due = new Date(dueAt).getTime();
    if (Number.isNaN(submitted) || Number.isNaN(due)) return '—';
    const days = Math.round((due - submitted) / (1000 * 60 * 60 * 24));
    return `${days}d window`;
}

function isValidEmail(s: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

type LoadState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'ok'; items: DSRTicket[]; source: 'api' | 'sample'; note?: string }
    | { status: 'error'; message: string };

async function fetchTickets(email: string): Promise<LoadState> {
    const tenantId = encodeURIComponent(email);
    const url = `${MCP_BASE}/api/v1/dsr/tickets?tenantId=${tenantId}`;
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                // Dummy auth — backend may ignore in v0. Real Bearer token lands Sprint 3.
                'x-dpo2u-tenant': email,
            },
        });
        if (res.ok) {
            const body = await res.json();
            const items: DSRTicket[] = Array.isArray(body?.items) ? body.items : [];
            return { status: 'ok', items, source: 'api' };
        }
        // 401 / 404 / 5xx → sample fallback so the UX stays demonstrable per S2.5 PASS criteria.
        return {
            status: 'ok',
            items: SAMPLE_DSR_TICKETS.map((t) => ({ ...t, tenantId: email, email })),
            source: 'sample',
            note: `Backend responded ${res.status}. Showing sample data (v0).`,
        };
    } catch (err) {
        return {
            status: 'ok',
            items: SAMPLE_DSR_TICKETS.map((t) => ({ ...t, tenantId: email, email })),
            source: 'sample',
            note: 'Network unavailable. Showing sample data (v0).',
        };
    }
}

// ─── components ────────────────────────────────────────────────────────────

const inputCls =
    'w-full bg-[#E8E2D5] border border-[rgba(12,13,16,.32)] px-3 py-2.5 text-[15px] font-body text-dpo2u-ink placeholder:text-dpo2u-ink/55 placeholder:font-mono placeholder:text-[13px] focus:outline-none focus:border-dpo2u-terracotta focus:ring-1 focus:ring-dpo2u-terracotta';

function LoginGate({ onLogin }: { onLogin: (email: string) => void }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!isValidEmail(trimmed)) {
            setError('Invalid email.');
            return;
        }
        setError(null);
        onLogin(trimmed);
    };

    return (
        <section
            className="max-w-[520px] border p-7 md:p-9 bg-[#E8E2D5]"
            style={{ borderColor: PALETTE.ruleStrong }}
        >
            <SmallLabel style={{ marginBottom: 10 }}>— Login (v0 dummy) —</SmallLabel>
            <h2
                className="text-[22px] md:text-[26px] font-medium mb-3"
                style={{ fontFamily: FONTS.display, letterSpacing: '-0.01em' }}
            >
                Identify yourself to see your tickets.
            </h2>
            <p className="text-[14px] text-dpo2u-ink/75 leading-[1.55] mb-5">
                Real auth (OAuth + DID) lands in Sprint 3. For now, the email is the
                tenant id; it is stored locally only (localStorage).
            </p>
            <form onSubmit={submit} noValidate>
                <label className="block mb-4">
                    <span
                        className="block mb-2"
                        style={{
                            fontFamily: FONTS.display,
                            fontSize: 14,
                            fontWeight: 500,
                            color: PALETTE.ink,
                        }}
                    >
                        Data subject email
                    </span>
                    <input
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError(null);
                        }}
                        placeholder="you@example.com"
                        className={inputCls}
                    />
                    {error && (
                        <span className="block font-mono text-[11px] text-dpo2u-terracotta mt-1.5">
                            {error}
                        </span>
                    )}
                </label>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 py-3 px-6 font-mono text-[13px] uppercase tracking-[0.14em] transition-colors"
                    style={{ background: PALETTE.ink, color: PALETTE.paper }}
                >
                    Sign in →
                </button>
            </form>
        </section>
    );
}

function TicketTable({ items }: { items: DSRTicket[] }) {
    if (items.length === 0) {
        return (
            <div
                className="border-t pt-10 mt-2"
                style={{ borderColor: PALETTE.rule }}
            >
                <p className="text-[15px] text-dpo2u-ink/70 mb-4">
                    No tickets yet. When you want to submit a request (access,
                    erasure, portability, etc.), we'll handle it through the
                    submission interface in the next sprint.
                </p>
                <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-dpo2u-ink/50">
                    DSR submission — v1 (next sprint)
                </p>
            </div>
        );
    }
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr style={{ borderBottom: `1px solid ${PALETTE.ruleStrong}` }}>
                        {[
                            'Ticket',
                            'Type',
                            'Jurisdiction',
                            'Submitted',
                            'Status',
                            'SLA',
                        ].map((h) => (
                            <th
                                key={h}
                                className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.14em] text-dpo2u-ink/70"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.map((t) => (
                        <tr
                            key={t.id}
                            style={{ borderBottom: `1px solid ${PALETTE.rule}` }}
                        >
                            <td className="py-3 pr-4 align-top">
                                <code
                                    className="text-[13px]"
                                    style={{ fontFamily: FONTS.mono, color: PALETTE.ink }}
                                >
                                    {t.id}
                                </code>
                                {t.attestationPda && (
                                    <div
                                        className="mt-1 text-[11px]"
                                        style={{
                                            fontFamily: FONTS.mono,
                                            color: PALETTE.verdigris,
                                        }}
                                        title="On-chain resolution PDA"
                                    >
                                        ✓ pda {t.attestationPda}
                                    </div>
                                )}
                            </td>
                            <td className="py-3 pr-4 text-[14px] text-dpo2u-ink align-top">
                                {TYPE_LABEL[t.type]}
                            </td>
                            <td className="py-3 pr-4 text-[14px] text-dpo2u-ink/70 align-top">
                                {t.jurisdiction}
                            </td>
                            <td
                                className="py-3 pr-4 text-[13px] text-dpo2u-ink/70 align-top"
                                style={{ fontFamily: FONTS.mono }}
                            >
                                {fmtDate(t.submittedAt)}
                            </td>
                            <td className="py-3 pr-4 align-top">
                                <span
                                    className="inline-block py-1 px-2 font-mono text-[10px] uppercase tracking-[0.16em]"
                                    style={{
                                        color: PALETTE.paper,
                                        background: STATUS_COLOR[t.status],
                                    }}
                                >
                                    {STATUS_LABEL[t.status]}
                                </span>
                                {t.resolutionNote && (
                                    <div className="mt-1 text-[12px] text-dpo2u-ink/65 max-w-[42ch] leading-[1.4]">
                                        {t.resolutionNote}
                                    </div>
                                )}
                            </td>
                            <td
                                className="py-3 pr-2 text-[13px] text-dpo2u-ink/70 align-top whitespace-nowrap"
                                style={{ fontFamily: FONTS.mono }}
                            >
                                {fmtSla(t.submittedAt, t.slaDueAt)}
                                <div className="text-[10px] text-dpo2u-ink/50">
                                    due {fmtDate(t.slaDueAt)}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── page ──────────────────────────────────────────────────────────────────

export default function DSRPage() {
    usePageHead({
        title: 'DSR Portal — DPO2U',
        description:
            'Data Subject Rights portal (LGPD Art. 18 / GDPR Arts. 15-22). Data-subject ticket history — access, rectification, erasure, portability. v0 read-only.',
        path: '/dsr',
    });

    const [email, setEmail] = useState<string | null>(null);
    const [load, setLoad] = useState<LoadState>({ status: 'idle' });

    // Hydrate from localStorage (dummy session).
    useEffect(() => {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            if (saved && isValidEmail(saved)) {
                setEmail(saved);
            }
        } catch {
            /* SSR / private mode — ignore. */
        }
    }, []);

    // Fetch tickets when email is set.
    useEffect(() => {
        if (!email) return;
        let cancelled = false;
        setLoad({ status: 'loading' });
        fetchTickets(email).then((next) => {
            if (!cancelled) setLoad(next);
        });
        return () => {
            cancelled = true;
        };
    }, [email]);

    const onLogin = (next: string) => {
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* ignore */
        }
        setEmail(next);
    };

    const onLogout = () => {
        try {
            window.localStorage.removeItem(STORAGE_KEY);
        } catch {
            /* ignore */
        }
        setEmail(null);
        setLoad({ status: 'idle' });
    };

    const ticketCount = useMemo(
        () => (load.status === 'ok' ? load.items.length : 0),
        [load],
    );

    return (
        <div
            className="min-h-screen bg-dpo2u-ivory text-dpo2u-ink"
            style={{ fontFamily: FONTS.body }}
        >
            <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-20">
                {/* Hero */}
                <header className="mb-12 md:mb-16">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dpo2u-ink/70 mb-4">
                        — DSR Portal · v0 read-only —
                    </p>
                    <h1
                        className="text-[40px] md:text-[56px] leading-[1.04] font-medium"
                        style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em' }}
                    >
                        Data Subject Rights — History.
                    </h1>
                    <p className="mt-6 max-w-[64ch] text-[16px] md:text-[18px] text-dpo2u-ink/75">
                        The 6 data-subject rights (LGPD Art. 18 / GDPR Arts. 15-22) listed
                        per ticket — when you submit a request, it shows up here with
                        status, SLA and a link to the on-chain attestation of the
                        resolution, when one exists. v0 read-only: submission lands next sprint.
                    </p>
                </header>

                {/* Login or History */}
                {!email && <LoginGate onLogin={onLogin} />}

                {email && (
                    <>
                        {/* Session bar */}
                        <section
                            className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-b py-4 mb-10"
                            style={{
                                borderColor: PALETTE.rule,
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <SmallLabel>Session</SmallLabel>
                                <code
                                    className="text-[13px]"
                                    style={{ fontFamily: FONTS.mono, color: PALETTE.ink }}
                                >
                                    {email}
                                </code>
                                <span
                                    className="font-mono text-[10px] uppercase tracking-[0.14em] py-0.5 px-1.5"
                                    style={{
                                        color: PALETTE.paper,
                                        background: PALETTE.concrete,
                                    }}
                                    title="Real auth lands in Sprint 3"
                                >
                                    dummy
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <SmallLabel>
                                    {load.status === 'ok'
                                        ? `${ticketCount} ticket${ticketCount === 1 ? '' : 's'}`
                                        : load.status === 'loading'
                                            ? 'loading…'
                                            : '—'}
                                </SmallLabel>
                                <button
                                    onClick={onLogout}
                                    className="font-mono text-[12px] uppercase tracking-[0.14em] border px-3 py-1.5 hover:bg-dpo2u-ink hover:text-dpo2u-ivory transition-colors"
                                    style={{ borderColor: PALETTE.ruleStrong }}
                                >
                                    Sign out
                                </button>
                            </div>
                        </section>

                        {/* Banner — sample data fallback */}
                        {load.status === 'ok' && load.source === 'sample' && (
                            <div
                                className="border-l-2 pl-4 py-2 mb-8"
                                style={{
                                    borderColor: PALETTE.terracotta,
                                    background: 'rgba(200,92,59,0.06)',
                                }}
                            >
                                <p
                                    className="font-mono text-[11px] uppercase tracking-[0.14em] mb-1"
                                    style={{ color: PALETTE.terracotta }}
                                >
                                    Sample mode
                                </p>
                                <p className="text-[13px] text-dpo2u-ink/80">
                                    {load.note ??
                                        'The /api/v1/dsr/tickets endpoint is not yet exposed for public reads. Showing 2 sample tickets (LGPD) to demonstrate the flow.'}
                                </p>
                            </div>
                        )}

                        {/* Table */}
                        {load.status === 'loading' && (
                            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-dpo2u-ink/60">
                                loading tickets…
                            </p>
                        )}
                        {load.status === 'ok' && <TicketTable items={load.items} />}
                        {load.status === 'error' && (
                            <p className="text-[14px] text-dpo2u-terracotta">
                                {load.message}
                            </p>
                        )}
                    </>
                )}

                {/* Footer — regulatory references */}
                <footer
                    className="border-t pt-10 mt-16"
                    style={{ borderColor: PALETTE.ruleStrong }}
                >
                    <SmallLabel style={{ marginBottom: 12 }}>
                        — Regulatory references —
                    </SmallLabel>
                    <ul className="space-y-2 text-[13px] text-dpo2u-ink/75 leading-[1.6]">
                        <li>
                            <strong className="text-dpo2u-ink">LGPD Art. 18</strong> — 6
                            data-subject rights: confirmation, access, correction,
                            anonymization/blocking/deletion, portability, information
                            about sharing. SLA 15 business days (ANPD).
                        </li>
                        <li>
                            <strong className="text-dpo2u-ink">GDPR Arts. 15-22</strong> —
                            access, rectification, erasure, restriction, portability,
                            objection, automated decisions. SLA 30 days (Art. 12(3),
                            extendable to 60).
                        </li>
                        <li>
                            <strong className="text-dpo2u-ink">CCPA §1798.110-130</strong> —
                            right-to-know + right-to-delete. SLA 45 days with a 45-day extension.
                        </li>
                    </ul>
                    <div className="mt-8 flex flex-wrap gap-6 font-mono text-[12px] uppercase tracking-[0.14em]">
                        <Link
                            to="/coverage"
                            className="text-dpo2u-ink/80 border-b border-dpo2u-ink/30 hover:border-dpo2u-terracotta hover:text-dpo2u-terracotta transition-colors pb-0.5"
                        >
                            → Coverage (24 jurisdictions)
                        </Link>
                        <Link
                            to="/privacy"
                            className="text-dpo2u-ink/80 border-b border-dpo2u-ink/30 hover:border-dpo2u-terracotta hover:text-dpo2u-terracotta transition-colors pb-0.5"
                        >
                            → Privacy policy
                        </Link>
                        <Link
                            to="/pricing"
                            className="text-dpo2u-ink/80 border-b border-dpo2u-ink/30 hover:border-dpo2u-terracotta hover:text-dpo2u-terracotta transition-colors pb-0.5"
                        >
                            → Pricing
                        </Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}
