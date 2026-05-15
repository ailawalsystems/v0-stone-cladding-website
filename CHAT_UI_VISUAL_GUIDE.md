# AI Chat Enhancement - Visual Guide

## 1. Floating Button Evolution

### Before (Two-Button Setup)
```
┌─────────────────┐
│   Web Page      │
│                 │
│   [Content]     │ ┌────────────────┐
│                 │ │ Stop Speaking  │ ← VolumeX button
│   [Content]     │ │ (if speaking)  │
│                 │ │                │
│   [Content]     │ ├────────────────┤
│                 │ │ Open Assistant │ ← MessageCircle button
│                 │ └────────────────┘
│                 │ ↑ Click to expand
│                 │ 
│                 │ ⊙ <- Main button (animate)
└─────────────────┘
```

**Complexity:** User had to expand first, then click to open (2 steps)

### After (Single Button)
```
┌─────────────────┐
│   Web Page      │
│                 │
│   [Content]     │
│                 │
│   [Content]     │ 
│                 │
│   [Content]     │ 
│                 │ 
│                 │
│                 │ ⊙ <- Click directly to open
└─────────────────┘
```

**Simplicity:** Click once to open chat (1 step)

---

## 2. Chat Window Responsiveness

### Mobile View (320px - 640px)
```
┌────────────────────┐
│ Stone Assist | X    │ ← Header (compact)
├────────────────────┤
│ Start a convers...  │
│                    │
│                    │
│ User: Hello        │
│ Assistant: Hi!     │
│ [Listen] [Stop]    │ ← Message buttons (if TTS on)
│                    │
├────────────────────┤
│ ┌────────────┬───┐ │
│ │ Type msg...│ ➤ │ │ ← Input area (compact)
│ └────────────┴───┘ │
├────────────────────┤
│ Clear conversation │
└────────────────────┘

Height: 100vh - 2rem (full screen minus margins)
Padding: p-3 (compact)
Text: text-xs/sm (readable)
```

**Features:**
- Fills entire mobile screen
- Respects safe areas (notches, home buttons)
- Touch targets 44px+ for easy tapping
- No horizontal scroll needed

### Tablet View (641px - 1024px)
```
┌────────────────────────────┐
│ Stone Assistant | ♪ | X     │ ← Expanded header
├────────────────────────────┤
│ Start a conversation...     │
│                            │
│ User: Hello World          │
│ Assistant: Hi there!       │
│ [Listen] [Stop]            │
│                            │
│ User: How can you help?    │
│ Assistant: I can assist... │
│ [Listen] [Stop]            │
│                            │
├────────────────────────────┤
│ ┌──────────────────┬─────┐ │
│ │ Type message...  │ ➤   │ │
│ └──────────────────┴─────┘ │
└────────────────────────────┘

Height: 500px (reasonable height)
Padding: p-4 (standard)
Max Width: 428px (sm)
Text: text-sm/base (comfortable)
```

**Features:**
- Comfortable height for reading
- Centered on screen
- More generous spacing than mobile
- Better readability

### Desktop View (1025px+)
```
┌─────────────────────────────────┐
│ Stone Assistant | ♪ | X          │ ← Full header
│                                  │
├─────────────────────────────────┤
│ Start a conversation with         │
│ Stone Assistant                  │
│                                  │
│ User: Tell me about your features│
│                                  │
│ Assistant: I can help you with... │
│ [Listen] [Stop]                  │
│                                  │
│ User: What about mobile support? │
│                                  │
│ Assistant: Full responsive...    │
│ [Listen] [Stop]                  │
│                                  │
│ User: Text-to-speech?           │
│                                  │
│ Assistant: Yes! Click Listen...  │
│ [Listen] [Stop]                  │
│                                  │
├─────────────────────────────────┤
│ ┌──────────────────────┬───────┐ │
│ │ Type your message... │ ➤     │ │
│ └──────────────────────┴───────┘ │
│                                  │
│ Clear conversation              │
└─────────────────────────────────┘

Height: 600px (full featured)
Padding: p-6 (generous)
Max Width: 512px (xl)
Text: text-base/lg (large)
```

**Features:**
- Spacious layout with comfortable spacing
- Full featured with all options visible
- Easy to read long conversations
- Professional appearance

---

## 3. Speaker Button States

### Header Speaker Button

#### When NLP + TTS Disabled (Hidden)
```
┌──────────────────────────┐
│ Stone Assistant      | X  │
│ Your AI guide             │
└──────────────────────────┘

Speaker button: NOT VISIBLE
```

#### When NLP + TTS Enabled, TTS OFF (Gray)
```
┌──────────────────────────┐
│ Stone Assistant ♪ | X     │
│ Your AI guide             │
└──────────────────────────┘
    ↑ Speaker icon (gray/muted)
```

#### When NLP + TTS Enabled, TTS ON (Orange)
```
┌──────────────────────────┐
│ Stone Assistant ♪ | X     │
│ Your AI guide             │
└──────────────────────────┘
    ↑ Speaker icon (orange/enabled)
    ↑ Highlighted background
```

### Per-Message Buttons

#### Assistant Message (TTS OFF)
```
User: Tell me about stone
