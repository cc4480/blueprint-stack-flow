
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Database, Clock, Target, FileText, Filter } from 'lucide-react';
import { ragService, RAGQuery, RAGResponse } from '@/services/ragService';
import { toast } from 'sonner';

interface RAGRetrieverProps {
  onResultsChange?: (results: RAGResponse | null) => void;
}

const RAGRetriever = ({ onResultsChange }: RAGRetrieverProps) => {
  const [query, setQuery] = useState('');
  const [maxResults, setMaxResults] = useState(10);
  const [threshold, setThreshold] = useState(0.7);
  const [results, setResults] = useState<RAGResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    console.log('🔍 RAG 2.0: Starting advanced retrieval search...');

    try {
      const searchQuery: RAGQuery = {
        query: query.trim(),
        maxResults,
        threshold,
        filters
      };

      const response = await ragService.search(searchQuery);
      setResults(response);
      onResultsChange?.(response);
      
      toast.success(`Found ${response.results.length} relevant documents in ${response.processingTime}ms`);
      console.log('✅ RAG 2.0: Retrieval completed successfully');
    } catch (error) {
      console.error('❌ RAG 2.0: Retrieval failed:', error);
      toast.error('Search failed. Please check your configuration.');
      setResults(null);
      onResultsChange?.(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-400/30">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>RAG 2.0 Advanced Retrieval Engine</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Query</label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your search query for semantic retrieval..."
              className="min-h-[100px] focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Results</label>
              <Input
                type="number"
                value={maxResults}
                onChange={(e) => setMaxResults(parseInt(e.target.value) || 10)}
                min="1"
                max="100"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Similarity Threshold</label>
              <Input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value) || 0.7)}
                min="0"
                max="1"
                step="0.1"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {isSearching ? (
              <>
                <Database className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search Knowledge Base
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
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
      )}
    </div>
  );
};

export default RAGRetriever;
