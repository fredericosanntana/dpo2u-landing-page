// Route guard for /app/*. Redirects to /login if no wallet is connected.
// Mirrors src/components/pilot/operator/RequireApiKey.tsx.
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useWalletAuth } from './WalletAuthProvider';

export function RequireWallet({ children }: { children: React.ReactNode }) {
  const { pubkey } = useWalletAuth();
  const location = useLocation();
  if (!pubkey) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <>{children}</>;
}

export default RequireWallet;
