'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useAIAssistant } from './ai-assistant-provider'

export default function FloatingAIButton() {
  const { isOpen, openAssistant, config } = useAIAssistant()

  if (!config || !config.enabled) return null

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  }

  const position = config.position || 'bottom-right'
  const animationDuration = config.animationEnabled ? config.animationDuration / 1000 : 0

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className={`fixed z-40 ${positionClasses[position]}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: animationDuration || 0.3, type: 'spring', stiffness: 400 }}
        >
          <motion.button
            onClick={openAssistant}
            className="relative p-4 rounded-full shadow-lg transition-all hover:shadow-xl group"
            style={{
              backgroundColor: config.accentColor,
              boxShadow: `0 0 30px ${config.accentColor}40`,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                `0 0 30px ${config.accentColor}40`,
                `0 0 50px ${config.accentColor}60`,
                `0 0 30px ${config.accentColor}40`,
              ],
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity },
            }}
          >
            <div className="relative">
              <MessageCircle className="w-6 h-6 text-white" />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: `2px solid ${config.accentColor}`,
                  opacity: 0.3,
                }}
                animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            <motion.div
              className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              pointerEvents="none"
            >
              {config.name}
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
