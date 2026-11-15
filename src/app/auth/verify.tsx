// /auth/verify?token=… — troca o link mágico por sessão e leva para /app/fi.
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/fi/gateway';
import { useFiSession } from '@/components/fi/FiSession';
import { FONTS, PALETTE } from '@/components/sealed/atoms';

export default function AuthVerifyPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useFiSession();
  const [error, setError] = useState<string | null>(null);
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;
    once.current = true;
    const token = params.get('token');
    if (!token) return setError('Link sem token.');
    // Remove o token da barra de endereço antes de qualquer outra coisa.
    window.history.replaceState(null, '', '/auth/verify');
    api.verify(token)
      .then(async (r) => {
        await refresh();
        navigate(r.created ? '/app/fi/workspace?welcome=1' : '/app/fi', { replace: true });
      })
      .catch(() => setError('Este link é inválido ou venceu. Peça um novo na página de diagnóstico.'));
  }, [params, navigate, refresh]);

  return (
    <div style={{ padding: 64, fontFamily: FONTS.body, color: PALETTE.ink }}>
      {error ? (
        <>
          <p role="alert">{error}</p>
          <a href="/financial-institutions#fi-diagnostic">Voltar</a>
        </>
      ) : (
        <p role="status">Entrando…</p>
      )}
    </div>
  );
}
