import { getProjects } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projects = getProjects()
    const project = projects.find(p => p.id === params.id && p.isPublished)
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get adjacent projects for navigation
    const publishedProjects = projects.filter(p => p.isPublished).sort((a, b) => a.displayOrder - b.displayOrder)
    const currentIndex = publishedProjects.findIndex(p => p.id === project.id)
    const previousProject = currentIndex > 0 ? publishedProjects[currentIndex - 1] : null
    const nextProject = currentIndex < publishedProjects.length - 1 ? publishedProjects[currentIndex + 1] : null

    return NextResponse.json({ 
      project,
      previousProject: previousProject ? { id: previousProject.id, title: previousProject.title } : null,
      nextProject: nextProject ? { id: nextProject.id, title: nextProject.title } : null
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}
