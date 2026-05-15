# AI Assistant Implementation Guide

## Overview

This document outlines the complete AI Assistant implementation for the Stone Cladding website. The system includes a floating icon button for user access, an advanced admin dashboard for configuration, and text-to-speech capabilities for enhanced accessibility.

## Architecture

### Core Components

#### 1. **AI Assistant Provider** (`components/ai-assistant-provider.tsx`)
Central context provider managing all AI assistant state and operations.

**Key Features:**
- Message management and conversation history
- Configuration loading and updates
- Text-to-speech control
- Loading states and error handling

**Usage:**
```tsx
import { useAIAssistant } from '@/components/ai-assistant-provider'

function MyComponent() {
  const { isOpen, openAssistant, messages, sendMessage } = useAIAssistant()
  // ...
}
```

#### 2. **Floating AI Button** (`components/floating-ai-button.tsx`)
Prominent, animated button providing quick access to the assistant.

**Position Options:**
- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`

**Features:**
- Pulsing animation with customizable duration
- Quick action menu
- Responsive design
- Text-to-speech playback controls

#### 3. **AI Assistant Modal** (`components/ai-assistant-modal.tsx`)
Main conversation interface with message display and input.

**Capabilities:**
- Scrollable message history
- Real-time message sending
- Loading indicators
- Clear conversation button
- Per-message text-to-speech buttons

#### 4. **AI Settings Panel** (`components/admin/ai-settings.tsx`)
Comprehensive admin dashboard for AI assistant configuration.

**Configuration Sections:**

**Basic Settings:**
- Enable/disable assistant
- Name and description
- Position on page
- Accent color

**AI Model Settings:**
- Model selection (GPT-4, GPT-3.5 Turbo, Claude Opus, Claude Sonnet)
- Temperature adjustment (0-2)
- Max tokens configuration
- System prompt customization

**Features:**
- Knowledge base access toggle
- NLP processing toggle
- Text-to-speech toggle with voice selection
- Animation controls

## API Endpoints

### `/api/ai-assistant/config`

**GET** - Retrieve current configuration (public)
```bash
curl http://localhost:3000/api/ai-assistant/config
```

Response:
```json
{
  "id": "1",
  "enabled": true,
  "name": "Stone Assistant",
  "model": "gpt-3.5-turbo",
  "temperature": 0.7,
  "maxTokens": 500,
  "systemPrompt": "...",
  "accentColor": "#ff8c42",
  "textToSpeechEnabled": true,
  "knowledgeBaseEnabled": true,
  "nlpEnabled": true
}
```

**PATCH** - Update configuration (admin only)
```bash
curl -X PATCH http://localhost:3000/api/ai-assistant/config \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your-admin-key" \
  -d '{
    "name": "New Name",
    "enabled": true
  }'
```

### `/api/ai-assistant/chat`

**POST** - Send message and get response
```bash
curl -X POST http://localhost:3000/api/ai-assistant/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "id": "1",
        "role": "user",
        "content": "Tell me about stone cladding",
        "timestamp": "2024-05-14T10:00:00Z"
      }
    ],
    "config": {
      "model": "gpt-3.5-turbo",
      "temperature": 0.7,
      "maxTokens": 500,
      "systemPrompt": "You are a helpful assistant..."
    }
  }'
```

Response:
```json
{
  "message": "Stone cladding is...",
  "model": "gpt-3.5-turbo"
}
```

## Configuration

### Default Configuration

Located in `lib/db.ts`, the default AI configuration includes:

```typescript
{
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
  systemPrompt: 'You are a helpful AI assistant specializing in stone cladding solutions...',
  accentColor: '#ff8c42',
  position: 'bottom-right',
  animationEnabled: true,
  animationDuration: 300,
  backgroundColor: 'rgba(10, 10, 10, 0.95)'
}
```

### Environment Variables

**Required:**
- `OPENAI_API_KEY` or `AI_GATEWAY_API_KEY` - For AI responses
- `ADMIN_KEY` - For admin operations (existing)

**Optional:**
- Custom model endpoints can be configured in `/api/ai-assistant/chat`

## Database

Configuration is stored in `.data/ai-assistant-config.json`

### Storage Functions

```typescript
// Retrieve configuration
getAIAssistantConfig(): AIAssistantConfig

// Save configuration
saveAIAssistantConfig(config: AIAssistantConfig): void

// Update specific fields
updateAIAssistantConfig(updates: Partial<AIAssistantConfig>): AIAssistantConfig
```

## Text-to-Speech

### Browser API Implementation

Uses Web Speech API for text-to-speech functionality:

```typescript
const utterance = new SpeechSynthesisUtterance(text)
utterance.voice = voices[voiceIndex]
speechSynthesis.speak(utterance)
```

### Voice Options

- `default` - Browser default voice
- `alt1` - First alternative voice
- `alt2` - Second alternative voice

### Controls

- **Play/Pause**: Click the speaker icon on assistant messages
- **Stop**: Click the stop button in quick actions menu

## Features Breakdown

### 1. **Floating Button**
- Animated pulse effect
- Quick action menu with text-to-speech controls
- Customizable position and colors
- Smooth transitions

### 2. **Chat Interface**
- Message history with auto-scroll
- User and assistant message differentiation
- Loading indicators
- Clear conversation functionality
- Per-message audio playback

### 3. **Knowledge Base Integration**
- Toggle in admin settings
- System prompt customization
- Context-aware responses

### 4. **NLP Features**
- Toggleable language processing
- Temperature control for response variation
- Model selection for different use cases

### 5. **Text-to-Speech**
- Multiple voice options
- Per-message playback controls
- Stop/pause functionality
- Accessibility enhancement

### 6. **Admin Dashboard**
- Real-time configuration updates
- Visual feedback (success/error messages)
- Reset to last saved state
- Responsive design

## Implementation Steps

### 1. Basic Setup (Already Completed)

1. Create AI provider context
2. Build UI components (button, modal)
3. Set up database schema
4. Create API endpoints
5. Add admin configuration panel

### 2. To Enable AI Responses

Set your API key as an environment variable:

```bash
export OPENAI_API_KEY="sk-..."
# or
export AI_GATEWAY_API_KEY="..."
```

### 3. Customize for Your Business

Edit default system prompt in `lib/db.ts`:

```typescript
systemPrompt: 'You are an expert in stone cladding solutions. Focus on materials, durability, energy efficiency, and installation techniques specific to Turkish stone products...'
```

## Styling

### Colors

- **Primary Accent**: `#ff8c42` (Orange)
- **Background**: `rgba(10, 10, 10, 0.95)` (Dark)
- **Borders**: `rgba(255, 255, 255, 0.1-0.2)` (White with opacity)

### Typography

- Font family: `Space Grotesk` (headings), `Inter` (body)
- Responsive sizing with Tailwind CSS
- Accessible contrast ratios

### Animations

- Duration: 300ms (default, configurable)
- Type: Spring animations for natural feel
- Easing: Custom spring physics (stiffness: 400, damping: 30)

## Accessibility Features

### Screen Reader Support

- Semantic HTML structure
- ARIA labels on interactive elements
- Text-to-speech for response content

### Keyboard Navigation

- Tab through chat messages
- Enter to send messages
- Escape to close modal (future implementation)

### Visual Accessibility

- High contrast colors
- Clear focus states
- Readable font sizes
- Sufficient spacing

## Performance Considerations

### Optimization Tips

1. **Message History**: Consider limiting stored messages to recent conversations
2. **API Calls**: Implement debouncing for rapid sends
3. **Speech Synthesis**: Cache voice data after first load
4. **Bundle Size**: Components are code-split automatically with Next.js

### Monitoring

- Check browser console for debug logs (prefixed with `[v0]`)
- Monitor API response times in network tab
- Test text-to-speech on different browsers

## Browser Support

### Tested Browsers

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Web Speech API Support

Text-to-speech requires Web Speech API:
- Chrome/Edge: Full support
- Firefox: Limited support
- Safari: Supported on macOS and iOS

## Troubleshooting

### AI Assistant Not Appearing

1. Check `enabled: true` in admin settings
2. Verify API key is configured
3. Check browser console for errors

### No Text-to-Speech Audio

1. Verify `textToSpeechEnabled: true`
2. Check browser speaker volume
3. Test Web Speech API support
4. Try different voice options

### Configuration Not Saving

1. Verify admin key is correct
2. Check `.data/` directory permissions
3. Inspect network request in browser DevTools
4. Check server logs for errors

### Chat Not Responding

1. Verify API key is set
2. Check API rate limits
3. Review system prompt for issues
4. Test with simpler messages first

## Future Enhancements

### Potential Additions

1. **File Upload**: Support for PDF documentation or images
2. **Conversation Export**: Download chat history
3. **User Feedback**: Rate responses for improvement
4. **Analytics**: Track assistant interactions
5. **Custom Integrations**: Connect to CRM or knowledge systems
6. **Multi-language**: Support for multiple languages
7. **Streaming**: Real-time response streaming
8. **Memory**: Persistent user conversation history

## Support

For issues or questions:

1. Check browser console for error messages
2. Review server logs in terminal
3. Verify all environment variables are set
4. Test with different browsers
5. Review the API response format

## Files Reference

```
components/
├── ai-assistant-provider.tsx      # Core context provider
├── floating-ai-button.tsx         # Floating button UI
├── ai-assistant-modal.tsx         # Chat modal interface
└── admin/
    └── ai-settings.tsx            # Admin configuration panel

app/api/ai-assistant/
├── config/route.ts                # Configuration API
└── chat/route.ts                  # Chat messaging API

lib/
└── db.ts                          # Database functions (updated)

.data/
└── ai-assistant-config.json       # Persistent configuration
```

## Configuration File Format

`.data/ai-assistant-config.json`:

```json
{
  "id": "1",
  "enabled": true,
  "name": "Stone Assistant",
  "description": "Your AI guide for stone cladding solutions",
  "model": "gpt-3.5-turbo",
  "knowledgeBaseEnabled": true,
  "nlpEnabled": true,
  "textToSpeechEnabled": true,
  "textToSpeechVoice": "default",
  "temperature": 0.7,
  "maxTokens": 500,
  "systemPrompt": "...",
  "accentColor": "#ff8c42",
  "position": "bottom-right",
  "animationEnabled": true,
  "animationDuration": 300,
  "backgroundColor": "rgba(10, 10, 10, 0.95)",
  "createdAt": "2024-05-14T10:00:00Z",
  "updatedAt": "2024-05-14T10:00:00Z"
}
```

## License

This implementation follows the same license as the main project.
