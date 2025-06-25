
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Search, Upload, BarChart3, Brain, Zap } from 'lucide-react';
import RAGRetriever from '@/components/rag/RAGRetriever';
import DocumentIndexer from '@/components/rag/DocumentIndexer';
import RAGAnalytics from '@/components/rag/RAGAnalytics';
import ApiKeyManager from '@/components/ApiKeyManager';

const RAGHub = () => {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem('deepseek_api_key')
  );

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              RAG 2.0 Hub - Advanced Retrieval Engine
            </h1>
            <p className="text-blue-200 text-lg">
              Configure your DeepSeek API key to access advanced RAG capabilities
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ApiKeyManager onApiKeyChange={setApiKey} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 pt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
            <Brain className="w-10 h-10 text-blue-400" />
            <span>RAG 2.0 Hub</span>
            <Zap className="w-8 h-8 text-yellow-400" />
          </h1>
          <p className="text-blue-200 text-lg">
            Advanced Retrieval-Augmented Generation with semantic search, hybrid retrieval, and intelligent ranking
          </p>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-sm border border-blue-400/30">
            <TabsTrigger 
              value="search" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200"
            >
              <Search className="w-4 h-4 mr-2" />
              Smart Search
            </TabsTrigger>
            <TabsTrigger 
              value="index" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-blue-200"
            >
              <Upload className="w-4 h-4 mr-2" />
              Index Documents
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-blue-200"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-blue-200"
            >
              <Database className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <RAGRetriever />
          </TabsContent>

          <TabsContent value="index" className="space-y-6">
            <DocumentIndexer />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <RAGAnalytics />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-2 border-blue-400/30">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>RAG 2.0 Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="max-w-2xl">
                  <ApiKeyManager onApiKeyChange={setApiKey} />
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200/50">
                  <h3 className="font-semibold text-blue-800 mb-4">🚀 RAG 2.0 Features Active</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div className="space-y-2">
                      <p>✅ <strong>Semantic Vector Search</strong> - Neural embeddings</p>
                      <p>✅ <strong>Hybrid Retrieval</strong> - Dense + sparse search</p>
                      <p>✅ <strong>Query Transformation</strong> - Enhanced query processing</p>
                      <p>✅ <strong>Reciprocal Rank Fusion</strong> - Multi-search combination</p>
                    </div>
                    <div className="space-y-2">
                      <p>✅ <strong>Maximum Marginal Relevance</strong> - Diversity ranking</p>
                      <p>✅ <strong>Contextual Compression</strong> - Optimized context</p>
                      <p>✅ <strong>Real-time Analytics</strong> - Performance monitoring</p>
                      <p>✅ <strong>Advanced Indexing</strong> - Smart document processing</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RAGHub;
