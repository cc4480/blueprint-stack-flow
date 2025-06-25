
import { RAGCore, RAGQuery, RAGResponse } from "./rag/ragCore";
import { RAGSearchEngine } from "./rag/ragSearchEngine";
import { RAGRanker } from "./rag/ragRanker";
import { RAGAnalytics } from "./rag/ragAnalytics";

class RAGService {
  private core: RAGCore;
  private searchEngine: RAGSearchEngine;
  private ranker: RAGRanker;
  private analytics: RAGAnalytics;

  constructor() {
    this.core = new RAGCore();
    this.searchEngine = new RAGSearchEngine();
    this.ranker = new RAGRanker();
    this.analytics = new RAGAnalytics();
  }

  async indexDocument(content: string, metadata: Record<string, any> = {}, source?: string, tags?: string[]): Promise<string> {
    return this.core.storeDocument(content, metadata, source, tags);
  }

  async search(query: RAGQuery): Promise<RAGResponse> {
    const startTime = Date.now();
    console.log('🔍 RAG 2.0: Performing advanced semantic search...');

    try {
      const queryEmbedding = await this.core.generateEmbedding(query.query);
      
      const semanticResults = await this.searchEngine.semanticSearch(queryEmbedding, query);
      const keywordResults = await this.searchEngine.keywordSearch(query);
      
      const fusedResults = this.searchEngine.fuseResults(semanticResults, keywordResults);
      const rankedResults = this.ranker.reRankResults(fusedResults, query);
      
      const processingTime = Date.now() - startTime;
      await this.core.logQuery(query, rankedResults.length, processingTime);

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

  async getAnalytics() {
    return this.analytics.getAnalytics();
  }
}

export const ragService = new RAGService();
export * from "./rag/ragCore";
