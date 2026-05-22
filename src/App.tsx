import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import ConsentProvider from '@/components/consent/ConsentProvider';
import CookieBanner from '@/components/consent/CookieBanner';
import MarketingScripts from '@/components/MarketingScripts';
import { Toaster } from '@/components/ui/toaster';
import SealedLayout from '@/components/sealed/SealedLayout';
// Home stays eager — it's the LCP route. All others lazy-loaded
// to keep the initial JS chunk under ~400 KB on mobile (F007/F014, audit cycle 2).
//
// /mcp removed 2026-04-29 — Sealed globalization sprint. Content now lives as a
// section on home (#mcp) and as the MCP Tool Reference section on /research.
// Server-side 301 redirect (server.js) sends /mcp → /#mcp for back-compat.
import HomePage from '@/app/page';
const SolanaProtocolPage  = lazy(() => import('@/app/solana-protocol'));
const AboutPage           = lazy(() => import('@/app/about'));
const ResearchPage        = lazy(() => import('@/app/research'));
const PrivacyPage         = lazy(() => import('@/app/privacy'));
const TermsPage           = lazy(() => import('@/app/terms'));
const RegisterDappPage    = lazy(() => import('@/app/register-dapp'));
const AlphaSignupPage     = lazy(() => import('@/app/alpha-signup'));
const AlphaPage           = lazy(() => import('@/app/alpha'));
const CoveragePage        = lazy(() => import('@/app/coverage'));
const PricingPage         = lazy(() => import('@/app/pricing'));
const DemoPage            = lazy(() => import('@/app/demo'));
const DSRPage             = lazy(() => import('@/app/dsr'));
const PortalPage          = lazy(() => import('@/app/portal'));
// Pilot Anticorrupção — Stellar Soroban (Sprint37° M1)
const PilotLandingPage    = lazy(() => import('@/app/pilot/index'));
const PilotAlertasPage    = lazy(() => import('@/app/pilot/alertas'));
const PilotCompliancePage = lazy(() => import('@/app/pilot/compliance'));
const PilotAtestarPage    = lazy(() => import('@/app/pilot/atestar'));
const PilotVerifyPage     = lazy(() => import('@/app/pilot/verify'));
const PilotDashboardPage  = lazy(() => import('@/app/pilot/dashboard'));
const PilotContractPage   = lazy(() => import('@/app/pilot/contract'));
// Phase B — Operator console
const PilotLoginPage      = lazy(() => import('@/app/pilot/login'));
const PilotOperatorIndex  = lazy(() => import('@/app/pilot/operator/index'));
const PilotOperatorSubmit = lazy(() => import('@/app/pilot/operator/submit'));
const PilotOperatorHistory= lazy(() => import('@/app/pilot/operator/history'));
const PilotOperatorErasure= lazy(() => import('@/app/pilot/operator/erasure'));
// Phase C — Admin console (feature-flagged via VITE_ADMIN_UI=1)
const PilotAdminIndex     = lazy(() => import('@/app/pilot/admin/index'));
const PilotAdminConfigure = lazy(() => import('@/app/pilot/admin/configure-use-case'));
const PilotAdminAuthorize = lazy(() => import('@/app/pilot/admin/authorize-submitter'));

// Editorial fade — no spinner, no layout shift. A thin ivory veil.
const RouteFallback = () => (
    <div
        aria-hidden
        className="min-h-screen bg-dpo2u-ivory animate-pulse"
        style={{ animationDuration: '1.6s' }}
    />
);

const NotFound = () => (
    <div className="min-h-screen bg-dpo2u-ivory text-dpo2u-ink font-body flex items-center justify-center p-6">
        <div className="max-w-[52ch] text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dpo2u-ink/70 mb-6">
                — 404 —
            </p>
            <h1 className="font-display text-section text-dpo2u-ink font-medium">
                This page has been sunset.
            </h1>
            <p className="mt-6 font-body text-[16px] text-dpo2u-ink/70">
                Try the homepage, or read the research.
            </p>
            <div className="mt-10 flex gap-8 justify-center font-mono text-[13px] uppercase tracking-[0.14em]">
                <Link
                    to="/"
                    className="text-dpo2u-ink border-b border-dpo2u-ink/30 hover:border-dpo2u-indigo hover:text-dpo2u-indigo transition-colors pb-1"
                >
                    → dpo2u.com
                </Link>
                <Link
                    to="/research"
                    className="text-dpo2u-ink/70 border-b border-dpo2u-ink/15 hover:border-dpo2u-ink hover:text-dpo2u-ink transition-colors pb-1"
                >
                    → Research
                </Link>
            </div>
        </div>
    </div>
);

function App() {
    return (
        <Router>
            <ConsentProvider>
                <MarketingScripts />
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-dpo2u-ink focus:text-dpo2u-ivory focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:uppercase focus:tracking-[0.16em] focus:rounded-sm"
                >
                    Skip to content
                </a>
                <SealedLayout>
                    <main id="main" className="flex flex-col">
                        <Suspense fallback={<RouteFallback />}>
                        <Routes>
                            {/* Active routes — 7 editorial + 2 alpha registry (2026-04-28).
                                /mcp removed 2026-04-29; server.js issues a 301 redirect
                                to /#mcp for any direct hits. */}
                            <Route path="/"                 element={<HomePage />}           />
                            <Route path="/solana-protocol"  element={<SolanaProtocolPage />} />
                            <Route path="/about"            element={<AboutPage />}          />
                            <Route path="/research"         element={<ResearchPage />}       />
                            <Route path="/privacy"          element={<PrivacyPage />}        />
                            <Route path="/terms"            element={<TermsPage />}          />
                            <Route path="/register-dapp"    element={<RegisterDappPage />}   />
                            <Route path="/alpha-signup"     element={<AlphaSignupPage />}    />
                            <Route path="/alpha"            element={<AlphaPage />}          />
                            <Route path="/coverage"         element={<CoveragePage />}       />
                            {/* Per-jurisdiction SEO routes (added 2026-05-11) — render
                                the same CoveragePage; prerender-meta.mjs injects unique
                                meta tags per jurisdiction for SEO. CoveragePage can read
                                useParams() if it wants to scroll-to-card; v1 renders all. */}
                            <Route path="/coverage/:code"   element={<CoveragePage />}       />
                            <Route path="/pricing"          element={<PricingPage />}        />
                            <Route path="/demo"             element={<DemoPage />}           />
                            {/* /dsr — Data Subject Rights portal v0 (S2.5, read-only history) */}
                            <Route path="/dsr"              element={<DSRPage />}            />
                            {/* /portal — Customer audit history portal v0 (S2.10, read-only) */}
                            <Route path="/portal"           element={<PortalPage />}         />

                            {/* Piloto Anticorrupção (Stellar Soroban) — Sprint37° M1 */}
                            <Route path="/pilot"                       element={<PilotLandingPage />}   />
                            <Route path="/pilot/alertas"               element={<PilotAlertasPage />}   />
                            <Route path="/pilot/compliance"            element={<PilotCompliancePage />} />
                            <Route path="/pilot/atestar"               element={<PilotAtestarPage />}   />
                            <Route path="/pilot/verify"                element={<PilotVerifyPage />}    />
                            <Route path="/pilot/dashboard"             element={<PilotDashboardPage />} />
                            <Route path="/pilot/contract"              element={<PilotContractPage />}  />
                            <Route path="/pilot/contract/:contract_id" element={<PilotContractPage />}  />
                            {/* Phase B — Operator (API key gated) */}
                            <Route path="/pilot/login"                 element={<PilotLoginPage />}     />
                            <Route path="/pilot/operator"              element={<PilotOperatorIndex />} />
                            <Route path="/pilot/operator/submit"       element={<PilotOperatorSubmit />} />
                            <Route path="/pilot/operator/history"      element={<PilotOperatorHistory />} />
                            <Route path="/pilot/operator/erasure"      element={<PilotOperatorErasure />} />
                            {/* Phase C — Admin (Freighter + allowlist + VITE_ADMIN_UI=1) */}
                            <Route path="/pilot/admin"                       element={<PilotAdminIndex />} />
                            <Route path="/pilot/admin/configure-use-case"    element={<PilotAdminConfigure />} />
                            <Route path="/pilot/admin/authorize-submitter"   element={<PilotAdminAuthorize />} />

                            {/* Legacy redirects — retired in the 2026-04-24 rebrand + 2026-04-28 sprint */}
                            <Route path="/midnight-protocol"    element={<Navigate to="/solana-protocol" replace />} />
                            <Route path="/mcp-brain"            element={<Navigate to="/research#mcp-reference" replace />} />
                            <Route path="/mcp"                  element={<Navigate to="/" replace />} />
                            <Route path="/self-funding-agent"   element={<Navigate to="/"                replace />} />
                            <Route path="/private-stack"        element={<Navigate to="/"                replace />} />
                            <Route path="/compliance-automate"  element={<Navigate to="/"                replace />} />
                            <Route path="/lgpd-kit"             element={<Navigate to="/"                replace />} />
                            <Route path="/analise"              element={<Navigate to="/register-dapp"   replace />} />
                            <Route path="/adequacao"            element={<Navigate to="/register-dapp"   replace />} />
                            <Route path="/register"             element={<Navigate to="/register-dapp"   replace />} />
                            <Route path="/showcase"             element={<Navigate to="/alpha"           replace />} />
                            <Route path="/dashboard"            element={<Navigate to="/"                replace />} />
                            <Route path="/graphs"               element={<Navigate to="/"                replace />} />
                            <Route path="/story"                element={<Navigate to="/about"           replace />} />
                            <Route path="/lgpd"                 element={<Navigate to="/"                replace />} />
                            <Route path="/teste"                element={<Navigate to="/"                replace />} />

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                        </Suspense>
                    </main>
                </SealedLayout>
                <Toaster />
                <CookieBanner />
            </ConsentProvider>
        </Router>
    );
}

export default App;
