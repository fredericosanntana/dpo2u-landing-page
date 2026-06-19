import React, { useEffect } from 'react';

export default function BrazilPage() {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-8');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.glass-card').forEach(card => observer.observe(card));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30 overflow-hidden">
            {/* Background glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-slate-900/40 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center transition-all">
                <div className="text-2xl font-bold tracking-tight">
                    DPO<span className="text-blue-500">2</span>U 
                    <span className="text-xs ml-3 text-slate-400 font-mono tracking-widest border border-slate-700 px-3 py-1 rounded-full bg-slate-800/50">BRASIL</span>
                </div>
                <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
                    <a href="#solucao" className="hover:text-white transition">Solução</a>
                    <a href="#arquitetura" className="hover:text-white transition">Arquitetura ZK</a>
                    <a href="#mcp" className="hover:text-white transition">Agents & MCP</a>
                </div>
                <a href="https://docs.dpo2u.com" target="_blank" rel="noreferrer" className="bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 rounded-full font-semibold hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all text-sm">
                    Acessar Integração
                </a>
            </nav>

            {/* Hero */}
            <header className="relative pt-40 pb-20 px-6 min-h-screen flex flex-col md:flex-row items-center container mx-auto gap-12 z-10">
                <div className="flex-1 max-w-2xl">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold">
                        MCP público ativo · visualização institucional
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Compliance como Protocolo
                    </h1>
                    <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                        Transformamos a regulação numa rotina puramente criptográfica. Empresas provam obediência sem exibir bancos de dados. Agentes validam permissões usando Zero Knowledge Proofs.
                    </p>
                    <div className="flex gap-4">
                        <a href="#arquitetura" className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all hover:-translate-y-0.5">
                            Explorar Desenho
                        </a>
                        <a href="https://docs.dpo2u.com" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full font-semibold border border-slate-700 hover:bg-slate-800 transition">
                            Acessar Docs
                        </a>
                    </div>
                </div>
                <div className="flex-1 relative perspective-1000">
                    <img src="/br-assets/hero_bg.png" alt="DPO2U Crypto Art BR" className="w-full max-w-lg mx-auto rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-[float_6s_ease-in-out_infinite]" />
                </div>
            </header>

            {/* Arquitetura */}
            <section id="arquitetura" className="py-24 px-6 container mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Engenharia em 5 Camadas Inquebráveis</h2>
                    <p className="text-slate-400 text-lg">O Design ZK que blinda a integração dos Agentes B2B Brasileiros.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { step: '01', title: 'Application (MCP Server)', desc: 'Inventário público de tools e OpenAPI para integrar agentes e aplicações sem depender de contagens hardcoded.' },
                        { step: '02', title: 'Storage Imutável', desc: 'Relatórios DPIA (Schema v1) atrelados a CIDs da rede IPFS/Lighthouse.' },
                        { step: '03', title: 'Agentes Autônomos', desc: 'O Auditor-Agent avalia as evidências utilizando regras determinísticas pontuando o compliance (ERC-8004).' },
                        { step: '04', title: 'Midnight ZK-SNARKs', desc: 'Smart Contracts em Compact. Submetem verificações blindando o payload no Ledger Global.' },
                        { step: '05', title: 'Analytical (OpenFHE)', desc: 'Engine ativo de Criptografia Homomórfica em container local. ML rodando em dados cifrados do cliente.' },
                    ].map((feature, i) => (
                        <div key={i} className={`glass-card opacity-0 translate-y-8 bg-slate-900/40 backdrop-blur-lg border border-white/5 p-8 rounded-3xl transition-all duration-700 hover:-translate-y-2 hover:bg-slate-800/50 hover:border-slate-700 ${i === 4 ? 'md:col-span-2 border-purple-500/30 bg-gradient-to-b from-slate-900/40 to-purple-900/10 hover:border-purple-500/50' : ''}`}>
                            <div className="text-blue-500 font-mono text-xl font-bold mb-4">{feature.step}</div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-slate-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* MCP */}
            <section id="mcp" className="py-24 px-6 container mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10 bg-gradient-to-r from-transparent via-slate-900/30 to-transparent rounded-3xl mb-24 border border-white/5">
                <div className="flex-1">
                    <img src="/br-assets/blockchain_bg.png" alt="Midnight Blockchain ZK" className="w-full max-w-lg mx-auto rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(139,92,246,0.15)] animate-[float_8s_ease-in-out_infinite_reverse]" />
                </div>
                <div className="flex-1 max-w-xl">
                    <h2 className="text-4xl font-bold mb-6">Model Context Protocol para IA</h2>
                    <p className="text-lg text-slate-400 mb-8">
                        Nosso maior trunfo de Integração Regional. Usar a plataforma significa instanciar o MCP no seu <strong className="text-white">Claude, OpenAI ou Ollama localmente isolado</strong>.
                    </p>
                    <ul className="space-y-4 text-slate-300 font-medium">
                        <li className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/5"><span className="text-purple-500 text-xl font-bold">✔</span> Chamadas sigilosas de check_compliance() e Scores</li>
                        <li className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/5"><span className="text-purple-500 text-xl font-bold">✔</span> Rate limit distribuído nativo persistido em Redis</li>
                        <li className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/5"><span className="text-purple-500 text-xl font-bold">✔</span> Avaliação B2B de permissões ZK em runtime</li>
                    </ul>
                </div>
            </section>
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes float {
                    0% { transform: translateY(0px) }
                    50% { transform: translateY(-20px) }
                    100% { transform: translateY(0px) }
                }
            `}} />
        </div>
    );
}
