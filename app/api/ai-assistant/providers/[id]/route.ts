import { NextRequest, NextResponse } from 'next/server'
import { updateAIProvider } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const updated = updateAIProvider(params.id, updates)

    if (!updated) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[v0] Provider PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 })
  }
}
