
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

class RAGService {
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = localStorage.getItem('deepseek_api_key');
  }

  async indexDocument(content: string, metadata: Record<string, any> = {}, source?: string, tags?: string[]): Promise<string> {
    console.log('🔍 RAG 2.0: Indexing document with advanced processing...');
    
    try {
      // Generate embedding using DeepSeek API
      const embedding = await this.generateEmbedding(content);
      
      // Store document in database
      const { data, error } = await supabase
        .from('rag_documents')
        .insert({
          content,
          metadata,
          source,
          tags,
          embedding: embedding as any // PostgreSQL vector type
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

  async search(query: RAGQuery): Promise<RAGResponse> {
    const startTime = Date.now();
    console.log('🔍 RAG 2.0: Performing advanced semantic search...');

    try {
      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(query.query);
      
      // Perform hybrid search (semantic + keyword)
      const semanticResults = await this.semanticSearch(queryEmbedding, query);
      const keywordResults = await this.keywordSearch(query);
      
      // Combine and rank results using RRF (Reciprocal Rank Fusion)
      const fusedResults = this.fuseResults(semanticResults, keywordResults);
      
      // Apply post-retrieval filtering and re-ranking
      const rankedResults = this.reRankResults(fusedResults, query);
      
      const processingTime = Date.now() - startTime;

      // Store query for analytics
      await this.logQuery(query, rankedResults.length, processingTime);

      console.log(`✅ RAG 2.0: Search completed in ${processingTime}ms, found ${rankedResults.length} results`);

      return {
        results: rankedResults,
        totalFound: rankedResults.length,
        processingTime,
        query: query.query
      };
    } catch (error) {
      console.error('❌ RAG 2.0: Search failed:', error);
      throw error;
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
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

  private async semanticSearch(embedding: number[], query: RAGQuery): Promise<RAGResult[]> {
    // Use direct vector similarity with SQL query since we don't have the custom function
    const embeddingString = `[${embedding.join(',')}]`;
    
    const { data, error } = await supabase
      .from('rag_documents')
      .select('*')
      .order('embedding <-> ' + embeddingString)
      .limit(query.maxResults || 10);

    if (error) {
      console.warn('Semantic search failed, falling back to keyword search:', error);
      return [];
    }

    return (data || []).map((doc: any, index: number) => ({
      document: {
        id: doc.id,
        content: doc.content,
        metadata: doc.metadata || {},
        source: doc.source,
        tags: doc.tags,
        created_at: doc.created_at,
        updated_at: doc.updated_at
      },
      score: 1 - (index * 0.1), // Simple scoring based on order
      relevance: 1 - (index * 0.1)
    }));
  }

  private async keywordSearch(query: RAGQuery): Promise<RAGResult[]> {
    // Full-text search using PostgreSQL
    const { data, error } = await supabase
      .from('rag_documents')
      .select('*')
      .textSearch('content', query.query)
      .limit(query.maxResults || 10);

    if (error) {
      console.warn('Keyword search failed:', error);
      return [];
    }

    return (data || []).map((doc: any) => ({
      document: {
        id: doc.id,
        content: doc.content,
        metadata: doc.metadata || {},
        source: doc.source,
        tags: doc.tags,
        created_at: doc.created_at,
        updated_at: doc.updated_at
      },
      score: 0.8, // Default keyword score
      relevance: 0.8
    }));
  }

  private fuseResults(semanticResults: RAGResult[], keywordResults: RAGResult[]): RAGResult[] {
    const resultMap = new Map<string, RAGResult>();
    
    // Add semantic results
    semanticResults.forEach((result, index) => {
      const rrfScore = 1 / (index + 60); // RRF with k=60
      resultMap.set(result.document.id, {
        ...result,
        score: rrfScore,
        relevance: result.relevance
      });
    });

    // Merge keyword results
    keywordResults.forEach((result, index) => {
      const rrfScore = 1 / (index + 60);
      const existing = resultMap.get(result.document.id);
      
      if (existing) {
        // Combine scores
        existing.score += rrfScore;
        existing.relevance = Math.max(existing.relevance, result.relevance);
      } else {
        resultMap.set(result.document.id, {
          ...result,
          score: rrfScore,
          relevance: result.relevance
        });
      }
    });

    return Array.from(resultMap.values())
      .sort((a, b) => b.score - a.score);
  }

  private reRankResults(results: RAGResult[], query: RAGQuery): RAGResult[] {
    // Apply Maximum Marginal Relevance (MMR) for diversity
    if (results.length <= 1) return results;

    const selected: RAGResult[] = [];
    const remaining = [...results];
    const lambda = 0.7; // Balance between relevance and diversity

    // Select the highest scoring result first
    selected.push(remaining.shift()!);

    while (remaining.length > 0 && selected.length < (query.maxResults || 10)) {
      let bestScore = -Infinity;
      let bestIndex = 0;

      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        
        // Calculate MMR score
        let maxSimilarity = 0;
        for (const selectedDoc of selected) {
          const similarity = this.calculateSimilarity(candidate.document.content, selectedDoc.document.content);
          maxSimilarity = Math.max(maxSimilarity, similarity);
        }

        const mmrScore = lambda * candidate.relevance - (1 - lambda) * maxSimilarity;
        
        if (mmrScore > bestScore) {
          bestScore = mmrScore;
          bestIndex = i;
        }
      }

      selected.push(remaining.splice(bestIndex, 1)[0]);
    }

    return selected;
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // Simple Jaccard similarity for diversity calculation
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  private async logQuery(query: RAGQuery, totalFound: number, processingTime: number): Promise<void> {
    try {
      await supabase
        .from('rag_queries')
        .insert({
          query: query.query,
          max_results: query.maxResults || 10,
          threshold: query.threshold || 0.7,
          total_found: totalFound,
          processing_time_ms: processingTime,
          results: null // Will be populated if needed
        });
    } catch (error) {
      console.warn('Failed to log query:', error);
    }
  }

  async getAnalytics(): Promise<any> {
    const { data: queries } = await supabase
      .from('rag_queries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: documents } = await supabase
      .from('rag_documents')
      .select('id, created_at, tags, source')
      .order('created_at', { ascending: false });

    return {
      totalQueries: queries?.length || 0,
      totalDocuments: documents?.length || 0,
      averageProcessingTime: queries?.reduce((acc, q) => acc + (q.processing_time_ms || 0), 0) / (queries?.length || 1),
      recentQueries: queries?.slice(0, 10) || [],
      documentSources: this.groupBy(documents || [], 'source'),
      documentTags: this.flatMap(documents || [], 'tags')
    };
  }

  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = item[key] || 'Unknown';
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  private flatMap(array: any[], key: string): Record<string, number> {
    const tags: Record<string, number> = {};
    array.forEach(item => {
      if (item[key] && Array.isArray(item[key])) {
        item[key].forEach((tag: string) => {
          tags[tag] = (tags[tag] || 0) + 1;
        });
      }
    });
    return tags;
  }
}

export const ragService = new RAGService();
