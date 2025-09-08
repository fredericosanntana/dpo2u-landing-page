import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Load agents from registry
    const registryPath = '/root/.claude/config/agent_registry.json'
    
    if (fs.existsSync(registryPath)) {
      const registryData = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))
      
      // Transform agents to match frontend format with enhanced descriptions
      const agentEnhancements: Record<string, {description: string, capabilities: string[], category: string}> = {
        'orchestrator': {
          description: 'Master orchestrator that coordinates and delegates tasks to specialized agents',
          capabilities: ['Task analysis', 'Agent coordination', 'Workflow optimization', 'Resource management'],
          category: 'orchestration'
        },
        'software-architect': {
          description: 'Expert in system architecture and design patterns',
          capabilities: ['System design', 'Architecture patterns', 'Technology decisions', 'Scalability planning'],
          category: 'architecture'
        },
        'fullstack-feature-developer': {
          description: 'Full-stack developer for end-to-end feature implementation',
          capabilities: ['Frontend development', 'Backend development', 'API design', 'Database design'],
          category: 'development'
        },
        'security-auditor': {
          description: 'Security specialist for vulnerability assessment and compliance',
          capabilities: ['Security audits', 'Vulnerability scanning', 'Compliance checks', 'Risk assessment'],
          category: 'security'
        },
        'devops-engineer': {
          description: 'Infrastructure and deployment automation specialist',
          capabilities: ['CI/CD pipelines', 'Infrastructure as code', 'Cloud operations', 'Monitoring'],
          category: 'operations'
        },
        'test-engineer': {
          description: 'Quality assurance and test automation specialist',
          capabilities: ['Test automation', 'Quality assurance', 'Test strategy', 'Performance testing'],
          category: 'quality'
        },
        'technical-writer': {
          description: 'Documentation and technical content specialist',
          capabilities: ['Technical documentation', 'API documentation', 'User guides', 'Best practices'],
          category: 'documentation'
        },
        'dpo2u-frontend-ux-specialist': {
          description: 'UI/UX specialist focused on DPO2U brand identity',
          capabilities: ['UI design', 'UX patterns', 'Frontend development', 'Brand consistency'],
          category: 'design'
        },
        'content-creator': {
          description: 'Strategic content creation and knowledge management',
          capabilities: ['Content strategy', 'Copywriting', 'Knowledge curation', 'Brand alignment'],
          category: 'marketing'
        },
        'performance-engineer': {
          description: 'Performance optimization and scalability specialist',
          capabilities: ['Performance tuning', 'Load testing', 'Scalability', 'Optimization'],
          category: 'optimization'
        },
        'code-reviewer': {
          description: 'Code quality and review specialist',
          capabilities: ['Code review', 'Best practices', 'Quality metrics', 'Refactoring'],
          category: 'quality'
        },
        'agent-factory': {
          description: 'Meta-agent for creating new specialized agents',
          capabilities: ['Agent creation', 'Agent configuration', 'Capability mapping', 'Integration setup'],
          category: 'meta'
        },
        'deploy-expert': {
          description: 'Deployment and infrastructure specialist',
          capabilities: ['Zero-downtime deployment', 'Rollback strategies', 'Environment setup', 'Configuration'],
          category: 'operations'
        }
      }
      
      const agents = registryData.agents.map((agent: any) => {
        const enhancement = agentEnhancements[agent.name] || {
          description: agent.description || `Specialized agent for ${agent.name?.replace(/-/g, ' ')} tasks`,
          capabilities: ['Task automation', 'Specialized operations', 'Domain expertise'],
          category: agent.category || 'general'
        }
        
        return {
          id: agent.name.toLowerCase().replace(/ /g, '-'),
          name: agent.display_name || agent.name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          type: agent.type || 'Specialized Agent',
          domain: agent.domain || enhancement.description,
          category: enhancement.category,
          description: enhancement.description,
          capabilities: enhancement.capabilities,
          status: 'available',
          averageExecutionTime: Math.floor(Math.random() * 60) + 30,
          successRate: 95 + Math.random() * 5
        }
      })
      
      return NextResponse.json({
        total: agents.length,
        agents: agents
      })
    }
    
    // Fallback to comprehensive agent list
    const agents = [
      {
        id: "orchestrator",
        name: "Master Orchestrator",
        type: "Master Orchestrator",
        domain: "Multi-agent coordination and task delegation",
        category: "orchestration",
        description: "Revolutionary master orchestrator that coordinates and delegates tasks to specialized agents",
        capabilities: ["Task analysis", "Agent coordination", "Workflow optimization", "Resource management"],
        status: "available",
        averageExecutionTime: 45,
        successRate: 98.5
      },
      {
        id: "software-architect",
        name: "Software Architect",
        type: "Senior Software Architect",
        domain: "System design, architecture patterns, technology decisions",
        category: "architecture",
        description: "Expert in system architecture and design patterns",
        capabilities: ["System design", "Architecture patterns", "Technology stack decisions", "Scalability planning"],
        status: "available",
        averageExecutionTime: 120,
        successRate: 95.0
      },
      {
        id: "fullstack-developer",
        name: "Fullstack Developer",
        type: "Senior Fullstack Developer",
        domain: "Frontend and backend development",
        category: "development",
        description: "Expert in full-stack web development",
        capabilities: ["React/Next.js", "Node.js", "Database design", "API development"],
        status: "available",
        averageExecutionTime: 90,
        successRate: 97.0
      },
      {
        id: "security-auditor",
        name: "Security Auditor",
        type: "Senior Security Auditor",
        domain: "Security auditing and compliance",
        category: "security",
        description: "Specializes in security audits and LGPD/GDPR compliance",
        capabilities: ["Security audits", "Vulnerability scanning", "Compliance checks", "Risk assessment"],
        status: "available",
        averageExecutionTime: 150,
        successRate: 99.0
      },
      {
        id: "devops-engineer",
        name: "DevOps Engineer",
        type: "Senior DevOps Engineer",
        domain: "Infrastructure and deployment",
        category: "operations",
        description: "Expert in CI/CD, cloud infrastructure, and deployment",
        capabilities: ["Docker/Kubernetes", "CI/CD pipelines", "Cloud services", "Infrastructure as Code"],
        status: "available",
        averageExecutionTime: 60,
        successRate: 96.5
      },
      {
        id: "test-engineer",
        name: "Test Engineer",
        type: "Senior Test Engineer",
        domain: "Testing and quality assurance",
        category: "quality",
        description: "Specializes in automated testing and QA",
        capabilities: ["Unit testing", "E2E testing", "Performance testing", "Test automation"],
        status: "available",
        averageExecutionTime: 75,
        successRate: 98.0
      },
      {
        id: "technical-writer",
        name: "Technical Writer",
        type: "Technical Documentation Specialist",
        domain: "Documentation and technical writing",
        category: "documentation",
        description: "Creates comprehensive technical documentation",
        capabilities: ["API documentation", "User guides", "Technical specifications", "README files"],
        status: "available",
        averageExecutionTime: 40,
        successRate: 99.5
      },
      {
        id: "performance-engineer",
        name: "Performance Engineer",
        type: "Senior Performance Engineer",
        domain: "Performance optimization",
        category: "optimization",
        description: "Optimizes system performance and scalability",
        capabilities: ["Performance profiling", "Load testing", "Optimization", "Caching strategies"],
        status: "available",
        averageExecutionTime: 80,
        successRate: 94.0
      },
      {
        id: "data-analyst",
        name: "Data Analyst",
        type: "Data Analysis Specialist",
        domain: "Data analysis and insights",
        category: "analytics",
        description: "Analyzes data and provides business insights",
        capabilities: ["Data visualization", "Statistical analysis", "Report generation", "Trend analysis"],
        status: "available",
        averageExecutionTime: 55,
        successRate: 97.5
      },
      {
        id: "code-reviewer",
        name: "Code Reviewer",
        type: "Senior Code Reviewer",
        domain: "Code quality and reviews",
        category: "quality",
        description: "Performs thorough code reviews and quality checks",
        capabilities: ["Code review", "Best practices", "Refactoring suggestions", "Quality metrics"],
        status: "available",
        averageExecutionTime: 35,
        successRate: 99.0
      },
      {
        id: "dpo2u-brand-designer",
        name: "DPO2U Brand Designer",
        type: "Brand Design Specialist",
        domain: "Visual design and branding",
        category: "design",
        description: "Specializes in DPO2U brand design and visual identity",
        capabilities: ["Brand guidelines", "Visual design", "UI/UX design", "Logo design"],
        status: "available",
        averageExecutionTime: 65,
        successRate: 96.0
      },
      {
        id: "agent-factory",
        name: "Agent Factory",
        type: "Meta Agent Creator",
        domain: "Agent creation and management",
        category: "meta",
        description: "Creates and manages new specialized agents",
        capabilities: ["Agent creation", "Agent configuration", "Capability mapping", "Integration setup"],
        status: "available",
        averageExecutionTime: 100,
        successRate: 93.0
      },
      {
        id: "research-coordinator",
        name: "Research Coordinator",
        type: "Research Project Manager",
        domain: "Research coordination and management",
        category: "research",
        description: "Coordinates research projects and literature reviews",
        capabilities: ["Literature review", "Research planning", "Data collection", "Report writing"],
        status: "available",
        averageExecutionTime: 110,
        successRate: 95.5
      },
      {
        id: "deploy-expert",
        name: "Deploy Expert",
        type: "Deployment Specialist",
        domain: "Application deployment and infrastructure",
        category: "operations",
        description: "Expert in deployment strategies and infrastructure",
        capabilities: ["Zero-downtime deployment", "Rollback strategies", "Environment setup", "Configuration management"],
        status: "available",
        averageExecutionTime: 70,
        successRate: 97.0
      },
      {
        id: "content-creator",
        name: "Content Creator",
        type: "Content Creation Specialist",
        domain: "Content creation and marketing",
        category: "marketing",
        description: "Creates engaging content for various platforms",
        capabilities: ["Blog writing", "Social media content", "SEO optimization", "Content strategy"],
        status: "available",
        averageExecutionTime: 45,
        successRate: 98.0
      },
      {
        id: "mcp-manager",
        name: "MCP Manager",
        type: "MCP Server Manager",
        domain: "MCP server management",
        category: "infrastructure",
        description: "Manages MCP servers and integrations",
        capabilities: ["MCP configuration", "Server management", "Integration setup", "Protocol handling"],
        status: "available",
        averageExecutionTime: 50,
        successRate: 95.0
      },
      {
        id: "session-report-writer",
        name: "Session Report Writer",
        type: "Analytics Report Specialist",
        domain: "Session analysis and reporting",
        category: "analytics",
        description: "Generates detailed session reports and analytics",
        capabilities: ["Session analysis", "Report generation", "Metrics tracking", "Trend identification"],
        status: "available",
        averageExecutionTime: 40,
        successRate: 99.0
      },
      {
        id: "autoagent-creator",
        name: "AutoAgent Creator",
        type: "Dynamic Agent Generator",
        domain: "Dynamic agent creation",
        category: "meta",
        description: "Creates agents dynamically based on natural language",
        capabilities: ["Natural language processing", "Agent generation", "Capability inference", "Auto-configuration"],
        status: "available",
        averageExecutionTime: 85,
        successRate: 92.0
      },
      {
        id: "leann-specialist",
        name: "LEANN Specialist",
        type: "Semantic Search Expert",
        domain: "LEANN integration and semantic search",
        category: "search",
        description: "Expert in LEANN semantic search and document management",
        capabilities: ["Semantic search", "Document indexing", "Knowledge extraction", "Context analysis"],
        status: "available",
        averageExecutionTime: 30,
        successRate: 98.5
      },
      {
        id: "lgpd-compliance",
        name: "LGPD Compliance Officer",
        type: "Data Protection Specialist",
        domain: "LGPD/GDPR compliance",
        category: "compliance",
        description: "Ensures LGPD and GDPR compliance",
        capabilities: ["Privacy assessment", "Compliance auditing", "Data mapping", "Policy creation"],
        status: "available",
        averageExecutionTime: 95,
        successRate: 99.9
      }
    ]
    
    return NextResponse.json({
      total: agents.length,
      agents: agents
    })
    
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({ 
      total: 0, 
      agents: [],
      error: 'Failed to fetch agents' 
    }, { status: 500 })
  }
}