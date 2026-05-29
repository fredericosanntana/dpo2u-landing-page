// Build, simulate, sign, and submit admin operations on the
// anticorruption-attestation contract via Freighter.
//
// configure_use_case(admin, use_case_id, config)
// authorize_submitter(admin, submitter, allowed)
//
// All ops require a 2-of-3 signature post-mainnet (Sprint L sets up
// SEP-30 multisig). On testnet today: single admin sig.

import {
  Address,
  BASE_FEE,
  Contract,
  Networks,
  rpc,
  Transaction,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk';
import type { ContractMeta } from './contracts';
import { DEFAULT_CONTRACT } from './contracts';
import { signXdr } from './freighter';

export interface SimulationResult {
  readonly success: boolean;
  readonly minFee: string;
  readonly cost?: unknown;
  readonly error?: string;
}

export interface SubmissionResult {
  readonly hash: string;
  readonly ledger?: number;
  readonly explorerUrl: string;
}

function getServer(contract: ContractMeta): rpc.Server {
  return new rpc.Server(contract.rpc_url);
}

export async function buildInvocation(args: {
  contract: ContractMeta;
  signer: string;
  method: string;
  scvArgs: xdr.ScVal[];
}): Promise<{ readonly preparedTx: Transaction; readonly raw: Transaction }> {
  const server = getServer(args.contract);
  const account = await server.getAccount(args.signer);
  const contract = new Contract(args.contract.id);
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: args.contract.network_passphrase,
  })
    .addOperation(contract.call(args.method, ...args.scvArgs))
    .setTimeout(180)
    .build();
  const prepared = await server.prepareTransaction(tx);
  return { preparedTx: prepared as Transaction, raw: tx };
}

export async function simulate(args: {
  contract: ContractMeta;
  signer: string;
  method: string;
  scvArgs: xdr.ScVal[];
}): Promise<SimulationResult> {
  const server = getServer(args.contract);
  try {
    const account = await server.getAccount(args.signer);
    const contract = new Contract(args.contract.id);
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: args.contract.network_passphrase,
    })
      .addOperation(contract.call(args.method, ...args.scvArgs))
      .setTimeout(180)
      .build();
    const sim = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(sim)) {
      return { success: false, minFee: BASE_FEE, error: sim.error };
    }
    return {
      success: true,
      minFee: sim.minResourceFee,
      cost: (sim as unknown as { cost?: unknown }).cost,
    };
  } catch (err) {
    return {
      success: false,
      minFee: BASE_FEE,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function submitSigned(args: {
  contract: ContractMeta;
  signedXdr: string;
}): Promise<SubmissionResult> {
  const server = getServer(args.contract);
  const signedTx = TransactionBuilder.fromXDR(args.signedXdr, args.contract.network_passphrase) as Transaction;
  const sent = await server.sendTransaction(signedTx);
  if (sent.status === 'ERROR') {
    throw new Error(`sendTransaction ERROR: ${JSON.stringify(sent.errorResult)}`);
  }
  // Poll for inclusion (up to ~30s).
  for (let i = 0; i < 30; i += 1) {
    const got = await server.getTransaction(sent.hash);
    if (got.status === 'SUCCESS') {
      return {
        hash: sent.hash,
        ledger: 'ledger' in got ? (got as { ledger: number }).ledger : undefined,
        explorerUrl: `${args.contract.explorer_base}/tx/${sent.hash}`,
      };
    }
    if (got.status === 'FAILED') {
      throw new Error(`tx ${sent.hash} failed: ${JSON.stringify(got)}`);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`tx ${sent.hash} not included after 30s`);
}

function symbolScv(s: string): xdr.ScVal {
  return xdr.ScVal.scvSymbol(s);
}

function addressScv(g: string): xdr.ScVal {
  return new Address(g).toScVal();
}

function boolScv(b: boolean): xdr.ScVal {
  return xdr.ScVal.scvBool(b);
}

function u32Scv(n: number): xdr.ScVal {
  return xdr.ScVal.scvU32(n);
}

function useCaseConfigScv(config: { active: boolean; predicate_set: string; predicate_version: number }): xdr.ScVal {
  // Soroban struct = scvMap with symbol-keyed entries in field order.
  return xdr.ScVal.scvMap([
    new xdr.ScMapEntry({
      key: symbolScv('active'),
      val: boolScv(config.active),
    }),
    new xdr.ScMapEntry({
      key: symbolScv('predicate_set'),
      val: symbolScv(config.predicate_set),
    }),
    new xdr.ScMapEntry({
      key: symbolScv('predicate_version'),
      val: u32Scv(config.predicate_version),
    }),
  ]);
}

export interface ConfigureUseCaseInput {
  readonly admin: string;
  readonly useCaseId: string;
  readonly active: boolean;
  readonly predicateSet: string;
  readonly predicateVersion: number;
  readonly contract?: ContractMeta;
}

export async function configureUseCaseSimulate(input: ConfigureUseCaseInput): Promise<SimulationResult> {
  const contract = input.contract ?? DEFAULT_CONTRACT;
  return simulate({
    contract,
    signer: input.admin,
    method: 'configure_use_case',
    scvArgs: [
      addressScv(input.admin),
      symbolScv(input.useCaseId),
      useCaseConfigScv({
        active: input.active,
        predicate_set: input.predicateSet,
        predicate_version: input.predicateVersion,
      }),
    ],
  });
}

export async function configureUseCaseSubmit(input: ConfigureUseCaseInput): Promise<SubmissionResult> {
  const contract = input.contract ?? DEFAULT_CONTRACT;
  const { preparedTx } = await buildInvocation({
    contract,
    signer: input.admin,
    method: 'configure_use_case',
    scvArgs: [
      addressScv(input.admin),
      symbolScv(input.useCaseId),
      useCaseConfigScv({
        active: input.active,
        predicate_set: input.predicateSet,
        predicate_version: input.predicateVersion,
      }),
    ],
  });
  const { signedTxXdr } = await signXdr({
    xdr: preparedTx.toXDR(),
    networkPassphrase: contract.network_passphrase,
    signerAddress: input.admin,
  });
  return submitSigned({ contract, signedXdr: signedTxXdr });
}

export interface AuthorizeSubmitterInput {
  readonly admin: string;
  readonly submitter: string;
  readonly allowed: boolean;
  readonly contract?: ContractMeta;
}

export async function authorizeSubmitterSimulate(input: AuthorizeSubmitterInput): Promise<SimulationResult> {
  const contract = input.contract ?? DEFAULT_CONTRACT;
  return simulate({
    contract,
    signer: input.admin,
    method: 'authorize_submitter',
    scvArgs: [
      addressScv(input.admin),
      addressScv(input.submitter),
      boolScv(input.allowed),
    ],
  });
}

export async function authorizeSubmitterSubmit(input: AuthorizeSubmitterInput): Promise<SubmissionResult> {
  const contract = input.contract ?? DEFAULT_CONTRACT;
  const { preparedTx } = await buildInvocation({
    contract,
    signer: input.admin,
    method: 'authorize_submitter',
    scvArgs: [
      addressScv(input.admin),
      addressScv(input.submitter),
      boolScv(input.allowed),
    ],
  });
  const { signedTxXdr } = await signXdr({
    xdr: preparedTx.toXDR(),
    networkPassphrase: contract.network_passphrase,
    signerAddress: input.admin,
  });
  return submitSigned({ contract, signedXdr: signedTxXdr });
}

// Keep Networks import used so tree-shake doesn't complain in some configs.
export const NETWORKS = Networks;
