import { NextRequest, NextResponse } from 'next/server'
import {
  getKnowledgeBase,
  addKnowledgeBaseDocument,
  updateKnowledgeBaseDocument,
  deleteKnowledgeBaseDocument,
  updateKnowledgeBaseSettings,
} from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const kb = getKnowledgeBase()
    return NextResponse.json(kb)
  } catch (error) {
    console.error('[v0] KB GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch knowledge base' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string || 'Untitled'
    const category = formData.get('category') as string || 'general'
    const tags = (formData.get('tags') as string || '').split(',').filter(Boolean)

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const content = await file.text()
    const doc = addKnowledgeBaseDocument({
      title,
      content,
      category,
      tags,
      metadata: {
        source: file.name,
        author: 'admin',
        updatedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ document: doc })
  } catch (error) {
    console.error('[v0] KB POST error:', error)
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { docId, updates } = data

    if (docId) {
      const updated = updateKnowledgeBaseDocument(docId, updates)
      if (!updated) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 })
      }
      return NextResponse.json({ document: updated })
    } else {
      const updated = updateKnowledgeBaseSettings(updates)
      return NextResponse.json(updated)
    }
  } catch (error) {
    console.error('[v0] KB PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update knowledge base' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { docId } = await request.json()
    const success = deleteKnowledgeBaseDocument(docId)

    if (!success) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] KB DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}
