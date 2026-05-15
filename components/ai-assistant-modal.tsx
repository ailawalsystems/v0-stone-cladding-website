'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Volume2, VolumeX, Loader, MessageCircle } from 'lucide-react'
import { useAIAssistant } from './ai-assistant-provider'
import { useState, useRef, useEffect } from 'react'

export default function AIAssistantModal() {
  const { isOpen, closeAssistant, config, messages, sendMessage, isLoading, isSpeaking, speakText, stopSpeaking, clearMessages } = useAIAssistant()
  const [input, setInput] = useState('')
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize TTS setting from config
  useEffect(() => {
    if (config) {
      setTtsEnabled(config.nlpEnabled && config.textToSpeechEnabled)
    }
  }, [config])

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

  const handleTtsToggle = () => {
    // Only allow toggle if both NLP and TTS are enabled in admin config
    if (config?.nlpEnabled && config?.textToSpeechEnabled) {
      setTtsEnabled(!ttsEnabled)
    }
  }

  if (!config) return null

  const animationDuration = config.animationEnabled ? config.animationDuration / 1000 : 0
  const isTtsAvailable = config.nlpEnabled && config.textToSpeechEnabled

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

          {/* Modal - Mobile first responsive design */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationDuration || 0.3 }}
          >
            <motion.div
              className="w-full max-w-md sm:max-w-lg md:max-w-xl rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col h-[calc(100vh-2rem)] sm:h-[500px] md:h-[600px]"
              style={{
                backgroundColor: config.backgroundColor || 'rgba(10, 10, 10, 0.95)',
                borderColor: `${config.accentColor}40`,
              }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: animationDuration || 0.3, type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Header - Responsive padding */}
              <div
                className="p-4 sm:p-6 border-b flex items-start sm:items-center justify-between gap-3 sm:gap-4"
                style={{
                  backgroundColor: `${config.accentColor}15`,
                  borderColor: `${config.accentColor}40`,
                }}
              >
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-white truncate">{config.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{config.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isTtsAvailable && (
                    <motion.button
                      onClick={handleTtsToggle}
                      className="p-2 rounded-lg transition-all"
                      style={{
                        backgroundColor: ttsEnabled ? `${config.accentColor}40` : 'rgba(255, 255, 255, 0.05)',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={ttsEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
                    >
                      {ttsEnabled ? (
                        <Volume2 className="w-4 h-4 text-white" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-gray-400" />
                      )}
                    </motion.button>
                  )}
                  <motion.button
                    onClick={closeAssistant}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Messages - Responsive padding and spacing */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-2">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${config.accentColor}20` }}
                    >
                      <MessageCircle className="w-6 h-6" style={{ color: config.accentColor }} />
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm">Start a conversation with {config.name}</p>
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
                          className={`max-w-xs sm:max-w-sm px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
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
                          <p className="break-words">{message.content}</p>

                          {/* Speaker button for assistant messages - respects NLP config */}
                          {message.role === 'assistant' && isTtsAvailable && ttsEnabled && (
                            <button
                              onClick={() =>
                                isSpeaking ? stopSpeaking() : speakText(message.content)
                              }
                              className="mt-2 p-1.5 hover:bg-white/10 rounded transition-colors inline-flex items-center gap-1"
                              title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
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
                      className="px-3 sm:px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <Loader className="w-4 h-4 animate-spin" style={{ color: config.accentColor }} />
                      <span className="text-xs sm:text-sm text-gray-300">Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input - Responsive padding */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 sm:p-6 border-t"
                style={{ borderColor: `${config.accentColor}40` }}
              >
                <div className="flex gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 px-3 sm:px-4 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:border-white/40 focus:outline-none transition-colors disabled:opacity-50"
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="p-2 rounded-lg text-white transition-colors disabled:opacity-50 flex-shrink-0"
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
                <div className="px-4 sm:px-6 pb-3 sm:pb-4">
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
