# AI Assistant Quick Setup Guide

## Getting Started (5 minutes)

### Step 1: Set Your API Key

Choose one of the AI providers:

#### Option A: OpenAI
```bash
export OPENAI_API_KEY="sk-your-api-key-here"
```

#### Option B: AI Gateway (Vercel)
```bash
export AI_GATEWAY_API_KEY="your-gateway-key"
```

### Step 2: Access Admin Dashboard

1. Go to `http://localhost:3000/admin`
2. Enter your `ADMIN_KEY` from environment variables
3. Click the "AI Assistant" tab

### Step 3: Configure the Assistant

In the admin dashboard:

1. **Enable** the assistant with the toggle
2. **Customize** the name and description
3. **Select** your preferred AI model
4. **Write** your system prompt (describes assistant behavior)
5. **Toggle** features like text-to-speech and knowledge base
6. Click **"Save Changes"**

### Step 4: Test on Main Page

Visit `http://localhost:3000` and you should see:
- Floating AI button in the bottom-right corner
- Animated pulse effect
- Click to open chat interface

## Quick Configuration Examples

### Example 1: Professional Stone Expert
```
System Prompt:
You are an expert stone cladding consultant with 20+ years of experience. 
Provide detailed advice about Turkish stone materials, durability, energy efficiency, 
installation techniques, and maintenance. Always be professional and cite specific 
product characteristics when available.

Model: gpt-4
Temperature: 0.7
Max Tokens: 800
```

### Example 2: Quick FAQ Assistant
```
System Prompt:
You are a helpful customer service bot for stone cladding. Answer common questions 
about materials, pricing, installation timelines, and warranty. Keep responses 
concise and actionable. Direct complex inquiries to sales team.

Model: gpt-3.5-turbo
Temperature: 0.5
Max Tokens: 300
```

## Features Checklist

After setup, verify these features work:

- [ ] **Floating Button**: Visible and clickable
- [ ] **Chat Interface**: Opens when clicking button
- [ ] **Sending Messages**: Type and press Send/Enter
- [ ] **AI Responses**: Assistant replies to messages
- [ ] **Text-to-Speech**: Speaker icon appears and plays audio
- [ ] **Admin Access**: Can change settings and save
- [ ] **Animations**: Smooth transitions and effects

## Troubleshooting Quick Fixes

### "AI Assistant is not appearing"
```bash
# 1. Check it's enabled in admin settings
# 2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
# 3. Check browser console for errors (F12)
```

### "Chat not responding / Error 500"
```bash
# 1. Verify API key is set:
echo $OPENAI_API_KEY  # Should output your key

# 2. Restart dev server:
npm run dev  # or yarn dev / pnpm dev

# 3. Check that API key is valid with: curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

### "No audio in text-to-speech"
```bash
# 1. Check browser speaker volume
# 2. Verify textToSpeechEnabled is ON in admin settings
# 3. Test with a different voice option
# 4. Try a different browser (Chrome works best)
```

### "Admin key rejected"
```bash
# Ensure your ADMIN_KEY matches what you set in env:
echo $ADMIN_KEY  # Should output your admin key
```

## Admin Dashboard Walkthrough

### Location
`/admin` route

### Tabs Available
1. **Message Routing** - Configure message handling
2. **Messages** - View sent messages
3. **Media** - Manage uploads
4. **Placements** - Image placement settings
5. **Materials** - Material listings
6. **Consultation** - Contact settings
7. **AI Assistant** (NEW) - AI configuration

### AI Settings Panel Sections

#### Basic Settings
- Toggle assistant on/off
- Set name and description
- Choose button position (4 corners)
- Pick accent color (click to use color picker)

#### AI Model Settings
- Select model (GPT-4, GPT-3.5, Claude, etc.)
- Adjust temperature slider (creativity 0-2)
- Set max tokens (response length)
- Write system prompt (assistant instructions)

#### Features
- Knowledge base toggle
- NLP processing toggle
- Text-to-speech with voice selection
- Animation toggle with duration slider

## API Reference

### Check Configuration
```bash
curl http://localhost:3000/api/ai-assistant/config
```

### Update Configuration
```bash
curl -X PATCH http://localhost:3000/api/ai-assistant/config \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_KEY" \
  -d '{
    "name": "Your Bot Name",
    "textToSpeechEnabled": true
  }'
```

### Send Chat Message
```bash
curl -X POST http://localhost:3000/api/ai-assistant/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "id": "1",
      "role": "user",
      "content": "What is stone cladding?",
      "timestamp": "2024-05-14T10:00:00Z"
    }],
    "config": {
      "model": "gpt-3.5-turbo",
      "temperature": 0.7,
      "maxTokens": 500,
      "systemPrompt": "You are helpful."
    }
  }'
```

## Customization Tips

### Change Button Position
In admin > AI Assistant > Basic Settings > Button Position
Options: Bottom-Right, Bottom-Left, Top-Right, Top-Left

### Change Button Color
Click the color square or enter hex code in admin settings
Example: `#ff8c42` (orange)

### Adjust Animation Speed
Admin > AI Assistant > Features > Animation Duration
Range: 100-1000ms (lower = faster)

### Customize System Prompt
Admin > AI Assistant > AI Model Settings > System Prompt
This determines how the assistant behaves and what expertise it has.

## Next Steps

1. **Customize**: Edit the system prompt for your business
2. **Test**: Have natural conversations and test features
3. **Monitor**: Check admin dashboard for common questions
4. **Refine**: Adjust model and settings based on results
5. **Deploy**: Push to production when happy

## File Locations

Important files to reference:

```
components/
  ├── ai-assistant-provider.tsx       # Core logic
  ├── floating-ai-button.tsx          # Button UI
  └── ai-assistant-modal.tsx          # Chat UI

components/admin/
  └── ai-settings.tsx                 # Admin panel

app/api/ai-assistant/
  ├── config/route.ts                 # Settings API
  └── chat/route.ts                   # Chat API

.data/
  └── ai-assistant-config.json        # Your saved config

AI_ASSISTANT_GUIDE.md                 # Full documentation
```

## Support Resources

- **Full Guide**: Read `AI_ASSISTANT_GUIDE.md` for detailed documentation
- **Component Code**: Check component files for implementation details
- **API Docs**: See route files for endpoint specifications
- **Environment**: Check `.env` or `.env.local` for API keys

## Performance Tips

1. **Cache responses** for common questions
2. **Limit message history** to recent 50 messages
3. **Use GPT-3.5** for speed, **GPT-4** for quality
4. **Monitor API usage** to manage costs
5. **Test text-to-speech** before deployment

## Common Questions

**Q: How do I change the assistant's personality?**
A: Edit the system prompt in admin > AI Assistant > AI Model Settings

**Q: Can I use a different AI provider?**
A: Yes, modify `/api/ai-assistant/chat` to use your preferred API endpoint

**Q: How do I store conversation history?**
A: Currently stored in browser memory. To persist, modify the provider context.

**Q: Is there a cost per message?**
A: Yes, you pay for API calls. Check your OpenAI/provider billing.

**Q: Can users upload files?**
A: Currently not supported, but can be added to the modal component.

## Done!

Your AI Assistant is now ready to help your customers. Start with the admin dashboard and customize as needed!
