import React, { useEffect } from 'react';
import { ArrowRight, ExternalLink, Github, ShieldCheck, Fingerprint, BadgeCheck, Scale, Landmark, Network, Mail } from 'lucide-react';

const SNOWTRACE = 'https://testnet.snowtrace.io';
const REPO = 'https://github.com/fredericosanntana/dpo2u-avalanche';

type Contract = { name: string; address: string; what: string };

const contracts: Contract[] = [
    { name: 'SP1Verifier (Groth16, v6.1.0)', address: '0xA9EF51126b02DDb8C284C424EfC4C54893d5979E', what: 'Verifies SP1 zero-knowledge proofs on the C-Chain.' },
    { name: 'ComplianceRegistry', address: '0xc997C83FbF40c70867b9A969a2AC2ee2Ae87C4cE', what: 'The seal: PASS / FAIL / REVIEW per subject and use case, with mandatory expiry and revocation.' },
    { name: 'ZkThresholdAttestor', address: '0x0a48471953bEFaEDE2f75E0D9A54f0EAFe68B9B7', what: 'Proves score ≥ threshold with a Groth16 proof. The score never touches the chain.' },
    { name: 'PassportOracle', address: '0x27bb394d3fFdD7DDc5bb67F8C8Ee64073BeDF2b2', what: 'Conformity passport per counterparty. Any contract asks isValid() before settling.' },
    { name: 'TravelRuleGate', address: '0xCB53038Bf6105F00F9FD48Fa22d0f77b6BE93834', what: 'An operator action only runs with a valid Travel Rule PASS, anti-replay and intent binding.' },
    { name: 'SolvencyRegistry', address: '0x92d194d2766394F917Aca20c6b8881De1F5db97b', what: 'Proof of reserves as an SP1 proof: solvent or not, without exposing balances.' },
    { name: 'MidnightRelay', address: '0xeF52a2F26E0A5E558A87b34Bd98E910F3F64D845', what: 'Brings private compliance seals from Midnight to Avalanche through k-of-n relayers.' },
];

const proofs = [
    { label: 'Real SP1 Groth16 proof verified on-chain', tx: '0xbb82fac5972b72f930538d404afb941be3a7e12d46578d4c2185987c5e630706' },
    { label: 'First solvency seal (SP1 PoR, test data)', tx: '0x0663f0c23fc7a2435d54fcd1f892ad5be62933bc428ab53ae9ef8548f59593a2' },
    { label: 'First Midnight → Fuji relayed seal', tx: '0x66f356b299fae0271be3e305f69b883bae0fe6e0d11a46042a6a75d4be2a1e4a' },
];

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export default function AvalanchePage() {
    useEffect(() => {
        document.title = 'DPO2U on Avalanche: compliance as a protocol';
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-8');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const card = 'reveal opacity-0 translate-y-8 transition-all duration-700 bg-slate-900/50 backdrop-blur-lg border border-white/5 rounded-3xl';

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-red-500/30 overflow-x-hidden">
            <div className="absolute top-0 left-1/4 w-[28rem] h-[28rem] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-[60rem] right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-4 flex justify-between items-center">
                <a href="/" className="text-2xl font-bold tracking-tight">
                    DPO<span className="text-red-500">2</span>U
                    <span className="hidden sm:inline text-xs ml-3 text-slate-300 font-mono tracking-widest border border-red-500/30 px-3 py-1 rounded-full bg-red-500/10">AVALANCHE</span>
                </a>
                <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
                    <a href="#problem" className="hover:text-white transition">Problem</a>
                    <a href="#how" className="hover:text-white transition">How it works</a>
                    <a href="#live" className="hover:text-white transition">Live on Fuji</a>
                    <a href="#roadmap" className="hover:text-white transition">Roadmap</a>
                </div>
                <a href={REPO} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 sm:px-5 py-2.5 rounded-full font-semibold transition text-sm">
                    <Github className="h-4 w-4" /> GitHub
                </a>
            </nav>

            {/* Hero */}
            <header className="relative pt-36 pb-20 px-4 sm:px-6 container mx-auto z-10">
                <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live on Avalanche Fuji · 7 verified contracts
                    </div>
                    <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                        Compliance as a protocol,
                        <span className="block bg-gradient-to-r from-red-400 via-rose-300 to-purple-300 bg-clip-text text-transparent">on Avalanche.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl">
                        DPO2U turns regulation into on-chain seals that any smart contract can check. Institutions, banks and crypto asset
                        service providers (PSAVs/VASPs) prove they are compliant with zero-knowledge proofs, without exposing their data.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a href="#live" className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(232,65,66,0.45)] transition">
                            See it on-chain <ArrowRight className="h-4 w-4" />
                        </a>
                        <a href={REPO} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full font-semibold border border-slate-700 hover:bg-slate-800 transition">
                            Read the code
                        </a>
                    </div>
                </div>
            </header>

            {/* Problem */}
            <section id="problem" className="py-20 px-4 sm:px-6 container mx-auto relative z-10">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">The problem</h2>
                <p className="text-slate-400 text-lg max-w-3xl mb-10">
                    Brazil's Central Bank rules for virtual asset providers (BCB Resolutions 519, 520 and 521), the Travel Rule and the LGPD
                    force every institution to check its counterparties. Today that means PDFs, questionnaires and trust. Nothing a smart contract can read.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { icon: Scale, title: 'Regulation is manual', desc: 'Each partner audits each other partner, again and again, with no shared, verifiable record.' },
                        { icon: Fingerprint, title: 'Privacy blocks transparency', desc: 'Institutions cannot publish client data or balances to prove they comply.' },
                        { icon: Landmark, title: 'DeFi cannot see compliance', desc: 'Settlement contracts have no way to refuse a counterparty that is not compliant.' },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className={`${card} p-8`}>
                            <Icon className="h-8 w-8 text-red-400 mb-4" />
                            <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
                            <p className="text-slate-400">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section id="how" className="py-20 px-4 sm:px-6 container mx-auto relative z-10">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">How it works</h2>
                <p className="text-slate-400 text-lg max-w-3xl mb-10">One flow, from a regulatory rule pack to a contract that refuses non-compliant counterparties.</p>
                <div className="grid md:grid-cols-4 gap-4">
                    {[
                        { n: '01', title: 'Evaluate', desc: 'The DPO2U gateway runs versioned rule packs (PSAV partner, safeguard, Travel Rule) over the evidence. The pack hash goes on-chain.' },
                        { n: '02', title: 'Prove', desc: 'An SP1 zero-knowledge proof shows the result (score ≥ threshold, reserves ≥ liabilities) without revealing inputs.' },
                        { n: '03', title: 'Seal', desc: 'The C-Chain verifies the Groth16 proof and writes a seal with origin, pack version and mandatory expiry.' },
                        { n: '04', title: 'Enforce', desc: 'Any contract asks the PassportOracle or the TravelRuleGate before it settles. No valid passport, no transfer.' },
                    ].map(s => (
                        <div key={s.n} className={`${card} p-6`}>
                            <div className="text-red-400 font-mono text-lg font-bold mb-3">{s.n}</div>
                            <h3 className="text-white text-lg font-bold mb-2">{s.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
                <div className={`${card} p-6 mt-6 flex items-start gap-4`}>
                    <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-sm leading-relaxed">
                        <strong className="text-white">Invariants:</strong> REVIEW and FAIL are never valid, every seal expires, a seal is written once,
                        and verifier keys are immutable. Without a real proof or signer the system records REVIEW instead of faking a PASS.
                    </p>
                </div>
            </section>

            {/* Live */}
            <section id="live" className="py-20 px-4 sm:px-6 container mx-auto relative z-10">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Live on Fuji today</h2>
                <p className="text-slate-400 text-lg max-w-3xl mb-10">
                    Every contract is verified on Snowtrace. Open-source (MIT), with 122 tests.
                </p>
                <div className="grid gap-3">
                    {contracts.map(c => (
                        <a key={c.address} href={`${SNOWTRACE}/address/${c.address}`} target="_blank" rel="noreferrer"
                            className={`${card} p-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 hover:border-red-500/40 hover:bg-slate-800/50`}>
                            <div className="md:w-72 shrink-0 flex items-center gap-2 font-semibold">
                                <BadgeCheck className="h-5 w-5 text-emerald-400 shrink-0" /> {c.name}
                            </div>
                            <div className="flex-1 text-slate-400 text-sm">{c.what}</div>
                            <div className="font-mono text-sm text-red-300 flex items-center gap-1">{short(c.address)} <ExternalLink className="h-3.5 w-3.5" /></div>
                        </a>
                    ))}
                </div>
                <h3 className="text-white text-xl font-bold mt-12 mb-4">Proof it works</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {proofs.map(p => (
                        <a key={p.tx} href={`${SNOWTRACE}/tx/${p.tx}`} target="_blank" rel="noreferrer" className={`${card} p-5 hover:border-red-500/40`}>
                            <div className="font-semibold mb-2">{p.label}</div>
                            <div className="font-mono text-xs text-red-300 flex items-center gap-1">tx {short(p.tx)} <ExternalLink className="h-3 w-3" /></div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Roadmap */}
            <section id="roadmap" className="py-20 px-4 sm:px-6 container mx-auto relative z-10">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-10">Roadmap</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { tag: 'Done', color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10', title: 'C-Chain core', items: ['SP1 verifier + compliance registry', 'ZK threshold attestor', 'PassportOracle (admin under 2-of-3 Safe)', 'Travel Rule gate', 'Solvency registry (SP1 proof of reserves)', 'Midnight → Avalanche relay'] },
                        { tag: 'Next', color: 'text-amber-300 border-amber-500/30 bg-amber-500/10', title: 'Real institutions', items: ['First PSAV seal with a real partner and named reviewer', 'Solvency with real custody and ledger feeds', 'Legal source manifest on-chain', 'SDK and docs for integrators'] },
                        { tag: 'Then', color: 'text-purple-300 border-purple-500/30 bg-purple-500/10', title: 'Compliance L1', items: ['Permissioned Avalanche L1 for institutions', 'Validator governance and allowlists', 'Passport mirrored across L1s via ICM / Teleporter', 'Native token design'] },
                    ].map(col => (
                        <div key={col.title} className={`${card} p-8`}>
                            <span className={`inline-block text-xs font-mono px-3 py-1 rounded-full border mb-4 ${col.color}`}>{col.tag}</span>
                            <h3 className="text-white text-xl font-bold mb-4">{col.title}</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                {col.items.map(i => <li key={i} className="flex gap-2"><span className="text-red-400">•</span>{i}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team / CTA */}
            <section className="py-20 px-4 sm:px-6 container mx-auto relative z-10">
                <div className={`${card} p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center border-red-500/20`}>
                    <div>
                        <Network className="h-8 w-8 text-red-400 mb-4" />
                        <h2 className="text-white text-3xl font-bold mb-4">Built in Brazil, for Avalanche</h2>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            Led by Frederico Santana, DPO2U's Chief Compliance &amp; Innovation Officer and protocol architect, working at the
                            intersection of legal design and smart contracts. Member of the Team1 Brazil chapter.
                        </p>
                        <p className="text-slate-400 text-sm">The same compliance engine already anchors seals on Midnight, Solana and Stellar. Avalanche is its first full reference implementation.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <a href={REPO} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 bg-slate-800/60 hover:bg-slate-800 border border-white/5 rounded-2xl p-5 transition">
                            <span className="flex items-center gap-3 font-semibold"><Github className="h-5 w-5" /> dpo2u-avalanche on GitHub</span><ArrowRight className="h-4 w-4" />
                        </a>
                        <a href="mailto:contato@dpo2u.com.br" className="flex items-center justify-between gap-3 bg-slate-800/60 hover:bg-slate-800 border border-white/5 rounded-2xl p-5 transition">
                            <span className="flex items-center gap-3 font-semibold"><Mail className="h-5 w-5" /> contato@dpo2u.com.br</span><ArrowRight className="h-4 w-4" />
                        </a>
                        <a href="https://x.com/fredsanntana" target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 bg-slate-800/60 hover:bg-slate-800 border border-white/5 rounded-2xl p-5 transition">
                            <span className="font-semibold">@fredsanntana on X</span><ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </section>

            <footer className="py-10 px-4 text-center text-slate-500 text-sm border-t border-white/5">
                © {new Date().getFullYear()} DPO2U · Testnet deployment (Avalanche Fuji, chain 43113). Not yet on mainnet.
            </footer>
        </div>
    );
}
