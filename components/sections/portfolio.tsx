'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { containerVariants, itemVariants } from '@/lib/animations'
import { PortfolioProject } from '@/lib/db'

export default function Portfolio() {
  const router = useRouter()
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects || [])
        }
      } catch (error) {
        console.error('[v0] Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])
  return (
    <section id="portfolio" className="py-20 sm:py-28 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-green-500/10 via-transparent to-transparent blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-space-grotesk">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl">
            A selection of our most prestigious stone cladding installations across Africa and international markets.
          </p>
        </motion.div>

        {/* Projects Grid - Responsive */}
        {loading ? (
          <div className="text-gray-400 text-center py-8">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No projects published yet</div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="group glass overflow-hidden rounded-lg sm:rounded-xl border border-white/10 cursor-pointer transition-all duration-300 hover:border-orange-500/50"
                whileHover={{ 
                  y: -6,
                  boxShadow: '0 20px 40px rgba(255, 140, 66, 0.2)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Image Container - Optimized for mobile */}
                <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden bg-gray-900">
                  <motion.img
                    src={project.featureImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                    initial={{ opacity: 0.3 }}
                    whileHover={{ opacity: 0.9 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Content - Compact on mobile */}
                <motion.div 
                  className="p-3 sm:p-5 bg-white/5"
                  initial={{ y: 0 }}
                  whileHover={{ y: -2 }}
                >
                  <motion.h3 
                    className="text-sm sm:text-base font-bold text-white mb-1.5 font-space-grotesk line-clamp-1 sm:line-clamp-2"
                    whileHover={{ color: '#ff8c42' }}
                    transition={{ duration: 0.2 }}
                  >
                    {project.title}
                  </motion.h3>
                  <motion.p 
                    className="text-xs text-orange-400 font-medium mb-2"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {project.location}
                  </motion.p>
                  <p className="text-gray-300 text-xs line-clamp-1 sm:line-clamp-2">
                    {project.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div 
          className="mt-12 sm:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-base sm:text-lg text-gray-400 mb-4 sm:mb-6">
            See more of our completed projects and case studies
          </p>
          <motion.button 
            onClick={() => router.push('/projects')}
            className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm sm:text-base rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Projects
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
