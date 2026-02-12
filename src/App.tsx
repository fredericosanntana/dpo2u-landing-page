import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConsentProvider from '@/components/consent/ConsentProvider';
import CookieBanner from '@/components/consent/CookieBanner';
import MarketingScripts from '@/components/MarketingScripts';
import { ThemeProvider } from '@/hooks/use-theme';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/app/page';
import MCPPage from '@/app/mcp';
import AnalysisPage from '@/app/analise';
import LgpdKitPage from '@/app/lgpd-kit';
import ERC8004Page from '@/app/erc8004';

// Placeholder for other pages - functionality to be verified
const Placeholder = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">{title} - Under Migration based on Next.js removal</h1>
    </div>
);

function App() {
    return (
        <Router>
            <ConsentProvider>
                <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
                    <MarketingScripts />
                    <div className="flex flex-col min-h-screen">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/mcp" element={<MCPPage />} />
                            <Route path="/analise" element={<AnalysisPage />} />
                            <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
                            <Route path="/lgpd" element={<LgpdKitPage />} />
                            <Route path="/kit-lgpd" element={<LgpdKitPage />} />
                            <Route path="/erc8004" element={<ERC8004Page />} />
                            <Route path="/privacy" element={<Placeholder title="Privacy" />} />
                            <Route path="/terms" element={<Placeholder title="Terms" />} />
                            <Route path="*" element={<Placeholder title="404 Not Found" />} />
                        </Routes>
                    </div>
                    <Toaster />
                    {/* <Analytics /> - Vercel Analytics removed */}
                </ThemeProvider>
                <CookieBanner />
            </ConsentProvider>
        </Router>
    );
}

export default App;
