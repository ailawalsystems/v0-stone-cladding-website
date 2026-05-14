'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Volume2, VolumeX, Loader } from 'lucide-react'
import { useAIAssistant } from './ai-assistant-provider'
import { useState, useRef, useEffect } from 'react'

export default function AIAssistantModal() {
  const { isOpen, closeAssistant, config, messages, sendMessage, isLoading, isSpeaking, speakText, stopSpeaking, clearMessages } = useAIAssistant()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const content = input
    setInput('')
    await sendMessage(content)
  }

  if (!config) return null

  const animationDuration = config.animationEnabled ? config.animationDuration / 1000 : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationDuration || 0.3 }}
            onClick={closeAssistant}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationDuration || 0.3 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col h-[600px]"
              style={{
                backgroundColor: config.backgroundColor || 'rgba(10, 10, 10, 0.95)',
                borderColor: `${config.accentColor}40`,
              }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: animationDuration || 0.3, type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Header */}
              <div
                className="p-6 border-b flex items-center justify-between"
                style={{
                  backgroundColor: `${config.accentColor}15`,
                  borderColor: `${config.accentColor}40`,
                }}
              >
                <div>
                  <h2 className="text-xl font-bold text-white">{config.name}</h2>
                  <p className="text-sm text-gray-400">{config.description}</p>
                </div>
                <motion.button
                  onClick={closeAssistant}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${config.accentColor}20` }}
                    >
                      <MessageCircle className="w-6 h-6" style={{ color: config.accentColor }} />
                    </div>
                    <p className="text-gray-400 text-sm">Start a conversation with {config.name}</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.role === 'user'
                              ? 'text-white rounded-br-none'
                              : 'text-gray-100 rounded-bl-none'
                          }`}
                          style={{
                            backgroundColor:
                              message.role === 'user'
                                ? config.accentColor
                                : 'rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <p className="text-sm">{message.content}</p>

                          {/* Text-to-speech button for assistant messages */}
                          {message.role === 'assistant' && config.textToSpeechEnabled && (
                            <button
                              onClick={() =>
                                isSpeaking ? stopSpeaking() : speakText(message.content)
                              }
                              className="mt-2 p-1 hover:bg-white/10 rounded transition-colors inline-flex items-center gap-1"
                              title={isSpeaking ? 'Stop' : 'Read aloud'}
                            >
                              {isSpeaking ? (
                                <VolumeX className="w-4 h-4" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                              <span className="text-xs">
                                {isSpeaking ? 'Stop' : 'Listen'}
                              </span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div
                      className="px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <Loader className="w-4 h-4 animate-spin" style={{ color: config.accentColor }} />
                      <span className="text-sm text-gray-300">Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-6 border-t"
                style={{ borderColor: `${config.accentColor}40` }}
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:border-white/40 focus:outline-none transition-colors disabled:opacity-50"
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="p-2 rounded-lg text-white transition-colors disabled:opacity-50"
                    style={{ backgroundColor: config.accentColor }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </form>

              {/* Clear Messages Button */}
              {messages.length > 0 && (
                <div className="px-6 pb-4">
                  <button
                    onClick={clearMessages}
                    className="w-full text-xs text-gray-400 hover:text-gray-300 transition-colors py-2"
                  >
                    Clear conversation
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

import { MessageCircle } from 'lucide-react'
