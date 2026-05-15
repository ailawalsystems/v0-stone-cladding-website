'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VIDEO_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_mzn3immmnwyzujz30szjrjyty2mzqtlhnzmm1sz-4rc5FTZZxgh9PxxnCmyP7Ff4LwdhrL.mp4'
const PRELOADER_COOKIE = 'octo21st_preloader_shown'

interface VideoPreloaderProps {
  children: React.ReactNode
}

export default function VideoPreloader({ children }: VideoPreloaderProps) {
  const [showPreloader, setShowPreloader] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasShown, setHasShown] = useState(false)

  // Check if preloader should be shown on component mount
  useEffect(() => {
    const checkPreloaderStatus = () => {
      // Check localStorage first (more reliable than cookies for this use case)
      const hasSeenPreloader = localStorage.getItem(PRELOADER_COOKIE)
      
      if (!hasSeenPreloader) {
        setShowPreloader(true)
        setHasShown(true)
      } else {
        setIsLoading(false)
      }
    }

    // Small delay to ensure hydration
    const timer = setTimeout(checkPreloaderStatus, 0)
    return () => clearTimeout(timer)
  }, [])

  // Handle video end
  const handleVideoEnd = () => {
    // Mark preloader as shown
    localStorage.setItem(PRELOADER_COOKIE, 'true')
    
    // Transition to main content
    if (videoRef.current) {
      videoRef.current.style.opacity = '0'
    }
    
    // After fade out, hide preloader
    setTimeout(() => {
      setShowPreloader(false)
      setIsLoading(false)
    }, 500)
  }

  // Handle video can play through
  const handleCanPlayThrough = () => {
    // Video is ready, but let it autoplay
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn('Autoplay failed:', err)
        // If autoplay fails, show content anyway
        handleVideoEnd()
      })
    }
  }

  // Handle skip button click
  const handleSkip = () => {
    localStorage.setItem(PRELOADER_COOKIE, 'true')
    if (videoRef.current) {
      videoRef.current.style.opacity = '0'
    }
    setTimeout(() => {
      setShowPreloader(false)
      setIsLoading(false)
    }, 300)
  }

  return (
    <>
      <AnimatePresence>
        {showPreloader && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Video Container */}
            <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
              <video
                ref={videoRef}
                src={VIDEO_URL}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                onCanPlayThrough={handleCanPlayThrough}
                className="w-full h-full object-cover transition-opacity duration-500"
                style={{
                  opacity: 1,
                }}
              />

              {/* Gradient Overlay for Skip Button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Skip Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onClick={handleSkip}
                className="absolute bottom-6 right-6 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors border border-white/20 z-10"
              >
                Skip
              </motion.button>

              {/* Loading Indicator (for video loading) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-6 left-6 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                <span className="text-xs text-white/60">Loading</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: showPreloader ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: showPreloader ? 0 : 0 }}
      >
        {children}
      </motion.div>
    </>
  )
}
