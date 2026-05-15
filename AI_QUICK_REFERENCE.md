# AI Assistant - Quick Reference Card

## 🚀 Getting Started (2 minutes)

```bash
# 1. Set API Key
export OPENAI_API_KEY="sk-your-key"

# 2. Start dev server
npm run dev  # or yarn dev / pnpm dev

# 3. Visit main page
# http://localhost:3000 → See floating button!

# 4. Visit admin
# http://localhost:3000/admin → Configure AI
```

## 📍 Key Locations

| What | Where |
|------|-------|
| Floating Button | `components/floating-ai-button.tsx` |
| Chat Modal | `components/ai-assistant-modal.tsx` |
| Admin Panel | `components/admin/ai-settings.tsx` |
| Context Hook | `components/ai-assistant-provider.tsx` |
| Config API | `app/api/ai-assistant/config/route.ts` |
| Chat API | `app/api/ai-assistant/chat/route.ts` |
| Database | `lib/db.ts` |
| Config File | `.data/ai-assistant-config.json` |

## 🎯 Main Features

- ✅ Floating AI button (4 position options)
- ✅ Chat interface with message history
- ✅ Text-to-speech (3 voice options)
- ✅ Admin configuration panel
- ✅ Model selection (4 AI models)
- ✅ Temperature & token control
- ✅ System prompt customization
- ✅ Toggle features on/off
- ✅ Animations (configurable speed)

## 🔧 How to Use

### As a User
1. Click floating button (bottom-right)
2. Type a question
3. Click send or press Enter
4. Click speaker icon to hear response

### As an Admin
1. Go to `/admin`
2. Enter your ADMIN_KEY
3. Click "AI Assistant" tab
4. Configure settings
5. Click "Save Changes"

## 📝 Key Code Snippets

### Use AI Hook in Component
```typescript
import { useAIAssistant } from '@/components/ai-assistant-provider'

function MyComponent() {
  const { isOpen, openAssistant, messages, sendMessage } = useAIAssistant()
  // Use these properties...
}
```

### Access Current Config
```typescript
const { config } = useAIAssistant()
console.log(config.name)        // "Stone Assistant"
console.log(config.temperature) // 0.7
console.log(config.enabled)     // true
```

### Send Message Programmatically
```typescript
const { sendMessage } = useAIAssistant()
await sendMessage("Tell me about stone cladding")
```

### Get Configuration (API)
```bash
curl http://localhost:3000/api/ai-assistant/config
```

### Update Configuration (Admin)
```bash
curl -X PATCH http://localhost:3000/api/ai-assistant/config \
  -H "x-admin-key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Name", "temperature": 0.8}'
```

## ⚙️ Configuration Options

| Setting | Type | Default | Range |
|---------|------|---------|-------|
| enabled | boolean | true | true/false |
| name | string | Stone Assistant | any |
| model | enum | gpt-3.5-turbo | gpt-4, gpt-3.5, claude |
| temperature | number | 0.7 | 0 - 2 |
| maxTokens | number | 500 | 10 - 4000 |
| position | enum | bottom-right | 4 corners |
| accentColor | hex | #ff8c42 | any hex |
| animationDuration | number | 300 | 100 - 1000 |

## 🎨 Customization

### Change Button Position
Admin → AI Assistant → Basic Settings → Button Position

### Change Button Color
Admin → AI Assistant → Basic Settings → Accent Color
(Click the color square or paste hex like `#ff0000`)

### Change AI Behavior
Admin → AI Assistant → AI Model Settings → System Prompt

Example prompts:
```
"You are a stone cladding expert with 20+ years experience."

"You are a friendly customer service bot. Keep answers short."

"You specialize in sustainable building materials."
```

### Adjust Creativity
Admin → AI Assistant → AI Model Settings → Temperature
- 0.0 - 0.5 = Focused, consistent
- 0.5 - 1.0 = Balanced
- 1.0 - 2.0 = Creative, varied

## 🆘 Quick Troubleshooting

### "AI button not showing"
```bash
# 1. Check enabled in admin
# 2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
# 3. Check console: F12 → Console tab
```

### "Chat not responding"
```bash
# 1. Verify API key set:
echo $OPENAI_API_KEY

# 2. Restart dev server:
npm run dev

# 3. Check admin key is correct
```

### "No audio"
```bash
# 1. Check volume is on
# 2. Verify TTS enabled in admin
# 3. Try different voice option
# 4. Try Chrome browser
```

### "Admin key rejected"
```bash
# Verify key matches:
echo $ADMIN_KEY

# Then try admin login again
```

## 📚 Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| AI_SETUP.md | Quick start | 5 min |
| AI_ASSISTANT_GUIDE.md | Full reference | 20 min |
| AI_IMPLEMENTATION_SUMMARY.md | Overview | 15 min |
| AI_FILES_MANIFEST.md | File listing | 5 min |

## 🔌 API Endpoints

```
GET  /api/ai-assistant/config
     → Returns current configuration

PATCH /api/ai-assistant/config
     → Updates configuration (admin key required)

POST /api/ai-assistant/chat
     → Send message and get response
```

## 💾 Configuration File

Location: `.data/ai-assistant-config.json`

Auto-created on first run with defaults.
Edit directly to change settings outside admin panel.

## 🎭 UI Positions

```
Floating button can go to:
├── bottom-right  (recommended)
├── bottom-left
├── top-right
└── top-left
```

## 🗣️ Text-to-Speech Voices

```
Voice options:
├── default   (browser default)
├── alt1      (alternative voice 1)
└── alt2      (alternative voice 2)
```

## 🎬 Animation Durations

```
Speed range: 100ms to 1000ms
Default: 300ms

Faster (100-200ms) = Snappier feel
Slower (500-1000ms) = More dramatic
```

## 🔒 Security

- Admin panel protected with ADMIN_KEY
- Configuration changes require admin key
- Chat messages are private (in-browser)
- No API keys exposed to client

## 📱 Browser Support

| Browser | Support | TTS |
|---------|---------|-----|
| Chrome | ✅ Full | ✅ Yes |
| Firefox | ✅ Full | ⚠️ Limited |
| Safari | ✅ Full | ✅ Yes |
| Edge | ✅ Full | ✅ Yes |

## 🚀 Deployment

1. Set OPENAI_API_KEY in production env
2. Set ADMIN_KEY securely
3. Deploy to Vercel/hosting
4. Configuration persists in .data folder

## 📞 Support Resources

**Quick Issues**: Check AI_SETUP.md troubleshooting

**Detailed Help**: Read AI_ASSISTANT_GUIDE.md

**How It Works**: See AI_IMPLEMENTATION_SUMMARY.md

**File Details**: Check AI_FILES_MANIFEST.md

## 🎯 Common Tasks

### Disable AI Assistant
Admin → AI Assistant → Basic Settings → Enable toggle OFF

### Change Response Length
Admin → AI Assistant → AI Model Settings → Max Tokens
(Higher = longer responses)

### Enable Knowledge Base
Admin → AI Assistant → Features → Knowledge Base Access → ON

### Toggle Text-to-Speech
Admin → AI Assistant → Features → Text-to-Speech → ON/OFF

### Change Animation Speed
Admin → AI Assistant → Features → Animation Duration slider

### Reset to Defaults
Admin → Click "Reset" button (if changes made)

## 🔑 Environment Variables

```bash
# Required (choose one)
export OPENAI_API_KEY="sk-..."
export AI_GATEWAY_API_KEY="..."

# Required (existing)
export ADMIN_KEY="your-secure-key"
```

## 📊 Models Available

```
GPT-4              (Most capable, slower, expensive)
GPT-3.5 Turbo      (Balanced, fast, recommended)
Claude Opus        (Very capable, thoughtful)
Claude Sonnet      (Balanced, natural)
```

## ✨ Features Breakdown

**User Features**
- Floating animated button
- Real-time chat
- Message history
- Text-to-speech playback
- Clear conversation

**Admin Features**
- Configuration dashboard
- Model selection
- Parameter tuning
- Feature toggles
- Real-time updates

## 🎓 Model Recommendations

| Use Case | Model | Temperature |
|----------|-------|------------|
| Customer support | GPT-3.5 | 0.5 |
| Sales consultation | GPT-4 | 0.7 |
| FAQ answers | GPT-3.5 | 0.3 |
| Creative content | Claude | 0.9 |

## 💡 Pro Tips

1. **Lower temperature** (0.5) for consistency
2. **Higher temperature** (1.0+) for creativity
3. **Start with GPT-3.5** then upgrade if needed
4. **Update system prompt** quarterly based on questions
5. **Monitor API usage** to manage costs

## 🎉 You're Ready!

Your AI Assistant is configured and running. 
Start conversations and customize based on feedback!

---

**Last Updated**: May 14, 2026
**Version**: 1.0.0
