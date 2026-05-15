export type Cluster = 'devnet' | 'mainnet-beta' | 'testnet';

export interface ProgramMetaLite {
  key: string;
  displayName: string;
  tagline: string;
  programId: string;
}

const DEFAULT_CLUSTER: Cluster =
  (import.meta as unknown as { env?: { VITE_SOLANA_CLUSTER?: Cluster } }).env?.VITE_SOLANA_CLUSTER ?? 'devnet';

export const PROGRAMS_META: ProgramMetaLite[] = [
  { key: 'complianceRegistry', displayName: 'Compliance Registry', tagline: 'ZK-verified LGPD/GDPR attestations.', programId: '7q19zbMMFCPSDhJhh3cfUVJstin6r1Q4dgmeDAuQERyK' },
  { key: 'complianceRegistryPinocchio', displayName: 'Compliance Registry (Pinocchio)', tagline: 'Pinocchio-native rewrite, smaller binary.', programId: 'FZ21S53Rn8Y6ANfccS2waCrkYWh5zfjXK3hkKU5YSkJ8' },
  { key: 'agentRegistry', displayName: 'Agent Registry', tagline: 'DPO agent DIDs with capability bitmask.', programId: '5qeuUAaJi9kTzsfmiphQ89PNrpqy7xW7sCvhBZQ6mya7' },
  { key: 'agentWalletFactory', displayName: 'Agent Wallet Factory', tagline: 'Deterministic per-agent wallet PDAs.', programId: 'AjRqmxyieQieov2qsNefdYpa6HbPhzciED7s5TfZi1in' },
  { key: 'aiverifyAttestation', displayName: 'AI Verify Attestation', tagline: 'AI model assurance attestations (IMDA AI Verify).', programId: 'CmPVUPo54hV25r5iw59X1yR1f5tEsn7FNmywFMDiPT7j' },
  { key: 'artVault', displayName: 'ART Vault', tagline: 'MiCAR Asset-Referenced Token reserve management.', programId: 'C7sGZFeWPxEkaGHACwqdzCcy4QkacqPLYEwEarVpidna' },
  { key: 'consentManager', displayName: 'Consent Manager', tagline: 'DPDP India / LGPD on-chain consent records.', programId: 'D5mLHU4uUQAkoMvtviAzBe1ugpdxfdqQ7VuGoKLaTjfB' },
  { key: 'feeDistributor', displayName: 'Fee Distributor', tagline: 'Routes per-attestation fees via Squads vault.', programId: '88eKEEMMnugv8AFWRvqa4i7LEiL7tM9bEuPTVkRbD76x' },
  { key: 'paymentGateway', displayName: 'Payment Gateway', tagline: 'USDC payment rails for compliance work.', programId: '4Qj6GziMjUfh4TszuSnasnEqnASqQBS6SHw6YAu9U23Q' },
  { key: 'popiaInfoOfficerRegistry', displayName: 'POPIA Info Officer Registry', tagline: 'South Africa POPIA Info Officer registrations.', programId: 'ASqTAMhhki7btr3WL768v2yUPKWuGfMEGWnP7TxALmmb' },
  { key: 'ccpaOptoutRegistry', displayName: 'CCPA Opt-Out Registry', tagline: 'California CCPA "Do Not Sell" opt-outs.', programId: '5xVQq4KKsAST14RGvxP2aSNZhp681tRENM9TFwVfUpgk' },
  { key: 'pipedaConsentExtension', displayName: 'PIPEDA Consent Extension', tagline: 'Canada PIPEDA / Quebec Law 25 consent layer.', programId: 'G98d5DAEC17xWfojMCdsYrAdAXP8E7QC2g2KrrnLrMPT' },
  { key: 'pipaKoreaZkIdentity', displayName: 'PIPA Korea ZK Identity', tagline: 'Korea PIPA i-PIN replacement, SP1 v6 ZK.', programId: '41JLtHb54P8LMLeSccZM1XR6xr4gxcDbVrNRZVg2hPhR' },
  { key: 'hiroshimaAiProcessAttestation', displayName: 'Hiroshima AI Process Attestation', tagline: 'G7 ICOC voluntary AI governance attestations.', programId: '4qPsou8f6QFacbZeW75ZZ1mZiYi5PtxuoRSJLyZZVQqx' },
];

export function explorerUrlStr(address: string, kind: 'program' | 'tx' | 'account' = 'account', cluster: Cluster = DEFAULT_CLUSTER): string {
  const base = 'https://solscan.io';
  const path = kind === 'tx' ? 'tx' : 'account';
  const suffix = cluster === 'mainnet-beta' ? '' : `?cluster=${cluster}`;
  return `${base}/${path}/${address}${suffix}`;
}

export function truncateAddressStr(address: string, head = 4, tail = 4): string {
  if (!address || address.length <= head + tail + 1) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}
