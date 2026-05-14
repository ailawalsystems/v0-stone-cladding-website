'use client'

import { useState, useEffect } from 'react'
import AdminNav from '@/components/admin-nav'
import { MessageRoutingConfig } from '@/components/admin/message-routing-config'
import { MediaManagement } from '@/components/admin/media-management'
import { MessageHistory } from '@/components/admin/message-history'
import { MaterialsManagement } from '@/components/admin/materials-management'
import { ConsultationManagement } from '@/components/admin/consultation-management'
import { ImagePlacementManager } from '@/components/admin/image-placement-manager'
import { AISettings } from '@/components/admin/ai-settings'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

type Tab = 'routing' | 'messages' | 'media' | 'images' | 'materials' | 'consultation' | 'ai'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('routing')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [keyInput, setKeyInput] = useState('')
  const [error, setError] = useState('')

  // Check if already authenticated
  useEffect(() => {
    const stored = localStorage.getItem('adminKey')
    if (stored) {
      setAdminKey(stored)
      setIsAuthenticated(true)
    }
  }, [])

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!keyInput.trim()) {
      setError('Please enter an admin key')
      return
    }

    // Verify admin key by attempting to fetch config
    try {
      const response = await fetch('/api/config', {
        headers: { 'x-admin-key': keyInput },
      })

      if (response.ok) {
        setAdminKey(keyInput)
        setIsAuthenticated(true)
        localStorage.setItem('adminKey', keyInput)
        setKeyInput('')
      } else {
        setError('Invalid admin key')
      }
    } catch (err) {
      setError('Authentication failed')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminKey('')
    localStorage.removeItem('adminKey')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="glass p-8 rounded-xl border border-white/10 w-full max-w-md">
          <h1 className="text-3xl font-bold text-white mb-2 font-space-grotesk">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mb-8">Enter your admin key to continue</p>

          <form onSubmit={handleAuthenticate} className="space-y-6">
            <div>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter admin key"
                className="w-full glass-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-2 rounded-lg focus:border-orange-500/50 focus:outline-none"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/50"
            >
              Authenticate
            </Button>
          </form>

          <p className="text-xs text-gray-500 mt-6 text-center">
            Admin key required. Check your environment variables or documentation.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white font-space-grotesk mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">Manage messaging routes and media assets</p>
          </div>
          <Button
            onClick={handleLogout}
            className="glass border-white/10 hover:border-orange-500/50 text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'routing' && (
            <MessageRoutingConfig adminKey={adminKey} />
          )}
          {activeTab === 'messages' && (
            <MessageHistory adminKey={adminKey} />
          )}
          {activeTab === 'media' && (
            <MediaManagement adminKey={adminKey} />
          )}
          {activeTab === 'images' && (
            <ImagePlacementManager adminKey={adminKey} />
          )}
          {activeTab === 'materials' && (
            <MaterialsManagement adminKey={adminKey} />
          )}
          {activeTab === 'consultation' && (
            <ConsultationManagement adminKey={adminKey} />
          )}
          {activeTab === 'ai' && (
            <AISettings adminKey={adminKey} />
          )}
        </div>
      </div>
    </div>
  )
}
