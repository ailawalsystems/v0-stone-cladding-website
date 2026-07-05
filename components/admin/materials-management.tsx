'use client'

import { useState, useEffect } from 'react'
import { Material } from '@/lib/db'
import { Trash2, Edit2, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MaterialsManagementProps {
  adminKey: string
}

export function MaterialsManagement({ adminKey }: MaterialsManagementProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    durability: '',
    cost: '',
    maintenance: '',
    applications: '',
    imageUrl: '',
    features: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Fetch materials
  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/materials')
      if (response.ok) {
        const data = await response.json()
        setMaterials(data.materials || [])
      }
    } catch (err) {
      setError('Failed to load materials')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      durability: '',
      cost: '',
      maintenance: '',
      applications: '',
      imageUrl: '',
      features: '',
    })
    setImageFile(null)
    setImagePreview('')
    setEditingId(null)
    setShowForm(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.imageUrl

    try {
      setUploadingImage(true)
      const formDataToSend = new FormData()
      formDataToSend.append('file', imageFile)
      formDataToSend.append('type', 'material-image')
      formDataToSend.append('title', formData.name)
      formDataToSend.append('description', `Image for ${formData.name}`)

      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'x-admin-key': adminKey,
        },
        body: formDataToSend,
      })

      if (response.ok) {
        const data = await response.json()
        return data.asset.url
      }
    } catch (err) {
      console.error('[v0] Image upload failed:', err)
    } finally {
      setUploadingImage(false)
    }
    return null
  }

  const handleEdit = (material: Material) => {
    setFormData({
      name: material.name,
      category: material.category,
      description: material.description,
      durability: material.durability,
      cost: material.cost,
      maintenance: material.maintenance,
      applications: material.applications,
      imageUrl: material.imageUrl,
      features: material.features.join(', '),
    })
    setImagePreview(material.imageUrl)
    setImageFile(null)
    setEditingId(material.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate
    if (!formData.name || !formData.category || !formData.description) {
      setError('Please fill in required fields')
      return
    }

    try {
      let imageUrl = formData.imageUrl

      // Upload image if a file was selected
      if (imageFile) {
        const uploadedUrl = await uploadImage()
        if (!uploadedUrl) {
          setError('Failed to upload image')
          return
        }
        imageUrl = uploadedUrl
      }

      const payload = {
        ...formData,
        imageUrl,
        features: formData.features
          .split(',')
          .map((f) => f.trim())
          .filter((f) => f),
      }

      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { id: editingId, ...payload } : payload

      const response = await fetch('/api/materials', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Failed to save material')
      }

      setSuccess(editingId ? 'Material updated successfully' : 'Material added successfully')
      resetForm()
      fetchMaterials()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to save material')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/materials?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete material')
      }

      setSuccess('Material deleted successfully')
      setDeleteConfirm(null)
      fetchMaterials()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete material')
    }
  }

  if (loading) {
    return <div className="text-gray-400">Loading materials...</div>
  }

  return (
    <div className="space-y-8">
      {/* Add Material Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Materials Catalog</h2>
        <Button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Material
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

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white font-space-grotesk">
                {editingId ? 'Edit Material' : 'Add New Material'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Material Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full glass-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                  placeholder="e.g., Granite Classic"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full glass-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                  placeholder="e.g., Natural Stone"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full glass-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                  placeholder="Brief description of the material"
                  rows={2}
                />
              </div>

              {/* Durability */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Durability
                </label>
                <input
                  type="text"
                  value={formData.durability}
                  onChange={(e) => setFormData({ ...formData, durability: e.target.value })}
                  className="w-full glass-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                  placeholder="e.g., 50+ years"
                />
              </div>

              {/* Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cost Range
                </label>
                <input
                  type="text"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full glass-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                  placeholder="e.g., Premium"
                />
              </div>

              {/* Maintenance */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Maintenance
                </label>
                <input
                  type="text"
                  value={formData.maintenance}
                  onChange={(e) => setFormData({ ...formData, maintenance: e.target.value })}
                  className="w-full glass-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                  placeholder="e.g., Low"
                />
              </div>

              {/* Applications */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Applications
                </label>
                <input
                  type="text"
                  value={formData.applications}
                  onChange={(e) => setFormData({ ...formData, applications: e.target.value })}
                  className="w-full glass-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                  placeholder="e.g., Facades, Flooring, Countertops"
                />
              </div>

              {/* Material Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Material Image
                </label>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {(imagePreview || formData.imageUrl) && (
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview || formData.imageUrl} 
                        alt="Material preview" 
                        className="h-40 w-40 object-cover rounded-lg border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview('')
                          setFormData({ ...formData, imageUrl: '' })
                        }}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* File Upload */}
                  <div>
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                      <span className="inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-lg text-orange-400 cursor-pointer hover:bg-orange-500/30 transition-colors text-sm font-medium">
                        {uploadingImage ? 'Uploading...' : imageFile ? 'Change Image' : 'Upload Image'}
                      </span>
                    </label>
                  </div>

                  {/* URL Fallback */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Or enter Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      disabled={!!imageFile}
                      className="w-full glass-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none disabled:opacity-50"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full glass-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
                  placeholder="e.g., Weather-resistant, Anti-slip, Eco-friendly"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/50">
                  {editingId ? 'Update Material' : 'Add Material'}
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 glass border border-white/10 hover:border-orange-500/50 text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Materials List */}
      <div className="grid gap-4">
        {materials.length === 0 ? (
          <div className="text-center py-12 glass rounded-xl border border-white/10 p-8">
            <p className="text-gray-400 mb-4">No materials yet. Add your first material to get started!</p>
          </div>
        ) : (
          materials.map((material) => (
            <div
              key={material.id}
              className="glass rounded-xl border border-white/10 p-4 sm:p-6 hover:border-orange-500/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1 font-space-grotesk">
                    {material.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {material.category} · {material.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {material.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-gray-300">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(material)}
                    className="glass border-white/10 hover:border-orange-500/50 text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>

                  {deleteConfirm === material.id ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDelete(material.id)}
                        className="bg-red-500/20 border-red-500/50 hover:bg-red-500/30 text-red-400"
                      >
                        Confirm
                      </Button>
                      <Button
                        onClick={() => setDeleteConfirm(null)}
                        className="glass border-white/10 text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setDeleteConfirm(material.id)}
                      className="glass border-white/10 hover:border-red-500/50 text-white hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
