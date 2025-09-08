import { NextResponse } from 'next/server'

const API_GATEWAY_URL = 'http://localhost:8090'

export async function GET() {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/agents/list`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch agents:', error)
    // Return fallback data
    return NextResponse.json({
      agents: [],
      total: 0
    })
  }
}