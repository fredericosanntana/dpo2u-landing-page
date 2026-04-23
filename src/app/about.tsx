import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Github, Twitter, Linkedin, Mail,
  Shield, Brain, Hexagon, Bot,
  FileCode2, Package, Cpu, Database, Lock, Users,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import PageShell from '@/components/landing/PageShell';
import PageHero from '@/components/landing/PageHero';
import PageSection from '@/components/landing/PageSection';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const AnimatedBlock: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className = '', id }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      id={id}
      initial="initial"
      animate={inView ? 'animate' : 'initial'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const stats: Array<{
  value: number;
  label: string;
  icon: typeof FileCode2;
  color: 'purple' | 'blue' | 'green';
  suffix?: string;
}> = [
  { value: 6, label: 'Anchor programs live on Solana devnet', icon: FileCode2, color: 'purple' },
  { value: 120, label: 'LOC patched in sp1-solana for SP1 v6', icon: Package, color: 'blue', suffix: '+' },
  { value: 156, label: 'k CU per on-chain ZK verification', icon: Cpu, color: 'green', suffix: 'k' },
  { value: 356, label: 'Bytes — Groth16 proof size', icon: Shield, color: 'purple' },
  { value: 4, label: 'Compliance skills in DPO2U MCP', icon: Brain, color: 'blue' },
  { value: 2078, label: 'Zettelkasten notes powering the stack', icon: Database, color: 'green' },
];

const expertise = [
  {
    title: 'Privacy & Compliance',
    icon: Lock,
    skills: ['LGPD / GDPR', 'DPDP India', 'MiCAR / ADGM', 'Zero-Knowledge Proofs', 'DPO-as-a-Service'],
  },
  {
    title: 'Solana / ZK Stack',
    icon: Hexagon,
    skills: ['Anchor programs', 'SP1 zkVM (v6)', 'Groth16 on alt_bn128', 'PDA / CPI patterns', 'Devnet ops'],
  },
  {
    title: 'AI & Automation',
    icon: Cpu,
    skills: ['Model Context Protocol (MCP)', 'Multi-agent systems', 'Autonomous agent design', 'Zettelkasten knowledge mgmt', 'Chairman + AI coordination'],
  },
];

const publications = [
  {
    title: 'DPO2U: Compliance as Protocol',
    type: 'Whitepaper v1.1',
    year: '2026',
    description: 'How MCP tools + SP1 v6 zero-knowledge proofs + Solana on-chain registry transform privacy compliance into a verifiable, cost-efficient cryptographic asset.',
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
];

const agents = [
  { name: 'Compliance Expert', model: 'Opus', color: 'text-red-400' },
  { name: 'Agent Factory', model: 'Opus', color: 'text-pink-400' },
  { name: 'Knowledge Manager', model: 'Sonnet', color: 'text-cyan-400' },
  { name: 'Content Creator', model: 'Sonnet', color: 'text-yellow-400' },
  { name: 'DeFi Ops', model: 'Sonnet', color: 'text-brand-emerald-400' },
  { name: 'Docker/VPS Ops', model: 'Sonnet', color: 'text-brand-sapphire-400' },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        badge={
          <>
            <Users className="w-4 h-4" />
            Founder &amp; Sole Operator
          </>
        }
        title="Frederico Santana"
        subtitle={
          <>
            Building the bridge between{' '}
            <span className="text-brand-purple-400 font-medium">autonomous AI agents</span> and{' '}
            <span className="text-brand-sapphire-400 font-medium">zero-knowledge privacy</span>.
            One person. Six AI agents. Twelve smart contracts.
          </>
        }
      >
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://github.com/fredericosanntana"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-full px-5 py-2.5 inline-flex items-center text-sm text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </a>
          <a
            href="https://x.com/fredsanntana"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-full px-5 py-2.5 inline-flex items-center text-sm text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            <Twitter className="h-4 w-4 mr-2" />
            X / Twitter
          </a>
          <a
            href="https://www.linkedin.com/in/fredericosantana/"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-full px-5 py-2.5 inline-flex items-center text-sm text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </a>
          <a
            href="mailto:contato@dpo2u.com.br"
            className="inline-flex items-center bg-gradient-to-r from-brand-sapphire-500 to-brand-emerald-500 hover:from-brand-sapphire-600 hover:to-brand-emerald-600 rounded-full px-5 py-2.5 text-sm text-white font-medium shadow-lg shadow-brand-sapphire-500/25 transition-all"
          >
            <Mail className="h-4 w-4 mr-2" />
            Get in Touch
          </a>
        </div>
      </PageHero>

      <PageSection>
        <AnimatedBlock>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading mb-4">
              Builder <span className="text-brand-sapphire-400">Credentials</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Numbers that speak louder than resumes.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <motion.div key={stat.label} variants={fadeInUp}>
                <Card className="p-8 liquid-glass rounded-3xl text-center">
                  <stat.icon className={`h-8 w-8 mx-auto mb-4 ${
                    stat.color === 'purple' ? 'text-brand-purple-400' :
                    stat.color === 'blue' ? 'text-brand-sapphire-400' :
                    'text-brand-emerald-400'
                  }`} />
                  <div className="text-3xl font-bold text-apex-heading mb-2">
                    <AnimatedCounter
                      value={stat.value}
                      duration={2}
                      delay={idx * 0.15}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="text-zinc-400 text-sm">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedBlock>
      </PageSection>

      <PageSection>
        <AnimatedBlock>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading mb-4">
              Technical <span className="text-brand-purple-400">Expertise</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {expertise.map((area) => (
              <motion.div key={area.title} variants={fadeInUp}>
                <Card className="h-full p-8 liquid-glass rounded-3xl">
                  <area.icon className="h-10 w-10 text-brand-purple-400 mb-6" />
                  <h3 className="text-xl font-semibold text-apex-heading mb-4">{area.title}</h3>
                  <ul className="space-y-3">
                    {area.skills.map((skill) => (
                      <li key={skill} className="flex items-center text-zinc-400 text-sm">
                        <div className="w-1.5 h-1.5 bg-brand-purple-400 rounded-full mr-3 flex-shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedBlock>
      </PageSection>

      <PageSection>
        <AnimatedBlock>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading mb-4">
              <span className="text-brand-sapphire-400">Publications</span> &amp; Research
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {publications.map((pub) => (
              <motion.div key={pub.title} variants={fadeInUp}>
                <Card className="p-8 liquid-glass rounded-3xl hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-apex-heading">{pub.title}</h3>
                    <span className="text-xs text-zinc-500 flex-shrink-0 ml-4">{pub.year}</span>
                  </div>
                  <span className="inline-block text-xs px-2 py-1 bg-brand-sapphire-500/10 text-brand-sapphire-300 rounded mb-3">
                    {pub.type}
                  </span>
                  <p className="text-zinc-400 text-sm">{pub.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedBlock>
      </PageSection>

      <PageSection>
        <AnimatedBlock>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeInUp}>
              <Bot className="h-16 w-16 text-brand-purple-400 mx-auto mb-8" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-5xl font-semibold text-apex-heading mb-6">
              The One-Person <span className="text-brand-purple-400">Unicorn</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-zinc-400 mb-8 leading-relaxed max-w-3xl mx-auto">
              DPO2U isn't a team of 50 — it's one founder amplified by six autonomous AI agents,
              each with distinct capabilities and on-chain identities. The agents handle compliance audits,
              content generation, treasury operations, knowledge management, and infrastructure — 24/7,
              with 99.9% uptime.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-zinc-500 mb-6 max-w-2xl mx-auto">
              This is not a pitch deck philosophy. The agents are live, the programs are deployed
              on Solana devnet, the tests are passing, and the ZK proofs are verifiable. Built in public, every step of the way.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-zinc-500 mb-12 max-w-2xl mx-auto italic">
              DPO2U prototyped on Midnight Network and migrated to Solana in Q2 2026 — the move
              unlocked cheaper on-chain verification, broader ecosystem reach, and a credible
              path to the ~50M Brazilian CNPJs who need LGPD attestations at scale.
            </motion.p>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {agents.map((agent) => (
                <Card key={agent.name} className="p-6 liquid-glass rounded-2xl">
                  <div className={`text-sm font-semibold ${agent.color} mb-1`}>{agent.name}</div>
                  <div className="text-xs text-zinc-500">Claude {agent.model}</div>
                </Card>
              ))}
            </motion.div>
          </div>
        </AnimatedBlock>
      </PageSection>
    </PageShell>
  );
}
