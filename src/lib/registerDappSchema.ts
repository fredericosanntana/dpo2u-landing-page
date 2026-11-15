import { z } from 'zod';

const stepBlock = z.record(z.string(), z.unknown());

export const step1Schema = z.object({ step1_company: stepBlock.optional() });
export const step2Schema = z.object({ step2_inventory: stepBlock.optional() });
export const step3Schema = z.object({ step3_purposes: stepBlock.optional() });
export const step4Schema = z.object({ step4_storage: stepBlock.optional() });
export const step5Schema = z.object({ step5_third_parties: stepBlock.optional() });
export const step6Schema = z.object({
  step6_security: stepBlock.optional(),
  step6_risks: stepBlock.optional(),
});
export const step7Schema = z.object({ step7_web3: stepBlock.optional() });

export const registerDappSchema = z.object({
  step1_company: stepBlock.optional(),
  step2_inventory: stepBlock.optional(),
  step3_purposes: stepBlock.optional(),
  step4_storage: stepBlock.optional(),
  step5_third_parties: stepBlock.optional(),
  step6_security: stepBlock.optional(),
  step6_risks: stepBlock.optional(),
  step7_web3: stepBlock.optional(),
});

export type RegisterDappPayload = {
  step1_company?: Record<string, unknown>;
  step2_inventory?: Record<string, unknown>;
  step3_purposes?: Record<string, unknown>;
  step4_storage?: Record<string, unknown>;
  step5_third_parties?: Record<string, unknown>;
  step6_security?: Record<string, unknown>;
  step6_risks?: Record<string, unknown>;
  step7_web3?: Record<string, unknown>;
};

export const stepSchemas: ReadonlyArray<z.ZodTypeAny> = [
  step1Schema, step2Schema, step3Schema, step4Schema, step5Schema, step6Schema, step7Schema,
];

export const stepTitles = [
  'Empresa', 'Inventário de dados', 'Finalidades & bases legais',
  'Retenção & armazenamento', 'Terceiros', 'Segurança & risco', 'Web3 / Solana',
];

export const defaultPayload: RegisterDappPayload = {
  step1_company: {}, step2_inventory: {}, step3_purposes: {},
  step4_storage: {}, step5_third_parties: {}, step6_security: {},
  step6_risks: {}, step7_web3: {},
};
