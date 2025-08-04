import { FreeEmbeddingService } from '../utils/free-embedding-service.js';

export class EmbeddingService {
  private freeEmbeddingService = new FreeEmbeddingService();

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Use free embedding service for completely free operation
      return await this.freeEmbeddingService.generateEmbedding(text);
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Return a zero vector as fallback
      return new Array(1536).fill(0);
    }
  }
}