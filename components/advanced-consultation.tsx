'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  ConsultationIcon,
  ProjectIcon,
  SupportIcon,
  MaterialIcon,
  PartnershipIcon,
} from '@/components/message-icons'

type MessageType = 'consultation' | 'project' | 'support' | 'material' | 'partnership'

interface MessageTypeOption {
  id: MessageType
  label: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const MESSAGE_TYPES: MessageTypeOption[] = [
  {
    id: 'consultation',
    label: 'Consultation',
    description: 'Request a consultation',
    icon: ConsultationIcon,
  },
  {
    id: 'project',
    label: 'Project',
    description: 'Discuss a project',
    icon: ProjectIcon,
  },
  {
    id: 'support',
    label: 'Support',
    description: 'Get technical support',
    icon: SupportIcon,
  },
  {
    id: 'material',
    label: 'Material',
    description: 'Ask about materials',
    icon: MaterialIcon,
  },
  {
    id: 'partnership',
    label: 'Partnership',
    description: 'Partnership proposal',
    icon: PartnershipIcon,
  },
]

interface FormData {
  type: MessageType
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function AdvancedConsultation() {
  const [selectedType, setSelectedType] = useState<MessageType>('consultation')
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    type: 'consultation',
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleTypeSelect = (type: MessageType) => {
    setSelectedType(type)
    setFormData((prev) => ({ ...prev, type }))
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit message')
      }

      setSubmitted(true)
      setFormData({
        type: 'consultation',
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })

      // Reset after 3 seconds
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit message')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedTypeOption = MESSAGE_TYPES.find((t) => t.id === selectedType)

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Selected Type Header - Prominent Display */}
      {selectedTypeOption && (
        <div className="mb-8 glass p-4 sm:p-6 rounded-xl border border-orange-500/40 bg-orange-500/10">
          <div className="flex items-center gap-3 sm:gap-4">
            {(() => {
              const Icon = selectedTypeOption.icon
              return <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-orange-400 flex-shrink-0" />
            })()}
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-2xl font-bold text-white font-space-grotesk">
                {selectedTypeOption.label}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                {selectedTypeOption.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Message Type Selection - Responsive Mobile First */}
      <div className="mb-8">
        <h3 className="text-sm sm:text-base font-semibold text-gray-300 mb-3 sm:mb-4 font-space-grotesk">
          Change Inquiry Type
        </h3>
        <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-3 md:gap-4">
          {MESSAGE_TYPES.map((type) => {
            const Icon = type.icon
            const isSelected = selectedType === type.id
            return (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`glass flex-1 sm:flex-none p-2 sm:p-4 rounded-lg border-2 transition-all duration-300 text-center group min-w-fit ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-white/10 hover:border-orange-500/50'
                }`}
              >
                <div className="flex justify-center mb-1 sm:mb-3">
                  <Icon
                    className={`w-4 sm:w-6 h-4 sm:h-6 transition-colors ${
                      isSelected
                        ? 'text-orange-400'
                        : 'text-gray-400 group-hover:text-orange-400'
                    }`}
                  />
                </div>
                <p
                  className={`text-xs sm:text-sm font-bold transition-colors truncate ${
                    isSelected ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {type.label}
                </p>
                <p className="hidden sm:block text-xs text-gray-500 mt-1">{type.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="glass p-6 sm:p-8 rounded-xl border border-white/10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-white mb-2">
              Full Name *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              required
              className="glass-sm bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-white mb-2">
              Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
              className="glass-sm bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-white mb-2">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+234 ..."
              className="glass-sm bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-xs sm:text-sm font-medium text-white mb-2">
              Subject *
            </label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="What is this about?"
              required
              className="glass-sm bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-white mb-2">
            Message *
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell us more about your inquiry..."
            rows={6}
            required
            className="glass-sm bg-white/10 border-white/20 text-white placeholder:text-gray-500"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {submitted && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
            Thank you! Your message has been submitted. We'll be in touch soon.
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || submitted}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : submitted ? 'Message Sent!' : 'Send Inquiry'}
        </Button>

        <p className="text-xs sm:text-sm text-gray-400 text-center">
          We respect your privacy. Your message will be routed securely to the appropriate team.
        </p>
      </form>
    </div>
  )
}
