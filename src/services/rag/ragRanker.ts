
import { RAGResult, RAGQuery } from "./ragCore";

export class RAGRanker {
  reRankResults(results: RAGResult[], query: RAGQuery): RAGResult[] {
    if (results.length <= 1) return results;

    const selected: RAGResult[] = [];
    const remaining = [...results];
    const lambda = 0.7;

    selected.push(remaining.shift()!);

    while (remaining.length > 0 && selected.length < (query.maxResults || 10)) {
      let bestScore = -Infinity;
      let bestIndex = 0;

      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        
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
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }
}
