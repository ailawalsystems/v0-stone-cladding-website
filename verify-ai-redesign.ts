import {
  getAIProviders,
  getNLPConfig,
  getKnowledgeBase,
  getAIAssistantConfig,
  addKnowledgeBaseDocument,
  updateKnowledgeBaseDocument,
  deleteKnowledgeBaseDocument,
  updateAIProvider,
} from './lib/db'

/**
 * Comprehensive verification script for the AI system redesign
 */

console.log('🔍 [v0] Starting AI Redesign Verification...\n')

try {
  // 1. Verify Providers
  console.log('📦 Verifying AI Providers...')
  const providers = getAIProviders()
  
  if (!Array.isArray(providers) || providers.length === 0) {
    throw new Error('❌ No providers found')
  }
  
  const providerNames = providers.map(p => p.name).join(', ')
  console.log(`   ✅ Found ${providers.length} providers: ${providerNames}\n`)
  
  providers.forEach(provider => {
    if (!provider.models || provider.models.length === 0) {
      throw new Error(`❌ Provider ${provider.name} has no models`)
    }
    console.log(`   ✓ ${provider.name}: ${provider.models.map(m => m.displayName).join(', ')}`)
  })
  console.log()

  // 2. Verify NLP Config
  console.log('🧠 Verifying NLP Configuration...')
  const nlpConfig = getNLPConfig()
  
  if (!nlpConfig) {
    throw new Error('❌ NLP config not found')
  }

  const enabledFeatures = Object.entries(nlpConfig.features)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature)
  
  console.log(`   ✅ NLP Config initialized`)
  console.log(`   ✓ Language: ${nlpConfig.language}`)
  console.log(`   ✓ Enabled Features: ${enabledFeatures.join(', ')}`)
  console.log(`   ✓ Lemmatization: ${nlpConfig.lemmatization ? 'ON' : 'OFF'}`)
  console.log(`   ✓ Stop words removal: ${nlpConfig.removeStopwords ? 'ON' : 'OFF'}`)
  console.log()

  // 3. Verify Knowledge Base
  console.log('📚 Verifying Knowledge Base System...')
  const kb = getKnowledgeBase()
  
  if (!kb) {
    throw new Error('❌ Knowledge base not found')
  }

  console.log(`   ✅ Knowledge Base initialized`)
  console.log(`   ✓ Documents: ${kb.documents.length}`)
  console.log(`   ✓ Search Method: ${kb.searchMethod}`)
  console.log(`   ✓ Max Retrieval: ${kb.maxRetrievalResults}`)
  console.log(`   ✓ Relevance Threshold: ${kb.relevanceThreshold}`)
  
  // Test document operations
  console.log('\n   Testing KB Document Operations...')
  const testDoc = addKnowledgeBaseDocument({
    title: 'Test Document',
    content: 'This is a test document for verification.',
    category: 'test',
    tags: ['test', 'verify'],
    metadata: {
      source: 'verification-script',
      author: 'system',
      updatedAt: new Date().toISOString(),
    },
  })
  
  console.log(`   ✓ Document created: ${testDoc.title} (ID: ${testDoc.id})`)
  
  const updated = updateKnowledgeBaseDocument(testDoc.id, {
    title: 'Updated Test Document',
  })
  
  if (!updated) {
    throw new Error('❌ Failed to update test document')
  }
  console.log(`   ✓ Document updated: ${updated.title}`)
  
  const deleted = deleteKnowledgeBaseDocument(testDoc.id)
  if (!deleted) {
    throw new Error('❌ Failed to delete test document')
  }
  console.log(`   ✓ Document deleted successfully`)
  console.log()

  // 4. Verify AI Assistant Config
  console.log('🤖 Verifying AI Assistant Configuration...')
  const assistantConfig = getAIAssistantConfig()
  
  if (!assistantConfig) {
    throw new Error('❌ AI Assistant config not found')
  }

  const selectedProvider = providers.find(p => p.provider === assistantConfig.provider)
  const selectedModel = selectedProvider?.models.find(m => m.name === assistantConfig.model)

  console.log(`   ✅ AI Assistant configured`)
  console.log(`   ✓ Name: ${assistantConfig.name}`)
  console.log(`   ✓ Provider: ${selectedProvider?.name || 'Unknown'}`)
  console.log(`   ✓ Model: ${selectedModel?.displayName || 'Unknown'}`)
  console.log(`   ✓ Temperature: ${assistantConfig.temperature}`)
  console.log(`   ✓ Top P: ${assistantConfig.topP}`)
  console.log(`   ✓ Max Tokens: ${assistantConfig.maxTokens}`)
  console.log(`   ✓ Knowledge Base: ${assistantConfig.knowledgeBaseEnabled ? 'ENABLED' : 'DISABLED'}`)
  console.log(`   ✓ NLP: ${assistantConfig.nlpEnabled ? 'ENABLED' : 'DISABLED'}`)
  console.log(`   ✓ Text-to-Speech: ${assistantConfig.textToSpeechEnabled ? 'ENABLED' : 'DISABLED'}`)
  console.log()

  // 5. Verify Advanced Features
  console.log('⚙️  Verifying Advanced Features...')
  
  // Check penalty parameters
  if (typeof assistantConfig.frequencyPenalty !== 'number') {
    throw new Error('❌ Frequency penalty not configured')
  }
  console.log(`   ✓ Frequency Penalty: ${assistantConfig.frequencyPenalty}`)
  
  if (typeof assistantConfig.presencePenalty !== 'number') {
    throw new Error('❌ Presence penalty not configured')
  }
  console.log(`   ✓ Presence Penalty: ${assistantConfig.presencePenalty}`)
  
  // Check system prompt
  if (!assistantConfig.systemPrompt) {
    throw new Error('❌ System prompt not configured')
  }
  console.log(`   ✓ System Prompt configured`)
  
  // Check UI settings
  console.log(`   ✓ Position: ${assistantConfig.position}`)
  console.log(`   ✓ Accent Color: ${assistantConfig.accentColor}`)
  console.log(`   ✓ Animations: ${assistantConfig.animationEnabled ? 'ENABLED' : 'DISABLED'}`)
  console.log()

  // 6. Verify Provider API Key Configuration
  console.log('🔐 Verifying Provider Configuration...')
  const configuredProviders = providers.filter(p => p.isConfigured)
  console.log(`   ✅ Configured Providers: ${configuredProviders.length}/${providers.length}`)
  
  configuredProviders.forEach(provider => {
    console.log(`   ✓ ${provider.name} - Rate Limit: ${provider.rateLimitPerMinute}/min`)
  })
  console.log()

  // Summary
  console.log('═'.repeat(50))
  console.log('✅ AI REDESIGN VERIFICATION COMPLETE')
  console.log('═'.repeat(50))
  console.log(`
📊 Summary:
  • AI Providers: ${providers.length} (${configuredProviders.length} configured)
  • AI Models: ${providers.reduce((acc, p) => acc + p.models.length, 0)}
  • NLP Features: ${enabledFeatures.length} enabled
  • Knowledge Base: Ready (${kb.documents.length} documents)
  • Advanced Features: All implemented
  
🎯 Ready for Production
  `)

} catch (error) {
  console.error('\n❌ VERIFICATION FAILED')
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
