import React, { useState } from 'react';
import { SmallLabel, FONTS, PALETTE } from '@/components/sealed/atoms';
import { usePageHead } from '@/lib/page-head';

interface FormState { name: string; email: string; company: string; }

export default function AlphaSignupPage() {
  usePageHead({ title: 'Pilot signup | DPO2U', description: 'Cadastro para o pilot DPO2U — primeiro audit grátis.', path: '/alpha-signup' });
  const [form, setForm] = useState<FormState>({ name: '', email: '', company: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'err'>('idle');
  const [message, setMessage] = useState<string>('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const r = await fetch('/api/alpha-signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
      setStatus('ok'); setMessage('Recebido. Vamos retornar em até 48h.');
    } catch (err) { setStatus('err'); setMessage(err instanceof Error ? err.message : String(err)); }
  };

  const fieldStyle: React.CSSProperties = { display: 'block', marginTop: 6, width: '100%', padding: 10, border: `1px solid ${PALETTE.ink}`, background: PALETTE.paper, fontFamily: FONTS.body, fontSize: 14 };
  const labelStyle: React.CSSProperties = { fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: PALETTE.ink };

  return (
    <section className="px-6 lg:px-14 py-20 max-w-[640px] mx-auto">
      <SmallLabel style={{ marginBottom: 16 }}>§ Pilot signup</SmallLabel>
      <h1 style={{ fontFamily: FONTS.display, fontSize: 56, lineHeight: 0.95, margin: 0, color: PALETTE.ink }}>Sele com a gente.</h1>
      <p style={{ fontFamily: FONTS.body, fontSize: 16, lineHeight: 1.6, marginTop: 16, color: PALETTE.inkSoft }}>
        Primeiro audit grátis em troca de feedback honesto + logo opcional no site se gostarem. Sem contrato.
      </p>
      <form onSubmit={onSubmit} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={labelStyle}>Nome<input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={fieldStyle} /></label>
        <label style={labelStyle}>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={fieldStyle} /></label>
        <label style={labelStyle}>Projeto / empresa<input type="text" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={fieldStyle} /></label>
        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={status === 'submitting' || status === 'ok'} style={{ padding: '12px 24px', background: PALETTE.ink, color: PALETTE.paper, border: 'none', fontFamily: FONTS.body, fontSize: 14, cursor: 'pointer', opacity: status === 'submitting' || status === 'ok' ? 0.5 : 1 }}>
            {status === 'submitting' ? 'Enviando…' : status === 'ok' ? 'Enviado ✓' : 'Cadastrar'}
          </button>
        </div>
        {status === 'err' && (<p style={{ fontFamily: FONTS.body, fontSize: 13, color: PALETTE.terracotta }}>{message}</p>)}
        {status === 'ok' && (<p style={{ fontFamily: FONTS.body, fontSize: 13, color: PALETTE.ink }}>{message}</p>)}
      </form>
    </section>
  );
}
