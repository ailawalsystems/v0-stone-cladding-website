import { NextRequest, NextResponse } from 'next/server'
import { getAIAssistantConfig, updateAIAssistantConfig } from '@/lib/db'

// GET - Retrieve AI assistant configuration
export async function GET(request: NextRequest) {
  try {
    const config = getAIAssistantConfig()
    return NextResponse.json(config)
  } catch (error) {
    console.error('[v0] Get AI config error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve AI configuration' },
      { status: 500 }
    )
  }
}

// PATCH - Update AI assistant configuration (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key')
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const config = updateAIAssistantConfig(body)

    return NextResponse.json(config)
  } catch (error) {
    console.error('[v0] Update AI config error:', error)
    return NextResponse.json(
      { error: 'Failed to update AI configuration' },
      { status: 500 }
    )
  }
}
