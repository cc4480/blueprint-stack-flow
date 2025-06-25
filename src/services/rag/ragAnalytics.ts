
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsData {
  totalQueries: number;
  totalDocuments: number;
  averageProcessingTime: number;
  recentQueries: any[];
  documentSources: Record<string, number>;
  documentTags: Record<string, number>;
}

export class RAGAnalytics {
  async getAnalytics(): Promise<AnalyticsData> {
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
