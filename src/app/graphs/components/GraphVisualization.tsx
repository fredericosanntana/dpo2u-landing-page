'use client'

import React, { useRef, useCallback, useEffect, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface GraphVisualizationProps {
  data: {
    nodes: Array<{
      id: string
      title: string
      type: string
      concepts: string[]
      path: string
      size: number
      connectionsCount: number
      val: number
      color: string
    }>
    links: Array<{
      source: string
      target: string
      value: number
    }>
  }
  selectedNode: string | null
  hoveredNode: string | null
  highlightNodes: Set<string>
  highlightLinks: Set<string>
  onNodeClick: (nodeId: string) => void
  onNodeHover: (nodeId: string | null) => void
  onBackgroundClick: () => void
}

export default function GraphVisualization({
  data,
  selectedNode,
  hoveredNode,
  highlightNodes,
  highlightLinks,
  onNodeClick,
  onNodeHover,
  onBackgroundClick,
}: GraphVisualizationProps) {
  const fgRef = useRef<any>()
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('graph-container')
      if (container) {
        const rect = container.getBoundingClientRect()
        setDimensions({
          width: rect.width,
          height: Math.max(600, rect.height)
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const handleNodeClick = useCallback((node: any) => {
    onNodeClick(node.id)
    
    // Center on node with animation
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000)
      fgRef.current.zoom(2, 1000)
    }
  }, [onNodeClick])

  const handleNodeHover = useCallback((node: any) => {
    onNodeHover(node ? node.id : null)
  }, [onNodeHover])

  const handleBackgroundClick = useCallback(() => {
    onBackgroundClick()
  }, [onBackgroundClick])

  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.title || node.id
    const fontSize = Math.max(2, 12 / globalScale)
    ctx.font = `${fontSize}px Inter, sans-serif`

    // Node styling based on state
    const isHighlighted = highlightNodes.has(node.id)
    const isSelected = selectedNode === node.id
    const isHovered = hoveredNode === node.id
    
    let nodeColor = node.color
    let nodeSize = node.val || 4
    let alpha = 0.8

    if (highlightNodes.size > 0) {
      alpha = isHighlighted ? 1 : 0.3
    }
    
    if (isSelected) {
      nodeSize *= 1.5
      alpha = 1
    } else if (isHovered) {
      nodeSize *= 1.2
      alpha = 0.9
    }

    // Draw node
    ctx.globalAlpha = alpha
    ctx.fillStyle = nodeColor
    ctx.beginPath()
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI)
    ctx.fill()

    // Draw border for selected/hovered nodes
    if (isSelected || isHovered) {
      ctx.strokeStyle = isSelected ? '#ffffff' : '#e5e7eb'
      ctx.lineWidth = isSelected ? 3 : 2
      ctx.stroke()
    }

    // Draw node type indicator
    const typeColor = {
      project: '#8b5cf6',
      area: '#06b6d4', 
      resource: '#10b981',
      permanent: '#f59e0b',
      reference: '#6b7280'
    }[node.type] || '#6b7280'

    ctx.fillStyle = typeColor
    ctx.beginPath()
    ctx.arc(node.x + nodeSize * 0.6, node.y - nodeSize * 0.6, nodeSize * 0.3, 0, 2 * Math.PI)
    ctx.fill()

    // Draw label
    if (globalScale >= 1.5 || isSelected || isHovered) {
      const textWidth = ctx.measureText(label).width
      const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2)
      
      ctx.globalAlpha = 0.8
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y + nodeSize + 2,
        bckgDimensions[0],
        bckgDimensions[1]
      )
      
      ctx.globalAlpha = 1
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        label,
        node.x,
        node.y + nodeSize + 2 + bckgDimensions[1] / 2
      )
    }

    ctx.globalAlpha = 1
  }, [highlightNodes, selectedNode, hoveredNode])

  const linkCanvasObject = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    const isHighlighted = highlightLinks.has(`${link.source.id}-${link.target.id}`)
    
    let alpha = 0.4
    let width = 1
    
    if (highlightLinks.size > 0) {
      alpha = isHighlighted ? 0.8 : 0.1
      width = isHighlighted ? 2 : 1
    }

    ctx.globalAlpha = alpha
    ctx.strokeStyle = isHighlighted ? '#8b5cf6' : '#64748b'
    ctx.lineWidth = width
    
    ctx.beginPath()
    ctx.moveTo(link.source.x, link.source.y)
    ctx.lineTo(link.target.x, link.target.y)
    ctx.stroke()

    ctx.globalAlpha = 1
  }, [highlightLinks])

  const zoomIn = () => {
    if (fgRef.current) {
      fgRef.current.zoom(fgRef.current.zoom() * 1.5, 300)
    }
  }

  const zoomOut = () => {
    if (fgRef.current) {
      fgRef.current.zoom(fgRef.current.zoom() * 0.75, 300)
    }
  }

  const fitToScreen = () => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 50)
    }
  }

  const resetView = () => {
    if (fgRef.current) {
      fgRef.current.centerAt(0, 0, 1000)
      fgRef.current.zoom(1, 1000)
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* Graph Container */}
      <div 
        id="graph-container" 
        className={`relative overflow-hidden rounded-lg border border-white/10 bg-slate-900/20 backdrop-blur ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-full'
        }`}
      >
        <ForceGraph2D
          ref={fgRef}
          graphData={data}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="transparent"
          nodeCanvasObject={nodeCanvasObject}
          linkCanvasObject={linkCanvasObject}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onBackgroundClick={handleBackgroundClick}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
        />

        {/* Graph Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={zoomIn}
                  className="bg-white/10 hover:bg-white/20 border-white/10"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={zoomOut}
                  className="bg-white/10 hover:bg-white/20 border-white/10"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={fitToScreen}
                  className="bg-white/10 hover:bg-white/20 border-white/10"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fit to Screen</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={resetView}
                  className="bg-white/10 hover:bg-white/20 border-white/10"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Graph Info */}
        <div className="absolute bottom-4 left-4">
          <Card className="bg-black/50 border-white/10 backdrop-blur">
            <div className="p-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="text-white">
                  <span className="font-medium">{data.nodes.length}</span> nodes
                </div>
                <div className="text-white">
                  <span className="font-medium">{data.links.length}</span> connections
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-xs text-gray-300">Project</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <span className="text-xs text-gray-300">Area</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-gray-300">Resource</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-gray-300">Permanent</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}