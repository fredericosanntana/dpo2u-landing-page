import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConsentProvider from '@/components/consent/ConsentProvider';
import CookieBanner from '@/components/consent/CookieBanner';
import MarketingScripts from '@/components/MarketingScripts';
import { ThemeProvider } from '@/hooks/use-theme';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/app/page';
import ComplianceAutomatePage from '@/app/compliance-automate';
import MCPBrainPage from '@/app/mcp-brain';
import MidnightProtocolPage from '@/app/midnight-protocol';
import SelfFundingAgentPage from '@/app/self-funding-agent';
import PrivateStackPage from '@/app/private-stack';
import AnalysisPage from '@/app/analise';
import AboutPage from '@/app/about';
import PrivacyPage from '@/app/privacy';
import TermsPage from '@/app/terms';

const NotFound = () => (
    <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">404 — Page Not Found</h1>
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
                            <Route path="/compliance-automate" element={<ComplianceAutomatePage />} />
                            <Route path="/mcp-brain" element={<MCPBrainPage />} />
                            <Route path="/midnight-protocol" element={<MidnightProtocolPage />} />
                            <Route path="/self-funding-agent" element={<SelfFundingAgentPage />} />
                            <Route path="/private-stack" element={<PrivateStackPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/analise" element={<AnalysisPage />} />
                            <Route path="/privacy" element={<PrivacyPage />} />
                            <Route path="/terms" element={<TermsPage />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                    <Toaster />
                </ThemeProvider>
                <CookieBanner />
            </ConsentProvider>
        </Router>
    );
}

export default App;
