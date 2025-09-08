'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Calendar, 
  Hash, 
  Link, 
  BarChart3, 
  ExternalLink,
  FolderOpen,
  TrendingUp,
  Heart,
  Meh,
  Frown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

interface NodeDetailsProps {
  selectedNodeId: string | null
  nodeData: any
  connections: string[]
  onNodeSelect: (nodeId: string) => void
}

export default function NodeDetails({ 
  selectedNodeId, 
  nodeData,
  connections,
  onNodeSelect 
}: NodeDetailsProps) {
  if (!selectedNodeId || !nodeData) {
    return (
      <Card className="h-full bg-slate-900/50 border-white/10 backdrop-blur">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Selecione uma nota no grafo</p>
            <p className="text-sm mt-2">para ver os detalhes</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      project: '🎯',
      area: '📂',
      resource: '📚',
      permanent: '💎',
      reference: '📝'
    }
    return icons[type as keyof typeof icons] || '📄'
  }

  const getTypeColor = (type: string) => {
    const colors = {
      project: 'bg-purple-500/20 text-purple-200 border-purple-500/30',
      area: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/30',
      resource: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
      permanent: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
      reference: 'bg-gray-500/20 text-gray-200 border-gray-500/30'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-200 border-gray-500/30'
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Heart className="h-4 w-4 text-green-400" />
      case 'negative': return <Frown className="h-4 w-4 text-red-400" />
      default: return <Meh className="h-4 w-4 text-gray-400" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedNodeId}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Card className="h-full bg-slate-900/50 border-white/10 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{getTypeIcon(nodeData.type)}</div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-white text-lg leading-tight mb-2">
                  {nodeData.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(nodeData.type)}>
                    {nodeData.type}
                  </Badge>
                  {nodeData.sentiment && (
                    <div className="flex items-center gap-1">
                      {getSentimentIcon(nodeData.sentiment.sentiment)}
                      <span className="text-xs text-gray-400">
                        {(nodeData.sentiment.polarity * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-6">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Link className="h-4 w-4" />
                      <span className="text-sm font-medium">Conexões</span>
                    </div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {connections.length}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-purple-400">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-sm font-medium">Tamanho</span>
                    </div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {formatFileSize(nodeData.size)}
                    </div>
                  </div>
                </div>

                {/* File Info */}
                <div className="space-y-3">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    Informações do Arquivo
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Caminho:</span>
                      <span className="text-white font-mono text-xs truncate ml-2" title={nodeData.path}>
                        {nodeData.path}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Criado em:</span>
                      <span className="text-white">
                        {formatDate(nodeData.created)}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Concepts */}
                {nodeData.concepts && nodeData.concepts.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Conceitos ({nodeData.concepts.length})
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {nodeData.concepts.slice(0, 10).map((concept: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-slate-800/50 border-white/20 text-gray-300 hover:bg-white/10 transition-colors"
                        >
                          {concept}
                        </Badge>
                      ))}
                      {nodeData.concepts.length > 10 && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-slate-800/50 border-white/20 text-gray-400"
                        >
                          +{nodeData.concepts.length - 10} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Separator className="bg-white/10" />

                {/* Connections */}
                {connections.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      Conexões Diretas ({connections.length})
                    </h3>
                    
                    <div className="space-y-2">
                      {connections.slice(0, 8).map((connectionId: string) => {
                        // This would need to be populated with actual connection data
                        return (
                          <Button
                            key={connectionId}
                            variant="ghost"
                            className="w-full justify-start text-left h-auto p-2 bg-slate-800/30 hover:bg-slate-700/50 border border-white/10"
                            onClick={() => onNodeSelect(connectionId)}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <div className="w-2 h-2 rounded-full bg-gray-400" />
                              <span className="text-sm text-white truncate">
                                {connectionId.substring(0, 12)}...
                              </span>
                              <ExternalLink className="h-3 w-3 text-gray-400 ml-auto flex-shrink-0" />
                            </div>
                          </Button>
                        )
                      })}
                      
                      {connections.length > 8 && (
                        <div className="text-xs text-gray-400 text-center py-2">
                          +{connections.length - 8} conexões adicionais
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sentiment Analysis */}
                {nodeData.sentiment && (
                  <>
                    <Separator className="bg-white/10" />
                    <div className="space-y-3">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Análise de Sentimento
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Polaridade:</span>
                          <div className="flex items-center gap-2">
                            {getSentimentIcon(nodeData.sentiment.sentiment)}
                            <span className="text-white">
                              {(nodeData.sentiment.polarity * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        
                        <Progress 
                          value={((nodeData.sentiment.polarity + 1) / 2) * 100} 
                          className="h-2"
                        />
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Subjetividade:</span>
                          <span className="text-white">
                            {(nodeData.sentiment.subjectivity * 100).toFixed(1)}%
                          </span>
                        </div>
                        
                        <Progress 
                          value={nodeData.sentiment.subjectivity * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}