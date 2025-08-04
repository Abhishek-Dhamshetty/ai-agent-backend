export class FreeEmbeddingService {
  async generateEmbedding(text: string): Promise<number[]> {
    // Simple hash-based embedding for free operation
    const embedding = new Array(1536).fill(0);
    
    // Create a simple deterministic embedding based on text content
    const words = text.toLowerCase().split(/\s+/);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i] || '';
      const hash = this.simpleHash(word);
      const index = Math.abs(hash) % 1536;
      embedding[index] = (embedding[index] || 0) + 0.1;
    }
    
    // Normalize the vector
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] = (embedding[i] || 0) / magnitude;
      }
    }
    
    return embedding;
  }
  
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
}