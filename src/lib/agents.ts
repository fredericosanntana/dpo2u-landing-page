export type Agent = {
  id: string;
  name: string;
  role: string;
  level: 'Estratégia' | 'Orquestração' | 'Especializada' | 'Execução';
  description: string;
  tools?: string[];
  kpis?: string[];
  tags?: string[];
};

export const agents: Agent[] = [
  // Nível 0 — AI Brain
  {
    id: 'ai-brain',
    name: 'AI Brain',
    role: 'OpenAI MCP Server',
    level: 'Estratégia',
    description:
      'Inteligência estratégica central: análise de contexto, decisões de alto nível e direcionamento do sistema multiagente.',
    tools: ['MCP Tools', 'OpenAI Reasoning', 'Context Engine'],
    kpis: ['Decisões assertivas', 'Aderência a objetivos', 'Tempo de resposta'],
    tags: ['Estratégico', 'MCP'],
  },
  // Nível 1 — Meta-Orchestration
  {
    id: 'master-orchestrator',
    name: 'Master Orchestrator',
    role: 'Meta-Orchestration',
    level: 'Orquestração',
    description:
      'Coordenação híbrida, delegação dinâmica e criação de agentes sob demanda (Agent Factory).',
    tools: ['Agent Factory', 'Planner', 'Cost Optimizer'],
    kpis: ['Custo/tarefa', 'Tempo total', 'Taxa de sucesso'],
    tags: ['Orquestração'],
  },
  // Nível 2 — Specialized Orchestration
  {
    id: 'claude-code-orchestrator',
    name: 'Claude Code Orchestrator',
    role: 'Gestor de Sessões e Contexto Global',
    level: 'Especializada',
    description:
      'Orquestra sessões de desenvolvimento com ferramentas Read/Write/Edit/Bash/WebSearch e contexto persistente.',
    tools: ['Read', 'Write', 'Edit', 'Bash', 'WebSearch'],
    kpis: ['Eficiência de codificação', 'Qualidade de PR', 'Menos retrabalho'],
    tags: ['Código', 'Sessões'],
  },
  {
    id: 'task-master',
    name: 'Task Master Orchestrator',
    role: 'Execução Local e Gestão de Tarefas',
    level: 'Especializada',
    description:
      'Coordena execução local, cron e tarefas integradas, com relatórios e status.',
    tools: ['Local Runner', 'CLI', 'Reports'],
    kpis: ['SLA de tarefas', 'Falhas evitadas'],
    tags: ['Tarefas'],
  },
  {
    id: 'session-manager',
    name: 'Session Manager',
    role: 'Backup de Sessões',
    level: 'Especializada',
    description:
      'Auto-detecção de início/fim, logging contínuo e relatórios Markdown no Obsidian (recuperação completa).',
    tools: ['auto_start_session', 'log_activity', 'end_session', 'recover_session'],
    kpis: ['100% sessões logadas', 'Zero context loss'],
    tags: ['Logs', 'Obsidian'],
  },
  // Nível 3 — Execution Agents (Conteúdo)
  {
    id: 'copywriter-seo-geo',
    name: 'Copywriter SEO GEO',
    role: 'Lead Producer',
    level: 'Execução',
    description:
      'Gera artigo master (800–1200), adapta para LinkedIn/Instagram/Substack com SEO ≥ 0.85 e GEO BR.',
    tools: ['SEO Toolkit', 'Tone & Style', 'GEO BR'],
    kpis: ['SEO ≥ 0.85', 'Tempo < 10m'],
    tags: ['Conteúdo'],
  },
  {
    id: 'visual-designer',
    name: 'Visual Designer',
    role: 'Hybrid Generator',
    level: 'Execução',
    description:
      'Geração visual híbrida: DALL·E 3 HD (1792×1024) e HTML→JPG (Puppeteer), escolhe melhor qualidade.',
    tools: ['DALL·E 3', 'Puppeteer', 'Brand Templates'],
    kpis: ['Consistência 100%', 'Qualidade visual'],
    tags: ['Visual'],
  },
  {
    id: 'dpo2u-brand-designer',
    name: 'DPO2U Brand Designer',
    role: 'Brand Guardian',
    level: 'Execução',
    description:
      'Enforcement de brand (#0066CC, Legal Design, consistência). Mantém templates e aprova saídas.',
    tools: ['Brand Linter', 'Templates', 'Review'],
    kpis: ['Brand 100%'],
    tags: ['Brand'],
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    role: 'Knowledge Curator',
    level: 'Execução',
    description:
      'Integra e organiza conteúdo no Obsidian (PARA), tagging automático e cross-linking.',
    tools: ['Obsidian PARA', 'Tags', 'Cross-links'],
    kpis: ['Tempo < 2m'],
    tags: ['Obsidian'],
  },
  // Nível 3 — Execution Agents (Técnicos)
  {
    id: 'software-architect',
    name: 'Software Architect',
    role: 'Design de Soluções',
    level: 'Execução',
    description:
      'Arquitetura e decisões técnicas com foco em segurança, performance e escalabilidade.',
    tools: ['Diagrams', 'ADR', 'Benchmarks'],
    kpis: ['Qualidade de arquitetura'],
    tags: ['Tech'],
  },
  {
    id: 'fullstack-developer',
    name: 'Fullstack Developer',
    role: 'Implementação',
    level: 'Execução',
    description:
      'Entrega features ponta a ponta, testes e integração com pipelines.',
    tools: ['Next.js', 'APIs', 'CI'],
    kpis: ['Lead time', 'Cobertura'],
    tags: ['Tech'],
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    role: 'CI/CD & Infra',
    level: 'Execução',
    description:
      'Pipelines, containers e observabilidade. Traefik/SSL, deploy e escalabilidade.',
    tools: ['Docker', 'Traefik', 'Grafana'],
    kpis: ['MTTR', 'Disponibilidade'],
    tags: ['DevOps'],
  },
  {
    id: 'security-auditor',
    name: 'Security Auditor',
    role: 'LGPD & AppSec',
    level: 'Execução',
    description:
      'Auditoria de segurança e compliance LGPD/GDPR, recomendações e mitigação.',
    tools: ['SAST/DAST', 'LGPD Checks'],
    kpis: ['Riscos mitigados'],
    tags: ['Segurança'],
  },
];

export const sections = {
  strategy: ['ai-brain'],
  orchestration: ['master-orchestrator'],
  specialized: ['claude-code-orchestrator', 'task-master', 'session-manager'],
  executionContent: ['copywriter-seo-geo', 'visual-designer', 'dpo2u-brand-designer', 'content-creator'],
  executionTech: ['software-architect', 'fullstack-developer', 'devops-engineer', 'security-auditor'],
};

