import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/lib/pilot/auth-store';

interface Props {
  readonly children: ReactNode;
}

/**
 * Route guard for /pilot/operator/*. Redirects to /pilot/login if no
 * API key is in localStorage. Preserves intended destination via
 * react-router state so post-login can return the user there.
 */
export function RequireApiKey({ children }: Props) {
  const apiKey = useAuthStore((s) => s.apiKey);
  const location = useLocation();

  if (!apiKey) {
    return <Navigate to="/pilot/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <>{children}</>;
}
