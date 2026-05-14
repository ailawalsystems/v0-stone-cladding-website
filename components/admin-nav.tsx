import Link from 'next/link'
import { Settings, Mail, Image, Layers, MessageSquare, Sparkles } from 'lucide-react'

type Tab = 'routing' | 'messages' | 'media' | 'images' | 'materials' | 'consultation' | 'ai'

interface AdminNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export default function AdminNav({ activeTab, onTabChange }: AdminNavProps) {
  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: 'routing', label: 'Message Routing', icon: <Settings className="w-4 h-4" /> },
    { id: 'messages', label: 'Messages', icon: <Mail className="w-4 h-4" /> },
    { id: 'media', label: 'Media', icon: <Image className="w-4 h-4" /> },
    { id: 'images', label: 'Placements', icon: <Image className="w-4 h-4" /> },
    { id: 'materials', label: 'Materials', icon: <Layers className="w-4 h-4" /> },
    { id: 'consultation', label: 'Consultation', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Assistant', icon: <Sparkles className="w-4 h-4" /> },
  ]

  return (
    <nav className="glass border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O21</span>
            </div>
            <span className="text-white font-bold hidden sm:inline">Admin</span>
          </Link>

          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
