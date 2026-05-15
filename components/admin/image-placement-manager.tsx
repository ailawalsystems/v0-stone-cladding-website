'use client'

import { useState, useEffect } from 'react'
import { MediaAsset, ImageGalleryConfig } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link2, X, Save, Upload, Trash2, Check, AlertCircle } from 'lucide-react'

interface ImagePlacementManagerProps {
  adminKey: string
}

export function ImagePlacementManager({ adminKey }: ImagePlacementManagerProps) {
  const [gallery, setGallery] = useState<ImageGalleryConfig | null>(null)
  const [media, setMedia] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [message, setMessage] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | ''>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [galleryRes, mediaRes] = await Promise.all([
        fetch('/api/media/gallery', { headers: { 'x-admin-key': adminKey } }),
        fetch('/api/media', { headers: { 'x-admin-key': adminKey } }),
      ])

      if (galleryRes.ok) {
        const data = await galleryRes.json()
        setGallery(data.gallery)
      }

      if (mediaRes.ok) {
        const data = await mediaRes.json()
        setMedia(data.media || [])
      }
    } catch (error) {
      console.error('[v0] Failed to load data:', error)
      setMessage('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const assignMediaToPlacement = async (placementKey: string, mediaId: string) => {
    try {
      const response = await fetch('/api/media/placements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ placementKey, mediaId }),
      })

      if (response.ok) {
        const data = await response.json()
        setGallery(data.gallery)
        setMessage('Placement updated successfully')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Failed to update placement')
      }
    } catch (error) {
      console.error('[v0] Failed to assign media:', error)
      setMessage('Error updating placement')
    }
  }

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToastMessage(msg)
    setToastType(type)
    setTimeout(() => {
      setToastType('')
      setToastMessage('')
    }, 3000)
  }

  const handleSaveAssignment = async () => {
    if (!selectedPlacement || !selectedMedia) return
    await assignMediaToPlacement(selectedPlacement, selectedMedia)
    setSelectedMedia(null)
    showToast('Placement updated successfully', 'success')
  }

  const handleUploadReplaceImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile || !selectedPlacement || !selectedPlacementData?.mediaId) {
      showToast('Please select a file', 'error')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('type', 'image')
      formData.append('title', selectedPlacementData.label)
      formData.append('description', `Replacement for ${selectedPlacementData.label}`)

      const uploadResponse = await fetch('/api/media', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey },
        body: formData,
      })

      if (!uploadResponse.ok) {
        showToast('Failed to upload image', 'error')
        setIsUploading(false)
        return
      }

      const uploadedData = await uploadResponse.json()
      const newMediaId = uploadedData.asset.id

      // Now assign the new media to the placement
      const assignResponse = await fetch('/api/media/placements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ placementKey: selectedPlacement, mediaId: newMediaId }),
      })

      if (assignResponse.ok) {
        const data = await assignResponse.json()
        setGallery(data.gallery)
        setUploadFile(null)
        const fileInput = document.getElementById('placement-file-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        showToast('Image replaced successfully', 'success')
        // Reload media list
        loadData()
      } else {
        showToast('Failed to assign image to placement', 'error')
      }
    } catch (error) {
      console.error('[v0] Upload error:', error)
      showToast('Error uploading image', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!selectedPlacement || !selectedPlacementData?.mediaId) return
    if (!confirm('Are you sure you want to remove this image from the placement?')) return

    try {
      const response = await fetch('/api/media/placements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ placementKey: selectedPlacement, mediaId: '' }),
      })

      if (response.ok) {
        const data = await response.json()
        setGallery(data.gallery)
        setUploadFile(null)
        showToast('Image removed successfully', 'success')
      } else {
        showToast('Failed to remove image', 'error')
      }
    } catch (error) {
      console.error('[v0] Remove error:', error)
      showToast('Error removing image', 'error')
    }
  }

  const getFilteredMedia = () => {
    if (filterCategory === 'all') return media
    return media.filter(m => m.category === filterCategory)
  }

  const getMediaForPlacement = (mediaId?: string) => {
    if (!mediaId) return null
    return media.find(m => m.id === mediaId)
  }

  if (loading) {
    return <div className="text-gray-400">Loading image placements...</div>
  }

  if (!gallery) {
    return <div className="text-red-400">Failed to load image gallery configuration</div>
  }

  const categories = Array.from(new Set(media.map(m => m.category)))
  const selectedPlacementData = gallery.placements.find(p => p.placementKey === selectedPlacement)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Image Placement Manager</h2>
        <p className="text-gray-400">
          Assign media assets to specific placements across your website
        </p>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg border flex items-center gap-2 animate-in fade-in ${
          toastType === 'success'
            ? 'bg-green-500/20 border-green-500/30 text-green-300'
            : 'bg-red-500/20 border-red-500/30 text-red-300'
        }`}>
          {toastType === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toastMessage}
        </div>
      )}

      {/* Message */}
      {message && (
        <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-200">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placements List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Placements</h3>
            <span className="text-sm text-gray-400">{gallery.placements.length}</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {gallery.placements.map((placement) => {
              const assignedMedia = getMediaForPlacement(placement.mediaId)
              const isSelected = selectedPlacement === placement.placementKey

              return (
                <button
                  key={placement.placementKey}
                  onClick={() => setSelectedPlacement(isSelected ? null : placement.placementKey)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-white">{placement.label}</p>
                      <p className="text-sm text-gray-400">{placement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{placement.placementKey}</p>
                    </div>
                    {assignedMedia && (
                      <div className="ml-2 flex items-center gap-1 text-green-400 text-xs">
                        <span>✓ Assigned</span>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Media Selection and Preview */}
        <div className="space-y-4">
          {selectedPlacementData ? (
            <>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {selectedPlacementData.label}
                </h3>
                <p className="text-sm text-gray-400">{selectedPlacementData.description}</p>
              </div>

              {/* Current Image Preview */}
              {selectedPlacementData.mediaId && getMediaForPlacement(selectedPlacementData.mediaId) && (
                <div className="space-y-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm font-semibold text-green-300">Current Image</p>
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-black/20 border border-white/10">
                    <img
                      src={getMediaForPlacement(selectedPlacementData.mediaId)!.url}
                      alt={getMediaForPlacement(selectedPlacementData.mediaId)!.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-300">
                    {getMediaForPlacement(selectedPlacementData.mediaId)!.title}
                  </p>
                </div>
              )}

              {/* Replace/Upload Section */}
              <div className="space-y-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm font-semibold text-blue-300">
                  {selectedPlacementData.mediaId ? 'Replace Image' : 'Upload Image'}
                </p>
                <form onSubmit={handleUploadReplaceImage} className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Select Image File</label>
                    <input
                      id="placement-file-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-300"
                    />
                    {uploadFile && (
                      <p className="text-xs text-gray-400 mt-2">Selected: {uploadFile.name}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isUploading || !uploadFile}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {isUploading ? 'Uploading...' : selectedPlacementData.mediaId ? 'Replace Image' : 'Upload Image'}
                  </button>
                </form>
              </div>

              {/* Remove Image Section */}
              {selectedPlacementData.mediaId && (
                <button
                  onClick={handleRemoveImage}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 text-sm rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Image
                </button>
              )}


            </>
          ) : (
            <div className="text-gray-400 text-center py-8">
              Select a placement to assign media
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
