export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Session {
  id: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}

export interface RAGChunk {
  content: string;
  filename: string;
  score: number;
}

export interface PluginResult {
  type: 'weather' | 'math';
  input: string;
  output: string;
  success: boolean;
}

export interface AgentRequest {
  message: string;
  session_id: string;
}

export interface AgentResponse {
  response: string;
  session_id: string;
  timestamp: Date;
}