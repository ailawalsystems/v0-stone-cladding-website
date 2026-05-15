# AI System Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     STONE CLADDING WEBSITE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │   Main Site      │              │ Admin Dashboard  │        │
│  │  (Home, About)   │              │    (Settings)    │        │
│  │                  │              │                  │        │
│  │ ┌──────────────┐ │              │  ┌────────────┐  │        │
│  │ │  AI Chat     │ │              │  │AI Assistant│  │        │
│  │ │  Assistant   │ │              │  │  Settings  │  │        │
│  │ │  (Floating)  │ │              │  │  Panel     │  │        │
│  │ └──────────────┘ │              │  └────────────┘  │        │
│  └──────────────────┘              └──────────────────┘        │
│          │                                  │                  │
│          └──────────────────┬───────────────┘                  │
│                             │                                  │
└─────────────────────────────┼──────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   API Gateway       │
                    │  (Next.js Routes)   │
                    └─────────────────────┘
                              │
                ┌─────────────┼─────────────┬──────────────┐
                │             │             │              │
                ▼             ▼             ▼              ▼
        ┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐
        │  Config API  │ │ Providers│ │   NLP    │ │Knowledge   │
        │ (Chat/Setup) │ │   API    │ │   API    │ │  Base API  │
        └──────────────┘ └──────────┘ └──────────┘ └────────────┘
                │             │             │              │
                ▼             ▼             ▼              ▼
        ┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐
        │  Database    │ │ Database │ │ Database │ │  Database  │
        │   (Config)   │ │(Providers│ │  (NLP)   │ │    (KB)    │
        └──────────────┘ └──────────┘ └──────────┘ └────────────┘
                │             │             │              │
                └─────────────┴─────────────┴──────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Unified Data Store │
                    │  (.data directory)  │
                    └─────────────────────┘
```

## Provider Integration Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    AI PROVIDERS SYSTEM                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐          │
│  │  OpenAI     │ │ Anthropic   │ │ Google       │          │
│  │ (GPT-4,3.5) │ │ (Claude 3)  │ │ (Gemini)     │          │
│  └──────┬──────┘ └──────┬──────┘ └──────┬───────┘          │
│         │               │               │                  │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐          │
│  │ DeepSeek    │ │ xAI (Grok)  │ │ Groq         │          │
│  │ (Chat)      │ │ (Grok 2)    │ │ (Mixtral)    │          │
│  └──────┬──────┘ └──────┬──────┘ └──────┬───────┘          │
│         │               │               │                  │
│         │      ┌────────┴───────────────┘                  │
│         │      │                                            │
│         └──────┼──────────────┬──────────────┐             │
│                │              │              │             │
│         ┌──────▼─────┐ ┌──────▼───┐ ┌──────▼──┐            │
│         │ Ollama     │ │ Configure │ │ Select  │            │
│         │ (Local)    │ │ API Keys  │ │ Default │            │
│         └────────────┘ └───────────┘ └─────────┘            │
│                                                             │
└──────────────────────────────────────────────────────────────┘
```

## Admin Settings Panel Structure

```
┌─────────────────────────────────────────────────────┐
│      AI Assistant Settings Panel (Admin)            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────┬────────────┬──────┬──────────────┐   │
│  │Providers│Model Config│ NLP  │Knowledge Base│   │
│  └────┬────┴────────────┴──────┴──────────────┘   │
│       │                                            │
│       ▼ SELECTED TAB                               │
│  ┌─────────────────────────────────────────────┐  │
│  │ Tab Content                                 │  │
│  │                                             │  │
│  │ [Config Controls]                           │  │
│  │ [Status Indicators]                         │  │
│  │ [Save/Load Buttons]                         │  │
│  │ [Toast Notifications]                       │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
└─────────────────────────────────────────────────────┘
```

## Data Flow: Chat to Response

```
┌──────────────────────────────────────────────────────────────┐
│                    AI CHAT FLOW                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  User Input                                                  │
│     │                                                        │
│     ▼                                                        │
│  ┌─────────────────┐                                        │
│  │ AI Chat Modal   │                                        │
│  │ (Client)        │                                        │
│  └────────┬────────┘                                        │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────────────────────────────────┐              │
│  │ POST /api/ai-assistant/chat              │              │
│  │ {message, config}                        │              │
│  └────────┬─────────────────────────────────┘              │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────────────────────────────────┐              │
│  │ Load AI Config                           │              │
│  │ • Provider                                │              │
│  │ • Model                                   │              │
│  │ • Parameters                              │              │
│  └────────┬─────────────────────────────────┘              │
│           │                                                  │
│      ┌────┴────────────────┐                                │
│      │                     │                                │
│      ▼                     ▼                                │
│  ┌──────────┐          ┌─────────────┐                     │
│  │NLP       │          │Knowledge    │                     │
│  │Processing│          │Base Search  │                     │
│  │(Optional)│          │(Optional)   │                     │
│  └────┬─────┘          └──────┬──────┘                     │
│       │                       │                             │
│       └───────────┬───────────┘                             │
│                   │                                         │
│                   ▼                                         │
│  ┌──────────────────────────────────────────┐              │
│  │ Build Prompt                             │              │
│  │ • System Prompt                          │              │
│  │ • Context from KB                        │              │
│  │ • NLP-processed input                    │              │
│  └────────┬─────────────────────────────────┘              │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────────────────────────────────┐              │
│  │ Call Selected Provider API                │              │
│  │ • Send with all parameters                │              │
│  │ • Temperature, penalties, etc.            │              │
│  └────────┬─────────────────────────────────┘              │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────────────────────────────────┐              │
│  │ Receive Streaming Response                │              │
│  └────────┬─────────────────────────────────┘              │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────────────────────────────────┐              │
│  │ Optional Text-to-Speech                   │              │
│  │ • Process response                        │              │
│  │ • Stream audio to client                  │              │
│  └────────┬─────────────────────────────────┘              │
│           │                                                  │
│           ▼                                                  │
│  Display in Chat Modal                                     │
│  • Message content                                         │
│  • Listen button (if TTS enabled)                          │
│                                                            │
└──────────────────────────────────────────────────────────────┘
```

## Knowledge Base Integration

```
┌─────────────────────────────────────────────────────┐
│         KNOWLEDGE BASE SYSTEM                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Upload Flow:                                       │
│  ┌─────────────┐                                   │
│  │ PDF/TXT/MD  │                                   │
│  │   File      │                                   │
│  └──────┬──────┘                                   │
│         │                                           │
│         ▼                                           │
│  ┌──────────────────────┐                         │
│  │ Parse & Extract      │                         │
│  │ Content              │                         │
│  └──────┬───────────────┘                         │
│         │                                           │
│         ▼                                           │
│  ┌──────────────────────┐                         │
│  │ Generate Embeddings  │                         │
│  │ (Semantic)           │                         │
│  └──────┬───────────────┘                         │
│         │                                           │
│         ▼                                           │
│  ┌──────────────────────┐                         │
│  │ Store in Database    │                         │
│  │ • Content            │                         │
│  │ • Embeddings         │                         │
│  │ • Metadata           │                         │
│  │ • Tags/Category      │                         │
│  └──────┬───────────────┘                         │
│         │                                           │
│         ▼                                           │
│  ┌──────────────────────┐                         │
│  │ Ready for Retrieval  │                         │
│  └──────────────────────┘                         │
│                                                    │
│  Retrieval Flow (During Chat):                    │
│  ┌─────────────────────────────────┐              │
│  │ User Question                   │              │
│  └────────┬────────────────────────┘              │
│           │                                        │
│      ┌────┴─────────────────┐                     │
│      │                      │                     │
│      ▼                      ▼                     │
│  ┌─────────────┐      ┌──────────────┐           │
│  │ Keyword     │      │ Semantic     │           │
│  │ Search      │      │ Search       │           │
│  │ (TF-IDF)    │      │ (Embeddings) │           │
│  └────────┬────┘      └──────┬───────┘           │
│           │                  │                    │
│           └──────────┬───────┘                    │
│                      │                            │
│                      ▼                            │
│  ┌──────────────────────────────────┐            │
│  │ Rank by Relevance                │            │
│  │ (Score > threshold)               │            │
│  └────────┬─────────────────────────┘            │
│           │                                       │
│           ▼                                       │
│  ┌──────────────────────────────────┐            │
│  │ Return Top N Results             │            │
│  │ (Default: 5 docs)                │            │
│  └────────┬─────────────────────────┘            │
│           │                                       │
│           ▼                                       │
│  Add to Chat Context                             │
│  (Sent to AI model)                              │
│                                                   │
└─────────────────────────────────────────────────────┘
```

## NLP Processing Pipeline

```
┌──────────────────────────────────────────────────┐
│         NLP PROCESSING PIPELINE                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  User Text Input                                 │
│      │                                           │
│      ├─── [1] Tokenization ────┐               │
│      │    (Split into tokens)   │               │
│      │                          │               │
│      ├─── [2] Language Check ──┐│               │
│      │    (Validate language)   ││               │
│      │                          ││               │
│      ├─── [3] Stop Word Removal ├┐              │
│      │    (Remove: the, a, an)  │││             │
│      │                          │││             │
│      ├─── [4] Lemmatization ───┤││             │
│      │    (running→run)         │││             │
│      │                          │││             │
│      ├─── [5] Stemming ────────┘││             │
│      │    (aggressive reduction) ││             │
│      │                          ││             │
│      └─────────────┬────────────┘│             │
│                    │             │             │
│      ┌─────────────┼─────────────┘             │
│      │             │                           │
│      ▼             ▼                           │
│  ┌────────────┐ ┌──────────────────┐          │
│  │Processing  │ │Feature Extraction│          │
│  │Complete    │ │                  │          │
│  │            │ │• Entities        │          │
│  │            │ │• Sentiment       │          │
│  │            │ │• Keywords        │          │
│  │            │ │• Classification  │          │
│  └────────────┘ └──────────────────┘          │
│                    │                          │
│                    ▼                          │
│         Ready for AI Processing               │
│                                               │
└──────────────────────────────────────────────┘
```

## Database Schema

```
┌───────────────────────────────┐
│  ai-assistant-config.json     │  Main Configuration
│                               │  • provider (openai, etc.)
│  • id: string                 │  • model: string
│  • enabled: boolean           │  • temperature: 0-2
│  • name: string               │  • topP: 0-1
│  • description: string        │  • frequencyPenalty: 0-2
│  • provider: AIProvider       │  • presencePenalty: 0-2
│  • model: string              │  • systemPrompt: string
│  • temperature: number        │  • knowledgeBaseEnabled
│  • ... (20 properties)        │  • nlpEnabled
└───────────────────────────────┘  • textToSpeechEnabled

┌───────────────────────────────┐
│  ai-providers.json            │  Provider Configurations
│                               │  • 7 providers
│  Array<AIProviderConfig>      │  • Each has 1-3 models
│  • provider: AIProvider       │  • API key storage
│  • name: string               │  • Rate limits
│  • apiKey: string (secure)    │  • Model details
│  • models: Model[]            │  • isConfigured flag
│  • isConfigured: boolean      │
└───────────────────────────────┘

┌───────────────────────────────┐
│  knowledge-base.json          │  Document Storage
│                               │  • Documents array
│  • id: string                 │  • Search config
│  • documents: Document[]      │  • Metadata
│  • searchMethod: enum         │  • Embeddings
│  • maxRetrievalResults        │  • Categories/tags
│  • relevanceThreshold         │
└───────────────────────────────┘
```

---

**All components working together to provide a comprehensive AI system**
