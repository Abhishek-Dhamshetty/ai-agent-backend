import type { Message, RAGChunk, PluginResult } from '../types/index.js';

interface PromptContext {
  recentMessages: Message[];
  ragChunks: RAGChunk[];
  pluginResult: PluginResult | null;
  userMessage: string;
}

export class PromptBuilder {
  buildPrompt(context: PromptContext): string {
    const { recentMessages, ragChunks, pluginResult, userMessage } = context;

    let prompt = `You are an intelligent AI assistant with access to relevant knowledge and tools.

SYSTEM INSTRUCTIONS:
- Provide helpful, accurate, and contextual responses
- Use the provided context and plugin results to enhance your answers
- Be concise but comprehensive
- If plugin results are available, incorporate them naturally into your response

`;

    // Add recent conversation history
    if (recentMessages.length > 0) {
      prompt += `RECENT CONVERSATION:\n`;
      recentMessages.forEach(msg => {
        prompt += `${msg.role.toUpperCase()}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    // Add RAG context
    if (ragChunks.length > 0) {
      prompt += `RELEVANT KNOWLEDGE:\n`;
      ragChunks.forEach((chunk, index) => {
        prompt += `[${index + 1}] From ${chunk.filename}:\n${chunk.content}\n\n`;
      });
    }

    // Add plugin results
    if (pluginResult && pluginResult.success) {
      prompt += `TOOL RESULT:\n`;
      prompt += `Used ${pluginResult.type} tool for "${pluginResult.input}"\n`;
      prompt += `Result: ${pluginResult.output}\n\n`;
    }

    prompt += `USER MESSAGE: ${userMessage}\n\nASSISTANT:`;

    return prompt;
  }
}