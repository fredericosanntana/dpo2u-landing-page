'use client'

import React, { useState, useCallback, useMemo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
// import { 
//   Sidebar, 
//   Panel,
//   PanelGroup,
//   PanelResizeHandle 
// } from 'react-resizable-panels'
import { 
  Brain, 
  BarChart3, 
  Settings,
  Menu,
  X,
  RefreshCw,
  Maximize2,
  Download,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useGraphData, useGraphFilters, useNodeSelection } from '@/hooks/useGraphData'

// Dynamic imports to prevent SSR issues
const GraphVisualization = dynamic(() => import('./components/GraphVisualization'), { 
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-slate-900/20 rounded-lg border border-white/10">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white">Carregando visualização...</p>
      </div>
    </div>
  )
})

import FilterPanel from './components/FilterPanel'
import NodeDetails from './components/NodeDetails'
import StatsCards from './components/StatsCards'
import SuggestionsPanel from './components/SuggestionsPanel'

export default function GraphsPage() {
  const [activeTab, setActiveTab] = useState('graph')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Data hooks
  const {
    graphData,
    rawGraphData,
    statsData,
    suggestionsData,
    graphLoading,
    statsLoading,
    suggestionsLoading,
    refreshData
  } = useGraphData()

  // Filters hook
  const { filters, filteredData, updateFilter, resetFilters } = useGraphFilters(rawGraphData)

  // Selection hook
  const {
    selectedNode,
    hoveredNode,
    highlightNodes,
    highlightLinks,
    selectNode,
    hoverNode,
    updateHighlights,
    clearSelection
  } = useNodeSelection()

  // Prepare data for components
  const nodeTypes = useMemo(() => {
    if (!rawGraphData?.nodes) return []
    
    const typeCounts: Record<string, number> = {}
    Object.values(rawGraphData.nodes).forEach(node => {
      typeCounts[node.type] = (typeCounts[node.type] || 0) + 1
    })

    const typeColors = {
      project: '#8b5cf6',
      area: '#06b6d4',
      resource: '#10b981',
      permanent: '#f59e0b',
      reference: '#6b7280'
    }

    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      color: typeColors[type as keyof typeof typeColors] || '#6b7280'
    }))
  }, [rawGraphData])

  const availableConcepts = useMemo(() => {
    if (!rawGraphData?.nodes) return []
    
    const conceptCounts: Record<string, number> = {}
    Object.values(rawGraphData.nodes).forEach(node => {
      node.concepts.forEach(concept => {
        conceptCounts[concept] = (conceptCounts[concept] || 0) + 1
      })
    })

    return Object.entries(conceptCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([concept]) => concept)
  }, [rawGraphData])

  // Handle node interactions
  const handleNodeClick = useCallback((nodeId: string) => {
    selectNode(nodeId)
    
    if (rawGraphData?.nodes[nodeId]) {
      const node = rawGraphData.nodes[nodeId]
      const connectedNodes = new Set([nodeId, ...node.connections])
      const connectedLinks = new Set<string>()
      
      node.connections.forEach(targetId => {
        connectedLinks.add(`${nodeId}-${targetId}`)
        connectedLinks.add(`${targetId}-${nodeId}`)
      })
      
      updateHighlights(connectedNodes, connectedLinks)
    }
  }, [selectNode, rawGraphData, updateHighlights])

  const handleNodeHover = useCallback((nodeId: string | null) => {
    hoverNode(nodeId)
  }, [hoverNode])

  const handleBackgroundClick = useCallback(() => {
    clearSelection()
  }, [clearSelection])

  const selectedNodeData = selectedNode && rawGraphData?.nodes[selectedNode] 
    ? rawGraphData.nodes[selectedNode] 
    : null

  const selectedNodeConnections = selectedNodeData ? selectedNodeData.connections : []

  // Actions
  const handleRefresh = () => {
    refreshData()
  }

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log('Exporting graph data...')
  }

  const handleShare = () => {
    // Share functionality would be implemented here
    navigator.clipboard.writeText(window.location.href)
  }

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="p-4 border-b border-white/10">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="filters" className="text-xs">Filtros</TabsTrigger>
            <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
            <TabsTrigger value="suggestions" className="text-xs">IA</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="filters" className="h-full m-0">
            <FilterPanel
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
              availableConcepts={availableConcepts}
              nodeTypes={nodeTypes}
              totalNodes={graphData.nodes.length}
              filteredCount={filteredData.nodes.length}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="h-full m-0 p-4">
            <div className="h-full overflow-y-auto">
              <StatsCards 
                stats={statsData || {
                  total_notes: 0,
                  connections: 0,
                  concepts_learned: 0,
                  projects: 0,
                  areas: 0,
                  resources: 0,
                  permanent_notes: 0,
                  average_connections: 0,
                  top_concepts: []
                }}
                isLoading={statsLoading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="suggestions" className="h-full m-0">
            <SuggestionsPanel
              suggestions={suggestionsData || {}}
              onNodeSelect={handleNodeClick}
              isLoading={suggestionsLoading}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 border-b border-white/10 bg-slate-900/50 backdrop-blur"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Brain className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Zettelkasten Knowledge Graph
                    </h1>
                    <p className="text-sm text-gray-400">
                      Explore conexões de conhecimento em tempo real
                    </p>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-200 border-purple-500/30">
                    {filteredData.nodes.length} notas
                  </Badge>
                  <Badge variant="outline" className="bg-cyan-500/20 text-cyan-200 border-cyan-500/30">
                    {filteredData.links.length} conexões
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRefresh}
                      disabled={graphLoading}
                      className="text-gray-400 hover:text-white"
                    >
                      <RefreshCw className={`h-4 w-4 ${graphLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Atualizar dados</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                      className="text-gray-400 hover:text-white"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Compartilhar</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleExport}
                      className="text-gray-400 hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Exportar</TooltipContent>
                </Tooltip>

                {/* Mobile menu button */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden text-gray-400 hover:text-white"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 bg-slate-900/95 border-white/10">
                    {sidebarContent}
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-0 h-[calc(100vh-80px)]"
        >
          <div className="flex h-full">
            {/* Left Sidebar - Desktop only */}
            <div className="hidden md:block w-80 border-r border-white/10 flex-shrink-0">
              {sidebarContent}
            </div>

            {/* Graph Visualization */}
            <div className="flex-1 p-4">
              <GraphVisualization
                data={filteredData}
                selectedNode={selectedNode}
                hoveredNode={hoveredNode}
                highlightNodes={highlightNodes}
                highlightLinks={highlightLinks}
                onNodeClick={handleNodeClick}
                onNodeHover={handleNodeHover}
                onBackgroundClick={handleBackgroundClick}
              />
            </div>

            {/* Right Panel - Node Details */}
            <div className="w-80 border-l border-white/10 p-4 flex-shrink-0">
              <NodeDetails
                selectedNodeId={selectedNode}
                nodeData={selectedNodeData}
                connections={selectedNodeConnections}
                onNodeSelect={handleNodeClick}
              />
            </div>
          </div>
        </motion.main>

        {/* Loading Overlay */}
        <AnimatePresence>
          {graphLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur z-50 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white">Carregando grafo de conhecimento...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}