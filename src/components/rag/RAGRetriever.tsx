
import { useState } from 'react';
import RAGSearchForm from './search/RAGSearchForm';
import RAGSearchResults from './search/RAGSearchResults';
import { ragService, RAGQuery, RAGResponse } from '@/services/ragService';
import { toast } from 'sonner';

interface RAGRetrieverProps {
  onResultsChange?: (results: RAGResponse | null) => void;
}

const RAGRetriever = ({ onResultsChange }: RAGRetrieverProps) => {
  const [results, setResults] = useState<RAGResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: RAGQuery) => {
    setIsSearching(true);
    console.log('🔍 RAG 2.0: Starting advanced retrieval search...');

    try {
      const response = await ragService.search(query);
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

  return (
    <div className="space-y-6">
      <RAGSearchForm onSearch={handleSearch} isSearching={isSearching} />
      {results && <RAGSearchResults results={results} />}
    </div>
  );
};

export default RAGRetriever;
