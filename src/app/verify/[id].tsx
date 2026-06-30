/**
 * /verify/:id  and  /verify/uc/:uc/hash/:hash  — public attestation proof.
 *
 * Unauthenticated, shareable. Re-verifies on-chain (Stellar testnet) through
 * src/lib/pilot/stellar.ts — the same trustless path the pilot uses. The :id
 * form resolves to (useCaseId, evidenceHashHex) via the Pilot Gateway; the
 * uc/hash form skips the gateway entirely.
 *
 * Reuses: VerifyResultCard (verdict render), verifyAttestation (on-chain read),
 * WaxSeal / sealed design tokens. Score private, proof public.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE, SmallLabel, Rule, WaxSeal, DPO2UWordmark } from '@/components/sealed/atoms';
import { VerifyResultCard } from '@/components/pilot/VerifyResultCard';
import { verifyAttestation, type VerifyResult } from '@/lib/pilot/stellar';
import { resolveById, type ResolvedRef } from '@/lib/app/verify-resolver';
import { verifyAttestationMidnight, type MidnightVerify } from '@/lib/pilot/midnight-verify';

type Phase =
  | { k: 'resolving' }
  | { k: 'verifying'; ref: ResolvedRef }
  | { k: 'done'; ref: ResolvedRef; result: VerifyResult; chain: 'stellar' | 'midnight'; midnight?: MidnightVerify }
  | { k: 'error'; message: string };

// Adapt a Midnight attestation into the shared VerifyResult shape so VerifyResultCard renders it.
function midnightToResult(mn: MidnightVerify): VerifyResult {
  return {
    found: true,
    contract_id: mn.contract_id ?? '',
    record: {
      verdict: mn.verdict ?? 'REVIEW',
      predicate_set: mn.use_case_id,
      predicate_version: 1,
      submitted_by: mn.submitted_by ?? '',
      timestamp: mn.timestamp ?? Math.floor(Date.now() / 1000),
      metadata_hash_hex: mn.metadata_hash,
    },
  } as unknown as VerifyResult;
}

export default function VerifyPublicPage() {
  const { id, uc, hash } = useParams<{ id?: string; uc?: string; hash?: string }>();
  const [phase, setPhase] = useState<Phase>({ k: 'resolving' });

  const run = useCallback(async (ref: ResolvedRef) => {
    setPhase({ k: 'verifying', ref });
    try {
      const result = await verifyAttestation({
        useCaseId: ref.useCaseId,
        evidenceHashHex: ref.evidenceHashHex,
      });
      if (result.found) { setPhase({ k: 'done', ref, result, chain: 'stellar' }); return; }
      // Not on Stellar → try the Midnight registry (same UI). Score-private, proof public.
      const mn = await verifyAttestationMidnight(ref.useCaseId, ref.evidenceHashHex);
      if (mn) { setPhase({ k: 'done', ref, result: midnightToResult(mn), chain: 'midnight', midnight: mn }); return; }
      setPhase({ k: 'done', ref, result, chain: 'stellar' });
    } catch (e) {
      // Stellar read threw — still try Midnight before surfacing an error.
      const mn = await verifyAttestationMidnight(ref.useCaseId, ref.evidenceHashHex).catch(() => null);
      if (mn) { setPhase({ k: 'done', ref, result: midnightToResult(mn), chain: 'midnight', midnight: mn }); return; }
      setPhase({ k: 'error', message: e instanceof Error ? e.message : String(e) });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (uc && hash) {
        if (!cancelled) await run({ useCaseId: uc, evidenceHashHex: hash });
        return;
      }
      if (id) {
        const out = await resolveById(id);
        if (cancelled) return;
        if (out.ref) {
          await run(out.ref);
          return;
        }
        const detail = out.detail;
        const msg =
          out.reason === 'auth'
            ? 'Este registro exige credencial pra resolver o id pelo gateway. Use a verificação direta por use_case_id + hash.'
            : out.reason === 'not-found'
              ? `Nenhum registro para o id "${id}".`
              : out.reason === 'no-hash'
                ? `O id "${id}" ainda não tem hash on-chain${detail ? ` (status: ${detail})` : ''}.`
                : `Falha ao resolver o id pelo gateway${detail ? `: ${detail}` : ''}.`;
        setPhase({ k: 'error', message: msg });
        return;
      }
      setPhase({ k: 'error', message: 'Informe um id de atestação ou um par use_case_id + hash.' });
    })();
    return () => { cancelled = true; };
  }, [id, uc, hash, run]);

  const ref = 'ref' in phase ? phase.ref : undefined;
  usePageHead({
    title: ref ? `Verify · ${ref.useCaseId} — DPO2U` : 'Verify attestation — DPO2U',
    description:
      'Verificação pública e trustless de uma atestação de compliance DPO2U, lida diretamente do contrato on-chain (Stellar). Score privado, prova pública.',
    path: id ? `/verify/${id}` : '/verify',
  });

  const verdict = phase.k === 'done' && phase.result.found ? phase.result.record!.verdict : null;
  const sealLabel = verdict === 'PASS' ? 'VERIFIED' : verdict === 'FAIL' ? 'FAILED' : 'SEALED';

  return (
    <div className="min-h-screen" style={{ background: PALETTE.paper, color: PALETTE.ink, fontFamily: FONTS.body }}>
      <div className="max-w-[760px] mx-auto px-6 md:px-10 py-16 md:py-20">
        {/* header / seal */}
        <div className="text-center">
          <Link to="/" className="inline-block mb-8"><DPO2UWordmark size={22} /></Link>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WaxSeal size={120} label={sealLabel} stamped={phase.k === 'done'} />
          </div>
          <SmallLabel style={{ marginTop: 18 }}>
            {phase.k === 'done'
              ? phase.result.found ? `VERIFIED ON-CHAIN · ${phase.chain === 'midnight' ? 'MIDNIGHT' : 'STELLAR'}` : 'NOT FOUND ON-CHAIN'
              : phase.k === 'error' ? 'COULD NOT VERIFY' : 'VERIFYING…'}
          </SmallLabel>
          <h1
            className="text-[34px] md:text-[44px] leading-[1.05] font-medium"
            style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 10 }}
          >
            Attestation proof
            <span style={{ color: PALETTE.terracotta }}>.</span>
          </h1>
          <p className="mt-3 text-[15px]" style={{ color: PALETTE.inkSoft }}>
            Lido diretamente do contrato on-chain via RPC/indexer público. Nenhuma credencial DPO2U usada.
          </p>
        </div>

        <Rule style={{ margin: '32px 0' }} color={PALETTE.ruleStrong} />

        {/* body */}
        {(phase.k === 'resolving' || phase.k === 'verifying') && (
          <p className="text-center text-[15px]" style={{ color: PALETTE.concrete, fontFamily: FONTS.mono }}>
            {phase.k === 'resolving' ? 'resolvendo referência…' : 'verificando on-chain…'}
          </p>
        )}

        {phase.k === 'error' && (
          <div className="rounded-xl border p-6" style={{ borderColor: PALETTE.ruleStrong, background: PALETTE.paper2 }}>
            <p className="text-[15px]" style={{ color: PALETTE.inkSoft }}>{phase.message}</p>
            <p className="mt-3 text-[13px]" style={{ color: PALETTE.concrete }}>
              Tente a verificação direta: <code style={{ fontFamily: FONTS.mono }}>/verify/uc/&lt;use_case_id&gt;/hash/&lt;evidence_hash_hex&gt;</code>
            </p>
          </div>
        )}

        {phase.k === 'done' && (
          <>
            <VerifyResultCard
              result={phase.result}
              useCaseId={phase.ref.useCaseId}
              evidenceHashHex={phase.ref.evidenceHashHex}
              chain={phase.chain}
              midnight={phase.midnight}
            />

            {/* selective disclosure */}
            {phase.result.found && (
              <div className="mt-6 rounded-xl border p-5" style={{ borderColor: PALETTE.rule, background: PALETTE.paper2 }}>
                <SmallLabel style={{ marginBottom: 10 }}>Selective disclosure</SmallLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]" style={{ color: PALETTE.inkSoft }}>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: PALETTE.verdigris }}>● PUBLIC</span>
                    <p className="mt-1">Veredito, jurisdição/predicate, timestamp e hash da evidência — verificáveis por qualquer um.</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: PALETTE.terracotta }}>◆ ZK-PROVEN</span>
                    <p className="mt-1">O score e os dados subjacentes permanecem privados: a prova atesta conformidade ao manifesto sem expor PII.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => run(phase.ref)}
                className="py-3 px-6 font-mono text-[13px] uppercase tracking-[0.14em]"
                style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: 'pointer' }}
              >
                Re-verify proof →
              </button>
              <Link
                to="/research"
                className="py-3 px-6 font-mono text-[13px] uppercase tracking-[0.14em]"
                style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, textDecoration: 'none' }}
              >
                How it works
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
