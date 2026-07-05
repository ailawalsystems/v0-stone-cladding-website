'use client'

import { useState, useEffect } from 'react'
import { PortfolioProject, Material } from '@/lib/db'
import { Trash2, Edit2, Plus, X, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PortfolioManagementProps {
  adminKey: string
}

export function PortfolioManagement({ adminKey }: PortfolioManagementProps) {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    category: '',
    featureImage: '',
    carouselImages: '' as string | string[],
    videoClips: '' as string | string[],
    galleryImages: '' as string | string[],
    detailedDescription: '',
    features: '',
    materials: [] as string[],
    completionDate: '',
    client: '',
    budget: '',
    metrics: {
      area: '',
      sqMeters: '',
      squareFeet: '',
    },
    isPublished: true,
  })

  useEffect(() => {
    fetchProjects()
    fetchMaterials()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects', {
        headers: { 'x-admin-key': adminKey },
      })
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (err) {
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials')
      if (response.ok) {
        const data = await response.json()
        setMaterials(data.materials || [])
      }
    } catch (err) {
      console.error('[v0] Failed to load materials:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      description: '',
      category: '',
      featureImage: '',
      carouselImages: '',
      videoClips: '',
      galleryImages: '',
      detailedDescription: '',
      features: '',
      materials: [],
      completionDate: '',
      client: '',
      budget: '',
      metrics: {
        area: '',
        sqMeters: '',
        squareFeet: '',
      },
      isPublished: true,
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (project: PortfolioProject) => {
    setFormData({
      title: project.title,
      location: project.location,
      description: project.description,
      category: project.category,
      featureImage: project.featureImage,
      carouselImages: project.carouselImages,
      videoClips: project.videoClips,
      galleryImages: project.galleryImages,
      detailedDescription: project.detailedDescription,
      features: project.features.join(', '),
      materials: project.materials,
      completionDate: project.completionDate,
      client: project.client || '',
      budget: project.budget || '',
      metrics: project.metrics || { area: '', sqMeters: '', squareFeet: '' },
      isPublished: project.isPublished,
    })
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.title || !formData.location || !formData.description) {
      setError('Please fill in required fields')
      return
    }

    try {
      const payload = {
        ...formData,
        carouselImages: Array.isArray(formData.carouselImages) 
          ? formData.carouselImages 
          : (formData.carouselImages as string).split(',').map(s => s.trim()).filter(s => s),
        videoClips: Array.isArray(formData.videoClips) 
          ? formData.videoClips 
          : (formData.videoClips as string).split(',').map(s => s.trim()).filter(s => s),
        galleryImages: Array.isArray(formData.galleryImages) 
          ? formData.galleryImages 
          : (formData.galleryImages as string).split(',').map(s => s.trim()).filter(s => s),
        features: (formData.features as string)
          .split(',')
          .map((f) => f.trim())
          .filter((f) => f),
        displayOrder: editingId 
          ? projects.find(p => p.id === editingId)?.displayOrder || 0 
          : projects.length,
      }

      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { id: editingId, ...payload } : payload

      const response = await fetch('/api/projects', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Failed to save project')
      }

      setSuccess(editingId ? 'Project updated successfully' : 'Project added successfully')
      resetForm()
      fetchProjects()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to save project')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      setSuccess('Project deleted successfully')
      setDeleteConfirm(null)
      fetchProjects()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete project')
    }
  }

  const handleDragStart = (id: string) => {
    setDraggedId(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) return

    const draggedIndex = projects.findIndex(p => p.id === draggedId)
    const targetIndex = projects.findIndex(p => p.id === targetId)

    const newProjects = [...projects]
    const [draggedProject] = newProjects.splice(draggedIndex, 1)
    newProjects.splice(targetIndex, 0, draggedProject)

    setProjects(newProjects)
    setDraggedId(null)

    const projectIds = newProjects.map(p => p.id)
    try {
      await fetch('/api/projects/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ projectIds }),
      })
    } catch (err) {
      console.error('[v0] Reorder failed:', err)
      fetchProjects()
    }
  }

  if (loading) {
    return <div className="text-gray-400">Loading projects...</div>
  }

  return (
    <div className="space-y-8">
      {/* Add Project Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Portfolio Management</h2>
        <Button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No projects yet</div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              draggable
              onDragStart={() => handleDragStart(project.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(project.id)}
              className={`glass rounded-lg border border-white/10 p-4 transition-all cursor-move ${
                draggedId === project.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <GripVertical className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white">{project.title}</h3>
                      <p className="text-orange-400 text-sm">{project.location}</p>
                      <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(project.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3 text-xs text-gray-500">
                    <span>Status: {project.isPublished ? 'Published' : 'Draft'}</span>
                    <span>Images: {project.carouselImages.length}</span>
                    <span>Videos: {project.videoClips.length}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-xl border border-white/10 p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-4">Delete Project?</h3>
            <p className="text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white font-space-grotesk">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                      placeholder="Project title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                      placeholder="Project location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                      placeholder="e.g., Commercial, Residential"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Completion Date</label>
                    <input
                      type="date"
                      value={formData.completionDate}
                      onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                      className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Short Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                    placeholder="Brief project description"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Detailed Description</label>
                  <textarea
                    value={formData.detailedDescription}
                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                    className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                    placeholder="Full project description"
                    rows={4}
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <h4 className="font-semibold text-white">Media</h4>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Feature Image URL</label>
                  <input
                    type="text"
                    value={formData.featureImage}
                    onChange={(e) => setFormData({ ...formData, featureImage: e.target.value })}
                    className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                    placeholder="Main image URL"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Carousel Images (comma-separated URLs)</label>
                  <textarea
                    value={Array.isArray(formData.carouselImages) ? formData.carouselImages.join(', ') : formData.carouselImages}
                    onChange={(e) => setFormData({ ...formData, carouselImages: e.target.value })}
                    className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                    placeholder="Image URL 1, Image URL 2, ..."
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Gallery Images (comma-separated URLs)</label>
                  <textarea
                    value={Array.isArray(formData.galleryImages) ? formData.galleryImages.join(', ') : formData.galleryImages}
                    onChange={(e) => setFormData({ ...formData, galleryImages: e.target.value })}
                    className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                    placeholder="Gallery image URL 1, Gallery image URL 2, ..."
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Video URLs (comma-separated)</label>
                  <textarea
                    value={Array.isArray(formData.videoClips) ? formData.videoClips.join(', ') : formData.videoClips}
                    onChange={(e) => setFormData({ ...formData, videoClips: e.target.value })}
                    className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                    placeholder="https://youtube.com/..., https://vimeo.com/..., ..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <h4 className="font-semibold text-white">Project Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Client</label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                      placeholder="Client name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Budget</label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                      placeholder="e.g., $50,000 - $100,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Features (comma-separated)</label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                    placeholder="Feature 1, Feature 2, Feature 3, ..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Area</label>
                    <input
                      type="text"
                      value={formData.metrics.area}
                      onChange={(e) => setFormData({ ...formData, metrics: { ...formData.metrics, area: e.target.value } })}
                      className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                      placeholder="Area description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Square Meters</label>
                    <input
                      type="text"
                      value={formData.metrics.sqMeters}
                      onChange={(e) => setFormData({ ...formData, metrics: { ...formData.metrics, sqMeters: e.target.value } })}
                      className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                      placeholder="e.g., 5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Square Feet</label>
                    <input
                      type="text"
                      value={formData.metrics.squareFeet}
                      onChange={(e) => setFormData({ ...formData, metrics: { ...formData.metrics, squareFeet: e.target.value } })}
                      className="w-full glass-sm bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                      placeholder="e.g., 53,800"
                    />
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <h4 className="font-semibold text-white">Materials Used</h4>
                <div className="flex flex-wrap gap-2">
                  {materials.map((material) => (
                    <button
                      key={material.id}
                      type="button"
                      onClick={() => {
                        if (formData.materials.includes(material.id)) {
                          setFormData({ ...formData, materials: formData.materials.filter(id => id !== material.id) })
                        } else {
                          setFormData({ ...formData, materials: [...formData.materials, material.id] })
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        formData.materials.includes(material.id)
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {material.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Publish Status */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/5"
                  />
                  <span className="text-white">Publish this project</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 border-t border-white/10 pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                >
                  {editingId ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
