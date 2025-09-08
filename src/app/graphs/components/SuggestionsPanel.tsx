'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Lightbulb, 
  ArrowRight, 
  Clock, 
  GitMerge, 
  MapPin, 
  Sparkles,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface SuggestionsPanelProps {
  suggestions: {
    orphaned_notes?: string[]
    potential_connections?: Array<{
      from: string
      to: string
      similarity: number
      reason: string
    }>
    learning_paths?: Array<{
      name: string
      nodes: string[]
      description: string
    }>
  }
  onNodeSelect: (nodeId: string) => void
  isLoading: boolean
}

export default function SuggestionsPanel({
  suggestions,
  onNodeSelect,
  isLoading
}: SuggestionsPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    connections: true,
    orphaned: false,
    paths: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }))
  }

  if (isLoading) {
    return (
      <Card className="h-full bg-slate-900/50 border-white/10 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Sugestões Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalSuggestions = (suggestions.potential_connections?.length || 0) + 
                           (suggestions.orphaned_notes?.length || 0) + 
                           (suggestions.learning_paths?.length || 0)

  return (
    <Card className="h-full bg-slate-900/50 border-white/10 backdrop-blur">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Sugestões Inteligentes
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          <span>{totalSuggestions} sugestões encontradas</span>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {/* Potential Connections */}
            {suggestions.potential_connections && suggestions.potential_connections.length > 0 && (
              <Collapsible open={expandedSections.connections} onOpenChange={() => toggleSection('connections')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                    <div className="flex items-center gap-2">
                      <GitMerge className="h-4 w-4 text-cyan-400" />
                      <span>Conexões Sugeridas</span>
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-200">
                        {suggestions.potential_connections.length}
                      </Badge>
                    </div>
                    {expandedSections.connections ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-3">
                  {suggestions.potential_connections.slice(0, 5).map((connection, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/30 rounded-lg p-4 border border-white/10 hover:border-cyan-500/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg flex-shrink-0">
                          <ArrowRight className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onNodeSelect(connection.from)}
                              className="text-xs text-white hover:text-cyan-400 p-0 h-auto font-mono"
                            >
                              {connection.from.substring(0, 8)}...
                            </Button>
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onNodeSelect(connection.to)}
                              className="text-xs text-white hover:text-cyan-400 p-0 h-auto font-mono"
                            >
                              {connection.to.substring(0, 8)}...
                            </Button>
                          </div>
                          
                          <p className="text-sm text-gray-300 mb-3">
                            {connection.reason}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">Similaridade:</span>
                              <Progress 
                                value={connection.similarity * 100} 
                                className="w-16 h-2"
                              />
                              <span className="text-xs text-cyan-400">
                                {(connection.similarity * 100).toFixed(0)}%
                              </span>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-cyan-400 hover:text-cyan-300 p-0 h-auto"
                            >
                              Aplicar
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {suggestions.potential_connections.length > 5 && (
                    <div className="text-center">
                      <Button variant="ghost" size="sm" className="text-cyan-400">
                        Ver mais {suggestions.potential_connections.length - 5} sugestões
                      </Button>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Orphaned Notes */}
            {suggestions.orphaned_notes && suggestions.orphaned_notes.length > 0 && (
              <Collapsible open={expandedSections.orphaned} onOpenChange={() => toggleSection('orphaned')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-400" />
                      <span>Notas Órfãs</span>
                      <Badge variant="secondary" className="bg-amber-500/20 text-amber-200">
                        {suggestions.orphaned_notes.length}
                      </Badge>
                    </div>
                    {expandedSections.orphaned ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-3">
                  <div className="text-sm text-gray-400 mb-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    Estas notas não possuem conexões e podem precisar de mais contexto:
                  </div>
                  {suggestions.orphaned_notes.slice(0, 6).map((noteId, index) => (
                    <motion.div
                      key={noteId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => onNodeSelect(noteId)}
                        className="w-full justify-between text-left bg-slate-800/30 hover:bg-slate-700/50 border border-white/10 hover:border-amber-500/30"
                      >
                        <span className="text-white font-mono text-sm truncate">
                          {noteId.substring(0, 12)}...
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-amber-500/20 text-amber-200 border-amber-500/30 text-xs">
                            Órfã
                          </Badge>
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                  
                  {suggestions.orphaned_notes.length > 6 && (
                    <div className="text-center pt-2">
                      <span className="text-xs text-gray-400">
                        +{suggestions.orphaned_notes.length - 6} notas órfãs adicionais
                      </span>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Learning Paths */}
            {suggestions.learning_paths && suggestions.learning_paths.length > 0 && (
              <Collapsible open={expandedSections.paths} onOpenChange={() => toggleSection('paths')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-purple-400" />
                      <span>Trilhas de Aprendizado</span>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">
                        {suggestions.learning_paths.length}
                      </Badge>
                    </div>
                    {expandedSections.paths ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-3">
                  {suggestions.learning_paths.map((path, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/30 rounded-lg p-4 border border-white/10 hover:border-purple-500/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                          <MapPin className="h-4 w-4 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-2">{path.name}</h4>
                          <p className="text-sm text-gray-300 mb-3">{path.description}</p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400">Caminho:</span>
                            <Badge variant="outline" className="text-xs">
                              {path.nodes.length} etapas
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {path.nodes.slice(0, 4).map((nodeId, nodeIndex) => (
                              <Button
                                key={nodeId}
                                variant="ghost"
                                size="sm"
                                onClick={() => onNodeSelect(nodeId)}
                                className="text-xs text-purple-400 hover:text-purple-300 p-1 h-auto font-mono"
                              >
                                {nodeIndex + 1}. {nodeId.substring(0, 6)}...
                              </Button>
                            ))}
                            {path.nodes.length > 4 && (
                              <span className="text-xs text-gray-400 px-2 py-1">
                                +{path.nodes.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Empty State */}
            {totalSuggestions === 0 && (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">Nenhuma sugestão disponível</h3>
                <p className="text-sm text-gray-400">
                  Continue explorando o grafo para descobrir novas conexões
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}