# AI Agent Backend

A fully functional AI agent backend with weather information, mathematical calculations, conversational AI, and RAG-based knowledge retrieval - all running completely free without paid API dependencies.

**🌐 Live Demo**: [https://ai-agent-backend-f46h.onrender.com](https://ai-agent-backend-f46h.onrender.com)

## 🚀 Features

- **Weather Plugin**: Real-time weather information for any city using OpenWeatherMap API
- **Math Plugin**: Mathematical expression evaluation and calculations
- **Free AI Service**: Intelligent conversational responses without OpenAI billing
- **Memory Management**: Conversation history tracking across sessions
- **RAG System**: Document knowledge retrieval with free embeddings
- **Professional REST API**: Clean endpoints with proper error handling

## 🛠️ Setup Steps

### Prerequisites

- Node.js 18+ installed
- Git installed

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ai-agent-backend.git
cd ai-agent-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**
   Create a `.env` file:

```env
WEATHER_API_KEY=your_openweathermap_api_key
PORT=3000
```

4. **Get Weather API Key** (Free)

   - Go to [OpenWeatherMap](https://openweathermap.org)
   - Sign up for free account
   - Get your API key from the dashboard
   - Add it to your `.env` file

5. **Start Development Server**

```bash
npm run dev
```

6. **Build for Production**

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Base URL

- **Local**: `http://localhost:3000`
- **Live Production**: `https://ai-agent-backend-f46h.onrender.com`

### Endpoints

#### Health Check

```bash
GET /
```

**Live Example**: [https://ai-agent-backend-f46h.onrender.com](https://ai-agent-backend-f46h.onrender.com)

#### Send Message to Agent

```bash
POST /agent/message
Content-Type: application/json

{
  "message": "your message here",
  "session_id": "unique-session-id"
}
```

## 🧪 Sample Commands

### Using cURL (Live Production)

#### Weather Information

```bash
curl -X POST https://ai-agent-backend-f46h.onrender.com/agent/message \
  -H "Content-Type: application/json" \
  -d '{"message": "weather in Tokyo", "session_id": "demo-session"}'
```

#### Mathematical Calculations

```bash
curl -X POST https://ai-agent-backend-f46h.onrender.com/agent/message \
  -H "Content-Type: application/json" \
  -d '{"message": "calculate 125 * 456", "session_id": "demo-session"}'
```

#### General Conversation

```bash
curl -X POST https://ai-agent-backend-f46h.onrender.com/agent/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, what can you help me with?", "session_id": "demo-session"}'
```

#### Help Command

```bash
curl -X POST https://ai-agent-backend-f46h.onrender.com/agent/message \
  -H "Content-Type: application/json" \
  -d '{"message": "help", "session_id": "demo-session"}'
```

#### Time and Date

```bash
curl -X POST https://ai-agent-backend-f46h.onrender.com/agent/message \
  -H "Content-Type: application/json" \
  -d '{"message": "what time is it?", "session_id": "demo-session"}'
```

### Using cURL (Local Development)

#### Weather Information

```bash
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{"message": "weather in Tokyo", "session_id": "demo-session"}'
```

#### Mathematical Calculations

```bash
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{"message": "calculate 125 * 456", "session_id": "demo-session"}'
```

### Using Postman

1. **Method**: POST
2. **URL**: `https://ai-agent-backend-f46h.onrender.com/agent/message`
3. **Headers**:
   - `Content-Type: application/json`
4. **Body** (raw JSON):

```json
{
  "message": "weather in London",
  "session_id": "test-session-123"
}
```

## 🌐 Live Demo & Testing

**Try the live API right now:**

1. **Health Check**: [https://ai-agent-backend-f46h.onrender.com](https://ai-agent-backend-f46h.onrender.com)

2. **Weather Query**:

```bash
curl -X POST https://ai-agent-backend-f46h.onrender.com/agent/message \
  -H "Content-Type: application/json" \
  -d '{"message": "weather in Paris", "session_id": "test"}'
```

3. **Math Calculation**:

```bash
curl -X POST https://ai-agent-backend-f46h.onrender.com/agent/message \
  -H "Content-Type: application/json" \
  -d '{"message": "calculate 999 + 111", "session_id": "test"}'
```

## 🏗️ Agent Architecture and Flow

### Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   HTTP Request  │───▶│  Agent Controller │───▶│  Plugin Manager │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ Memory Manager   │    │ Weather Plugin  │
                       └──────────────────┘    │ Math Plugin     │
                                │              └─────────────────┘
                                ▼                        │
                       ┌──────────────────┐              ▼
                       │   RAG Service    │    ┌─────────────────┐
                       └──────────────────┘    │ Free AI Service │
                                │              └─────────────────┘
                                ▼                        │
                       ┌──────────────────┐              ▼
                       │ Embedding Service│    ┌─────────────────┐
                       └──────────────────┘    │  HTTP Response  │
                                               └─────────────────┘
```

### Request Flow

1. **HTTP Request**: Client sends message to `/agent/message`
2. **Controller**: Validates request and extracts message/session_id
3. **Memory Management**: Stores user message and retrieves conversation history
4. **RAG Processing**: Generates embeddings and finds relevant knowledge chunks
5. **Plugin Detection**: Checks if message matches weather or math patterns
6. **Plugin Execution**: If match found, executes appropriate plugin
7. **AI Response**: If no plugin match, uses Free AI Service for response
8. **Memory Storage**: Stores assistant response in conversation history
9. **HTTP Response**: Returns formatted JSON response to client

### Plugin Routing Logic

```typescript
// Weather Plugin: Detects patterns like "weather in [city]"
const weatherMatch = message.match(/weather\s+in\s+([a-zA-Z\s]+)/i);

// Math Plugin: Detects mathematical expressions
const mathExpressions = [
  /(\d+(?:\.\d+)?)\s*[\+\-\*\/]\s*(\d+(?:\.\d+)?)/,
  /calculate\s+(.+)/i,
  /what\s+is\s+(.+)\s*[\+\-\*\/]\s*(.+)/i,
];
```

### Memory and Context Integration

- **Session-based Memory**: Each session maintains up to 50 messages
- **Recent Context**: Last 2 messages included in AI prompts
- **RAG Context**: Top 3 relevant document chunks retrieved
- **Plugin Results**: Integrated into conversation flow
- **Automatic Cleanup**: Sessions older than 24 hours are cleaned

## 🔧 Technology Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Weather API**: OpenWeatherMap (free tier)
- **AI Service**: Custom rule-based system (no external AI costs)
- **Embeddings**: Custom hash-based system (completely free)
- **Memory**: In-memory session management
- **Deployment**: Render (free tier)
- **Live URL**: [https://ai-agent-backend-f46h.onrender.com](https://ai-agent-backend-f46h.onrender.com)

## 🌟 Key Benefits

- **100% Free Operation**: No paid API dependencies
- **Production Ready**: Professional error handling and logging
- **Scalable Architecture**: Modular plugin system
- **Intelligent Routing**: Smart message categorization
- **Memory Persistence**: Conversation context across messages
- **Real-time Data**: Live weather information
- **Mathematical Processing**: Complex calculation support
- **Global Accessibility**: Deployed on Render with worldwide access

## 🚀 Deployment Information

- **Platform**: Render (Free Tier)
- **Live URL**: [https://ai-agent-backend-f46h.onrender.com](https://ai-agent-backend-f46h.onrender.com)
- **Auto-Deploy**: Enabled (deploys automatically on Git push)
- **Cold Start**: ~10-15 seconds (typical for free hosting)
- **Uptime**: 99%+ availability
- **Global CDN**: Worldwide access via Render's infrastructure
