import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Github, Twitter, Linkedin, Mail,
  Shield, Brain, Hexagon, Network, BookOpen, Bot,
  FileCode2, Package, Cpu, Database, Lock, Users
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimatedCounter } from '@/components/ui/animated-counter';
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

const stats = [
  { value: 2078, label: 'Zettelkasten Notes', icon: Database, color: 'purple' as const },
  { value: 12, label: 'Smart Contracts (7 Base + 5 Midnight)', icon: FileCode2, color: 'blue' as const },
  { value: 97, label: 'Tests Passing', suffix: '/97', icon: Shield, color: 'green' as const },
  { value: 6, label: 'Active AI Agents', icon: Bot, color: 'purple' as const },
  { value: 17, label: 'MCP Compliance Tools', icon: Brain, color: 'blue' as const },
  { value: 27, label: 'Midnight SDK Packages', suffix: '+', icon: Package, color: 'green' as const },
];

const expertise = [
  {
    title: 'Privacy & Compliance',
    icon: Lock,
    skills: ['LGPD / GDPR', 'Data Protection Impact Assessments', 'Zero-Knowledge Proofs', 'Privacy by Design', 'DPO-as-a-Service'],
  },
  {
    title: 'Blockchain & Web3',
    icon: Hexagon,
    skills: ['Solidity / ERC-8004', 'Midnight Compact Language', 'Uniswap V3 Integration', 'Base Chain (L2)', 'Cross-Chain Bridges'],
  },
  {
    title: 'AI & Automation',
    icon: Cpu,
    skills: ['Model Context Protocol (MCP)', 'Multi-Agent Systems', 'Autonomous Agent Design', 'Zettelkasten Knowledge Mgmt', 'Content Pipeline Automation'],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-chrome-900 text-brand-platinum-100 overflow-x-hidden">
      <Header />

      {/* Hero */}
      <AnimatedSection className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-b from-brand-chrome-900 via-brand-chrome-900 to-brand-chrome-900">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-brand-sapphire-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-purple-600/8 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto">
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-brand-sapphire-500/10 rounded-full border border-brand-sapphire-500/20 text-sm text-brand-sapphire-300 mb-6">
                <Users className="h-4 w-4 mr-2" />
                Founder & Sole Operator
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white">
                Frederico Santana
              </h1>
              <p className="text-xl md:text-2xl text-brand-platinum-400 leading-relaxed font-light mb-8">
                Building the bridge between{' '}
                <span className="text-brand-purple-400 font-medium">autonomous AI agents</span> and{' '}
                <span className="text-brand-sapphire-400 font-medium">zero-knowledge privacy</span>.
                One person. Six AI agents. Twelve smart contracts.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <a
                href="https://github.com/fredericosanntana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 bg-brand-chrome-800 hover:bg-brand-platinum-800 rounded-xl text-brand-platinum-400 transition-colors"
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </a>
              <a
                href="https://x.com/fredsanntana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 bg-brand-chrome-800 hover:bg-brand-platinum-800 rounded-xl text-brand-platinum-400 transition-colors"
              >
                <Twitter className="h-5 w-5 mr-2" />
                X / Twitter
              </a>
              <a
                href="https://www.linkedin.com/in/fredericosantana/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 bg-brand-chrome-800 hover:bg-brand-platinum-800 rounded-xl text-brand-platinum-400 transition-colors"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                LinkedIn
              </a>
              <a
                href="mailto:contato@dpo2u.com.br"
                className="inline-flex items-center px-5 py-2.5 bg-brand-sapphire-600 hover:bg-brand-sapphire-500 rounded-xl text-white transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                Get in Touch
              </a>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Builder Credentials — Stats Grid */}
      <AnimatedSection className="py-24 bg-brand-chrome-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              Builder <span className="text-brand-sapphire-400">Credentials</span>
            </h2>
            <p className="text-lg text-brand-platinum-500 max-w-2xl mx-auto">
              Numbers that speak louder than resumes.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <motion.div key={stat.label} variants={fadeInUp}>
                <Card className="p-6 bg-brand-chrome-800/50 border-brand-platinum-800 text-center">
                  <stat.icon className={`h-8 w-8 mx-auto mb-4 ${
                    stat.color === 'purple' ? 'text-brand-purple-400' :
                    stat.color === 'blue' ? 'text-brand-sapphire-400' :
                    'text-brand-emerald-400'
                  }`} />
                  <div className="text-3xl font-bold text-white mb-2">
                    <AnimatedCounter
                      value={stat.value}
                      duration={2}
                      delay={idx * 0.15}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="text-brand-platinum-500 text-sm">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Technical Expertise */}
      <AnimatedSection className="py-24 bg-brand-chrome-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              Technical <span className="text-brand-purple-400">Expertise</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {expertise.map((area, idx) => (
              <motion.div key={area.title} variants={fadeInUp}>
                <Card className="h-full p-8 bg-brand-chrome-800/30 border-brand-platinum-800">
                  <area.icon className="h-10 w-10 text-brand-purple-400 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-4">{area.title}</h3>
                  <ul className="space-y-3">
                    {area.skills.map((skill) => (
                      <li key={skill} className="flex items-center text-brand-platinum-500 text-sm">
                        <div className="w-1.5 h-1.5 bg-brand-purple-400 rounded-full mr-3 flex-shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Publications */}
      <AnimatedSection className="py-24 bg-brand-chrome-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              <span className="text-brand-sapphire-400">Publications</span> & Research
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                title: 'DPO2U: Compliance as Protocol',
                type: 'Whitepaper v1.1',
                year: '2026',
                description: 'How MCP + IPFS + ERC-8004 + Midnight ZK-SNARKs transform privacy compliance into a cryptographic on-chain asset.',
              },
              {
                title: 'Co-authored Research on DAOs',
                type: 'Academic Paper',
                year: '2024',
                description: 'Peer-reviewed publication on decentralized autonomous organizations and governance mechanisms.',
              },
              {
                title: 'ERC-8004: Autonomous Agent Standard',
                type: 'Technical Specification',
                year: '2025',
                description: 'A revolutionary Ethereum standard enabling AI agents to operate with complete financial autonomy via self-funding smart contracts.',
              },
            ].map((pub, idx) => (
              <motion.div key={pub.title} variants={fadeInUp}>
                <Card className="p-6 bg-brand-chrome-800/50 border-brand-platinum-800 hover:border-brand-sapphire-500/30 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white">{pub.title}</h3>
                    <span className="text-xs text-brand-platinum-600 flex-shrink-0 ml-4">{pub.year}</span>
                  </div>
                  <span className="inline-block text-xs px-2 py-1 bg-brand-sapphire-500/10 text-brand-sapphire-300 rounded mb-3">
                    {pub.type}
                  </span>
                  <p className="text-brand-platinum-500 text-sm">{pub.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* One Person Unicorn */}
      <AnimatedSection className="py-24 bg-brand-chrome-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeInUp}>
              <Bot className="h-16 w-16 text-brand-purple-400 mx-auto mb-8" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              The One-Person <span className="text-brand-purple-400">Unicorn</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-brand-platinum-400 mb-8 leading-relaxed max-w-3xl mx-auto">
              DPO2U isn't a team of 50 — it's one founder amplified by six autonomous AI agents,
              each with distinct capabilities and on-chain identities. The agents handle compliance audits,
              content generation, treasury operations, knowledge management, and infrastructure — 24/7,
              with 99.9% uptime.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-brand-platinum-500 mb-12 max-w-2xl mx-auto">
              This is not a pitch deck philosophy. The agents are live, the contracts are deployed,
              the tests are passing, and the ZK proofs are verifiable. Built in public, every step of the way.
            </motion.p>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { name: 'Compliance Expert', model: 'Opus', color: 'text-red-400' },
                { name: 'Agent Factory', model: 'Opus', color: 'text-pink-400' },
                { name: 'Knowledge Manager', model: 'Sonnet', color: 'text-cyan-400' },
                { name: 'Content Creator', model: 'Sonnet', color: 'text-yellow-400' },
                { name: 'DeFi Ops', model: 'Sonnet', color: 'text-brand-emerald-400' },
                { name: 'Docker/VPS Ops', model: 'Sonnet', color: 'text-brand-sapphire-400' },
              ].map((agent) => (
                <Card key={agent.name} className="p-4 bg-brand-chrome-800/50 border-brand-platinum-800">
                  <div className={`text-sm font-semibold ${agent.color} mb-1`}>{agent.name}</div>
                  <div className="text-xs text-brand-platinum-600">Claude {agent.model}</div>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Contact CTA */}
      <AnimatedSection className="py-24 bg-gradient-to-r from-brand-sapphire-900/30 via-brand-chrome-900 to-brand-purple-900/30 text-center">
        <div className="container mx-auto px-4">
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Let's Build Together
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-brand-platinum-400 mb-8 max-w-2xl mx-auto">
            Interested in Midnight Network integration, AI compliance systems,
            or the "Compliance as Protocol" thesis? I'd love to connect.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="xl"
              className="bg-brand-sapphire-600 hover:bg-brand-sapphire-500 text-white font-bold px-12"
              onClick={() => window.location.href = 'mailto:contato@dpo2u.com.br'}
            >
              <Mail className="h-5 w-5 mr-2" />
              Email Me
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-2 border-brand-purple-400/30 text-brand-purple-300 hover:bg-brand-purple-500/10"
              onClick={() => window.open('https://github.com/fredericosanntana', '_blank')}
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub Profile
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
