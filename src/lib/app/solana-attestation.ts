// Primitivas de atestação Solana no browser — compartilhadas por submit (self-custody),
// leitura (verify/dashboard) e indexer. Espelha o solana-driver.ts do gateway: usa o
// selector 0x00 `create_attestation` do compliance-registry (sem prova ZK).
//
// IMPORTANTE: usa PROGRAM_IDS.complianceRegistry (7q19zbMM…), NÃO idl.address — a IDL
// embarcada tem address = verifier (5xrWphWX…), que é o programa errado pra estas contas.
//
// Buffer é polyfilled neste app (o @solana/web3.js + BorshCoder já dependem dele); o hash
// usa crypto.subtle (nativo do browser).

import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
// Import explícito do pacote `buffer` (dep transitiva do web3.js) — Vite o empacota
// deterministicamente. Evita depender de um `Buffer` global, que NÃO é polyfilled neste app.
import { Buffer } from 'buffer';
import { getConnection, PROGRAM_IDS, explorerUrl } from '@/lib/solana';

export type Verdict = 'PASS' | 'FAIL' | 'REVIEW';

// Discriminador Anchor de create_attestation (IDL compliance_registry.json). Igual ao gateway.
const CREATE_ATTESTATION_DISC = Buffer.from([49, 24, 67, 80, 12, 249, 96, 239]);
const ATTESTATION_SEED = Buffer.from('attestation');

export interface SolanaAttestationRecord {
  readonly pda: string;
  readonly subject: string;
  readonly issuer: string;
  readonly verdict: Verdict | null;
  readonly evidenceHashHex: string | null;
  readonly commitmentHex: string;
  readonly issuedAt: number | null; // ms epoch
  readonly storageUri: string;
  readonly explorerUrl: string;
}

/** commitment = sha256(`${useCaseId}:${evidenceHashHex}`) — idêntico ao gateway. */
export async function deriveCommitment(useCaseId: string, evidenceHashHex: string): Promise<Buffer> {
  const data = new TextEncoder().encode(`${useCaseId}:${evidenceHashHex}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Buffer.from(new Uint8Array(digest));
}

export function deriveAttestationPda(subject: PublicKey, commitment: Buffer): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [ATTESTATION_SEED, subject.toBuffer(), commitment],
    PROGRAM_IDS.complianceRegistry,
  );
  return pda;
}

/** O Attestation Solana não tem campo verdict — embute verdict + evidence no storage_uri. */
function encodeStorageUri(verdict: Verdict, evidenceHashHex: string): string {
  return `dpo2u:${verdict}:${evidenceHashHex}`;
}
export function parseStorageUri(uri: string): { verdict?: Verdict; evidenceHashHex?: string } {
  const m = uri.match(/^dpo2u:(PASS|FAIL|REVIEW):([0-9a-fA-F]{64})$/);
  return m ? { verdict: m[1] as Verdict, evidenceHashHex: m[2] } : {};
}

/** Decodifica os bytes da conta Attestation (layout do compliance-registry Anchor). */
export function decodeAttestation(pda: string, raw: Uint8Array): SolanaAttestationRecord {
  const dv = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);
  let o = 8; // pula discriminador Anchor
  const subject = new PublicKey(raw.subarray(o, o + 32)); o += 32;
  const issuer = new PublicKey(raw.subarray(o, o + 32)); o += 32;
  o += 32; // schema_id
  const commitment = raw.subarray(o, o + 32); o += 32;
  const uriLen = dv.getUint32(o, true); o += 4;
  const uri = new TextDecoder().decode(raw.subarray(o, o + uriLen)); o += uriLen;
  const issuedAtSec = Number(dv.getBigInt64(o, true));
  const { verdict, evidenceHashHex } = parseStorageUri(uri);
  return {
    pda,
    subject: subject.toBase58(),
    issuer: issuer.toBase58(),
    verdict: verdict ?? null,
    evidenceHashHex: evidenceHashHex ?? null,
    commitmentHex: Buffer.from(commitment).toString('hex'),
    issuedAt: Number.isFinite(issuedAtSec) ? issuedAtSec * 1000 : null,
    storageUri: uri,
    explorerUrl: explorerUrl(pda),
  };
}

/** Lê uma atestação por (subject, commitment). Retorna null se a PDA não existe. */
export async function fetchSolanaAttestation(args: {
  subject: string;
  commitment: Buffer;
}): Promise<SolanaAttestationRecord | null> {
  const conn = getConnection();
  const pda = deriveAttestationPda(new PublicKey(args.subject), args.commitment);
  const info = await conn.getAccountInfo(pda, 'confirmed');
  if (!info) return null;
  return decodeAttestation(pda.toBase58(), new Uint8Array(info.data));
}

/** Lista as atestações on-chain de um subject (memcmp no offset 8 = subject). */
export async function fetchSolanaAttestationsBySubject(
  subject: string,
): Promise<SolanaAttestationRecord[]> {
  const conn = getConnection();
  const accounts = await conn.getProgramAccounts(PROGRAM_IDS.complianceRegistry, {
    commitment: 'confirmed',
    filters: [{ memcmp: { offset: 8, bytes: subject } }],
  });
  const out: SolanaAttestationRecord[] = [];
  for (const a of accounts) {
    try {
      out.push(decodeAttestation(a.pubkey.toBase58(), new Uint8Array(a.account.data)));
    } catch {
      // não é uma conta Attestation — ignora
    }
  }
  return out;
}

/** Provider mínimo de wallet Solana (Solflare/Phantom injetam isto em window). */
export interface SolanaWalletProvider {
  readonly publicKey: { toString(): string } | null;
  signTransaction(tx: Transaction): Promise<Transaction>;
}

/**
 * Self-custody: a própria wallet (Solflare) assina e envia a tx de atestação. issuer ==
 * subject == owner; o usuário paga a fee de rede. Não passa pelo gateway. (Caminho do
 * público SDK/power-user; o fluxo padrão do app é managed via gateway.)
 */
export async function submitSelfCustodyAttestation(args: {
  provider: SolanaWalletProvider;
  useCaseId: string;
  evidenceHashHex: string;
  verdict: Verdict;
  metadataHashHex?: string;
}): Promise<SolanaAttestationRecord & { signature: string }> {
  const conn = getConnection();
  const ownerStr = args.provider.publicKey?.toString();
  if (!ownerStr) throw new Error('Wallet Solana não conectada.');
  const owner = new PublicKey(ownerStr);

  const commitment = await deriveCommitment(args.useCaseId, args.evidenceHashHex);
  const pda = deriveAttestationPda(owner, commitment);
  const schemaId = args.metadataHashHex
    ? new PublicKey(Buffer.from(args.metadataHashHex.replace(/^0x/, ''), 'hex'))
    : PublicKey.default;
  const uriBytes = Buffer.from(encodeStorageUri(args.verdict, args.evidenceHashHex), 'utf8');
  const uriLen = Buffer.alloc(4);
  uriLen.writeUInt32LE(uriBytes.length, 0);
  const data = Buffer.concat([
    CREATE_ATTESTATION_DISC,
    commitment,
    uriLen,
    uriBytes,
    schemaId.toBuffer(),
    Buffer.from([0]), // expires_at: Option<i64> = None
  ]);

  const ix = new TransactionInstruction({
    programId: PROGRAM_IDS.complianceRegistry,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: true }, // issuer
      { pubkey: owner, isSigner: false, isWritable: false }, // subject (== owner)
      { pubkey: pda, isSigner: false, isWritable: true }, // attestation PDA
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });

  const tx = new Transaction().add(ix);
  tx.feePayer = owner;
  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash('confirmed');
  tx.recentBlockhash = blockhash;

  const signed = await args.provider.signTransaction(tx);
  const signature = await conn.sendRawTransaction(signed.serialize());
  const conf = await conn.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
  if (conf.value.err) throw new Error(`tx falhou: ${JSON.stringify(conf.value.err)}`);

  return {
    pda: pda.toBase58(),
    subject: owner.toBase58(),
    issuer: owner.toBase58(),
    verdict: args.verdict,
    evidenceHashHex: args.evidenceHashHex,
    commitmentHex: commitment.toString('hex'),
    issuedAt: Date.now(),
    storageUri: encodeStorageUri(args.verdict, args.evidenceHashHex),
    explorerUrl: explorerUrl(signature, 'tx'),
    signature,
  };
}
