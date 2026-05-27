/**
 * /register-dapp — DPO2U alpha registry intake.
 *
 * Wizard multi-step (7 steps, ~58 fields) covering CompleteFormData (steps 1-6
 * LGPD diligence) + step7_web3 (Solana / multi-jurisdictional metadata).
 *
 * Voice canon: numbers-first, antithetical, dev-idiomatic, no buzzwords.
 *
 * Submission flow:
 *   1. Client validates step-by-step via Zod (incremental).
 *   2. Final submit: POST /api/register-dapp.
 *   3. Backend clones repo (shallow), persists JSON, emails Chairman.
 *   4. Chairman runs `process_submission.py --id <uuid>` to invoke MCP chain.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
    registerDappSchema,
    stepSchemas,
    stepTitles,
    defaultPayload,
    type RegisterDappPayload,
} from '@/lib/registerDappSchema';
import { usePageHead } from '@/lib/page-head';
import {
    SmallLabel,
    Rule,
    Button,
    FONTS,
    PALETTE,
} from '@/components/sealed/atoms';

// "Why register?" sidebar bullets — terracotta dash + ink-soft text, mirrors
// the home Roadmap rhythm. Updated 2026-04-29 in the Sealed globalization sprint.
const WHY_REGISTER = [
    'Compliance attested on-chain — auditable, revocable, immutable.',
    'Seventeen jurisdictions in scope (LGPD, GDPR, MiCAR, DPDP, PDPA, UAE, PDPL, POPIA, NDPA, CCPA, PIPEDA, LAW25, PIPA, PDP, APPI, MEXICO, VIETNAM, MALAYSIA) + AI Governance vertical (six frameworks: Japan AI Promotion Act, Hiroshima ICOC G7, EU AI Act, Korea AI Basic Act, CAIDP Universal Guidelines, UNESCO RAM).',
    'Names public, scores private. Proof, not prose.',
    'No $50k consultant. No PDFs. No monthly dashboard.',
    'Draft auto-saves locally. Close the tab — pick up later.',
];

const DRAFT_KEY = 'dpo2u-register-draft';
const TOTAL_STEPS = 7;

const FRAMEWORKS = ['LGPD', 'GDPR', 'MiCAR', 'DPDP', 'PDPA', 'UAE', 'PDPL', 'POPIA', 'NDPA', 'CCPA', 'PIPEDA', 'LAW25', 'PIPA', 'PDP'] as const;
const PROJECT_TYPES = ['dApp', 'SaaS', 'DeFi', 'RWA', 'Stablecoin', 'AI Agent', 'Other'] as const;
const BASE_LEGAL = [
    'consentimento', 'contrato', 'obrigacao_legal', 'exercicio_regular',
    'protecao_vida', 'tutela_saude', 'interesse_legitimo', 'protecao_credito', 'outro',
] as const;
const DATA_CATEGORIES = ['cadastral', 'sensivel', 'crianca', 'financeiro', 'outro'] as const;
const VOLUMES = ['baixo', 'medio', 'alto'] as const;
const STORAGE_LOCATIONS = ['cloud_brasil', 'cloud_exterior', 'on_premise', 'misto'] as const;
const TP_TYPES = ['processador', 'controlador_conjunto', 'subcontratado'] as const;

type SubmissionState =
    | { status: 'idle' }
    | { status: 'submitting' }
    | { status: 'success'; submissionId: string }
    | { status: 'error'; message: string };

// ── Reusable input primitives (terracotta-ready) ────────────────────────────

const Field: React.FC<{ label: string; hint?: string; error?: string; children: React.ReactNode }> = ({
    label, hint, error, children,
}) => (
    <label className="block mb-5">
        <span
            className="block mb-2"
            style={{
                fontFamily: FONTS.display,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '-0.005em',
                color: PALETTE.ink,
            }}
        >
            {label}
        </span>
        {children}
        {hint && <span className="block font-mono text-[11px] text-dpo2u-ink/70 mt-1.5">{hint}</span>}
        {error && <span className="block font-mono text-[11px] text-dpo2u-terracotta mt-1.5">{error}</span>}
    </label>
);

// Sealed-flavored input — paper-2 bg, .5px rule-strong border, terracotta focus
// state, monospace placeholder. Mirrors the home aesthetic (Hero, MCP cards).
const inputCls =
    'w-full bg-[#E8E2D5] border border-[rgba(12,13,16,.32)] px-3 py-2.5 text-[15px] font-body text-dpo2u-ink placeholder:text-dpo2u-ink/55 placeholder:font-mono placeholder:text-[13px] focus:outline-none focus:border-dpo2u-terracotta focus:ring-1 focus:ring-dpo2u-terracotta';
const checkCls =
    'inline-flex items-center gap-2 cursor-pointer select-none mr-4 mb-2';

// ── Component ───────────────────────────────────────────────────────────────

export default function RegisterDappPage() {
    usePageHead({
        title: 'Register a dApp — Alpha intake | DPO2U',
        description: 'Submit your dApp to the DPO2U alpha registry. Seven-step LGPD diligence + Solana metadata. Compliance attested on-chain.',
        path: '/register-dapp',
    });
    const [step, setStep] = useState<number>(1);
    const [payload, setPayload] = useState<RegisterDappPayload>(defaultPayload);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submission, setSubmission] = useState<SubmissionState>({ status: 'idle' });

    // Load draft on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                setPayload(prev => ({ ...prev, ...parsed }));
            }
        } catch {/* ignore corrupt draft */}
    }, []);

    // Auto-save draft
    useEffect(() => {
        try { localStorage.setItem(DRAFT_KEY, JSON.stringify(payload)); }
        catch {/* quota exceeded — silent */}
    }, [payload]);

    const update = <K extends keyof RegisterDappPayload>(key: K, value: RegisterDappPayload[K]) => {
        setPayload(prev => ({ ...prev, [key]: value }));
    };

    const validateStep = (n: number): boolean => {
        const schema = stepSchemas[n - 1];
        if (!schema) return true;
        const result = schema.safeParse(payload);
        if (result.success) {
            setErrors({});
            return true;
        }
        const errMap: Record<string, string> = {};
        for (const issue of result.error.issues) {
            errMap[issue.path.join('.')] = issue.message;
        }
        setErrors(errMap);
        return false;
    };

    const handleNext = () => {
        if (validateStep(step) && step < TOTAL_STEPS) setStep(step + 1);
    };
    const handleBack = () => { if (step > 1) setStep(step - 1); };

    const handleSubmit = async () => {
        if (!validateStep(step)) return;
        const full = registerDappSchema.safeParse(payload);
        if (!full.success) {
            const errMap: Record<string, string> = {};
            for (const issue of full.error.issues) errMap[issue.path.join('.')] = issue.message;
            setErrors(errMap);
            return;
        }
        setSubmission({ status: 'submitting' });
        try {
            const res = await fetch('/api/register-dapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(full.data),
            });
            const json = await res.json();
            if (!res.ok) {
                setSubmission({ status: 'error', message: json?.error || 'Submission failed.' });
                return;
            }
            setSubmission({ status: 'success', submissionId: json.submissionId });
            try { localStorage.removeItem(DRAFT_KEY); } catch {/* */}
        } catch (e: any) {
            setSubmission({ status: 'error', message: e?.message || 'Network error.' });
        }
    };

    const progressPct = useMemo(() => Math.round((step / TOTAL_STEPS) * 100), [step]);

    // ── Success screen ─────────────────────────────────────────────────────
    if (submission.status === 'success') {
        return (
            <section className="px-6 lg:px-14 py-24">
                <div className="max-w-[640px] mx-auto">
                    <SmallLabel style={{ marginBottom: 16, color: PALETTE.terracotta }}>§ SUBMISSION RECEIVED</SmallLabel>
                    <h1
                        style={{
                            fontFamily: FONTS.display, fontWeight: 500,
                            lineHeight: 1.05, letterSpacing: '-.03em',
                            margin: 0,
                        }}
                        className="text-[40px] sm:text-[52px] lg:text-[60px]"
                    >
                        DPO2U <span style={{ fontStyle: 'italic' }}>has your submission.</span>
                    </h1>
                    <p
                        style={{
                            fontFamily: FONTS.body, fontSize: 17, lineHeight: 1.6,
                            color: PALETTE.inkSoft, marginTop: 24,
                        }}
                    >
                        We'll email you when the research desk processes it.
                        No dashboard. No "stay tuned." A quiet email.
                    </p>
                    <div
                        style={{
                            marginTop: 36,
                            background: PALETTE.paper2,
                            border: `.5px solid ${PALETTE.ruleStrong}`,
                            padding: '20px 22px',
                        }}
                    >
                        <SmallLabel>SUBMISSION ID</SmallLabel>
                        <p
                            style={{
                                fontFamily: FONTS.mono, fontSize: 13,
                                color: PALETTE.ink, marginTop: 8, wordBreak: 'break-all',
                            }}
                            className="select-all"
                        >
                            {submission.submissionId}
                        </p>
                    </div>
                    <div className="mt-10 flex gap-3 flex-wrap">
                        <Button kind="terracotta" href="/">→ Home</Button>
                        <Button kind="ghost" href="/alpha">→ Alpha showcase</Button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="px-6 lg:px-14 pt-16 lg:pt-24 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-14 max-w-[1200px] mx-auto">
                <div>
                    {/* Hero */}
                    <SmallLabel style={{ marginBottom: 16 }}>§ REGISTER · ALPHA INTAKE</SmallLabel>
                    <h1
                        style={{
                            fontFamily: FONTS.display, fontWeight: 500,
                            lineHeight: 1.02, letterSpacing: '-.035em',
                            margin: 0,
                        }}
                        className="text-[44px] sm:text-[52px] lg:text-[56px]"
                    >
                        Submit a <span style={{ fontStyle: 'italic', color: PALETTE.terracotta }}>dApp.</span>
                    </h1>
                    <p
                        style={{
                            fontFamily: FONTS.display, fontSize: 22,
                            color: PALETTE.inkSoft, lineHeight: 1.4,
                            marginTop: 24, maxWidth: 600,
                        }}
                    >
                        DPO2U is the research house that ships code.
                        Seventeen jurisdictions. 66 MCP tools. Six AI governance frameworks. ~58 fields. ~15 minutes.
                    </p>
                    <p
                        style={{
                            fontFamily: FONTS.mono, fontSize: 12,
                            letterSpacing: '.14em', textTransform: 'uppercase',
                            color: PALETTE.terracotta, marginTop: 24,
                        }}
                    >
                        Without a lawyer. Without a $50k consultant.
                    </p>

                    {/* Stepper */}
                    <div className="mt-14 mb-10">
                        <div className="flex items-center justify-between mb-3">
                            <span style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: PALETTE.concrete }}>
                                Step {step} of {TOTAL_STEPS} · {stepTitles[step]}
                            </span>
                            <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.concrete }}>
                                {progressPct}%
                            </span>
                        </div>
                        <div style={{ height: 1, background: PALETTE.rule }}>
                            <div
                                style={{
                                    height: 1, background: PALETTE.terracotta,
                                    width: `${progressPct}%`, transition: 'width .25s',
                                }}
                            />
                        </div>
                    </div>

                    {/* Step body */}
                    <div
                        style={{
                            background: PALETTE.paper2,
                            border: `.5px solid ${PALETTE.ruleStrong}`,
                            padding: '28px 24px',
                        }}
                    >
                            {step === 1 && (
                                <Step1
                                    value={payload.step1_company}
                                    onChange={v => update('step1_company', v)}
                                    errors={errors}
                                />
                            )}
                            {step === 2 && (
                                <Step2
                                    value={payload.step2_inventory}
                                    onChange={v => update('step2_inventory', v)}
                                />
                            )}
                            {step === 3 && (
                                <Step3
                                    value={payload.step3_purposes}
                                    inventory={payload.step2_inventory}
                                    onChange={v => update('step3_purposes', v)}
                                />
                            )}
                            {step === 4 && (
                                <Step4
                                    value={payload.step4_storage}
                                    inventory={payload.step2_inventory}
                                    onChange={v => update('step4_storage', v)}
                                />
                            )}
                            {step === 5 && (
                                <Step5
                                    value={payload.step5_third_parties}
                                    inventory={payload.step2_inventory}
                                    onChange={v => update('step5_third_parties', v)}
                                />
                            )}
                            {step === 6 && (
                                <Step6
                                    security={payload.step6_security}
                                    risks={payload.step6_risks}
                                    onChangeSecurity={v => update('step6_security', v)}
                                    onChangeRisks={v => update('step6_risks', v)}
                                    errors={errors}
                                />
                            )}
                            {step === 7 && (
                                <Step7
                                    value={payload.step7_web3}
                                    onChange={v => update('step7_web3', v)}
                                    errors={errors}
                                />
                            )}
                    </div>

                    {/* Nav */}
                    <div className="mt-10 flex items-center justify-between gap-4 flex-wrap">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            style={{
                                fontFamily: FONTS.mono, fontSize: 12,
                                letterSpacing: '.14em', textTransform: 'uppercase',
                                padding: '10px 18px',
                                background: 'transparent',
                                border: `.5px solid ${PALETTE.ruleStrong}`,
                                color: PALETTE.ink,
                                cursor: step === 1 ? 'not-allowed' : 'pointer',
                                opacity: step === 1 ? 0.3 : 1,
                                borderRadius: 2,
                            }}
                        >
                            ← Back
                        </button>
                        {step < TOTAL_STEPS ? (
                            <button
                                onClick={handleNext}
                                style={{
                                    fontFamily: FONTS.mono, fontSize: 12,
                                    letterSpacing: '.14em', textTransform: 'uppercase',
                                    padding: '10px 22px',
                                    background: PALETTE.terracotta,
                                    color: '#fff3e6',
                                    border: `.5px solid ${PALETTE.terracotta}`,
                                    cursor: 'pointer',
                                    borderRadius: 2,
                                }}
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submission.status === 'submitting'}
                                style={{
                                    fontFamily: FONTS.mono, fontSize: 12,
                                    letterSpacing: '.14em', textTransform: 'uppercase',
                                    padding: '10px 22px',
                                    background: PALETTE.terracotta,
                                    color: '#fff3e6',
                                    border: `.5px solid ${PALETTE.terracotta}`,
                                    cursor: submission.status === 'submitting' ? 'not-allowed' : 'pointer',
                                    opacity: submission.status === 'submitting' ? 0.5 : 1,
                                    borderRadius: 2,
                                }}
                            >
                                {submission.status === 'submitting' ? 'Submitting…' : 'Submit for review'}
                            </button>
                        )}
                    </div>

                    {submission.status === 'error' && (
                        <p style={{ marginTop: 24, fontFamily: FONTS.mono, fontSize: 13, color: PALETTE.terracotta }}>
                            {submission.message}
                        </p>
                    )}

                    {/* Anti-pattern footer note */}
                    <p
                        style={{
                            marginTop: 56, fontFamily: FONTS.mono, fontSize: 11,
                            letterSpacing: '.14em', textTransform: 'uppercase',
                            color: PALETTE.concrete,
                        }}
                    >
                        Draft auto-saved locally. Close the tab — come back. We'll be here.
                    </p>
                </div>

                {/* Why register? sidebar */}
                <aside className="lg:pt-2">
                    <div
                        style={{
                            background: PALETTE.paper2,
                            border: `.5px solid ${PALETTE.ruleStrong}`,
                            padding: '24px 22px',
                        }}
                    >
                        <SmallLabel style={{ marginBottom: 16, color: PALETTE.terracotta }}>
                            WHY REGISTER?
                        </SmallLabel>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {WHY_REGISTER.map((line) => (
                                <li
                                    key={line}
                                    style={{
                                        display: 'flex', alignItems: 'flex-start', gap: 10,
                                        fontFamily: FONTS.body, fontSize: 14, lineHeight: 1.6,
                                        color: PALETTE.inkSoft, marginBottom: 12,
                                    }}
                                >
                                    <span aria-hidden style={{ color: PALETTE.terracotta, fontFamily: FONTS.mono, fontSize: 12, marginTop: 2 }}>
                                        —
                                    </span>
                                    <span>{line}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
    );
}

// ── Step 1: Empresa ─────────────────────────────────────────────────────────

function Step1({ value, onChange, errors }: any) {
    const set = (k: string, v: any) => onChange({ ...value, [k]: v });
    const e = (k: string) => errors[`step1_company.${k}`];
    return (
        <div>
            <h2 className="font-display text-[28px] font-medium mb-2">Company</h2>
            <p className="text-[14px] text-dpo2u-ink/70 mb-8">Who is the controller behind the dApp.</p>
            <Field label="Name" error={e('nome')}>
                <input className={inputCls} value={value.nome} onChange={ev => set('nome', ev.target.value)} />
            </Field>
            <Field label="CNPJ (optional, BR companies)" error={e('cnpj')}>
                <input className={inputCls} value={value.cnpj} onChange={ev => set('cnpj', ev.target.value)} />
            </Field>
            <Field label="Sector" error={e('setor')}>
                <input className={inputCls} value={value.setor} onChange={ev => set('setor', ev.target.value)} />
            </Field>
            <Field label="Number of employees" error={e('colaboradores')}>
                <input type="number" min={0} className={inputCls} value={value.colaboradores} onChange={ev => set('colaboradores', Number(ev.target.value))} />
            </Field>
            <div className="flex gap-6 mb-5 flex-wrap">
                <label className={checkCls}>
                    <input type="checkbox" checked={value.coletaDados} onChange={ev => set('coletaDados', ev.target.checked)} />
                    <span className="text-[14px]">Collects third-party personal data</span>
                </label>
                <label className={checkCls}>
                    <input type="checkbox" checked={value.possuiOperadores} onChange={ev => set('possuiOperadores', ev.target.checked)} />
                    <span className="text-[14px]">Has data processors / sub-processors</span>
                </label>
            </div>
            <Field label="Responsible person" error={e('responsavel')}>
                <input className={inputCls} value={value.responsavel} onChange={ev => set('responsavel', ev.target.value)} />
            </Field>
            <Field label="Contact email" error={e('email')}>
                <input type="email" className={inputCls} value={value.email} onChange={ev => set('email', ev.target.value)} />
            </Field>
            <Field label="Phone (optional)">
                <input className={inputCls} value={value.telefone || ''} onChange={ev => set('telefone', ev.target.value)} />
            </Field>
        </div>
    );
}

// ── Step 2: Inventory (dynamic array) ───────────────────────────────────────

function Step2({ value, onChange }: any) {
    const add = () => onChange([...value, { id: crypto.randomUUID(), tipo: '', categoria: 'cadastral', volume: 'baixo', descricao: '' }]);
    const remove = (id: string) => onChange(value.filter((it: any) => it.id !== id));
    const upd = (id: string, k: string, v: any) => onChange(value.map((it: any) => it.id === id ? { ...it, [k]: v } : it));
    return (
        <div>
            <h2 className="font-display text-[28px] font-medium mb-2">Data inventory</h2>
            <p className="text-[14px] text-dpo2u-ink/70 mb-8">What kinds of personal data does the system handle.</p>
            {value.length === 0 && (
                <p className="font-mono text-[12px] text-dpo2u-ink/65 mb-6">No items yet. Click below to add.</p>
            )}
            {value.map((it: any) => (
                <div key={it.id} className="border border-dpo2u-ink/15 p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <Field label="Type">
                            <input className={inputCls} placeholder="email, CPF, IP…" value={it.tipo} onChange={ev => upd(it.id, 'tipo', ev.target.value)} />
                        </Field>
                        <Field label="Category">
                            <select className={inputCls} value={it.categoria} onChange={ev => upd(it.id, 'categoria', ev.target.value)}>
                                {DATA_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </Field>
                        <Field label="Volume">
                            <select className={inputCls} value={it.volume} onChange={ev => upd(it.id, 'volume', ev.target.value)}>
                                {VOLUMES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </Field>
                        <button onClick={() => remove(it.id)} className="font-mono text-[11px] uppercase tracking-[0.14em] text-dpo2u-terracotta self-end mb-5">
                            × Remove
                        </button>
                    </div>
                    <Field label="Description">
                        <input className={inputCls} value={it.descricao} onChange={ev => upd(it.id, 'descricao', ev.target.value)} />
                    </Field>
                </div>
            ))}
            <button onClick={add} className="font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2 border border-dpo2u-terracotta text-dpo2u-terracotta hover:bg-dpo2u-terracotta hover:text-dpo2u-ivory">
                + Add data type
            </button>
        </div>
    );
}

// ── Step 3: Purposes ────────────────────────────────────────────────────────

function Step3({ value, inventory, onChange }: any) {
    const add = () => onChange([...value, { dataItemId: inventory[0]?.id || '', finalidade: '', baseLegal: 'consentimento', justificativa: '' }]);
    const remove = (i: number) => onChange(value.filter((_: any, idx: number) => idx !== i));
    const upd = (i: number, k: string, v: any) => onChange(value.map((it: any, idx: number) => idx === i ? { ...it, [k]: v } : it));
    return (
        <div>
            <h2 className="font-display text-[28px] font-medium mb-2">Purposes & legal basis</h2>
            <p className="text-[14px] text-dpo2u-ink/70 mb-8">Why each data type is processed and the LGPD legal basis (Art. 7).</p>
            {value.map((it: any, i: number) => (
                <div key={i} className="border border-dpo2u-ink/15 p-4 mb-4">
                    <Field label="Data item">
                        <select className={inputCls} value={it.dataItemId} onChange={ev => upd(i, 'dataItemId', ev.target.value)}>
                            {inventory.map((d: any) => <option key={d.id} value={d.id}>{d.tipo || d.id.slice(0, 8)}</option>)}
                        </select>
                    </Field>
                    <Field label="Purpose">
                        <input className={inputCls} value={it.finalidade} onChange={ev => upd(i, 'finalidade', ev.target.value)} />
                    </Field>
                    <Field label="Legal basis">
                        <select className={inputCls} value={it.baseLegal} onChange={ev => upd(i, 'baseLegal', ev.target.value)}>
                            {BASE_LEGAL.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </Field>
                    <Field label="Justification">
                        <textarea className={inputCls} rows={2} value={it.justificativa} onChange={ev => upd(i, 'justificativa', ev.target.value)} />
                    </Field>
                    <button onClick={() => remove(i)} className="font-mono text-[11px] uppercase tracking-[0.14em] text-dpo2u-terracotta">× Remove</button>
                </div>
            ))}
            <button onClick={add} disabled={inventory.length === 0} className="font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2 border border-dpo2u-terracotta text-dpo2u-terracotta hover:bg-dpo2u-terracotta hover:text-dpo2u-ivory disabled:opacity-30">
                + Add purpose
            </button>
            {inventory.length === 0 && <p className="font-mono text-[12px] text-dpo2u-ink/65 mt-3">Add inventory items in step 2 first.</p>}
        </div>
    );
}

// ── Step 4: Storage ─────────────────────────────────────────────────────────

function Step4({ value, inventory, onChange }: any) {
    const add = () => onChange([...value, { dataItemId: inventory[0]?.id || '', localizacao: 'cloud_brasil', provedor: '', periodo_retencao: '', procedimento_exclusao: '' }]);
    const remove = (i: number) => onChange(value.filter((_: any, idx: number) => idx !== i));
    const upd = (i: number, k: string, v: any) => onChange(value.map((it: any, idx: number) => idx === i ? { ...it, [k]: v } : it));
    return (
        <div>
            <h2 className="font-display text-[28px] font-medium mb-2">Storage & retention</h2>
            <p className="text-[14px] text-dpo2u-ink/70 mb-8">Where the data lives and when it dies.</p>
            {value.map((it: any, i: number) => (
                <div key={i} className="border border-dpo2u-ink/15 p-4 mb-4">
                    <Field label="Data item">
                        <select className={inputCls} value={it.dataItemId} onChange={ev => upd(i, 'dataItemId', ev.target.value)}>
                            {inventory.map((d: any) => <option key={d.id} value={d.id}>{d.tipo || d.id.slice(0, 8)}</option>)}
                        </select>
                    </Field>
                    <Field label="Location">
                        <select className={inputCls} value={it.localizacao} onChange={ev => upd(i, 'localizacao', ev.target.value)}>
                            {STORAGE_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </Field>
                    <Field label="Provider (optional)">
                        <input className={inputCls} value={it.provedor || ''} onChange={ev => upd(i, 'provedor', ev.target.value)} placeholder="AWS, GCP, on-prem…" />
                    </Field>
                    <Field label="Retention period">
                        <input className={inputCls} value={it.periodo_retencao} onChange={ev => upd(i, 'periodo_retencao', ev.target.value)} placeholder='"5 years", "until cancellation"' />
                    </Field>
                    <Field label="Deletion procedure">
                        <input className={inputCls} value={it.procedimento_exclusao} onChange={ev => upd(i, 'procedimento_exclusao', ev.target.value)} />
                    </Field>
                    <button onClick={() => remove(i)} className="font-mono text-[11px] uppercase tracking-[0.14em] text-dpo2u-terracotta">× Remove</button>
                </div>
            ))}
            <button onClick={add} disabled={inventory.length === 0} className="font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2 border border-dpo2u-terracotta text-dpo2u-terracotta hover:bg-dpo2u-terracotta hover:text-dpo2u-ivory disabled:opacity-30">
                + Add storage record
            </button>
        </div>
    );
}

// ── Step 5: Third parties ───────────────────────────────────────────────────

function Step5({ value, inventory, onChange }: any) {
    const add = () => onChange([...value, { id: crypto.randomUUID(), nome: '', cnpj: '', tipo: 'processador', localizacao: 'brasil', dados_compartilhados: [], finalidade_compartilhamento: '', possui_dpa: false }]);
    const remove = (id: string) => onChange(value.filter((it: any) => it.id !== id));
    const upd = (id: string, k: string, v: any) => onChange(value.map((it: any) => it.id === id ? { ...it, [k]: v } : it));
    return (
        <div>
            <h2 className="font-display text-[28px] font-medium mb-2">Third parties</h2>
            <p className="text-[14px] text-dpo2u-ink/70 mb-8">Processors, joint controllers, sub-processors.</p>
            {value.map((it: any) => (
                <div key={it.id} className="border border-dpo2u-ink/15 p-4 mb-4">
                    <Field label="Name">
                        <input className={inputCls} value={it.nome} onChange={ev => upd(it.id, 'nome', ev.target.value)} />
                    </Field>
                    <Field label="CNPJ (optional)">
                        <input className={inputCls} value={it.cnpj || ''} onChange={ev => upd(it.id, 'cnpj', ev.target.value)} />
                    </Field>
                    <Field label="Type">
                        <select className={inputCls} value={it.tipo} onChange={ev => upd(it.id, 'tipo', ev.target.value)}>
                            {TP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </Field>
                    <Field label="Location">
                        <select className={inputCls} value={it.localizacao} onChange={ev => upd(it.id, 'localizacao', ev.target.value)}>
                            <option value="brasil">brasil</option><option value="exterior">exterior</option>
                        </select>
                    </Field>
                    <Field label="Data shared (select inventory items)">
                        <div className="flex flex-wrap">
                            {inventory.map((d: any) => (
                                <label key={d.id} className={checkCls}>
                                    <input type="checkbox"
                                        checked={it.dados_compartilhados.includes(d.id)}
                                        onChange={ev => {
                                            const set = new Set(it.dados_compartilhados);
                                            ev.target.checked ? set.add(d.id) : set.delete(d.id);
                                            upd(it.id, 'dados_compartilhados', Array.from(set));
                                        }} />
                                    <span className="text-[13px]">{d.tipo || d.id.slice(0, 8)}</span>
                                </label>
                            ))}
                        </div>
                    </Field>
                    <Field label="Sharing purpose">
                        <input className={inputCls} value={it.finalidade_compartilhamento} onChange={ev => upd(it.id, 'finalidade_compartilhamento', ev.target.value)} />
                    </Field>
                    <label className={checkCls}>
                        <input type="checkbox" checked={it.possui_dpa} onChange={ev => upd(it.id, 'possui_dpa', ev.target.checked)} />
                        <span className="text-[14px]">Has DPA signed</span>
                    </label>
                    <div className="mt-4">
                        <button onClick={() => remove(it.id)} className="font-mono text-[11px] uppercase tracking-[0.14em] text-dpo2u-terracotta">× Remove</button>
                    </div>
                </div>
            ))}
            <button onClick={add} className="font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2 border border-dpo2u-terracotta text-dpo2u-terracotta hover:bg-dpo2u-terracotta hover:text-dpo2u-ivory">
                + Add third party
            </button>
        </div>
    );
}

// ── Step 6: Security & Risks ────────────────────────────────────────────────

function Step6({ security, risks, onChangeSecurity, onChangeRisks, errors }: any) {
    const setT = (k: string, v: any) => onChangeSecurity({ ...security, tecnicas: { ...security.tecnicas, [k]: v } });
    const setO = (k: string, v: any) => onChangeSecurity({ ...security, organizacionais: { ...security.organizacionais, [k]: v } });
    const setR = (k: string, v: any) => onChangeRisks({ ...risks, [k]: v });
    return (
        <div>
            <h2 className="font-display text-[28px] font-medium mb-2">Security & risks</h2>
            <p className="text-[14px] text-dpo2u-ink/70 mb-8">Technical + organizational measures, plus high-risk activities.</p>

            <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-dpo2u-ink/70 mt-4 mb-4">— Technical —</h3>
            {(['criptografia', 'controle_acesso', 'backup', 'firewall', 'antivirus', 'monitoramento'] as const).map(k => (
                <label key={k} className={checkCls}>
                    <input type="checkbox" checked={security.tecnicas[k]} onChange={ev => setT(k, ev.target.checked)} />
                    <span className="text-[14px]">{k.replace('_', ' ')}</span>
                </label>
            ))}

            <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-dpo2u-ink/70 mt-8 mb-4">— Organizational —</h3>
            {(['politica_privacidade_interna', 'treinamento_colaboradores', 'procedimentos_documentados', 'auditoria_regular'] as const).map(k => (
                <label key={k} className={checkCls}>
                    <input type="checkbox" checked={security.organizacionais[k]} onChange={ev => setO(k, ev.target.checked)} />
                    <span className="text-[14px]">{k.replace(/_/g, ' ')}</span>
                </label>
            ))}

            <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-dpo2u-ink/70 mt-8 mb-4">— Risks —</h3>
            {(['atividades_alto_risco', 'decisoes_automatizadas', 'perfilamento', 'transferencia_internacional', 'incidentes_anteriores'] as const).map(k => (
                <label key={k} className={checkCls}>
                    <input type="checkbox" checked={risks[k]} onChange={ev => setR(k, ev.target.checked)} />
                    <span className="text-[14px]">{k.replace(/_/g, ' ')}</span>
                </label>
            ))}

            <div className="mt-8">
                <Field label="Mitigation measures" error={errors['step6_risks.medidas_mitigacao']}>
                    <textarea className={inputCls} rows={3} value={risks.medidas_mitigacao} onChange={ev => setR('medidas_mitigacao', ev.target.value)} />
                </Field>
            </div>
        </div>
    );
}

// ── Step 7: Web3 ────────────────────────────────────────────────────────────

function Step7({ value, onChange, errors }: any) {
    const set = (k: string, v: any) => onChange({ ...value, [k]: v });
    const e = (k: string) => errors[`step7_web3.${k}`];
    const toggleFw = (fw: string) => {
        const set_ = new Set(value.framework);
        set_.has(fw) ? set_.delete(fw) : set_.add(fw);
        set('framework', Array.from(set_));
    };
    return (
        <div>
            <h2 className="font-display text-[28px] font-medium mb-2">Web3 / Solana</h2>
            <p className="text-[14px] text-dpo2u-ink/70 mb-8">Solana programs, repo, jurisdictional scope.</p>
            <Field label="dApp name" error={e('dappName')}>
                <input className={inputCls} value={value.dappName} onChange={ev => set('dappName', ev.target.value)} />
            </Field>
            <Field label="GitHub repo URL" hint="Will be shallow-cloned (--depth=1, ≤50MB) for contract analysis." error={e('githubRepo')}>
                <input className={inputCls} placeholder="https://github.com/owner/repo" value={value.githubRepo} onChange={ev => set('githubRepo', ev.target.value)} />
            </Field>
            <Field label="Regulatory frameworks" error={e('framework')}>
                <div className="flex flex-wrap">
                    {FRAMEWORKS.map(fw => (
                        <label key={fw} className={checkCls}>
                            <input type="checkbox" checked={value.framework.includes(fw)} onChange={() => toggleFw(fw)} />
                            <span className="text-[14px]">{fw}</span>
                        </label>
                    ))}
                </div>
            </Field>
            <Field label="Project type">
                <select className={inputCls} value={value.projectType} onChange={ev => set('projectType', ev.target.value)}>
                    {PROJECT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <label className={checkCls}>
                    <input type="checkbox" checked={value.hasToken} onChange={ev => set('hasToken', ev.target.checked)} />
                    <span className="text-[14px]">Has token</span>
                </label>
                <label className={checkCls}>
                    <input type="checkbox" checked={value.isAgenticAI} onChange={ev => set('isAgenticAI', ev.target.checked)} />
                    <span className="text-[14px]">Uses AI agent</span>
                </label>
                <label className={checkCls}>
                    <input type="checkbox" checked={value.hasMiCARVault} onChange={ev => set('hasMiCARVault', ev.target.checked)} />
                    <span className="text-[14px]">Has MiCAR vault</span>
                </label>
            </div>
            {value.hasMiCARVault && (
                <Field label="Vault PDA (base58, optional)">
                    <input className={inputCls} value={value.vaultPda || ''} onChange={ev => set('vaultPda', ev.target.value)} />
                </Field>
            )}
            <Field label="Expected outcomes (optional)">
                <textarea className={inputCls} rows={3} value={value.expectedOutcomes || ''} onChange={ev => set('expectedOutcomes', ev.target.value)} placeholder="What does success look like for your dApp from a compliance perspective?" />
            </Field>
            <label className={checkCls + ' mt-6'}>
                <input type="checkbox" checked={value.consentToProcess} onChange={ev => set('consentToProcess', ev.target.checked)} />
                <span className="text-[14px]">I consent to DPO2U processing this submission as part of the alpha registry.</span>
            </label>
            {e('consentToProcess') && <p className="text-[12px] text-dpo2u-terracotta mt-2">{e('consentToProcess')}</p>}
        </div>
    );
}
