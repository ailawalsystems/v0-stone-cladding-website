import { NextRequest, NextResponse } from 'next/server'
import { getAIProviders, updateAIProvider } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const providers = getAIProviders()
    return NextResponse.json(providers)
  } catch (error) {
    console.error('[v0] Providers GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
  }
}
