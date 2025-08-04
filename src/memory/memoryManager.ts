import type { Session, Message } from '../types/index.js';

export class MemoryManager {
  private sessions: Map<string, Session> = new Map();

  addMessage(sessionId: string, message: Message): void {
    let session = this.sessions.get(sessionId);
    
    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        createdAt: new Date(),
        lastActivity: new Date()
      };
      this.sessions.set(sessionId, session);
    }

    session.messages.push(message);
    session.lastActivity = new Date();

    // Keep only last 50 messages per session
    if (session.messages.length > 50) {
      session.messages = session.messages.slice(-50);
    }
  }

  getRecentMessages(sessionId: string, count: number): Message[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    return session.messages.slice(-count);
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  // Clean up old sessions (older than 24 hours)
  cleanupOldSessions(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastActivity < oneDayAgo) {
        this.sessions.delete(sessionId);
      }
    }
  }
}