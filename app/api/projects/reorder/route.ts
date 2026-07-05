import { reorderProjects, getProjects } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123'

function verifyAdminKey(request: NextRequest): boolean {
  const key = request.headers.get('x-admin-key')
  return key === ADMIN_KEY
}

export async function POST(request: NextRequest) {
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { projectIds } = await request.json()
    
    if (!Array.isArray(projectIds)) {
      return NextResponse.json({ error: 'Invalid project IDs' }, { status: 400 })
    }

    reorderProjects(projectIds)
    const projects = getProjects()
    
    return NextResponse.json({ projects })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reorder projects' }, { status: 400 })
  }
}
