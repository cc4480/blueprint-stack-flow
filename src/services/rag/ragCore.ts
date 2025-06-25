
import { supabase } from "@/integrations/supabase/client";

export interface RAGDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  source?: string;
  tags?: string[];
  embedding?: number[];
  created_at: string;
  updated_at: string;
}

export interface RAGQuery {
  query: string;
  maxResults?: number;
  threshold?: number;
  filters?: Record<string, any>;
}

export interface RAGResult {
  document: RAGDocument;
  score: number;
  relevance: number;
}

export interface RAGResponse {
  results: RAGResult[];
  totalFound: number;
  processingTime: number;
  query: string;
}

export class RAGCore {
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = localStorage.getItem('deepseek_api_key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('deepseek_api_key', key);
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    const response = await fetch('https://api.deepseek.com/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-embedding',
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate embedding');
    }

    const data = await response.json();
    return data.data[0].embedding;
  }

  async storeDocument(content: string, metadata: Record<string, any> = {}, source?: string, tags?: string[]): Promise<string> {
    console.log('🔍 RAG 2.0: Indexing document with advanced processing...');
    
    try {
      const embedding = await this.generateEmbedding(content);
      
      const { data, error } = await supabase
        .from('rag_documents')
        .insert({
          content,
          metadata,
          source,
          tags,
          embedding: embedding as any
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ RAG 2.0: Document indexed successfully');
      return data.id;
    } catch (error) {
      console.error('❌ RAG 2.0: Document indexing failed:', error);
      throw error;
    }
  }

  async logQuery(query: RAGQuery, totalFound: number, processingTime: number): Promise<void> {
    try {
      await supabase
        .from('rag_queries')
        .insert({
          query: query.query,
          max_results: query.maxResults || 10,
          threshold: query.threshold || 0.7,
          total_found: totalFound,
          processing_time_ms: processingTime,
          results: null
        });
    } catch (error) {
      console.warn('Failed to log query:', error);
    }
  }
}
