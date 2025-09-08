'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Network, Hash, TrendingUp, Brain, GitBranch } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface StatsCardsProps {
  stats: {
    total_notes: number
    connections: number
    concepts_learned: number
    projects: number
    areas: number
    resources: number
    permanent_notes: number
    average_connections: number
    top_concepts: Array<{
      concept: string
      count: number
    }>
  }
  isLoading: boolean
}

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-slate-900/50 border-white/10 backdrop-blur animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-8 bg-slate-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const typeDistribution = [
    { name: 'Projects', value: stats.projects, color: '#8b5cf6' },
    { name: 'Areas', value: stats.areas, color: '#06b6d4' },
    { name: 'Resources', value: stats.resources, color: '#10b981' },
    { name: 'Permanent', value: stats.permanent_notes, color: '#f59e0b' },
  ]

  const topConceptsChart = stats.top_concepts?.slice(0, 8).map(concept => ({
    name: concept.concept.length > 15 ? concept.concept.substring(0, 15) + '...' : concept.concept,
    count: concept.count,
    fullName: concept.concept
  })) || []

  const connectivityScore = Math.min(100, (stats.average_connections * 20)) // Scale to 0-100

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur hover:bg-slate-800/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total de Notas</p>
                  <p className="text-3xl font-bold text-white">{stats.total_notes}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={75} className="h-2" />
                <p className="text-xs text-gray-400 mt-2">75% do objetivo anual</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur hover:bg-slate-800/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conexões</p>
                  <p className="text-3xl font-bold text-white">{stats.connections}</p>
                </div>
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <Network className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Média:</span>
                  <Badge variant="outline" className="bg-cyan-500/20 text-cyan-200 border-cyan-500/30">
                    {stats.average_connections.toFixed(1)} por nota
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur hover:bg-slate-800/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conceitos</p>
                  <p className="text-3xl font-bold text-white">{stats.concepts_learned}</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <Hash className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400">+12% esta semana</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur hover:bg-slate-800/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conectividade</p>
                  <p className="text-3xl font-bold text-white">{connectivityScore.toFixed(0)}%</p>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <Brain className="h-6 w-6 text-amber-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={connectivityScore} className="h-2" />
                <p className="text-xs text-gray-400 mt-2">
                  {connectivityScore >= 80 ? 'Excelente' : connectivityScore >= 60 ? 'Boa' : 'Regular'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Distribuição por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {typeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                {typeDistribution.map((type) => (
                  <div key={type.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-sm text-gray-300">{type.name}</span>
                    <Badge variant="outline" className="ml-auto bg-slate-800/50">
                      {type.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Concepts Chart */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Conceitos Mais Usados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topConceptsChart} margin={{ left: 0, right: 0, top: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Bar 
                      dataKey="count" 
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <motion.div variants={itemVariants}>
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.projects}</div>
                <div className="text-sm text-gray-400">Projetos Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{stats.areas}</div>
                <div className="text-sm text-gray-400">Áreas de Foco</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{stats.resources}</div>
                <div className="text-sm text-gray-400">Recursos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">{stats.permanent_notes}</div>
                <div className="text-sm text-gray-400">Notas Permanentes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}