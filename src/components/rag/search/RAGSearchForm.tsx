
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Database } from 'lucide-react';
import { RAGQuery } from '@/services/rag/ragCore';

interface RAGSearchFormProps {
  onSearch: (query: RAGQuery) => void;
  isSearching: boolean;
}

const RAGSearchForm = ({ onSearch, isSearching }: RAGSearchFormProps) => {
  const [query, setQuery] = useState('');
  const [maxResults, setMaxResults] = useState(10);
  const [threshold, setThreshold] = useState(0.7);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    onSearch({
      query: query.trim(),
      maxResults,
      threshold,
      filters: {}
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
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
  );
};

export default RAGSearchForm;
