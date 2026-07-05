'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PortfolioProject } from '@/lib/db'
import { containerVariants, itemVariants } from '@/lib/animations'

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<PortfolioProject[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects || [])
          setFilteredProjects(data.projects || [])
        }
      } catch (error) {
        console.error('[v0] Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(p => p.category === selectedCategory))
    }
  }, [selectedCategory, projects])

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))]

  return (
    <main className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-500/10 via-transparent to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-green-500/10 via-transparent to-transparent blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
        {/* Page Header */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 font-space-grotesk">
            Our <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Explore our comprehensive portfolio of stone cladding installations across residential, commercial, and institutional projects worldwide.
          </p>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <motion.div 
            className="mb-12 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-orange-500/50 hover:text-white'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </motion.div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="text-gray-400 text-center py-12">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-gray-400 text-center py-12">No projects in this category</div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="group glass overflow-hidden rounded-xl border border-white/10 cursor-pointer transition-all duration-300 hover:border-orange-500/50"
                whileHover={{ 
                  y: -8,
                  boxShadow: '0 25px 50px rgba(255, 140, 66, 0.2)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gray-900">
                  <motion.img
                    src={project.featureImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                    initial={{ opacity: 0.3 }}
                    whileHover={{ opacity: 0.95 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Content */}
                <motion.div 
                  className="p-6 bg-white/5 backdrop-blur-sm"
                  initial={{ y: 0 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="mb-3">
                    {project.category && (
                      <span className="inline-block text-xs font-medium text-orange-400 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/30 mb-2">
                        {project.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-space-grotesk line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-orange-400 font-medium mb-3">{project.location}</p>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-4">{project.description}</p>
                  
                  {/* Metadata */}
                  <div className="flex gap-4 text-xs text-gray-500 pt-3 border-t border-white/10">
                    {project.carouselImages.length > 0 && (
                      <span>{project.carouselImages.length} Images</span>
                    )}
                    {project.videoClips.length > 0 && (
                      <span>{project.videoClips.length} Videos</span>
                    )}
                    {project.completionDate && (
                      <span>{new Date(project.completionDate).getFullYear()}</span>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  )
}
