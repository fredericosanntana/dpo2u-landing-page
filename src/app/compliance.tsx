import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, CheckCircle, Zap, ArrowRight, Lock, Activity, Star, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-brand-chrome-900 text-brand-platinum-100 overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-chrome-900 via-brand-chrome-900 to-brand-sapphire-950"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-sapphire-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-emerald-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] opacity-[0.03]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md"
            >
              <Shield className="h-4 w-4 text-brand-emerald-400 mr-2" />
              <span className="text-sm font-semibold text-brand-emerald-300 tracking-wide uppercase">DPO2U Compliance Suite</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight tracking-tight"
            >
              <span className="text-white">Intelligent Compliance,</span> <br />
              <span className="bg-gradient-to-r from-brand-emerald-400 via-brand-ocean-400 to-brand-sapphire-400 bg-clip-text text-transparent">
                Automated
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-xl md:text-2xl text-brand-platinum-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
            >
              Ditch the spreadsheets. Our AI agents analyze 32 control points and generate
              all legal and technical documentation in minutes. Compliance scores verifiable
              on-chain via Midnight ZK proofs.
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
                onClick={() => window.location.href = '/midnight'}
              >
                <Fingerprint className="mr-2 h-5 w-5" />
                See ZK Verification
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

      {/* Features Grid */}
      <section className="py-24 relative bg-brand-chrome-900">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-chrome-900 via-brand-chrome-900 to-brand-chrome-900"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white leading-tight">
              The Most Complete <span className="text-brand-emerald-400">Compliance Kit</span>
            </h2>
            <p className="text-lg text-brand-platinum-500 max-w-2xl mx-auto">
              AI analyzes 32 control points and generates legally valid, customized documents
              with optional ZK on-chain verification.
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
                desc: 'Custom-generated with specific clauses for your sector and data collection type.',
                color: 'blue',
              },
              {
                icon: Lock,
                title: 'Terms of Use',
                desc: 'Clear usage rules protecting your intellectual property and outlining responsibilities.',
                color: 'emerald',
              },
              {
                icon: Activity,
                title: 'DPIA Report',
                desc: 'Complete Data Protection Impact Assessment for high-risk data processing activities.',
                color: 'purple',
              },
              {
                icon: Shield,
                title: 'Security Policy',
                desc: 'Internal information security standards, access control, and incident response procedures.',
                color: 'orange',
              },
              {
                icon: CheckCircle,
                title: 'Cookie Management',
                desc: 'Ready-to-deploy consent banner scripts with granular control for your website.',
                color: 'cyan',
              },
              {
                icon: Fingerprint,
                title: 'ZK Compliance Proof',
                desc: 'On-chain verified compliance score via Midnight Network — provable without exposing data.',
                color: 'yellow',
              },
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-8 h-full bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-brand-emerald-500/30 transition-all duration-300 group hover:-translate-y-2">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-${item.color}-500/20`}>
                    <item.icon className={`h-7 w-7 text-${item.color}-400 group-hover:text-${item.color}-300`} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3 text-white group-hover:text-brand-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-brand-platinum-500 group-hover:text-brand-platinum-400 leading-relaxed">{item.desc}</p>
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
                  { step: '02', title: 'AI Processing', desc: 'Our agents cross-reference your data with LGPD, GDPR, and applicable legislation.' },
                  { step: '03', title: 'Instant Delivery', desc: 'Receive your complete compliance kit — editable, legally valid, and ready to implement.' },
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
              <div className="relative aspect-square md:aspect-video bg-brand-chrome-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto bg-brand-emerald-500/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Lock className="h-10 w-10 text-brand-emerald-400" />
                  </div>
                  <p className="text-brand-platinum-400 font-serif text-lg">Generating Documents...</p>
                  <div className="w-48 h-1 bg-brand-chrome-800 rounded-full mx-auto mt-4 overflow-hidden">
                    <div className="h-full bg-brand-emerald-500 w-2/3 animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-sapphire-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-sapphire-900/50 via-brand-sapphire-950 to-brand-sapphire-950"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8">
            Protect Your Business Today
          </h2>
          <p className="text-brand-platinum-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Join modern companies that chose DPO2U's automated compliance —
            with ZK proofs that make your compliance status verifiable on-chain.
          </p>
          <Button
            size="xl"
            className="bg-white text-brand-sapphire-900 hover:bg-brand-platinum-200 font-bold px-12 py-8 text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
            onClick={() => window.location.href = '/analise'}
          >
            Start Compliance Assessment
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
