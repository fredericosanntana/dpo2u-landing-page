import { NextResponse } from 'next/server'

const API_GATEWAY_URL = 'http://localhost:8090'

export async function GET() {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/health`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      services: {
        leann: false,
        orchestrator: false,
        docker: false
      },
      timestamp: new Date().toISOString(),
      latency_ms: 0
    }, { status: 503 })
  }
}