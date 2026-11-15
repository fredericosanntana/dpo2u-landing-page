// Browser polyfills — DEVE ser importado como PRIMEIRA coisa em main.tsx.
//
// O @dpo2u/stellar-sdk (decoder) usa `Buffer.from` no caminho de verificação on-chain
// (/verify). O Vite não polyfilla globals de Node, então sem isto o /verify quebra com
// "Buffer is not defined". Setamos o Buffer global no browser de forma idempotente.
import { Buffer } from 'buffer';

if (typeof globalThis !== 'undefined' && !(globalThis as { Buffer?: unknown }).Buffer) {
  (globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;
}
