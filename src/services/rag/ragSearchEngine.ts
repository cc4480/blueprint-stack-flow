
import { supabase } from "@/integrations/supabase/client";
import { RAGQuery, RAGResult, RAGResponse } from "./ragCore";

export class RAGSearchEngine {
  async semanticSearch(embedding: number[], query: RAGQuery): Promise<RAGResult[]> {
    const embeddingString = `[${embedding.join(',')}]`;
    
    const { data, error } = await supabase
      .from('rag_documents')
      .select('*')
      .order('embedding <-> ' + embeddingString)
      .limit(query.maxResults || 10);

    if (error) {
      console.warn('Semantic search failed:', error);
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
      score: 1 - (index * 0.1),
      relevance: 1 - (index * 0.1)
    }));
  }

  async keywordSearch(query: RAGQuery): Promise<RAGResult[]> {
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
      score: 0.8,
      relevance: 0.8
    }));
  }

  fuseResults(semanticResults: RAGResult[], keywordResults: RAGResult[]): RAGResult[] {
    const resultMap = new Map<string, RAGResult>();
    
    semanticResults.forEach((result, index) => {
      const rrfScore = 1 / (index + 60);
      resultMap.set(result.document.id, {
        ...result,
        score: rrfScore,
        relevance: result.relevance
      });
    });

    keywordResults.forEach((result, index) => {
      const rrfScore = 1 / (index + 60);
      const existing = resultMap.get(result.document.id);
      
      if (existing) {
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

    return Array.from(resultMap.values()).sort((a, b) => b.score - a.score);
  }
}
