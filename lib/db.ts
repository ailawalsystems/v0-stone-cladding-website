import fs from 'fs'
import path from 'path'

const DB_DIR = path.join(process.cwd(), '.data')
const MESSAGES_FILE = path.join(DB_DIR, 'messages.json')
const CONFIG_FILE = path.join(DB_DIR, 'config.json')
const MEDIA_FILE = path.join(DB_DIR, 'media.json')
const MATERIALS_FILE = path.join(DB_DIR, 'materials.json')
const CONSULTATION_CONFIG_FILE = path.join(DB_DIR, 'consultation-config.json')
const IMAGE_GALLERY_FILE = path.join(DB_DIR, 'image-gallery.json')
const AI_ASSISTANT_CONFIG_FILE = path.join(DB_DIR, 'ai-assistant-config.json')

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

// Message Types
export type MessageType = 'consultation' | 'project' | 'support' | 'material' | 'partnership'

export interface Message {
  id: string
  type: MessageType
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  metadata?: Record<string, any>
  createdAt: string
  status: 'received' | 'processed' | 'archived'
}

export interface MessageConfig {
  messageTypes: {
    [key in MessageType]: {
      label: string
      description: string
      destinations: string[] // email addresses or webhook URLs
      enabled: boolean
    }
  }
  adminEmails: string[]
  webhooks: {
    [key: string]: {
      url: string
      active: boolean
      headers?: Record<string, string>
    }
  }
}

export interface MediaAsset {
  id: string
  type: 'hero-video' | 'hero-image' | 'portfolio-image' | 'thumbnail' | 'testimonial' | 'logo' | 'section-image'
  title: string
  description: string
  filename: string
  url: string
  size: number
  uploadedAt: string
  category: string // e.g., 'header', 'hero', 'testimonials', 'portfolio'
  placement?: string // specific placement identifier (e.g., 'header-logo', 'hero-background')
  altText: string // for accessibility
  width?: number
  height?: number
  tags: string[]
  isActive: boolean
  metadata?: Record<string, any>
}

export interface ImagePlacement {
  id: string
  placementKey: string // e.g., 'header-logo', 'hero-background'
  label: string // display name
  category: string // e.g., 'header', 'hero', 'testimonials'
  description: string
  mediaId?: string // currently assigned media asset
  width?: number
  height?: number
  aspectRatio?: string // e.g., '16/9', '1/1'
  isRequired: boolean
}

export interface ImageGalleryConfig {
  id: string
  placements: ImagePlacement[]
  defaultCategory: string
  createdAt: string
  updatedAt: string
}

export interface Material {
  id: string
  name: string
  category: string
  description: string
  durability: string
  cost: string
  maintenance: string
  applications: string
  imageUrl: string
  features: string[]
  createdAt: string
}

export interface ConsultationChannel {
  id: string
  type: 'phone' | 'email' | 'gmail' | 'whatsapp' | 'telegram'
  label: string
  value: string // phone number, email, username, etc.
  enabled: boolean
  icon?: string // icon name for UI
}

export interface ConsultationConfig {
  id: string
  title: string
  subtitle: string
  channels: ConsultationChannel[]
  backgroundColor: string // hex color
  accentColor: string // hex color
  buttonColor: string // hex color
  buttonTextColor: string // hex color
  animationDuration: number // ms
  animationEnabled: boolean
  closeOnBackdropClick: boolean
  createdAt: string
  updatedAt: string
}

export interface AIAssistantConfig {
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

// Initialize default config if not exists
function initializeConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
  }

  const defaultConfig: MessageConfig = {
    messageTypes: {
      consultation: {
        label: 'Consultation Request',
        description: 'Request a consultation with our team',
        destinations: [],
        enabled: true,
      },
      project: {
        label: 'Project Inquiry',
        description: 'Discuss your upcoming project',
        destinations: [],
        enabled: true,
      },
      support: {
        label: 'Support Request',
        description: 'Request technical support',
        destinations: [],
        enabled: true,
      },
      material: {
        label: 'Material Inquiry',
        description: 'Ask about our stone materials',
        destinations: [],
        enabled: true,
      },
      partnership: {
        label: 'Partnership Proposal',
        description: 'Propose a partnership opportunity',
        destinations: [],
        enabled: true,
      },
    },
    adminEmails: [],
    webhooks: {},
  }

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2))
  return defaultConfig
}

// Initialize default messages array
function initializeMessages() {
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2))
  }
}

// Initialize default media array
function initializeMedia() {
  if (!fs.existsSync(MEDIA_FILE)) {
    fs.writeFileSync(MEDIA_FILE, JSON.stringify([], null, 2))
  }
}

// Initialize default materials array
function initializeMaterials() {
  if (!fs.existsSync(MATERIALS_FILE)) {
    fs.writeFileSync(MATERIALS_FILE, JSON.stringify([], null, 2))
  }
}

// Initialize default consultation config
function initializeConsultationConfig() {
  if (fs.existsSync(CONSULTATION_CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONSULTATION_CONFIG_FILE, 'utf-8'))
  }

  const defaultConfig: ConsultationConfig = {
    id: '1',
    title: 'Get In Touch',
    subtitle: 'Choose your preferred contact method',
    channels: [
      {
        id: '1',
        type: 'phone',
        label: 'Call Us',
        value: '+234701234567',
        enabled: true,
        icon: 'Phone',
      },
      {
        id: '2',
        type: 'email',
        label: 'Email',
        value: 'info@octo21st.com',
        enabled: true,
        icon: 'Mail',
      },
      {
        id: '3',
        type: 'whatsapp',
        label: 'WhatsApp',
        value: '+234701234567',
        enabled: true,
        icon: 'MessageCircle',
      },
      {
        id: '4',
        type: 'telegram',
        label: 'Telegram',
        value: '@octo21st',
        enabled: true,
        icon: 'Send',
      },
    ],
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    accentColor: '#ff8c42',
    buttonColor: '#ff8c42',
    buttonTextColor: '#ffffff',
    animationDuration: 300,
    animationEnabled: true,
    closeOnBackdropClick: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  fs.writeFileSync(CONSULTATION_CONFIG_FILE, JSON.stringify(defaultConfig, null, 2))
  return defaultConfig
}

// Initialize image gallery config
function initializeImageGallery() {
  if (fs.existsSync(IMAGE_GALLERY_FILE)) {
    return JSON.parse(fs.readFileSync(IMAGE_GALLERY_FILE, 'utf-8'))
  }

  const defaultGallery: ImageGalleryConfig = {
    id: '1',
    placements: [
      { id: '1', placementKey: 'header-logo', label: 'Header Logo', category: 'header', description: 'Logo in header', isRequired: true },
      { id: '2', placementKey: 'hero-background', label: 'Hero Background', category: 'hero', description: 'Hero section background', isRequired: true, aspectRatio: '16/9' },
      { id: '3', placementKey: 'overview-image-1', label: 'Overview Section', category: 'overview', description: 'Overview section image', isRequired: false },
      { id: '4', placementKey: 'portfolio-1', label: 'Portfolio Image 1', category: 'portfolio', description: 'Portfolio showcase 1', isRequired: false },
      { id: '5', placementKey: 'portfolio-2', label: 'Portfolio Image 2', category: 'portfolio', description: 'Portfolio showcase 2', isRequired: false },
      { id: '6', placementKey: 'testimonial-avatar-1', label: 'Testimonial Avatar 1', category: 'testimonials', description: 'Avatar for testimonial 1', isRequired: false, aspectRatio: '1/1' },
      { id: '7', placementKey: 'testimonial-avatar-2', label: 'Testimonial Avatar 2', category: 'testimonials', description: 'Avatar for testimonial 2', isRequired: false, aspectRatio: '1/1' },
      { id: '8', placementKey: 'testimonial-avatar-3', label: 'Testimonial Avatar 3', category: 'testimonials', description: 'Avatar for testimonial 3', isRequired: false, aspectRatio: '1/1' },
      { id: '9', placementKey: 'footer-logo', label: 'Footer Logo', category: 'footer', description: 'Logo in footer', isRequired: false },
    ],
    defaultCategory: 'general',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  fs.writeFileSync(IMAGE_GALLERY_FILE, JSON.stringify(defaultGallery, null, 2))
  return defaultGallery
}

// Initialize AI assistant config
function initializeAIAssistantConfig() {
  if (fs.existsSync(AI_ASSISTANT_CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(AI_ASSISTANT_CONFIG_FILE, 'utf-8'))
  }

  const defaultConfig: AIAssistantConfig = {
    id: '1',
    enabled: true,
    name: 'Stone Assistant',
    description: 'Your AI guide for stone cladding solutions',
    model: 'gpt-3.5-turbo',
    knowledgeBaseEnabled: true,
    nlpEnabled: true,
    textToSpeechEnabled: true,
    textToSpeechVoice: 'default',
    temperature: 0.7,
    maxTokens: 500,
    systemPrompt: 'You are a helpful AI assistant specializing in stone cladding solutions. Provide expert advice about materials, installation, design, and durability. Always be professional and helpful.',
    accentColor: '#ff8c42',
    position: 'bottom-right',
    animationEnabled: true,
    animationDuration: 300,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  fs.writeFileSync(AI_ASSISTANT_CONFIG_FILE, JSON.stringify(defaultConfig, null, 2))
  return defaultConfig
}

// Ensure files exist
initializeConfig()
initializeMessages()
initializeMedia()
initializeMaterials()
initializeConsultationConfig()
initializeImageGallery()
initializeAIAssistantConfig()

// Read functions
export function getMessages(): Message[] {
  try {
    return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'))
  } catch {
    return []
  }
}

export function getConfig(): MessageConfig {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
  } catch {
    return initializeConfig()
  }
}

export function getMedia(): MediaAsset[] {
  try {
    return JSON.parse(fs.readFileSync(MEDIA_FILE, 'utf-8'))
  } catch {
    return []
  }
}

export function getMaterials(): Material[] {
  try {
    return JSON.parse(fs.readFileSync(MATERIALS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

// Write functions
export function saveMessages(messages: Message[]): void {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2))
}

export function saveConfig(config: MessageConfig): void {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
}

export function saveMedia(media: MediaAsset[]): void {
  fs.writeFileSync(MEDIA_FILE, JSON.stringify(media, null, 2))
}

export function saveMaterials(materials: Material[]): void {
  fs.writeFileSync(MATERIALS_FILE, JSON.stringify(materials, null, 2))
}

// Helper functions
export function addMessage(message: Omit<Message, 'id' | 'createdAt' | 'status'>): Message {
  const messages = getMessages()
  const newMessage: Message = {
    ...message,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'received',
  }
  messages.push(newMessage)
  saveMessages(messages)
  return newMessage
}

export function updateConfig(updates: Partial<MessageConfig>): MessageConfig {
  const config = getConfig()
  const updated = { ...config, ...updates }
  saveConfig(updated)
  return updated
}

export function addMediaAsset(asset: Omit<MediaAsset, 'id' | 'uploadedAt'>): MediaAsset {
  const media = getMedia()
  const newAsset: MediaAsset = {
    ...asset,
    id: Date.now().toString(),
    uploadedAt: new Date().toISOString(),
  }
  media.push(newAsset)
  saveMedia(media)
  return newAsset
}

export function deleteMessage(id: string): boolean {
  const messages = getMessages()
  const filtered = messages.filter((m) => m.id !== id)
  if (filtered.length < messages.length) {
    saveMessages(filtered)
    return true
  }
  return false
}

export function deleteMediaAsset(id: string): boolean {
  const media = getMedia()
  const filtered = media.filter((m) => m.id !== id)
  if (filtered.length < media.length) {
    saveMedia(filtered)
    return true
  }
  return false
}

export function updateMessage(
  id: string,
  updates: Partial<Message>
): Message | null {
  const messages = getMessages()
  const index = messages.findIndex((m) => m.id === id)
  if (index === -1) return null

  messages[index] = { ...messages[index], ...updates }
  saveMessages(messages)
  return messages[index]
}

export function updateMediaAsset(
  id: string,
  updates: Partial<MediaAsset>
): MediaAsset | null {
  const media = getMedia()
  const index = media.findIndex((m) => m.id === id)
  if (index === -1) return null

  media[index] = { ...media[index], ...updates }
  saveMedia(media)
  return media[index]
}

export function addMaterial(material: Omit<Material, 'id' | 'createdAt'>): Material {
  const materials = getMaterials()
  const newMaterial: Material = {
    ...material,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  materials.push(newMaterial)
  saveMaterials(materials)
  return newMaterial
}

export function updateMaterial(
  id: string,
  updates: Partial<Material>
): Material | null {
  const materials = getMaterials()
  const index = materials.findIndex((m) => m.id === id)
  if (index === -1) return null

  materials[index] = { ...materials[index], ...updates }
  saveMaterials(materials)
  return materials[index]
}

export function deleteMaterial(id: string): boolean {
  const materials = getMaterials()
  const filtered = materials.filter((m) => m.id !== id)
  if (filtered.length < materials.length) {
    saveMaterials(filtered)
    return true
  }
  return false
}

export function getConsultationConfig(): ConsultationConfig {
  try {
    return JSON.parse(fs.readFileSync(CONSULTATION_CONFIG_FILE, 'utf-8'))
  } catch {
    return initializeConsultationConfig()
  }
}

export function saveConsultationConfig(config: ConsultationConfig): void {
  fs.writeFileSync(CONSULTATION_CONFIG_FILE, JSON.stringify(config, null, 2))
}

export function updateConsultationConfig(
  updates: Partial<ConsultationConfig>
): ConsultationConfig {
  const config = getConsultationConfig()
  const updated: ConsultationConfig = {
    ...config,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  saveConsultationConfig(updated)
  return updated
}

export function getImageGallery(): ImageGalleryConfig {
  try {
    return JSON.parse(fs.readFileSync(IMAGE_GALLERY_FILE, 'utf-8'))
  } catch {
    return initializeImageGallery()
  }
}

export function saveImageGallery(config: ImageGalleryConfig): void {
  fs.writeFileSync(IMAGE_GALLERY_FILE, JSON.stringify(config, null, 2))
}

export function updateImageGallery(
  updates: Partial<ImageGalleryConfig>
): ImageGalleryConfig {
  const config = getImageGallery()
  const updated: ImageGalleryConfig = {
    ...config,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  saveImageGallery(updated)
  return updated
}

export function assignMediaToPlacement(placementKey: string, mediaId: string): ImageGalleryConfig {
  const gallery = getImageGallery()
  const placement = gallery.placements.find(p => p.placementKey === placementKey)
  if (placement) {
    placement.mediaId = mediaId
  }
  return updateImageGallery({ placements: gallery.placements })
}

export function getMediaByPlacement(placementKey: string): MediaAsset | null {
  const gallery = getImageGallery()
  const placement = gallery.placements.find(p => p.placementKey === placementKey)
  if (!placement || !placement.mediaId) return null
  
  const media = getMedia()
  return media.find(m => m.id === placement.mediaId) || null
}

export function getAIAssistantConfig(): AIAssistantConfig {
  try {
    return JSON.parse(fs.readFileSync(AI_ASSISTANT_CONFIG_FILE, 'utf-8'))
  } catch {
    return initializeAIAssistantConfig()
  }
}

export function saveAIAssistantConfig(config: AIAssistantConfig): void {
  fs.writeFileSync(AI_ASSISTANT_CONFIG_FILE, JSON.stringify(config, null, 2))
}

export function updateAIAssistantConfig(updates: Partial<AIAssistantConfig>): AIAssistantConfig {
  const config = getAIAssistantConfig()
  const updated: AIAssistantConfig = {
    ...config,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  saveAIAssistantConfig(updated)
  return updated
}
