'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import useSWR from 'swr'

export interface GraphNode {
  id: string
  title: string
  type: 'project' | 'area' | 'resource' | 'permanent' | 'reference'
  concepts: string[]
  connections: string[]
  created: string
  path: string
  size: number
  sentiment?: {
    sentiment: string
    polarity: number
    subjectivity: number
  }
}

export interface GraphData {
  nodes: Record<string, GraphNode>
}

export interface GraphStats {
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

export interface GraphSuggestions {
  orphaned_notes: string[]
  potential_connections: Array<{
    from: string
    to: string
    similarity: number
    reason: string
  }>
  learning_paths: Array<{
    name: string
    nodes: string[]
    description: string
  }>
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch')
  }
  return response.json()
}

export function useGraphData() {
  const { data: graphData, error: graphError, isLoading: graphLoading, mutate: mutateGraph } = useSWR<GraphData>(
    '/graphs/api/graph',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  )

  const { data: statsData, error: statsError, isLoading: statsLoading } = useSWR<GraphStats>(
    '/graphs/api/stats',
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
    }
  )

  const { data: suggestionsData, error: suggestionsError, isLoading: suggestionsLoading } = useSWR<GraphSuggestions>(
    '/graphs/api/suggestions',
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  )

  // Transform data for react-force-graph
  const transformedGraphData = useMemo(() => {
    if (!graphData?.nodes) return { nodes: [], links: [] }

    const nodes = Object.values(graphData.nodes).map(node => ({
      id: node.id,
      title: node.title,
      type: node.type,
      concepts: node.concepts,
      path: node.path,
      size: node.size,
      created: node.created,
      sentiment: node.sentiment,
      connectionsCount: node.connections.length,
      // Visual properties
      val: Math.max(1, node.connections.length * 2), // Node size based on connections
      color: getNodeColor(node.type),
    }))

    const links: Array<{ source: string; target: string; value: number }> = []

    // Create links from connections
    Object.values(graphData.nodes).forEach(node => {
      node.connections.forEach(targetId => {
        if (graphData.nodes[targetId]) {
          links.push({
            source: node.id,
            target: targetId,
            value: 1
          })
        }
      })
    })

    return { nodes, links }
  }, [graphData])

  const refreshData = useCallback(() => {
    mutateGraph()
  }, [mutateGraph])

  return {
    // Graph data
    graphData: transformedGraphData,
    rawGraphData: graphData,
    graphError,
    graphLoading,

    // Stats data
    statsData,
    statsError,
    statsLoading,

    // Suggestions data
    suggestionsData,
    suggestionsError,
    suggestionsLoading,

    // Actions
    refreshData,
  }
}

function getNodeColor(type: string): string {
  // Helper function to get color from CSS variables
  const getColor = (varName: string): string => {
    if (typeof window === 'undefined') return '#8b5cf6'; // SSR fallback
    const root = document.documentElement;
    const color = getComputedStyle(root).getPropertyValue(varName).trim();
    return color || '#8b5cf6'; // Fallback if not found
  };

  const colorMap = {
    project: getColor('--graph-project'),
    area: getColor('--graph-area'),
    resource: getColor('--graph-resource'),
    permanent: getColor('--graph-permanent'),
    reference: getColor('--graph-reference'),
  }
  return colorMap[type as keyof typeof colorMap] || getColor('--graph-reference')
}

// Custom hook for graph filtering
export function useGraphFilters(graphData: GraphData | undefined) {
  const [filters, setFilters] = useState({
    search: '',
    types: [] as string[],
    dateRange: { from: null as Date | null, to: null as Date | null },
    minConnections: 0,
    maxConnections: 100,
    concepts: [] as string[],
  })

  const filteredData = useMemo(() => {
    if (!graphData?.nodes) return { nodes: [], links: [] }

    let filteredNodes = Object.values(graphData.nodes)

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredNodes = filteredNodes.filter(node =>
        node.title.toLowerCase().includes(searchTerm) ||
        node.concepts.some(concept => concept.toLowerCase().includes(searchTerm)) ||
        node.path.toLowerCase().includes(searchTerm)
      )
    }

    // Apply type filter
    if (filters.types.length > 0) {
      filteredNodes = filteredNodes.filter(node => filters.types.includes(node.type))
    }

    // Apply connections filter
    filteredNodes = filteredNodes.filter(node =>
      node.connections.length >= filters.minConnections &&
      node.connections.length <= filters.maxConnections
    )

    // Apply date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      filteredNodes = filteredNodes.filter(node => {
        const nodeDate = new Date(node.created)
        const fromDate = filters.dateRange.from
        const toDate = filters.dateRange.to

        if (fromDate && nodeDate < fromDate) return false
        if (toDate && nodeDate > toDate) return false
        return true
      })
    }

    // Apply concepts filter
    if (filters.concepts.length > 0) {
      filteredNodes = filteredNodes.filter(node =>
        filters.concepts.some(concept =>
          node.concepts.some(nodeConcept =>
            nodeConcept.toLowerCase().includes(concept.toLowerCase())
          )
        )
      )
    }

    // Transform to graph format
    const nodeIds = new Set(filteredNodes.map(n => n.id))

    const nodes = filteredNodes.map(node => ({
      id: node.id,
      title: node.title,
      type: node.type,
      concepts: node.concepts,
      path: node.path,
      size: node.size,
      created: node.created,
      sentiment: node.sentiment,
      connectionsCount: node.connections.length,
      val: Math.max(1, node.connections.length * 2),
      color: getNodeColor(node.type),
    }))

    const links: Array<{ source: string; target: string; value: number }> = []

    filteredNodes.forEach(node => {
      node.connections.forEach(targetId => {
        if (nodeIds.has(targetId)) {
          links.push({
            source: node.id,
            target: targetId,
            value: 1
          })
        }
      })
    })

    return { nodes, links }
  }, [graphData, filters])

  return {
    filters,
    setFilters,
    filteredData,
    updateFilter: <K extends keyof typeof filters>(key: K, value: typeof filters[K]) => {
      setFilters(prev => ({ ...prev, [key]: value }))
    },
    resetFilters: () => {
      setFilters({
        search: '',
        types: [],
        dateRange: { from: null, to: null },
        minConnections: 0,
        maxConnections: 100,
        concepts: [],
      })
    }
  }
}

// Custom hook for node selection
export function useNodeSelection() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [highlightNodes, setHighlightNodes] = useState(new Set<string>())
  const [highlightLinks, setHighlightLinks] = useState(new Set<string>())

  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNode(nodeId)
  }, [])

  const hoverNode = useCallback((nodeId: string | null) => {
    setHoveredNode(nodeId)
  }, [])

  const updateHighlights = useCallback((nodes: Set<string>, links: Set<string>) => {
    setHighlightNodes(nodes)
    setHighlightLinks(links)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedNode(null)
    setHoveredNode(null)
    setHighlightNodes(new Set())
    setHighlightLinks(new Set())
  }, [])

  return {
    selectedNode,
    hoveredNode,
    highlightNodes,
    highlightLinks,
    selectNode,
    hoverNode,
    updateHighlights,
    clearSelection,
  }
}