'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Calendar, Hash, BarChart3, ChevronDown, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface FilterPanelProps {
  filters: {
    search: string
    types: string[]
    dateRange: { from: Date | null; to: Date | null }
    minConnections: number
    maxConnections: number
    concepts: string[]
  }
  updateFilter: (key: string, value: any) => void
  resetFilters: () => void
  availableConcepts: string[]
  nodeTypes: Array<{ type: string; count: number; color: string }>
  totalNodes: number
  filteredCount: number
}

export default function FilterPanel({
  filters,
  updateFilter,
  resetFilters,
  availableConcepts,
  nodeTypes,
  totalNodes,
  filteredCount,
}: FilterPanelProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    types: true,
    connections: false,
    concepts: false,
    date: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }))
  }

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type]
    updateFilter('types', newTypes)
  }

  const handleConceptToggle = (concept: string) => {
    const newConcepts = filters.concepts.includes(concept)
      ? filters.concepts.filter(c => c !== concept)
      : [...filters.concepts, concept]
    updateFilter('concepts', newConcepts)
  }

  const clearSearch = () => {
    updateFilter('search', '')
  }

  const hasActiveFilters = 
    filters.search ||
    filters.types.length > 0 ||
    filters.minConnections > 0 ||
    filters.maxConnections < 100 ||
    filters.concepts.length > 0 ||
    filters.dateRange.from ||
    filters.dateRange.to

  return (
    <Card className="h-full bg-slate-900/50 border-white/10 backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-gray-400 hover:text-white"
            >
              Limpar
            </Button>
          )}
        </div>
        
        {/* Results Summary */}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>
            {filteredCount} de {totalNodes} notas
          </span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">
              Filtrado
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
                  isSearchFocused ? 'text-purple-400' : 'text-gray-400'
                }`} />
                <Input
                  placeholder="Buscar notas, conceitos, caminhos..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-10 pr-10 bg-slate-800/50 border-white/10 text-white placeholder-gray-400"
                />
                {filters.search && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Node Types Filter */}
            <Collapsible open={expandedSections.types} onOpenChange={() => toggleSection('types')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Tipos de Nota
                    {filters.types.length > 0 && (
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">
                        {filters.types.length}
                      </Badge>
                    )}
                  </div>
                  {expandedSections.types ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                {nodeTypes.map(({ type, count, color }) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.types.includes(type)}
                      onCheckedChange={() => handleTypeToggle(type)}
                      className="border-white/20"
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="flex-1 flex items-center justify-between text-sm text-white cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="capitalize">{type}</span>
                      </div>
                      <span className="text-gray-400">{count}</span>
                    </label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Connections Filter */}
            <Collapsible open={expandedSections.connections} onOpenChange={() => toggleSection('connections')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Conexões
                    {(filters.minConnections > 0 || filters.maxConnections < 100) && (
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">
                        {filters.minConnections}-{filters.maxConnections}
                      </Badge>
                    )}
                  </div>
                  {expandedSections.connections ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Min: {filters.minConnections}</span>
                    <span>Max: {filters.maxConnections}</span>
                  </div>
                  <Slider
                    value={[filters.minConnections]}
                    onValueChange={([value]) => updateFilter('minConnections', value)}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <Slider
                    value={[filters.maxConnections]}
                    onValueChange={([value]) => updateFilter('maxConnections', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Top Concepts */}
            <Collapsible open={expandedSections.concepts} onOpenChange={() => toggleSection('concepts')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Conceitos Principais
                    {filters.concepts.length > 0 && (
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">
                        {filters.concepts.length}
                      </Badge>
                    )}
                  </div>
                  {expandedSections.concepts ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableConcepts.slice(0, 20).map((concept) => (
                    <div key={concept} className="flex items-center space-x-2">
                      <Checkbox
                        id={`concept-${concept}`}
                        checked={filters.concepts.includes(concept)}
                        onCheckedChange={() => handleConceptToggle(concept)}
                        className="border-white/20"
                      />
                      <label
                        htmlFor={`concept-${concept}`}
                        className="text-sm text-white cursor-pointer truncate flex-1"
                        title={concept}
                      >
                        {concept}
                      </label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Date Range Filter */}
            <Collapsible open={expandedSections.date} onOpenChange={() => toggleSection('date')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Período de Criação
                    {(filters.dateRange.from || filters.dateRange.to) && (
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">
                        Ativo
                      </Badge>
                    )}
                  </div>
                  {expandedSections.date ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                <div className="text-sm text-gray-400">
                  Filtro por data em desenvolvimento...
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}