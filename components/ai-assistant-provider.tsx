'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface AIAssistantConfig {
  id: string
  enabled: boolean
  name: string
  description: string
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-opus' | 'claude-sonnet'
  knowledgeBaseEnabled: boolean
  nlpEnabled: boolean
  textToSpeechEnabled: boolean
  textToSpeechVoice: 'default' | 'alt1' | 'alt2'
  temperature: number
  maxTokens: number
  systemPrompt: string
  accentColor: string
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  animationEnabled: boolean
  animationDuration: number
  createdAt: string
  updatedAt: string
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface AIAssistantContextType {
  isOpen: boolean
  isLoading: boolean
  config: AIAssistantConfig | null
  messages: AIMessage[]
  openAssistant: () => void
  closeAssistant: () => void
  sendMessage: (content: string) => Promise<void>
  updateConfig: (updates: Partial<AIAssistantConfig>) => Promise<void>
  clearMessages: () => void
  isSpeaking: boolean
  speakText: (text: string) => Promise<void>
  stopSpeaking: () => void
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined)

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<AIAssistantConfig | null>(null)
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Load config on mount
  React.useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/ai-assistant/config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('[v0] Failed to load AI config:', error)
    }
  }

  const openAssistant = useCallback(() => {
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeAssistant = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = 'unset'
  }, [])

  const sendMessage = async (content: string) => {
    if (!config || !content.trim()) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          config,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: AIMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMessage])

        // Auto-speak if enabled
        if (config.textToSpeechEnabled) {
          await speakText(data.message)
        }
      }
    } catch (error) {
      console.error('[v0] Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateConfig = async (updates: Partial<AIAssistantConfig>) => {
    if (!config) return

    try {
      const response = await fetch('/api/ai-assistant/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('[v0] Failed to update config:', error)
    }
  }

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const speakText = async (text: string) => {
    if (!config?.textToSpeechEnabled) return

    try {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Set voice based on config
      const voices = speechSynthesis.getVoices()
      if (voices.length > 0) {
        const voiceIndex = config.textToSpeechVoice === 'alt1' ? 1 : config.textToSpeechVoice === 'alt2' ? 2 : 0
        utterance.voice = voices[Math.min(voiceIndex, voices.length - 1)]
      }

      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('[v0] Text-to-speech error:', error)
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return (
    <AIAssistantContext.Provider
      value={{
        isOpen,
        isLoading,
        config,
        messages,
        openAssistant,
        closeAssistant,
        sendMessage,
        updateConfig,
        clearMessages,
        isSpeaking,
        speakText,
        stopSpeaking,
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  )
}

export function useAIAssistant() {
  const context = useContext(AIAssistantContext)
  if (!context) {
    throw new Error('useAIAssistant must be used within AIAssistantProvider')
  }
  return context
}
