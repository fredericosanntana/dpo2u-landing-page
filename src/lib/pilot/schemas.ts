// Zod schemas for pilot forms. Mirror the on-chain validation in the
// Soroban contract so the form blocks bad input BEFORE network round-trip.

import { z } from 'zod';

const USE_CASE_ID_REGEX = /^[a-zA-Z0-9_]{1,32}$/;
const HEX64_REGEX = /^[0-9a-fA-F]{64}$/;

export const verifyFormSchema = z.object({
  use_case_id: z
    .string()
    .min(1, 'Informe o use_case_id (ex.: bank_chg)')
    .max(32, 'Máximo 32 caracteres')
    .regex(USE_CASE_ID_REGEX, 'Somente [a-zA-Z0-9_], até 32 caracteres'),
  evidence_hash_hex: z
    .string()
    .length(64, 'Hash precisa ter exatamente 64 caracteres hexadecimais (SHA-256)')
    .regex(HEX64_REGEX, 'Apenas dígitos hexadecimais (0-9, a-f)'),
});

export type VerifyFormInput = z.infer<typeof verifyFormSchema>;

/** Known sample for the demo round-trip (Sprint M anchor 2026-05-14). */
export const VERIFY_SAMPLE: VerifyFormInput = {
  use_case_id: 'bank_chg',
  evidence_hash_hex: '0dbf43ad5862d6e1c3f16958056e531f09bd23eed0fb515d4185bdbf1206bed4',
};
