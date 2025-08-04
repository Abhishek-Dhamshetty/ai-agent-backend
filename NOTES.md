# Development Notes - AI Agent Backend

## 🤖 What Was AI-Generated vs Manual

### AI-Generated Components (Using GitHub Copilot)

- **Initial project structure** - Copilot suggested the modular architecture
- **TypeScript interfaces** - Generated the type definitions in `src/types/index.ts`
- **Plugin system foundation** - Basic structure for weather and math plugins
- **RAG service skeleton** - Initial embedding and similarity service structure
- **Express router setup** - Basic REST API endpoint structure

### Manual Development

- **Free AI Service** - Completely hand-written rule-based conversation system
- **Free Embedding Service** - Custom hash-based embedding algorithm
- **Plugin detection logic** - Manual regex patterns for weather/math detection
- **Error handling** - All error handling and graceful degradation logic
- **Memory management** - Session-based conversation history system
- **Production configuration** - Deployment setup, environment variables, build scripts
- **OpenAI quota handling** - Fallback mechanisms when API limits are reached

## 🐛 Bugs Faced and Solutions

### 1. **OpenAI Module Resolution Error**

**Problem**:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/Users/.../controller.js'
```

**Cause**: TypeScript ES modules with Node.js were having import resolution issues

**Solution**:

- Updated `tsconfig.json` with proper ES module configuration
- Used `.js` extensions in TypeScript imports
- Added `"type": "module"` to `package.json`
- Configured `ts-node` with ESM support

### 2. **OpenAI Quota Exceeded Error**

**Problem**:

```
RateLimitError: 429 You exceeded your current quota
```

**Cause**: New OpenAI account hit billing/quota limits

**Solution**:

- Implemented graceful degradation with quota detection
- Created `FreeAIService` as a complete replacement
- Added mock embedding service to eliminate OpenAI dependency
- Updated controller to use free services by default

### 3. **Environment Variables Loading Too Late**

**Problem**: OpenAI service initialized before `dotenv.config()` was called

**Solution**:

- Moved `dotenv.config()` to the very top of `server.ts`
- Created `config/env.ts` for early environment loading
- Added re-initialization logic in OpenAI service

### 4. **Missing Docs Folder Error**

**Problem**: RAG service crashed when `docs/` folder didn't exist

**Solution**:

```typescript
try {
  const files = await fs.readdir(docsPath);
} catch (error) {
  console.log("No docs folder found, using sample chunks");
  this.chunks = [
    /* sample data */
  ];
}
```

### 5. **TypeScript Build Errors for Production**

**Problem**: Development worked but production build failed

**Solution**:

- Moved `typescript` from devDependencies to dependencies
- Added proper build script configuration
- Ensured all imports use `.js` extensions

## 🔄 Agent Routing: Plugin Calls + Memory + Context

### Request Processing Flow

```
1. HTTP Request Received
   ↓
2. Extract message + session_id
   ↓
3. Store user message in memory
   ↓
4. Retrieve last 2 messages for context
   ↓
5. Generate embeddings for RAG lookup
   ↓
6. Get top 3 relevant knowledge chunks
   ↓
7. Plugin Detection Logic:
   ┌─────────────────────────────────┐
   │ if (message.match(/weather/i))  │──→ Weather Plugin
   │ if (message.match(/calculate/)) │──→ Math Plugin
   │ else                            │──→ Free AI Service
   └─────────────────────────────────┘
   ↓
8. Execute selected plugin/service
   ↓
9. Store assistant response in memory
   ↓
10. Return JSON response
```

### Plugin Routing Implementation

**Weather Plugin Trigger**:

```typescript
const weatherMatch = message.match(/weather\s+in\s+([a-zA-Z\s]+)/i);
if (weatherMatch) {
  const city = weatherMatch[1]?.trim();
  return await this.weatherPlugin.execute(city);
}
```

**Math Plugin Trigger**:

```typescript
const mathExpressions = [
  /(\d+(?:\.\d+)?)\s*[\+\-\*\/]\s*(\d+(?:\.\d+)?)/,
  /calculate\s+(.+)/i,
  /what\s+is\s+(.+)\s*[\+\-\*\/]\s*(.+)/i,
];
```

**Free AI Service Fallback**:

```typescript
if (!pluginResult || !pluginResult.success) {
  const llmResponse = await freeAIService.generateResponse(message);
}
```

### Memory Integration

**Storage Strategy**:

- Each session maintains up to 50 messages
- Messages include role, content, and timestamp
- Automatic cleanup of sessions older than 24 hours

**Context Building**:

```typescript
const recentMessages = memoryManager.getRecentMessages(session_id, 2);
const ragChunks = await ragService.retrieveRelevantChunks(message, 3);
const prompt = promptBuilder.buildPrompt({
  recentMessages,
  ragChunks,
  pluginResult,
  userMessage: message,
});
```

### Embedding Strategy

**Problem**: OpenAI embeddings cost money and had quota limits

**Solution**: Created deterministic hash-based embeddings:

```typescript
private simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}
```

**Benefits**:

- Completely free operation
- Deterministic results
- Fast computation
- No external API dependencies

## 🚀 Architecture Decisions

### Why Free AI Service Over OpenAI

1. **Cost Efficiency**: No ongoing API costs
2. **Reliability**: No quota limitations
3. **Simplicity**: Easier to debug and maintain
4. **Performance**: Faster response times (no external API calls)

### Plugin System Design

- **Modular**: Easy to add new plugins
- **Priority-based**: Plugins checked before general AI
- **Extensible**: Clear interface for new capabilities

### Memory Management

- **In-memory**: Fast access, suitable for demo/development
- **Session-based**: Isolated conversations
- **Size-limited**: Prevents memory leaks

## 📊 Performance Characteristics

- **Cold Start**: ~2-3 seconds (typical for free hosting)
- **Response Time**: 50-200ms for plugin responses
- **Memory Usage**: ~50MB baseline
- **Throughput**: Handles multiple concurrent sessions
- **Availability**: 99%+ uptime on Render free tier
