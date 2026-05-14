import { NextRequest, NextResponse } from 'next/server'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface AIAssistantConfig {
  id: string
  enabled: boolean
  name: string
  model: string
  systemPrompt: string
  temperature: number
  maxTokens: number
}

// POST - Handle chat messages
export async function POST(request: NextRequest) {
  try {
    const { messages, config } = await request.json() as {
      messages: Message[]
      config: AIAssistantConfig
    }

    if (!config.enabled) {
      return NextResponse.json(
        { error: 'AI Assistant is disabled' },
        { status: 403 }
      )
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      )
    }

    // Format messages for the AI
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Get API key from environment
    const apiKey = process.env.OPENAI_API_KEY || process.env.AI_GATEWAY_API_KEY

    if (!apiKey) {
      console.error('[v0] No AI API key configured')
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    // Call the AI API (using OpenAI-compatible endpoint)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: config.systemPrompt,
          },
          ...formattedMessages,
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] AI API error:', error)
      return NextResponse.json(
        { error: 'Failed to get AI response', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()
    const assistantMessage =
      data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.'

    return NextResponse.json({
      message: assistantMessage,
      model: config.model,
    })
  } catch (error) {
    console.error('[v0] Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
