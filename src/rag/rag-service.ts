import type { RAGChunk } from '../types/index.js';
import { EmbeddingService } from './embedding-service.js';
import { SimilarityService } from './similarity-service.js';
import fs from 'fs/promises';
import path from 'path';

export class RAGService {
  private embeddingService = new EmbeddingService();
  private similarityService = new SimilarityService();
  private chunks: RAGChunk[] = [];
  private embeddings: number[][] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    await this.loadMarkdownFiles();
    await this.generateEmbeddings();
    this.initialized = true;
  }

  private async loadMarkdownFiles(): Promise<void> {
    const docsPath = path.join(process.cwd(), 'docs');
    
    try {
      const files = await fs.readdir(docsPath);
      const markdownFiles = files.filter(file => file.endsWith('.md'));

      for (const file of markdownFiles) {
        const filePath = path.join(docsPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Split content into chunks (simple paragraph splitting)
        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
        
        for (const paragraph of paragraphs) {
          if (paragraph.trim().length > 50) { // Filter out very short chunks
            this.chunks.push({
              content: paragraph.trim(),
              filename: file,
              score: 0
            });
          }
        }
      }
    } catch (error) {
      console.log('No docs folder found or error reading files:', error);
      // Create some sample chunks for demonstration
      this.chunks = [
        {
          content: "This is sample knowledge about AI agents and their capabilities.",
          filename: "sample.md",
          score: 0
        }
      ];
    }
  }

  private async generateEmbeddings(): Promise<void> {
    for (const chunk of this.chunks) {
      const embedding = await this.embeddingService.generateEmbedding(chunk.content);
      this.embeddings.push(embedding);
    }
  }

  async retrieveRelevantChunks(query: string, topK: number = 3): Promise<RAGChunk[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.chunks.length === 0) {
      return [];
    }

    const queryEmbedding = await this.embeddingService.generateEmbedding(query);
    
    const scoredChunks = this.chunks.map((chunk, index) => {
      const similarity = this.similarityService.cosineSimilarity(
        queryEmbedding,
        this.embeddings[index] || []
      );
      
      return {
        ...chunk,
        score: similarity
      };
    });

    return scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}