import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, FileText, CheckCircle, Zap, ArrowRight, Lock, Activity, Fingerprint, Database, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className = '', id }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="initial"
      animate={inView ? 'animate' : 'initial'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function ComplianceAutomatePage() {
  return (
    <div className="min-h-screen bg-brand-chrome-900 text-brand-platinum-100 overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-chrome-900 via-brand-chrome-900 to-brand-sapphire-950"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-emerald-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-sapphire-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4 backdrop-blur-md"
            >
              <span className="text-xs font-mono text-brand-platinum-500 mr-2">01</span>
              <Shield className="h-4 w-4 text-brand-emerald-400 mr-2" />
              <span className="text-sm font-semibold text-brand-emerald-300 tracking-wide uppercase">Compliance Engine</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight tracking-tight"
            >
              <span className="text-white">From Zero to Compliant</span> <br />
              <span className="bg-gradient-to-r from-brand-emerald-400 via-brand-ocean-400 to-brand-sapphire-400 bg-clip-text text-transparent">
                in Minutes
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-xl md:text-2xl text-brand-platinum-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
            >
              AI agents analyze <span className="text-brand-emerald-400 font-medium">32 control points</span> and generate
              all legal and technical documentation — policies, DPIAs, audit checklists —
              customized to your business in minutes.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button
                size="xl"
                className="bg-gradient-to-r from-brand-emerald-600 to-brand-emerald-500 hover:from-brand-emerald-500 hover:to-brand-emerald-400 text-white font-bold px-10 py-7 text-lg rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 border border-brand-emerald-400/20"
                onClick={() => window.location.href = '/analise'}
              >
                <Zap className="mr-2 h-5 w-5 fill-current" />
                Start Free Diagnostic
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm px-8 py-7 text-lg rounded-2xl font-medium transition-all"
                onClick={() => window.location.href = '/mcp-brain'}
              >
                <Brain className="mr-2 h-5 w-5" />
                Next: AI Brain
              </Button>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="mt-8 text-sm text-brand-platinum-600 font-medium"
            >
              <span className="text-brand-emerald-400">&check;</span> No credit card required &nbsp;
              <span className="text-brand-emerald-400">&check;</span> Instant results &nbsp;
              <span className="text-brand-emerald-400">&check;</span> LGPD &amp; GDPR
            </motion.p>
          </div>
        </div>
      </section>

      {/* Output Artifacts */}
      <section className="py-24 relative bg-brand-chrome-900">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-chrome-900 via-brand-chrome-900 to-brand-chrome-900"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white leading-tight">
              What the Engine <span className="text-brand-emerald-400">Generates</span>
            </h2>
            <p className="text-lg text-brand-platinum-500 max-w-2xl mx-auto">
              AI analyzes 32 control points and produces legally valid, customized documents
              stored on IPFS with content-addressable CIDs.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: FileText,
                title: 'Privacy Policy',
                desc: 'Custom-generated with specific clauses for your sector, data collection type, and legal basis.',
                output: 'policy.json → IPFS CID',
                bgClass: 'bg-brand-sapphire-500/10',
                borderClass: 'border-brand-sapphire-500/20',
                textClass: 'text-brand-sapphire-400',
              },
              {
                icon: Lock,
                title: 'Terms of Use',
                desc: 'Clear usage rules protecting intellectual property and outlining responsibilities.',
                output: 'terms.json → IPFS CID',
                bgClass: 'bg-brand-emerald-500/10',
                borderClass: 'border-brand-emerald-500/20',
                textClass: 'text-brand-emerald-400',
              },
              {
                icon: Activity,
                title: 'DPIA Report',
                desc: 'Complete Data Protection Impact Assessment for high-risk data processing activities.',
                output: 'dpia.json → IPFS CID',
                bgClass: 'bg-brand-purple-500/10',
                borderClass: 'border-brand-purple-500/20',
                textClass: 'text-brand-purple-400',
              },
              {
                icon: Shield,
                title: 'Security Policy',
                desc: 'Internal information security standards, access control, and incident response procedures.',
                output: 'security.json → IPFS CID',
                bgClass: 'bg-orange-500/10',
                borderClass: 'border-orange-500/20',
                textClass: 'text-orange-400',
              },
              {
                icon: CheckCircle,
                title: 'Audit Checklist',
                desc: 'Point-by-point compliance checklist covering all 32 control points with pass/fail status.',
                output: 'audit.json → IPFS CID',
                bgClass: 'bg-cyan-500/10',
                borderClass: 'border-cyan-500/20',
                textClass: 'text-cyan-400',
              },
              {
                icon: Fingerprint,
                title: 'ZK-Ready Score',
                desc: 'Compliance score ready to be posted as a ZK proof on Midnight Network via Product 03.',
                output: 'score → Midnight Ledger',
                bgClass: 'bg-yellow-500/10',
                borderClass: 'border-yellow-500/20',
                textClass: 'text-yellow-400',
              },
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-8 h-full bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-brand-emerald-500/30 transition-all duration-300 group hover:-translate-y-2">
                  <div className={`w-14 h-14 rounded-2xl ${item.bgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border ${item.borderClass}`}>
                    <item.icon className={`h-7 w-7 ${item.textClass}`} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3 text-white group-hover:text-brand-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-brand-platinum-500 group-hover:text-brand-platinum-400 leading-relaxed mb-3">{item.desc}</p>
                  <p className="text-xs font-mono text-brand-emerald-400/70">{item.output}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-brand-chrome-900 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-brand-sapphire-500/10 border border-brand-sapphire-500/20 rounded-full mb-6">
                <span className="text-xs font-bold text-brand-sapphire-300 uppercase tracking-widest">Simplified Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-white leading-tight">
                From Zero to Compliant <br />
                <span className="text-brand-platinum-600">in 3 Steps</span>
              </h2>
              <div className="space-y-10">
                {[
                  { step: '01', title: 'Smart Diagnostic', desc: 'Answer dynamic questions adapted to your business model and data processing activities.' },
                  { step: '02', title: 'AI Processing', desc: 'Our agents cross-reference your data with LGPD, GDPR, and applicable legislation across 32 control points.' },
                  { step: '03', title: 'Instant Delivery', desc: 'Receive your complete compliance kit — all documents stored on IPFS with content-addressable CIDs.' },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-serif font-bold text-brand-platinum-700 group-hover:text-brand-emerald-400 group-hover:border-brand-emerald-500/30 transition-all">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-brand-emerald-300 transition-colors">{step.title}</h3>
                      <p className="text-brand-platinum-500 group-hover:text-brand-platinum-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-emerald-500 to-brand-sapphire-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-brand-chrome-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-8">
                <div className="space-y-4 font-mono text-sm">
                  <div className="text-brand-emerald-400">{">"} Processing company data...</div>
                  <div className="text-brand-platinum-500">Analyzing 32 control points</div>
                  <div className="text-brand-platinum-500">Cross-referencing LGPD Art. 7-11</div>
                  <div className="text-brand-sapphire-400">Generating privacy_policy.json</div>
                  <div className="text-brand-sapphire-400">Generating dpia_report.json</div>
                  <div className="text-brand-sapphire-400">Generating security_policy.json</div>
                  <div className="text-brand-purple-400">Uploading to IPFS/Lighthouse...</div>
                  <div className="text-brand-emerald-400">CID: bafybeig...k2mq</div>
                  <div className="text-amber-400">Score: 87/100 — Ready for ZK proof</div>
                  <div className="mt-4 text-brand-emerald-400 font-bold">
                    ✓ Compliance kit ready. Next → AI Brain (MCP)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where it fits in the flow */}
      <AnimatedSection className="py-20 bg-brand-chrome-900 border-t border-white/5">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Product <span className="text-brand-emerald-400">01</span> in the Pipeline
            </h2>
            <p className="text-brand-platinum-500 max-w-2xl mx-auto">
              The Compliance Engine is the entry point. Documents flow to the AI Brain for programmatic processing.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto bg-brand-chrome-900 rounded-xl p-6 border border-brand-chrome-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
              {[
                { label: 'Compliance Engine', active: true, icon: FileText },
                { label: 'AI Brain', active: false, icon: Brain },
                { label: 'ZK Protocol', active: false, icon: Fingerprint },
                { label: 'Agents', active: false, icon: Database },
              ].map((step, idx) => (
                <React.Fragment key={step.label}>
                  {idx > 0 && <ArrowRight className="h-5 w-5 text-brand-platinum-700 hidden md:block flex-shrink-0" />}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                      step.active
                        ? 'bg-brand-emerald-500/20 border-brand-emerald-500/50'
                        : 'bg-brand-chrome-800 border-brand-platinum-800'
                    }`}>
                      <step.icon className={`h-6 w-6 ${step.active ? 'text-brand-emerald-400' : 'text-brand-platinum-600'}`} />
                    </div>
                    <span className={`text-sm font-medium ${step.active ? 'text-brand-emerald-400' : 'text-brand-platinum-600'}`}>
                      {step.label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* CTA Bottom */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-sapphire-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-sapphire-900/50 via-brand-sapphire-950 to-brand-sapphire-950"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8">
            Protect Your Business Today
          </h2>
          <p className="text-brand-platinum-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Start with a free diagnostic and get your compliance kit in minutes.
            Next step: connect it to the AI Brain for programmatic verification.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="xl"
              className="bg-white text-brand-sapphire-900 hover:bg-brand-platinum-200 font-bold px-12 py-8 text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
              onClick={() => window.location.href = '/analise'}
            >
              Start Compliance Assessment
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-2 border-white/20 text-white hover:bg-white/10"
              onClick={() => window.location.href = '/mcp-brain'}
            >
              <Brain className="mr-2 h-5 w-5" />
              Next: AI Compliance Brain
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
