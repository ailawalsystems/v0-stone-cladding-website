import fs from 'fs'
import path from 'path'

const DB_DIR = path.join(process.cwd(), '.data')
const MESSAGES_FILE = path.join(DB_DIR, 'messages.json')
const CONFIG_FILE = path.join(DB_DIR, 'config.json')
const MEDIA_FILE = path.join(DB_DIR, 'media.json')
const MATERIALS_FILE = path.join(DB_DIR, 'materials.json')
const PROJECTS_FILE = path.join(DB_DIR, 'projects.json')
const CONSULTATION_CONFIG_FILE = path.join(DB_DIR, 'consultation-config.json')
const IMAGE_GALLERY_FILE = path.join(DB_DIR, 'image-gallery.json')
const AI_ASSISTANT_CONFIG_FILE = path.join(DB_DIR, 'ai-assistant-config.json')
const AI_PROVIDERS_FILE = path.join(DB_DIR, 'ai-providers.json')
const KNOWLEDGE_BASE_FILE = path.join(DB_DIR, 'knowledge-base.json')

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

export interface PortfolioProject {
  id: string
  title: string
  location: string
  description: string
  category: string
  featureImage: string
  carouselImages: string[]
  videoClips: string[]
  galleryImages: string[]
  detailedDescription: string
  features: string[]
  materials: string[]
  completionDate: string
  client?: string
  budget?: string
  metrics?: {
    area?: string
    sqMeters?: string
    squareFeet?: string
  }
  createdAt: string
  updatedAt: string
  isPublished: boolean
  displayOrder: number
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

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'deepseek' | 'xai' | 'groq' | 'ollama'
export type NLPFeature = 'tokenization' | 'entity-extraction' | 'sentiment-analysis' | 'keyword-extraction' | 'text-classification'

export interface AIProviderConfig {
  id: string
  provider: AIProvider
  name: string
  apiKey?: string
  isConfigured: boolean
  models: {
    id: string
    name: string
    displayName: string
    contextWindow: number
    costPer1kTokens: number
  }[]
  defaultModel: string
  applicationDefaultModel?: string // application-wide default model for this provider
  rateLimitPerMinute: number
  createdAt: string
  updatedAt: string
}

export interface NLPConfig {
  id: string
  enabled: boolean
  features: {
    tokenization: boolean
    entityExtraction: boolean
    sentimentAnalysis: boolean
    keywordExtraction: boolean
    textClassification: boolean
  }
  language: 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ja' | 'zh'
  caseSensitive: boolean
  removeStopwords: boolean
  lemmatization: boolean
  stemming: boolean
  createdAt: string
  updatedAt: string
}

export interface KnowledgeBaseDocument {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  embeddings?: number[] // vector embeddings for semantic search
  metadata: {
    source?: string
    author?: string
    updatedAt: string
  }
  createdAt: string
}

export interface KnowledgeBase {
  id: string
  documents: KnowledgeBaseDocument[]
  searchMethod: 'semantic' | 'keyword' | 'hybrid'
  maxRetrievalResults: number
  relevanceThreshold: number
  createdAt: string
  updatedAt: string
}

export interface AIAssistantConfig {
  id: string
  enabled: boolean
  name: string
  description: string
  provider: AIProvider
  model: string
  knowledgeBaseEnabled: boolean
  knowledgeBasId?: string
  nlpConfigId?: string
  nlpEnabled: boolean
  textToSpeechEnabled: boolean
  textToSpeechVoice: 'default' | 'alt1' | 'alt2'
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
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

// Initialize default projects array
function initializeProjects() {
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2))
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

// Initialize AI providers
function initializeAIProviders() {
  if (fs.existsSync(AI_PROVIDERS_FILE)) {
    return JSON.parse(fs.readFileSync(AI_PROVIDERS_FILE, 'utf-8'))
  }

  const defaultProviders: AIProviderConfig[] = [
    {
      id: '1',
      provider: 'openai',
      name: 'OpenAI',
      apiKey: process.env.OPENAI_API_KEY,
      isConfigured: !!process.env.OPENAI_API_KEY,
      models: [
        { id: 'gpt-4-turbo', name: 'gpt-4-turbo-preview', displayName: 'GPT-4 Turbo', contextWindow: 128000, costPer1kTokens: 0.01 },
        { id: 'gpt-4', name: 'gpt-4', displayName: 'GPT-4', contextWindow: 8192, costPer1kTokens: 0.03 },
        { id: 'gpt-3.5-turbo', name: 'gpt-3.5-turbo', displayName: 'GPT-3.5 Turbo', contextWindow: 4096, costPer1kTokens: 0.0005 },
      ],
      defaultModel: 'gpt-3.5-turbo',
      rateLimitPerMinute: 90,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      provider: 'anthropic',
      name: 'Anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      isConfigured: !!process.env.ANTHROPIC_API_KEY,
      models: [
        { id: 'claude-opus', name: 'claude-3-opus-20240229', displayName: 'Claude 3 Opus', contextWindow: 200000, costPer1kTokens: 0.015 },
        { id: 'claude-sonnet', name: 'claude-3-sonnet-20240229', displayName: 'Claude 3 Sonnet', contextWindow: 200000, costPer1kTokens: 0.003 },
        { id: 'claude-haiku', name: 'claude-3-haiku-20240307', displayName: 'Claude 3 Haiku', contextWindow: 200000, costPer1kTokens: 0.00025 },
      ],
      defaultModel: 'claude-opus',
      rateLimitPerMinute: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      provider: 'google',
      name: 'Google Gemini',
      apiKey: process.env.GOOGLE_API_KEY,
      isConfigured: !!process.env.GOOGLE_API_KEY,
      models: [
        { id: 'gemini-pro', name: 'gemini-1.5-pro', displayName: 'Gemini 1.5 Pro', contextWindow: 1000000, costPer1kTokens: 0.00125 },
        { id: 'gemini-flash', name: 'gemini-1.5-flash', displayName: 'Gemini 1.5 Flash', contextWindow: 1000000, costPer1kTokens: 0.000075 },
      ],
      defaultModel: 'gemini-pro',
      rateLimitPerMinute: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      provider: 'deepseek',
      name: 'DeepSeek',
      apiKey: process.env.DEEPSEEK_API_KEY,
      isConfigured: !!process.env.DEEPSEEK_API_KEY,
      models: [
        { id: 'deepseek-chat', name: 'deepseek-chat', displayName: 'DeepSeek Chat', contextWindow: 32000, costPer1kTokens: 0.0002 },
      ],
      defaultModel: 'deepseek-chat',
      rateLimitPerMinute: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      provider: 'xai',
      name: 'xAI Grok',
      apiKey: process.env.XAI_API_KEY,
      isConfigured: !!process.env.XAI_API_KEY,
      models: [
        { id: 'grok-2', name: 'grok-2', displayName: 'Grok 2', contextWindow: 128000, costPer1kTokens: 0.002 },
      ],
      defaultModel: 'grok-2',
      rateLimitPerMinute: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '6',
      provider: 'groq',
      name: 'Groq',
      apiKey: process.env.GROQ_API_KEY,
      isConfigured: !!process.env.GROQ_API_KEY,
      models: [
        { id: 'mixtral-8x7b', name: 'mixtral-8x7b-32768', displayName: 'Mixtral 8x7B', contextWindow: 32768, costPer1kTokens: 0.00024 },
        { id: 'llama2-70b', name: 'llama2-70b-4096', displayName: 'Llama 2 70B', contextWindow: 4096, costPer1kTokens: 0.0007 },
      ],
      defaultModel: 'mixtral-8x7b',
      rateLimitPerMinute: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '7',
      provider: 'ollama',
      name: 'Ollama (Local)',
      apiKey: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      isConfigured: true,
      models: [
        { id: 'llama2', name: 'llama2', displayName: 'Llama 2', contextWindow: 4096, costPer1kTokens: 0 },
        { id: 'mistral', name: 'mistral', displayName: 'Mistral', contextWindow: 8000, costPer1kTokens: 0 },
        { id: 'neural-chat', name: 'neural-chat', displayName: 'Neural Chat', contextWindow: 8000, costPer1kTokens: 0 },
      ],
      defaultModel: 'llama2',
      rateLimitPerMinute: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  fs.writeFileSync(AI_PROVIDERS_FILE, JSON.stringify(defaultProviders, null, 2))
  return defaultProviders
}

// Initialize NLP config
function initializeNLPConfig() {
  const defaultNLP: NLPConfig = {
    id: '1',
    enabled: true,
    features: {
      tokenization: true,
      entityExtraction: true,
      sentimentAnalysis: true,
      keywordExtraction: true,
      textClassification: true,
    },
    language: 'en',
    caseSensitive: false,
    removeStopwords: true,
    lemmatization: true,
    stemming: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return defaultNLP
}

// Initialize knowledge base
function initializeKnowledgeBase() {
  if (fs.existsSync(KNOWLEDGE_BASE_FILE)) {
    return JSON.parse(fs.readFileSync(KNOWLEDGE_BASE_FILE, 'utf-8'))
  }

  const defaultKB: KnowledgeBase = {
    id: '1',
    documents: [],
    searchMethod: 'hybrid',
    maxRetrievalResults: 5,
    relevanceThreshold: 0.6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  fs.writeFileSync(KNOWLEDGE_BASE_FILE, JSON.stringify(defaultKB, null, 2))
  return defaultKB
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
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    knowledgeBaseEnabled: true,
    nlpEnabled: true,
    textToSpeechEnabled: true,
    textToSpeechVoice: 'default',
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
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
initializeProjects()
initializeConsultationConfig()
initializeImageGallery()
initializeAIProviders()
initializeNLPConfig()
initializeKnowledgeBase()
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

export function getProjects(): PortfolioProject[] {
  try {
    return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'))
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

export function saveProjects(projects: PortfolioProject[]): void {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2))
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

export function addProject(project: Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'>): PortfolioProject {
  const projects = getProjects()
  const newProject: PortfolioProject = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  projects.push(newProject)
  saveProjects(projects)
  return newProject
}

export function updateProject(
  id: string,
  updates: Partial<PortfolioProject>
): PortfolioProject | null {
  const projects = getProjects()
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) return null

  projects[index] = { 
    ...projects[index], 
    ...updates,
    updatedAt: new Date().toISOString()
  }
  saveProjects(projects)
  return projects[index]
}

export function deleteProject(id: string): boolean {
  const projects = getProjects()
  const filtered = projects.filter((p) => p.id !== id)
  if (filtered.length < projects.length) {
    saveProjects(filtered)
    return true
  }
  return false
}

export function reorderProjects(projectIds: string[]): void {
  const projects = getProjects()
  projects.forEach((p, index) => {
    const newOrder = projectIds.indexOf(p.id)
    if (newOrder !== -1) {
      p.displayOrder = newOrder
    }
  })
  saveProjects(projects)
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

// AI Providers
export function getAIProviders(): AIProviderConfig[] {
  try {
    return JSON.parse(fs.readFileSync(AI_PROVIDERS_FILE, 'utf-8'))
  } catch {
    return initializeAIProviders()
  }
}

export function saveAIProviders(providers: AIProviderConfig[]): void {
  fs.writeFileSync(AI_PROVIDERS_FILE, JSON.stringify(providers, null, 2))
}

export function updateAIProvider(providerId: string, updates: Partial<AIProviderConfig>): AIProviderConfig | null {
  const providers = getAIProviders()
  const index = providers.findIndex(p => p.id === providerId)
  if (index === -1) return null
  
  providers[index] = {
    ...providers[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  saveAIProviders(providers)
  return providers[index]
}

export function getAIProvider(provider: AIProvider): AIProviderConfig | null {
  const providers = getAIProviders()
  return providers.find(p => p.provider === provider) || null
}

// NLP Config
export function getNLPConfig(): NLPConfig {
  return initializeNLPConfig()
}

export function updateNLPConfig(updates: Partial<NLPConfig>): NLPConfig {
  const config: NLPConfig = {
    ...getNLPConfig(),
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return config
}

// Knowledge Base
export function getKnowledgeBase(): KnowledgeBase {
  try {
    return JSON.parse(fs.readFileSync(KNOWLEDGE_BASE_FILE, 'utf-8'))
  } catch {
    return initializeKnowledgeBase()
  }
}

export function saveKnowledgeBase(kb: KnowledgeBase): void {
  fs.writeFileSync(KNOWLEDGE_BASE_FILE, JSON.stringify(kb, null, 2))
}

export function addKnowledgeBaseDocument(doc: Omit<KnowledgeBaseDocument, 'id' | 'createdAt'>): KnowledgeBaseDocument {
  const kb = getKnowledgeBase()
  const newDoc: KnowledgeBaseDocument = {
    ...doc,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  kb.documents.push(newDoc)
  saveKnowledgeBase(kb)
  return newDoc
}

export function updateKnowledgeBaseDocument(docId: string, updates: Partial<KnowledgeBaseDocument>): KnowledgeBaseDocument | null {
  const kb = getKnowledgeBase()
  const index = kb.documents.findIndex(d => d.id === docId)
  if (index === -1) return null
  
  kb.documents[index] = {
    ...kb.documents[index],
    ...updates,
    metadata: {
      ...kb.documents[index].metadata,
      updatedAt: new Date().toISOString(),
    },
  }
  saveKnowledgeBase(kb)
  return kb.documents[index]
}

export function deleteKnowledgeBaseDocument(docId: string): boolean {
  const kb = getKnowledgeBase()
  const filtered = kb.documents.filter(d => d.id !== docId)
  if (filtered.length < kb.documents.length) {
    kb.documents = filtered
    saveKnowledgeBase(kb)
    return true
  }
  return false
}

export function updateKnowledgeBaseSettings(updates: Partial<KnowledgeBase>): KnowledgeBase {
  const kb = getKnowledgeBase()
  const updated: KnowledgeBase = {
    ...kb,
    ...updates,
    documents: kb.documents,
    updatedAt: new Date().toISOString(),
  }
  saveKnowledgeBase(updated)
  return updated
}
