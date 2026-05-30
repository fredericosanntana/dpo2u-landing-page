/**
 * /verify/sol/uc/:uc/hash/:hash/subject/:subject — prova pública de atestação Solana.
 *
 * Espelho do /verify (Stellar), mas lê a PDA do compliance-registry (devnet) via
 * getProgramAccounts/getAccountInfo — trustless, sem credencial DPO2U. Deriva
 * commitment = sha256(uc:hash) + subject → PDA, decodifica o verdict do storage_uri.
 */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE, SmallLabel, Rule, WaxSeal, DPO2UWordmark } from '@/components/sealed/atoms';
import {
  deriveCommitment,
  fetchSolanaAttestation,
  type SolanaAttestationRecord,
} from '@/lib/app/solana-attestation';

type Phase =
  | { k: 'verifying' }
  | { k: 'done'; record: SolanaAttestationRecord | null }
  | { k: 'error'; message: string };

export default function VerifySolanaPage() {
  const { uc, hash, subject } = useParams<{ uc?: string; hash?: string; subject?: string }>();
  const [phase, setPhase] = useState<Phase>({ k: 'verifying' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!uc || !hash || !subject) {
        setPhase({ k: 'error', message: 'Informe use_case_id, hash e subject.' });
        return;
      }
      try {
        const commitment = await deriveCommitment(uc, hash);
        const record = await fetchSolanaAttestation({ subject, commitment });
        if (!cancelled) setPhase({ k: 'done', record });
      } catch (e) {
        if (!cancelled) setPhase({ k: 'error', message: e instanceof Error ? e.message : String(e) });
      }
    })();
    return () => { cancelled = true; };
  }, [uc, hash, subject]);

  usePageHead({
    title: uc ? `Verify (Solana) · ${uc} — DPO2U` : 'Verify attestation (Solana) — DPO2U',
    description:
      'Verificação pública e trustless de uma atestação de compliance DPO2U na Solana (devnet), lida diretamente da PDA on-chain. Score privado, prova pública.',
    path: '/verify/sol',
  });

  const found = phase.k === 'done' && phase.record !== null;
  const verdict = phase.k === 'done' ? phase.record?.verdict ?? null : null;
  const sealLabel = verdict === 'PASS' ? 'VERIFIED' : verdict === 'FAIL' ? 'FAILED' : 'SEALED';

  return (
    <div className="min-h-screen" style={{ background: PALETTE.paper, color: PALETTE.ink, fontFamily: FONTS.body }}>
      <div className="max-w-[760px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="text-center">
          <Link to="/" className="inline-block mb-8"><DPO2UWordmark size={22} /></Link>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WaxSeal size={120} label={sealLabel} stamped={phase.k === 'done'} />
          </div>
          <SmallLabel style={{ marginTop: 18 }}>
            {phase.k === 'done'
              ? found ? 'VERIFIED ON-CHAIN · SOLANA' : 'NOT FOUND ON-CHAIN'
              : phase.k === 'error' ? 'COULD NOT VERIFY' : 'VERIFYING…'}
          </SmallLabel>
          <h1 className="text-[34px] md:text-[44px] leading-[1.05] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 10 }}>
            Attestation proof<span style={{ color: PALETTE.terracotta }}>.</span>
          </h1>
          <p className="mt-3 text-[15px]" style={{ color: PALETTE.inkSoft }}>
            Lido diretamente da PDA via RPC Solana pública. Nenhuma credencial DPO2U usada.
          </p>
        </div>

        <Rule style={{ margin: '32px 0' }} color={PALETTE.ruleStrong} />

        {phase.k === 'verifying' && (
          <p className="text-center text-[15px]" style={{ color: PALETTE.concrete, fontFamily: FONTS.mono }}>
            verificando on-chain…
          </p>
        )}

        {phase.k === 'error' && (
          <div className="rounded-xl border p-6" style={{ borderColor: PALETTE.ruleStrong, background: PALETTE.paper2 }}>
            <p className="text-[15px]" style={{ color: PALETTE.inkSoft }}>{phase.message}</p>
          </div>
        )}

        {phase.k === 'done' && (
          <div className="rounded-xl border p-6" style={{ borderColor: found ? PALETTE.verdigris : PALETTE.ruleStrong, background: PALETTE.paper2 }}>
            {found && phase.record ? (
              <>
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <h2 className="text-[24px] font-medium" style={{ fontFamily: FONTS.display, color: verdict === 'PASS' ? PALETTE.verdigris : verdict === 'FAIL' ? PALETTE.terracotta : PALETTE.ink }}>
                    {verdict ?? 'SEALED'}
                  </h2>
                  <a href={phase.record.explorerUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.terracotta, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                    ver no explorer →
                  </a>
                </div>
                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]" style={{ color: PALETTE.inkSoft }}>
                  <div><dt className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: PALETTE.concrete }}>use case</dt><dd>{uc}</dd></div>
                  <div><dt className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: PALETTE.concrete }}>issued at</dt><dd>{phase.record.issuedAt ? new Date(phase.record.issuedAt).toISOString().slice(0, 16).replace('T', ' ') + ' UTC' : '—'}</dd></div>
                  <div className="sm:col-span-2"><dt className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: PALETTE.concrete }}>evidence hash</dt><dd style={{ fontFamily: FONTS.mono, fontSize: 11, wordBreak: 'break-all' }}>{phase.record.evidenceHashHex ?? '—'}</dd></div>
                  <div className="sm:col-span-2"><dt className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: PALETTE.concrete }}>attestation PDA</dt><dd style={{ fontFamily: FONTS.mono, fontSize: 11, wordBreak: 'break-all' }}>{phase.record.pda}</dd></div>
                </dl>
              </>
            ) : (
              <p className="text-[15px]" style={{ color: PALETTE.inkSoft }}>
                Nenhuma atestação encontrada on-chain para esse (use_case, hash, subject).
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/research" className="py-3 px-6 font-mono text-[13px] uppercase tracking-[0.14em]" style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, textDecoration: 'none' }}>
            How it works
          </Link>
        </div>
      </div>
    </div>
  );
}
