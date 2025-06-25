
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, FileText, Clock, Database } from 'lucide-react';
import { RAGResponse } from '@/services/rag/ragCore';

interface RAGSearchResultsProps {
  results: RAGResponse;
}

const RAGSearchResults = ({ results }: RAGSearchResultsProps) => {
  if (!results) return null;

  return (
    <Card className="border-2 border-green-400/30">
      <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Search Results</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>{results.totalFound} found</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{results.processingTime}ms</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {results.results.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No documents found matching your query.</p>
            <p className="text-sm">Try adjusting your search terms or lowering the similarity threshold.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.results.map((result, index) => (
              <Card key={result.document.id} className="border border-gray-200 hover:border-blue-400/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        Rank #{index + 1}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Score: {result.score.toFixed(3)}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        Relevance: {(result.relevance * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    {result.document.source && (
                      <Badge variant="outline" className="text-xs">
                        {result.document.source}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-3 line-clamp-3">
                    {result.document.content.substring(0, 300)}
                    {result.document.content.length > 300 && '...'}
                  </div>

                  {result.document.tags && result.document.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.document.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RAGSearchResults;
