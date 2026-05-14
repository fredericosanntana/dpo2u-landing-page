import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const LINKS = [
  { to: '/pilot', label: 'Visão geral', exact: true },
  { to: '/pilot/verify', label: 'Verificar' },
  { to: '/pilot/dashboard', label: 'Dashboard' },
  { to: '/pilot/contract', label: 'Contrato' },
];

export function PilotNav() {
  return (
    <nav className="border-y border-dpo2u-ink/10 bg-dpo2u-ivory">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ul className="flex flex-wrap items-center gap-1 sm:gap-2 py-3">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  cn(
                    'inline-block rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                    'font-display tracking-tight',
                    isActive
                      ? 'bg-dpo2u-ink text-dpo2u-ivory'
                      : 'text-dpo2u-ink/70 hover:bg-dpo2u-ink/5 hover:text-dpo2u-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
