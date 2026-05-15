# AI System Integration Guide

## Quick Start

### 1. Access Admin Panel
```
URL: http://localhost:3000/admin
Admin Key: key
```

### 2. Navigate to AI Settings
- Dashboard → AI Assistant Tab (Sparkles icon)
- Four sub-tabs: Providers, Model Config, NLP Settings, Knowledge Base

### 3. Configure Your First Provider

#### Option A: OpenAI
1. Click **Providers** tab
2. Expand OpenAI card
3. Paste your OpenAI API key in the input field
4. Click "Save API Key"
5. Green checkmark appears when configured

#### Option B: Anthropic
1. Expand Anthropic card
2. Enter Claude API key
3. Save and you're ready to use Claude models

#### Option C: Google Gemini
1. Expand Google Gemini card
2. Enter Google API key
3. Save and select Gemini models

#### Option D: Local Ollama
- Already configured (no API key needed)
- Requires Ollama running on `http://localhost:11434`

### 4. Select Model
1. Click **Model Config** tab
2. **Provider dropdown**: Select a configured provider
3. **Model dropdown**: Choose from available models
4. Adjust parameters:
   - Temperature: Control creativity (0-2)
   - Top P: Nucleus sampling (0-1)
   - Max Tokens: Response length limit
   - Frequency Penalty: Reduce repetition
5. Customize system prompt
6. Click **Save Configuration**

### 5. Enhanced NLP (Optional)
1. Click **NLP Settings** tab
2. Enable desired features:
   - ✓ Tokenization (break into tokens)
   - ✓ Entity Extraction (find names, dates, etc.)
   - ✓ Sentiment Analysis (detect mood/tone)
   - ✓ Keyword Extraction (find key terms)
   - ✓ Text Classification (categorize text)
3. Select language (default: English)
4. Optional text processing:
   - Remove stopwords (common words like "the", "a")
   - Lemmatization (reduce words to base form)
   - Stemming (aggressive word reduction)

### 6. Knowledge Base
1. Click **Knowledge Base** tab
2. Upload documents (PDF, TXT, MD):
   - Product guides
   - Company policies
   - Technical documentation
   - FAQs
3. Documents are immediately indexed
4. Chat automatically retrieves relevant docs

## API Integration

### Get Providers
```bash
curl -H "x-admin-key: key" \
  http://localhost:3000/api/ai-assistant/providers
```

Response:
```json
[
  {
    "id": "1",
    "provider": "openai",
    "name": "OpenAI",
    "isConfigured": true,
    "models": [
      {
        "id": "gpt-4-turbo",
        "name": "gpt-4-turbo-preview",
        "displayName": "GPT-4 Turbo",
        "contextWindow": 128000,
        "costPer1kTokens": 0.01
      }
    ]
  }
]
```

### Update Provider
```bash
curl -X PATCH \
  -H "x-admin-key: key" \
  -H "Content-Type: application/json" \
  -d '{"apiKey":"sk-...","isConfigured":true}' \
  http://localhost:3000/api/ai-assistant/providers/1
```

### Get Knowledge Base
```bash
curl -H "x-admin-key: key" \
  http://localhost:3000/api/ai-assistant/knowledge-base
```

### Upload Document
```bash
curl -X POST \
  -H "x-admin-key: key" \
  -F "file=@guide.pdf" \
  -F "title=Product Guide" \
  -F "category=documentation" \
  http://localhost:3000/api/ai-assistant/knowledge-base
```

### Delete Document
```bash
curl -X DELETE \
  -H "x-admin-key: key" \
  -H "Content-Type: application/json" \
  -d '{"docId":"123456"}' \
  http://localhost:3000/api/ai-assistant/knowledge-base
```

## Environment Variables

Add these to your `.env` for provider access:

```env
ADMIN_KEY=key

# OpenAI
OPENAI_API_KEY=sk_your_key_here

# Anthropic
ANTHROPIC_API_KEY=sk-ant_your_key_here

# Google
GOOGLE_API_KEY=your_key_here

# DeepSeek
DEEPSEEK_API_KEY=your_key_here

# xAI (Grok)
XAI_API_KEY=your_key_here

# Groq
GROQ_API_KEY=your_key_here

# Ollama (if using local)
OLLAMA_BASE_URL=http://localhost:11434
```

## Model Selection Guide

### For Speed & Cost: ⚡ Fast & Cheap
- Groq Mixtral 8x7B ($0.00024/1k)
- GPT-3.5 Turbo ($0.0005/1k)
- Gemini Flash ($0.000075/1k)

### For Quality: ⭐ Best Results
- Claude 3 Opus (200k context)
- GPT-4 Turbo (128k context)
- Gemini 1.5 Pro (1M context)

### For Local/Privacy: 🏠 On-Device
- Ollama + Llama 2 (free, local)
- Ollama + Mistral (free, local)
- DeepSeek Chat ($0.0002/1k)

## Troubleshooting

### Provider Not Appearing as Configured
- Check API key is correctly entered
- Verify environment variable is set
- Refresh page after saving

### Chat Not Using Knowledge Base
- Go to NLP Settings tab and verify enabled
- Upload at least one document
- Check document content is not empty

### NLP Features Not Working
- Ensure NLP is enabled in settings
- Check selected language matches content
- Verify feature is toggled ON

### Models Not Appearing
- Select a different provider (should be configured)
- Clear browser cache
- Restart dev server

## Database Schema Reference

### AIProviderConfig
```typescript
{
  id: string
  provider: 'openai' | 'anthropic' | 'google' | 'deepseek' | 'xai' | 'groq' | 'ollama'
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
  rateLimitPerMinute: number
}
```

### AIAssistantConfig
```typescript
{
  id: string
  enabled: boolean
  provider: AIProvider
  model: string
  temperature: number (0-2)
  topP: number (0-1)
  maxTokens: number
  frequencyPenalty: number (0-2)
  presencePenalty: number (0-2)
  systemPrompt: string
  knowledgeBaseEnabled: boolean
  nlpEnabled: boolean
  textToSpeechEnabled: boolean
  // ... UI settings
}
```

### KnowledgeBase
```typescript
{
  id: string
  documents: KnowledgeBaseDocument[]
  searchMethod: 'semantic' | 'keyword' | 'hybrid'
  maxRetrievalResults: number
  relevanceThreshold: number
}
```

---

**For questions or issues**: Check `AI_REDESIGN_COMPLETE.md` for full documentation.
