'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { PortfolioProject, Material } from '@/lib/db'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<PortfolioProject | null>(null)
  const [prevProject, setPrevProject] = useState<{ id: string; title: string } | null>(null)
  const [nextProject, setNextProject] = useState<{ id: string; title: string } | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, materialsRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetch('/api/materials')
        ])

        if (projectRes.ok) {
          const projectData = await projectRes.json()
          setProject(projectData.project)
          setPrevProject(projectData.previousProject)
          setNextProject(projectData.nextProject)
        }

        if (materialsRes.ok) {
          const materialsData = await materialsRes.json()
          setMaterials(materialsData.materials || [])
        }
      } catch (error) {
        console.error('[v0] Failed to fetch project:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [projectId])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-400">Loading project...</div>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <div className="text-gray-400">Project not found</div>
        <button
          onClick={() => router.push('/projects')}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all"
        >
          Back to Projects
        </button>
      </main>
    )
  }

  const carouselImages = project.carouselImages || [project.featureImage]
  const galleryImages = project.galleryImages || []
  const projectMaterials = materials.filter(m => project.materials.includes(m.id))

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-500/10 via-transparent to-transparent blur-3xl" />

      <div className="relative z-10">
        {/* Navigation Bar */}
        <div className="glass border-b border-white/10 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => router.push('/projects')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Projects</span>
            </button>
            <h1 className="text-xl font-bold text-white font-space-grotesk text-center flex-1">
              Project Details
            </h1>
            <div className="w-12" />
          </div>
        </div>

        {/* Hero Section with Carousel */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-gray-900 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.img
              src={carouselImages[currentImageIndex]}
              alt={project.title}
              className="w-full h-full object-cover"
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Carousel Controls */}
            {carouselImages.length > 1 && (
              <>
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors z-20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors z-20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-orange-500 w-4' : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Image Count */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur text-white text-sm">
              {currentImageIndex + 1} / {carouselImages.length}
            </div>
          </motion.div>
        </div>

        {/* Project Details Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div 
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Header Info */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block text-xs font-medium text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
                    {project.category}
                  </span>
                  {project.completionDate && (
                    <span className="inline-block text-xs font-medium text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      {new Date(project.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-space-grotesk">
                  {project.title}
                </h1>
                <p className="text-xl text-orange-400 font-medium mb-6">{project.location}</p>
              </div>

              {/* Detailed Description */}
              {project.detailedDescription && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">About This Project</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {project.detailedDescription}
                  </p>
                </div>
              )}

              {/* Features */}
              {project.features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">Key Features</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <span className="text-orange-500 font-bold flex-shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">Gallery</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {galleryImages.map((image, index) => (
                      <motion.img
                        key={index}
                        src={image}
                        alt={`${project.title} - Gallery ${index + 1}`}
                        className="h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-white/10"
                        onClick={() => setSelectedImage(image)}
                        whileHover={{ scale: 1.05 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {project.videoClips.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">Video</h2>
                  <div className="space-y-4">
                    {project.videoClips.map((video, index) => (
                      <motion.a
                        key={index}
                        href={video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                            ▶
                          </div>
                          <div>
                            <p className="font-medium text-white">Project Video {index + 1}</p>
                            <p className="text-sm text-gray-400">{video}</p>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Project Info Card */}
              <div className="glass rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4 font-space-grotesk">Project Information</h3>
                <div className="space-y-4">
                  {project.client && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Client</p>
                      <p className="text-white font-medium">{project.client}</p>
                    </div>
                  )}
                  {project.completionDate && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Completion Date</p>
                      <p className="text-white font-medium">{new Date(project.completionDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {project.budget && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Budget</p>
                      <p className="text-white font-medium">{project.budget}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics Card */}
              {project.metrics && Object.values(project.metrics).some(v => v) && (
                <div className="glass rounded-xl border border-white/10 p-6">
                  <h3 className="text-lg font-bold text-white mb-4 font-space-grotesk">Project Metrics</h3>
                  <div className="space-y-3">
                    {project.metrics.area && <div><p className="text-gray-400 text-sm">Area: <span className="text-white font-medium">{project.metrics.area}</span></p></div>}
                    {project.metrics.sqMeters && <div><p className="text-gray-400 text-sm">Square Meters: <span className="text-white font-medium">{project.metrics.sqMeters} m²</span></p></div>}
                    {project.metrics.squareFeet && <div><p className="text-gray-400 text-sm">Square Feet: <span className="text-white font-medium">{project.metrics.squareFeet} ft²</span></p></div>}
                  </div>
                </div>
              )}

              {/* Materials Used */}
              {projectMaterials.length > 0 && (
                <div className="glass rounded-xl border border-white/10 p-6">
                  <h3 className="text-lg font-bold text-white mb-4 font-space-grotesk">Materials Used</h3>
                  <div className="space-y-3">
                    {projectMaterials.map((material) => (
                      <div
                        key={material.id}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors"
                      >
                        {material.imageUrl && (
                          <img src={material.imageUrl} alt={material.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                        )}
                        <p className="font-medium text-white">{material.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{material.category}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="space-y-3">
                {prevProject && (
                  <button
                    onClick={() => router.push(`/projects/${prevProject.id}`)}
                    className="w-full p-4 rounded-lg glass border border-white/10 hover:border-orange-500/50 transition-colors text-left group"
                  >
                    <p className="text-xs text-gray-500 mb-1">← Previous Project</p>
                    <p className="text-white font-medium group-hover:text-orange-400 transition-colors">{prevProject.title}</p>
                  </button>
                )}
                {nextProject && (
                  <button
                    onClick={() => router.push(`/projects/${nextProject.id}`)}
                    className="w-full p-4 rounded-lg glass border border-white/10 hover:border-orange-500/50 transition-colors text-left group"
                  >
                    <p className="text-xs text-gray-500 mb-1">Next Project →</p>
                    <p className="text-white font-medium group-hover:text-orange-400 transition-colors">{nextProject.title}</p>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage}
              alt="Enlarged"
              className="max-h-[90vh] max-w-[90vw] rounded-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </div>
    </main>
  )
}
