import { NextRequest, NextResponse } from 'next/server'
import { getNLPConfig, updateNLPConfig } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const nlpConfig = getNLPConfig()
    return NextResponse.json(nlpConfig)
  } catch (error) {
    console.error('[v0] NLP GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch NLP config' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const updated = updateNLPConfig(updates)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('[v0] NLP PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update NLP config' }, { status: 500 })
  }
}
