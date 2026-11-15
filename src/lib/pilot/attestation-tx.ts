// Build, sign (Freighter) e submit de `register_attestation` no contrato
// anticorruption-attestation — move a assinatura do MEMBRO para o frontend
// (aposenta o fluxo do Stellar Lab para os 5 membros do piloto).
//
// register_attestation(submitter, use_case_id, verdict, evidence_hash, metadata_hash)
// O `submitter` é a conta-fonte da tx → a assinatura do Freighter satisfaz
// `submitter.require_auth()` (source-account auth). Reusa o pipeline do admin-tx.

import { Address, xdr } from '@stellar/stellar-sdk';
import type { ContractMeta } from './contracts';
import { DEFAULT_CONTRACT } from './contracts';
import {
  buildInvocation,
  submitSigned,
  simulate,
  type SimulationResult,
  type SubmissionResult,
} from './admin-tx';
import { signXdr } from './freighter';

export type AttestationVerdict = 'Pass' | 'Fail' | 'Review';

export interface RegisterAttestationInput {
  readonly submitter: string;
  readonly useCaseId: string;
  readonly verdict: AttestationVerdict;
  readonly evidenceHashHex: string;
  readonly metadataHashHex: string;
  readonly contract?: ContractMeta;
}

/** hex (64 chars) → Uint8Array(32). Browser-safe (sem Buffer). */
export function hexToBytes32(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/, '');
  if (!/^[0-9a-fA-F]{64}$/.test(clean)) {
    throw new Error(`hash deve ser 32 bytes em hex (64 chars); recebi ${clean.length}`);
  }
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i += 1) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/** Verdict é enum unit do Soroban → scvVec([scvSymbol(variant)]). */
export function verdictScv(v: AttestationVerdict): xdr.ScVal {
  return xdr.ScVal.scvVec([xdr.ScVal.scvSymbol(v)]);
}

/** Args ScVal de register_attestation (puro — unit-testável). */
export function registerAttestationArgs(input: RegisterAttestationInput): xdr.ScVal[] {
  return [
    new Address(input.submitter).toScVal(),
    xdr.ScVal.scvSymbol(input.useCaseId),
    verdictScv(input.verdict),
    xdr.ScVal.scvBytes(Buffer.from(hexToBytes32(input.evidenceHashHex))),
    xdr.ScVal.scvBytes(Buffer.from(hexToBytes32(input.metadataHashHex))),
  ];
}

export async function registerAttestationSimulate(input: RegisterAttestationInput): Promise<SimulationResult> {
  const contract = input.contract ?? DEFAULT_CONTRACT;
  return simulate({
    contract,
    signer: input.submitter,
    method: 'register_attestation',
    scvArgs: registerAttestationArgs(input),
  });
}

export async function registerAttestationSubmit(input: RegisterAttestationInput): Promise<SubmissionResult> {
  const contract = input.contract ?? DEFAULT_CONTRACT;
  const { preparedTx } = await buildInvocation({
    contract,
    signer: input.submitter,
    method: 'register_attestation',
    scvArgs: registerAttestationArgs(input),
  });
  const { signedTxXdr } = await signXdr({
    xdr: preparedTx.toXDR(),
    networkPassphrase: contract.network_passphrase,
    signerAddress: input.submitter,
  });
  return submitSigned({ contract, signedXdr: signedTxXdr });
}
