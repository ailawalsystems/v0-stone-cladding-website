'use client'

import { useState, useEffect } from 'react'
import { AIAssistantConfig, AIProviderConfig, NLPConfig } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Settings, Save, Zap, Brain, BookOpen, Check, AlertCircle, ChevronDown,
  Lock, Unlock, Plus, Trash2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AISettingsAdvancedProps {
  adminKey: string
}

type TabType = 'providers' | 'model' | 'nlp' | 'knowledge-base'

export function AISettingsAdvanced({ adminKey }: AISettingsAdvancedProps) {
  const [activeTab, setActiveTab] = useState<TabType>('providers')
  const [config, setConfig] = useState<AIAssistantConfig | null>(null)
  const [providers, setProviders] = useState<AIProviderConfig[]>([])
  const [nlpConfig, setNlpConfig] = useState<NLPConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [configRes, providersRes, nlpRes] = await Promise.all([
        fetch('/api/ai-assistant/config', { headers: { 'x-admin-key': adminKey } }),
        fetch('/api/ai-assistant/providers', { headers: { 'x-admin-key': adminKey } }),
        fetch('/api/ai-assistant/nlp', { headers: { 'x-admin-key': adminKey } }),
      ])

      if (configRes.ok) setConfig(await configRes.json())
      if (providersRes.ok) setProviders(await providersRes.json())
      if (nlpRes.ok) setNlpConfig(await nlpRes.json())
    } catch (error) {
      console.error('[v0] Load error:', error)
      showToast('Failed to load settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSaveConfig = async () => {
    if (!config) return
    setSaving(true)

    try {
      const response = await fetch('/api/ai-assistant/config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        showToast('Configuration saved successfully', 'success')
      } else {
        showToast('Failed to save configuration', 'error')
      }
    } catch (error) {
      console.error('[v0] Save error:', error)
      showToast('Error saving configuration', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateProvider = async (providerId: string, updates: Partial<AIProviderConfig>) => {
    try {
      const response = await fetch(`/api/ai-assistant/providers/${providerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updated = await response.json()
        setProviders(providers.map(p => p.id === providerId ? updated : p))
        showToast('Provider updated successfully', 'success')
      } else {
        showToast('Failed to update provider', 'error')
      }
    } catch (error) {
      console.error('[v0] Provider update error:', error)
      showToast('Error updating provider', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin">
          <Zap className="w-8 h-8 text-orange-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`fixed top-4 right-4 p-4 rounded-lg border flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-green-500/20 border-green-500/30 text-green-300'
                : 'bg-red-500/20 border-red-500/30 text-red-300'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {[
          { id: 'providers' as TabType, label: 'Providers', icon: Zap },
          { id: 'model' as TabType, label: 'Model Config', icon: Settings },
          { id: 'nlp' as TabType, label: 'NLP Settings', icon: Brain },
          { id: 'knowledge-base' as TabType, label: 'Knowledge Base', icon: BookOpen },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'providers' && (
          <ProviderSettings
            providers={providers}
            selectedProvider={config?.provider}
            onProviderSelect={(provider) => config && setConfig({ ...config, provider })}
            onUpdate={handleUpdateProvider}
          />
        )}

        {activeTab === 'model' && config && (
          <ModelSettings
            config={config}
            providers={providers}
            onChange={setConfig}
            onSave={handleSaveConfig}
            isSaving={saving}
          />
        )}

        {activeTab === 'nlp' && nlpConfig && (
          <NLPSettings
            config={nlpConfig}
            onChange={setNlpConfig}
          />
        )}

        {activeTab === 'knowledge-base' && (
          <KnowledgeBaseSettings adminKey={adminKey} />
        )}
      </div>
    </div>
  )
}

// Provider Settings Component
function ProviderSettings({
  providers,
  selectedProvider,
  onProviderSelect,
  onUpdate,
}: {
  providers: AIProviderConfig[]
  selectedProvider?: string
  onProviderSelect: (provider: string) => void
  onUpdate: (providerId: string, updates: Partial<AIProviderConfig>) => void
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})

  const providerIcons: Record<string, React.ReactNode> = {
    openai: '🤖',
    anthropic: '⚡',
    google: '🔮',
    deepseek: '🌊',
    xai: '🎯',
    groq: '⚙️',
    ollama: '🦙',
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map(provider => {
          const appDefaultModel = provider.models.find(m => m.id === provider.applicationDefaultModel)
          return (
          <motion.div
            key={provider.id}
            className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
            onClick={() => {
              setExpandedId(expandedId === provider.id ? null : provider.id)
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{providerIcons[provider.provider]}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{provider.name}</p>
                    {provider.applicationDefaultModel && (
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/50">
                        App Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {provider.models.length} models {appDefaultModel && `• Using: ${appDefaultModel.displayName}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {provider.isConfigured && <Check className="w-4 h-4 text-green-400" />}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedId === provider.id ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            <AnimatePresence>
              {expandedId === provider.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-white/10 space-y-3"
                >
                  {!provider.isConfigured && provider.provider !== 'ollama' && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">API Key</label>
                      <input
                        type="password"
                        placeholder="Enter API key"
                        value={apiKeys[provider.id] || ''}
                        onChange={(e) => setApiKeys({ ...apiKeys, [provider.id]: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (apiKeys[provider.id]) {
                            onUpdate(provider.id, {
                              apiKey: apiKeys[provider.id],
                              isConfigured: true,
                            })
                            setApiKeys({ ...apiKeys, [provider.id]: '' })
                          }
                        }}
                        className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Save API Key
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Models</label>
                    <div className="space-y-2">
                      {provider.models.map(model => (
                        <div key={model.id} className="flex items-center gap-2 p-2 rounded bg-white/5">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-white">{model.displayName}</p>
                            <p className="text-xs text-gray-500">{model.contextWindow.toLocaleString()} tokens</p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onUpdate(provider.id, { applicationDefaultModel: model.id })
                              }}
                              className={`px-2 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                                provider.applicationDefaultModel === model.id
                                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                              }`}
                              title="Set as application default"
                            >
                              {provider.applicationDefaultModel === model.id ? '★ App Default' : '☆ Set Default'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Model Settings Component
function ModelSettings({
  config,
  providers,
  onChange,
  onSave,
  isSaving,
}: {
  config: AIAssistantConfig
  providers: AIProviderConfig[]
  onChange: (config: AIAssistantConfig) => void
  onSave: () => void
  isSaving: boolean
}) {
  const selectedProvider = providers.find(p => p.provider === config.provider)
  const models = selectedProvider?.models || []

  const appDefaultModel = selectedProvider?.applicationDefaultModel
  const appDefaultModelObj = selectedProvider?.models.find(m => m.id === appDefaultModel)

  return (
    <div className="space-y-6 p-6 rounded-lg bg-white/5 border border-white/10">
      {/* Info Box */}
      {appDefaultModel && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
          <div className="text-blue-400 flex-shrink-0 mt-0.5">ℹ️</div>
          <div>
            <p className="text-sm font-medium text-blue-300">Application Default Model</p>
            <p className="text-xs text-blue-200 mt-1">
              {selectedProvider?.name}: <span className="font-semibold">{appDefaultModelObj?.displayName}</span>
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Provider</label>
          <select
            value={config.provider}
            onChange={(e) => onChange({ ...config, provider: e.target.value as any })}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            {providers.filter(p => p.isConfigured).map(p => (
              <option key={p.id} value={p.provider}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
          <select
            value={config.model}
            onChange={(e) => onChange({ ...config, model: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            {models.map(m => (
              <option key={m.id} value={m.name}>{m.displayName}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Temperature (0-2)</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onChange={(e) => onChange({ ...config, temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
            <span className="text-xs text-gray-400">{config.temperature.toFixed(1)}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Top P (0-1)</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.topP}
              onChange={(e) => onChange({ ...config, topP: parseFloat(e.target.value) })}
              className="w-full"
            />
            <span className="text-xs text-gray-400">{config.topP.toFixed(1)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Max Tokens</label>
            <input
              type="number"
              value={config.maxTokens}
              onChange={(e) => onChange({ ...config, maxTokens: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Frequency Penalty</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.frequencyPenalty}
              onChange={(e) => onChange({ ...config, frequencyPenalty: parseFloat(e.target.value) })}
              className="w-full"
            />
            <span className="text-xs text-gray-400">{config.frequencyPenalty.toFixed(1)}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">System Prompt</label>
          <textarea
            value={config.systemPrompt}
            onChange={(e) => onChange({ ...config, systemPrompt: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          />
        </div>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  )
}

// NLP Settings Component
function NLPSettings({
  config,
  onChange,
}: {
  config: NLPConfig
  onChange: (config: NLPConfig) => void
}) {
  return (
    <div className="space-y-6 p-6 rounded-lg bg-white/5 border border-white/10">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
          <input
            type="checkbox"
            checked={config.features.tokenization}
            onChange={(e) =>
              onChange({
                ...config,
                features: { ...config.features, tokenization: e.target.checked },
              })
            }
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-300">Tokenization</span>
        </label>

        <label className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
          <input
            type="checkbox"
            checked={config.features.entityExtraction}
            onChange={(e) =>
              onChange({
                ...config,
                features: { ...config.features, entityExtraction: e.target.checked },
              })
            }
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-300">Entity Extraction</span>
        </label>

        <label className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
          <input
            type="checkbox"
            checked={config.features.sentimentAnalysis}
            onChange={(e) =>
              onChange({
                ...config,
                features: { ...config.features, sentimentAnalysis: e.target.checked },
              })
            }
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-300">Sentiment Analysis</span>
        </label>

        <label className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
          <input
            type="checkbox"
            checked={config.features.keywordExtraction}
            onChange={(e) =>
              onChange({
                ...config,
                features: { ...config.features, keywordExtraction: e.target.checked },
              })
            }
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-300">Keyword Extraction</span>
        </label>

        <label className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
          <input
            type="checkbox"
            checked={config.features.textClassification}
            onChange={(e) =>
              onChange({
                ...config,
                features: { ...config.features, textClassification: e.target.checked },
              })
            }
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-300">Text Classification</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
        <select
          value={config.language}
          onChange={(e) => onChange({ ...config, language: e.target.value as any })}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="pt">Portuguese</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.removeStopwords}
            onChange={(e) => onChange({ ...config, removeStopwords: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-300">Remove Stopwords</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.lemmatization}
            onChange={(e) => onChange({ ...config, lemmatization: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-300">Lemmatization</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.stemming}
            onChange={(e) => onChange({ ...config, stemming: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-300">Stemming</span>
        </label>
      </div>
    </div>
  )
}

// Knowledge Base Settings Component
function KnowledgeBaseSettings({ adminKey }: { adminKey: string }) {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/ai-assistant/knowledge-base', {
        headers: { 'x-admin-key': adminKey },
      })
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error('[v0] Load KB error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', uploadFile)

    try {
      const response = await fetch('/api/ai-assistant/knowledge-base', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey },
        body: formData,
      })

      if (response.ok) {
        await loadDocuments()
        setUploadFile(null)
      }
    } catch (error) {
      console.error('[v0] Upload KB error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="p-6 rounded-lg bg-white/5 border border-white/10 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Upload Document</label>
          <input
            type="file"
            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            accept=".pdf,.txt,.md"
            className="w-full text-sm text-gray-300"
          />
        </div>
        <button
          type="submit"
          disabled={isUploading || !uploadFile}
          className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-300">Documents ({documents.length})</p>
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{doc.title}</p>
                <p className="text-xs text-gray-400">{doc.category}</p>
              </div>
              <button className="p-1 hover:bg-red-500/20 rounded transition-colors">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
