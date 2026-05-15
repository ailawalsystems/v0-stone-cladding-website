'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { AlertCircle, Save, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'

interface AIAssistantConfig {
  id: string
  enabled: boolean
  name: string
  description: string
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-opus' | 'claude-sonnet'
  knowledgeBaseEnabled: boolean
  nlpEnabled: boolean
  textToSpeechEnabled: boolean
  textToSpeechVoice: 'default' | 'alt1' | 'alt2'
  temperature: number
  maxTokens: number
  systemPrompt: string
  accentColor: string
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  animationEnabled: boolean
  animationDuration: number
  backgroundColor: string
  createdAt: string
  updatedAt: string
}

interface AISettingsProps {
  adminKey: string
}

export function AISettings({ adminKey }: AISettingsProps) {
  const [config, setConfig] = useState<AIAssistantConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [originalConfig, setOriginalConfig] = useState<AIAssistantConfig | null>(null)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ai-assistant/config', {
        headers: { 'x-admin-key': adminKey },
      })

      if (response.ok) {
        const data = await response.json()
        setConfig(data)
        setOriginalConfig(data)
      } else {
        setError('Failed to load AI assistant configuration')
      }
    } catch (err) {
      setError('Error loading configuration')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!config) return

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const response = await fetch('/api/ai-assistant/config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        const data = await response.json()
        setConfig(data)
        setOriginalConfig(data)
        setSuccess('AI Assistant configuration updated successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to save configuration')
      }
    } catch (err) {
      setError('Error saving configuration')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (originalConfig) {
      setConfig(originalConfig)
      setError('')
    }
  }

  const hasChanges = JSON.stringify(config) !== JSON.stringify(originalConfig)

  if (loading) {
    return (
      <Card className="p-8 border-white/10 glass bg-white/5">
        <div className="flex items-center justify-center gap-3 text-gray-400">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          Loading configuration...
        </div>
      </Card>
    )
  }

  if (!config) {
    return (
      <Card className="p-8 border-white/10 glass bg-white/5">
        <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-400">Failed to load AI Assistant configuration</p>
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Status Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-4"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-4"
        >
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs">✓</span>
          </div>
          <p className="text-green-400 text-sm">{success}</p>
        </motion.div>
      )}

      {/* Basic Settings */}
      <Card className="p-6 border-white/10 glass bg-white/5 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-6">Basic Settings</h3>

          <div className="space-y-4">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div>
                <Label className="text-white text-base">Enable AI Assistant</Label>
                <p className="text-sm text-gray-400 mt-1">
                  Toggle the AI assistant on or off
                </p>
              </div>
              <Switch
                checked={config.enabled}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, enabled: checked })
                }
              />
            </div>

            {/* Name */}
            <div>
              <Label className="text-white">Assistant Name</Label>
              <Input
                value={config.name}
                onChange={(e) =>
                  setConfig({ ...config, name: e.target.value })
                }
                placeholder="e.g., Stone Assistant"
                className="mt-2 glass bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-white">Description</Label>
              <Input
                value={config.description}
                onChange={(e) =>
                  setConfig({ ...config, description: e.target.value })
                }
                placeholder="Brief description of the assistant"
                className="mt-2 glass bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>

            {/* Position */}
            <div>
              <Label className="text-white">Button Position</Label>
              <Select
                value={config.position}
                onValueChange={(value: any) =>
                  setConfig({ ...config, position: value })
                }
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
              </Select>
            </div>

            {/* Accent Color */}
            <div>
              <Label className="text-white">Accent Color</Label>
              <div className="flex gap-2 mt-2">
                <div
                  className="w-12 h-10 rounded-lg border-2 border-white/20 cursor-pointer"
                  style={{ backgroundColor: config.accentColor }}
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'color'
                    input.value = config.accentColor
                    input.onchange = (e: any) => {
                      setConfig({ ...config, accentColor: e.target.value })
                    }
                    input.click()
                  }}
                />
                <Input
                  value={config.accentColor}
                  onChange={(e) =>
                    setConfig({ ...config, accentColor: e.target.value })
                  }
                  placeholder="#ff8c42"
                  className="glass bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Model Settings */}
      <Card className="p-6 border-white/10 glass bg-white/5 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-6">AI Model Settings</h3>

          <div className="space-y-4">
            {/* Model Selection */}
            <div>
              <Label className="text-white">AI Model</Label>
              <Select
                value={config.model}
                onValueChange={(value: any) =>
                  setConfig({ ...config, model: value })
                }
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="claude-sonnet">Claude Sonnet</option>
                <option value="claude-opus">Claude Opus</option>
              </Select>
            </div>

            {/* Temperature */}
            <div>
              <Label className="text-white">Temperature: {config.temperature.toFixed(1)}</Label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) =>
                  setConfig({ ...config, temperature: parseFloat(e.target.value) })
                }
                className="w-full mt-2 accent-orange-500"
              />
              <p className="text-xs text-gray-400 mt-2">
                Lower values (0-0.5): More focused and deterministic
                <br />
                Higher values (1.5-2): More creative and varied
              </p>
            </div>

            {/* Max Tokens */}
            <div>
              <Label className="text-white">Max Tokens</Label>
              <Input
                type="number"
                min="10"
                max="4000"
                value={config.maxTokens}
                onChange={(e) =>
                  setConfig({ ...config, maxTokens: parseInt(e.target.value) })
                }
                className="mt-2 glass bg-white/10 border-white/20 text-white"
              />
              <p className="text-xs text-gray-400 mt-2">
                Maximum length of assistant responses
              </p>
            </div>

            {/* System Prompt */}
            <div>
              <Label className="text-white">System Prompt</Label>
              <Textarea
                value={config.systemPrompt}
                onChange={(e) =>
                  setConfig({ ...config, systemPrompt: e.target.value })
                }
                placeholder="Define the assistant's behavior and expertise..."
                className="mt-2 glass bg-white/10 border-white/20 text-white min-h-24"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Features */}
      <Card className="p-6 border-white/10 glass bg-white/5 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-6">Features</h3>

          <div className="space-y-4">
            {/* Knowledge Base */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div>
                <Label className="text-white text-base">Knowledge Base Access</Label>
                <p className="text-sm text-gray-400 mt-1">
                  Allow assistant to access knowledge base
                </p>
              </div>
              <Switch
                checked={config.knowledgeBaseEnabled}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, knowledgeBaseEnabled: checked })
                }
              />
            </div>

            {/* NLP */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div>
                <Label className="text-white text-base">NLP Processing</Label>
                <p className="text-sm text-gray-400 mt-1">
                  Enable natural language processing features
                </p>
              </div>
              <Switch
                checked={config.nlpEnabled}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, nlpEnabled: checked })
                }
              />
            </div>

            {/* Text-to-Speech */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div>
                <Label className="text-white text-base">Text-to-Speech</Label>
                <p className="text-sm text-gray-400 mt-1">
                  Allow assistant to read responses aloud
                </p>
              </div>
              <Switch
                checked={config.textToSpeechEnabled}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, textToSpeechEnabled: checked })
                }
              />
            </div>

            {/* TTS Voice Selection */}
            {config.textToSpeechEnabled && (
              <div>
                <Label className="text-white">Voice</Label>
                <Select
                  value={config.textToSpeechVoice}
                  onValueChange={(value: any) =>
                    setConfig({ ...config, textToSpeechVoice: value })
                  }
                >
                  <option value="default">Default Voice</option>
                  <option value="alt1">Alternative Voice 1</option>
                  <option value="alt2">Alternative Voice 2</option>
                </Select>
              </div>
            )}

            {/* Animation */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div>
                <Label className="text-white text-base">Animations</Label>
                <p className="text-sm text-gray-400 mt-1">
                  Enable UI animations
                </p>
              </div>
              <Switch
                checked={config.animationEnabled}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, animationEnabled: checked })
                }
              />
            </div>

            {/* Animation Duration */}
            {config.animationEnabled && (
              <div>
                <Label className="text-white">Animation Duration (ms): {config.animationDuration}</Label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={config.animationDuration}
                  onChange={(e) =>
                    setConfig({ ...config, animationDuration: parseInt(e.target.value) })
                  }
                  className="w-full mt-2 accent-orange-500"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/50 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          onClick={handleReset}
          disabled={!hasChanges}
          variant="outline"
          className="glass border-white/20 hover:border-orange-500/50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </motion.div>
  )
}
