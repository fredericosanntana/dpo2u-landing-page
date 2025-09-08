"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Network, 
  Workflow, 
  Cog, 
  Zap, 
  TrendingUp, 
  Shield, 
  Users,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Tipos para agentes e conexões
type AgentLevel = 0 | 1 | 2 | 3;
type AgentStatus = 'idle' | 'processing' | 'success' | 'coordinating';

interface Agent {
  id: string;
  name: string;
  level: AgentLevel;
  status: AgentStatus;
  position: { x: number; y: number };
  description: string;
}

interface Connection {
  from: string;
  to: string;
  active: boolean;
  type: 'command' | 'data' | 'result';
}

// Configuração dos agentes
const agents: Agent[] = [
  // Nível 0 - AI Brain
  {
    id: 'ai-brain',
    name: 'AI Brain',
    level: 0,
    status: 'coordinating',
    position: { x: 50, y: 10 },
    description: 'Inteligência estratégica central'
  },
  // Nível 1 - Master Orchestrator  
  {
    id: 'master-orchestrator',
    name: 'Master Orchestrator',
    level: 1,
    status: 'processing',
    position: { x: 50, y: 30 },
    description: 'Coordenação híbrida e delegação'
  },
  // Nível 2 - Specialized
  {
    id: 'claude-orchestrator',
    name: 'Claude Orchestrator',
    level: 2,
    status: 'processing',
    position: { x: 25, y: 55 },
    description: 'Sessões e contexto global'
  },
  {
    id: 'task-master',
    name: 'Task Master',
    level: 2,
    status: 'processing',
    position: { x: 50, y: 55 },
    description: 'Execução local e tarefas'
  },
  {
    id: 'session-manager',
    name: 'Session Manager',
    level: 2,
    status: 'success',
    position: { x: 75, y: 55 },
    description: 'Backup e recovery'
  },
  // Nível 3 - Execution
  {
    id: 'copywriter',
    name: 'Copywriter SEO',
    level: 3,
    status: 'success',
    position: { x: 15, y: 80 },
    description: 'Conteúdo otimizado'
  },
  {
    id: 'visual-designer',
    name: 'Visual Designer',
    level: 3,
    status: 'processing',
    position: { x: 35, y: 80 },
    description: 'Geração visual híbrida'
  },
  {
    id: 'software-architect',
    name: 'Software Architect',
    level: 3,
    status: 'idle',
    position: { x: 65, y: 80 },
    description: 'Arquitetura de soluções'
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    level: 3,
    status: 'success',
    position: { x: 85, y: 80 },
    description: 'CI/CD e infraestrutura'
  }
];

// Configuração das conexões
const connections: Connection[] = [
  { from: 'ai-brain', to: 'master-orchestrator', active: true, type: 'command' },
  { from: 'master-orchestrator', to: 'claude-orchestrator', active: true, type: 'data' },
  { from: 'master-orchestrator', to: 'task-master', active: true, type: 'data' },
  { from: 'master-orchestrator', to: 'session-manager', active: false, type: 'data' },
  { from: 'claude-orchestrator', to: 'copywriter', active: true, type: 'result' },
  { from: 'claude-orchestrator', to: 'visual-designer', active: true, type: 'result' },
  { from: 'task-master', to: 'software-architect', active: false, type: 'result' },
  { from: 'task-master', to: 'devops-engineer', active: true, type: 'result' }
];

// Ícones por nível
const levelIcons = {
  0: Brain,
  1: Network,
  2: Workflow,
  3: Cog
};

// Cores por nível
const levelColors = {
  0: 'from-brand-sapphire-500 to-brand-sapphire-600',
  1: 'from-brand-emerald-500 to-brand-emerald-600',
  2: 'from-brand-purple-500 to-brand-purple-600',
  3: 'from-brand-ocean-500 to-brand-ocean-600'
};

// Animações por status
const statusAnimations = {
  idle: {
    scale: 1,
    opacity: 0.7
  },
  processing: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: { duration: 2, repeat: Infinity }
  },
  success: {
    scale: 1.1,
    opacity: 1,
    boxShadow: '0 0 20px rgba(0, 212, 148, 0.5)'
  },
  coordinating: {
    scale: [1, 1.08, 1],
    rotate: [0, 2, -2, 0],
    opacity: [1, 0.9, 1],
    transition: { duration: 3, repeat: Infinity }
  }
};

// Componente AgentNode
const AgentNode: React.FC<{ agent: Agent; onClick?: () => void }> = ({ agent, onClick }) => {
  const Icon = levelIcons[agent.level];
  
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${agent.position.x}%`,
        top: `${agent.position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      animate={statusAnimations[agent.status]}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
    >
      <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${levelColors[agent.level]} flex items-center justify-center shadow-lg border-2 border-white/20`}>
        <Icon className="h-8 w-8 text-white" />
        
        {/* Status indicator */}
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
          agent.status === 'processing' ? 'bg-yellow-400' :
          agent.status === 'success' ? 'bg-green-400' :
          agent.status === 'coordinating' ? 'bg-blue-400' :
          'bg-gray-400'
        }`} />
      </div>
      
      {/* Tooltip */}
      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-max opacity-0 hover:opacity-100 transition-opacity z-10">
        <div className="text-xs font-semibold text-gray-800">{agent.name}</div>
        <div className="text-xs text-gray-600">{agent.description}</div>
      </div>
    </motion.div>
  );
};

// Componente ConnectionLine
const ConnectionLine: React.FC<{ connection: Connection; agents: Agent[] }> = ({ connection, agents }) => {
  const fromAgent = agents.find(a => a.id === connection.from);
  const toAgent = agents.find(a => a.id === connection.to);
  
  if (!fromAgent || !toAgent) return null;
  
  const connectionColors = {
    command: 'stroke-brand-sapphire-400',
    data: 'stroke-brand-emerald-400',
    result: 'stroke-brand-purple-400'
  };
  
  return (
    <motion.line
      x1={`${fromAgent.position.x}%`}
      y1={`${fromAgent.position.y}%`}
      x2={`${toAgent.position.x}%`}
      y2={`${toAgent.position.y}%`}
      className={`${connectionColors[connection.type]} ${connection.active ? 'opacity-100' : 'opacity-30'}`}
      strokeWidth="2"
      strokeDasharray={connection.active ? "0" : "5,5"}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        pathLength: connection.active ? 1 : 0.5, 
        opacity: connection.active ? 1 : 0.3 
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
  );
};

// Componente principal
export default function MultiAgentVisualization() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [metrics, setMetrics] = useState({
    tasksProcessing: 23,
    efficiency: 340,
    costReduction: 67,
    timeSaved: 127
  });

  // Simular métricas em tempo real
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => ({
        tasksProcessing: prev.tasksProcessing + Math.floor(Math.random() * 3) - 1,
        efficiency: prev.efficiency + Math.floor(Math.random() * 10) - 5,
        costReduction: Math.min(99, prev.costReduction + Math.random() * 2),
        timeSaved: prev.timeSaved + Math.floor(Math.random() * 5)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-900">
      <div className="container mx-auto container-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-brand-sapphire-100 rounded-full mb-6 dark:bg-slate-800">
            <Network className="h-4 w-4 text-brand-sapphire-600 mr-2" />
            <span className="text-sm font-medium text-brand-sapphire-700 dark:text-slate-200">Sistema Multiagentes — Live Production</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 dark:text-white mb-6">
            Veja a{' '}
            <span className="bg-gradient-to-r from-brand-sapphire-600 to-brand-emerald-600 bg-clip-text text-transparent">
              Orquestração Inteligente
            </span>{' '}
            em Ação
          </h2>
          <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
            Arquitetura híbrida de 4 níveis coordenando agentes especializados para máxima eficiência empresarial
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Visualização Principal */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-[500px] relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Arquitetura Multiagente</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pausar' : 'Executar'}
                </Button>
              </div>

              <div className="relative h-full bg-gradient-to-br from-brand-sapphire-50/30 to-brand-emerald-50/30 rounded-lg">
                {/* Linhas de conexão */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                  {connections.map((connection, index) => (
                    <ConnectionLine
                      key={`${connection.from}-${connection.to}-${index}`}
                      connection={connection}
                      agents={agents}
                    />
                  ))}
                </svg>

                {/* Níveis de fundo */}
                <div className="absolute inset-0" style={{ zIndex: 0 }}>
                  <div className="absolute top-[5%] left-0 right-0 h-[20%] bg-brand-sapphire-50/20 rounded-lg mx-4" />
                  <div className="absolute top-[25%] left-0 right-0 h-[20%] bg-brand-emerald-50/20 rounded-lg mx-4" />
                  <div className="absolute top-[45%] left-0 right-0 h-[20%] bg-brand-purple-50/20 rounded-lg mx-4" />
                  <div className="absolute top-[70%] left-0 right-0 h-[25%] bg-brand-ocean-50/20 rounded-lg mx-4" />
                </div>

                {/* Labels dos níveis */}
                <div className="absolute left-2 top-[12%] text-xs font-semibold text-brand-sapphire-600">Nível 0 - Estratégia</div>
                <div className="absolute left-2 top-[32%] text-xs font-semibold text-brand-emerald-600">Nível 1 - Orquestração</div>
                <div className="absolute left-2 top-[52%] text-xs font-semibold text-brand-purple-600">Nível 2 - Especializada</div>
                <div className="absolute left-2 top-[77%] text-xs font-semibold text-brand-ocean-600">Nível 3 - Execução</div>

                {/* Agentes */}
                <div className="relative h-full" style={{ zIndex: 2 }}>
                  {agents.map(agent => (
                    <AgentNode
                      key={agent.id}
                      agent={agent}
                      onClick={() => setSelectedAgent(agent)}
                    />
                  ))}
                </div>

                {/* Partículas de dados (animação) */}
                {isPlaying && (
                  <div className="absolute inset-0" style={{ zIndex: 3 }}>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-brand-emerald-400 rounded-full"
                        initial={{ x: '50%', y: '10%' }}
                        animate={{ 
                          x: [`50%`, `${25 + (i * 15)}%`], 
                          y: ['10%', '30%', '55%', '80%'] 
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          delay: i * 0.8,
                          ease: "linear" 
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Métricas em Tempo Real */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-brand-emerald-500 mr-2" />
                Métricas ao Vivo
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tarefas Processando</span>
                  <motion.span 
                    className="text-xl font-bold text-brand-sapphire-600"
                    key={metrics.tasksProcessing}
                    initial={{ scale: 1.2, color: '#00d494' }}
                    animate={{ scale: 1, color: '#4F46E5' }}
                    transition={{ duration: 0.3 }}
                  >
                    {metrics.tasksProcessing}
                  </motion.span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ganho Eficiência</span>
                  <motion.span 
                    className="text-xl font-bold text-brand-emerald-600"
                    key={metrics.efficiency}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    +{metrics.efficiency}%
                  </motion.span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Redução Custos</span>
                  <motion.span 
                    className="text-xl font-bold text-brand-purple-600"
                    key={metrics.costReduction.toFixed(0)}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {metrics.costReduction.toFixed(0)}%
                  </motion.span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tempo Economizado</span>
                  <motion.span 
                    className="text-xl font-bold text-brand-ocean-600"
                    key={metrics.timeSaved}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {metrics.timeSaved}h/sem
                  </motion.span>
                </div>
              </div>
            </Card>

            {/* Detalhes do Agente Selecionado */}
            <AnimatePresence>
              {selectedAgent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <Shield className="h-5 w-5 text-brand-sapphire-500 mr-2" />
                      {selectedAgent.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{selectedAgent.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Nível {selectedAgent.level}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        selectedAgent.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        selectedAgent.status === 'success' ? 'bg-green-100 text-green-700' :
                        selectedAgent.status === 'coordinating' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedAgent.status === 'processing' ? 'Processando' :
                         selectedAgent.status === 'success' ? 'Concluído' :
                         selectedAgent.status === 'coordinating' ? 'Coordenando' :
                         'Inativo'}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA */}
            <Card className="p-6 bg-gradient-to-br from-brand-sapphire-500 to-brand-emerald-500 text-white">
              <h3 className="text-lg font-semibold mb-2">Veja em Sua Empresa</h3>
              <p className="text-sm opacity-90 mb-4">
                Agende uma demonstração personalizada do sistema multiagente
              </p>
              <Button 
                variant="outline" 
                className="w-full border-white text-white hover:bg-white hover:text-brand-sapphire-600"
              >
                Consultoria Executiva
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
