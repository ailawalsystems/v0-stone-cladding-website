import { getProjects, addProject, deleteProject, updateProject } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123'

function verifyAdminKey(request: NextRequest): boolean {
  const key = request.headers.get('x-admin-key')
  return key === ADMIN_KEY
}

export async function GET(request: NextRequest) {
  try {
    const projects = getProjects()
    const published = projects.filter(p => p.isPublished).sort((a, b) => a.displayOrder - b.displayOrder)
    return NextResponse.json({ projects: published })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const project = addProject(data)
    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, ...updates } = data
    const project = updateProject(id, updates)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    return NextResponse.json({ project })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing project ID' }, { status: 400 })
    }
    const success = deleteProject(id)
    if (!success) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 400 })
  }
}
