import express from 'express';
import type { AgentRequest, AgentResponse } from '../types/index.js';
import { MemoryManager } from '../memory/memoryManager.js';
import { RAGService } from '../rag/rag-service.js';
import { PluginDetector } from '../plugins/pluginManager.js';
import { PromptBuilder } from './promptBuilder.js';
import { FreeAIService } from '../utils/free-ai-service.js';

export const agentRouter = express.Router();
const memoryManager = new MemoryManager();
const ragService = new RAGService();
const pluginDetector = new PluginDetector();
const promptBuilder = new PromptBuilder();
const freeAIService = new FreeAIService();

// Initialize RAG service on startup
ragService.initialize().catch(console.error);

agentRouter.post('/message', async (req, res) => {
  try {
    const { message, session_id }: AgentRequest = req.body;

    if (!message || !session_id) {
      return res.status(400).json({ error: 'Message and session_id are required' });
    }

    // Add user message to memory
    memoryManager.addMessage(session_id, {
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Get last 2 messages from memory
    const recentMessages = memoryManager.getRecentMessages(session_id, 2);

    // Embed message and retrieve relevant RAG chunks (will use mock embeddings)
    const ragChunks = await ragService.retrieveRelevantChunks(message, 3);

    // Detect and execute plugins first
    const pluginResult = await pluginDetector.detectAndExecute(message);

    // If plugin handled the request successfully, return plugin result
    if (pluginResult && pluginResult.success) {
      const response: AgentResponse = {
        response: pluginResult.output,
        session_id,
        timestamp: new Date()
      };
      
      // Add assistant response to memory
      memoryManager.addMessage(session_id, {
        role: 'assistant',
        content: pluginResult.output,
        timestamp: new Date()
      });

      return res.json(response);
    }

    // If no plugin handled it, use the free AI service
    const llmResponse = await freeAIService.generateResponse(message);

    // Add assistant response to memory
    memoryManager.addMessage(session_id, {
      role: 'assistant',
      content: llmResponse,
      timestamp: new Date()
    });

    const response: AgentResponse = {
      response: llmResponse,
      session_id,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error processing agent message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});