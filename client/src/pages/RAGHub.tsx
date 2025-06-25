import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  Upload, 
  Search, 
  Brain, 
  Database, 
  Zap, 
  Settings, 
  Trash2, 
  Eye,
  Download,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

// Types
interface RAGDocument {
  id: string;
  title: string;
  content: string;
  type: 'pdf' | 'text' | 'url' | 'code';
  size: number;
  chunks: number;
  embeddings: number;
  status: 'processing' | 'ready' | 'error';
  createdAt: string;
  lastUpdated: string;
  metadata: {
    source?: string;
    author?: string;
    tags: string[];
  };
}

interface RAGQuery {
  id: string;
  query: string;
  results: number;
  relevanceScore: number;
  timestamp: string;
  responseTime: number;
}

interface RAGMetrics {
  totalDocuments: number;
  totalChunks: number;
  totalEmbeddings: number;
  avgRelevanceScore: number;
  avgResponseTime: number;
  queriesPerDay: number;
}

// Mock data
const mockDocuments: RAGDocument[] = [
  {
    id: '1',
    title: 'NoCodeLos Documentation v2.0',
    content: 'Complete guide to building applications with NoCodeLos...',
    type: 'pdf',
    size: 2048576,
    chunks: 156,
    embeddings: 156,
    status: 'ready',
    createdAt: '2025-01-20T10:00:00Z',
    lastUpdated: '2025-01-25T14:30:00Z',
    metadata: {
      source: 'internal',
      author: 'NoCodeLos Team',
      tags: ['documentation', 'guide', 'tutorial']
    }
  },
  {
    id: '2',
    title: 'React Best Practices 2025',
    content: 'Latest React patterns and optimization techniques...',
    type: 'text',
    size: 512000,
    chunks: 84,
    embeddings: 84,
    status: 'ready',
    createdAt: '2025-01-22T08:15:00Z',
    lastUpdated: '2025-01-24T16:45:00Z',
    metadata: {
      source: 'external',
      author: 'React Community',
      tags: ['react', 'frontend', 'best-practices']
    }
  },
  {
    id: '3',
    title: 'DeepSeek API Reference',
    content: 'Complete API documentation for DeepSeek integration...',
    type: 'url',
    size: 1024000,
    chunks: 92,
    embeddings: 0,
    status: 'processing',
    createdAt: '2025-01-25T12:00:00Z',
    lastUpdated: '2025-01-25T12:05:00Z',
    metadata: {
      source: 'https://docs.deepseek.com',
      tags: ['api', 'deepseek', 'integration']
    }
  }
];

const mockQueries: RAGQuery[] = [
  {
    id: '1',
    query: 'How to implement RAG with DeepSeek?',
    results: 5,
    relevanceScore: 0.89,
    timestamp: '2025-01-25T15:30:00Z',
    responseTime: 234
  },
  {
    id: '2',
    query: 'Best practices for React performance optimization',
    results: 8,
    relevanceScore: 0.92,
    timestamp: '2025-01-25T14:45:00Z',
    responseTime: 156
  },
  {
    id: '3',
    query: 'NoCodeLos blueprint generation workflow',
    results: 12,
    relevanceScore: 0.95,
    timestamp: '2025-01-25T13:20:00Z',
    responseTime: 189
  }
];

// Custom hooks
const useRAGDocuments = () => {
  const [documents, setDocuments] = useState<RAGDocument[]>(mockDocuments);
  const [isUploading, setIsUploading] = useState(false);

  const uploadDocument = async (file: File, metadata: Partial<RAGDocument['metadata']>) => {
    setIsUploading(true);
    
    // Simulate upload and processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDocument: RAGDocument = {
      id: Date.now().toString(),
      title: file.name,
      content: 'Document content being processed...',
      type: file.type.includes('pdf') ? 'pdf' : 'text',
      size: file.size,
      chunks: Math.floor(file.size / 1000) + Math.floor(Math.random() * 50),
      embeddings: 0,
      status: 'processing',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      metadata: {
        tags: [],
        ...metadata
      }
    };
    
    setDocuments(prev => [...prev, newDocument]);
    
    // Simulate processing completion
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === newDocument.id 
            ? { ...doc, status: 'ready' as const, embeddings: doc.chunks }
            : doc
        )
      );
    }, 3000);
    
    setIsUploading(false);
  };

  const deleteDocument = async (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const reprocessDocument = async (id: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id 
          ? { ...doc, status: 'processing' as const, lastUpdated: new Date().toISOString() }
          : doc
      )
    );
    
    // Simulate reprocessing
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === id 
            ? { ...doc, status: 'ready' as const, embeddings: doc.chunks }
            : doc
        )
      );
    }, 2000);
  };

  return {
    documents,
    isUploading,
    uploadDocument,
    deleteDocument,
    reprocessDocument
  };
};

const useRAGMetrics = (documents: RAGDocument[], queries: RAGQuery[]): RAGMetrics => {
  return React.useMemo(() => {
    const readyDocuments = documents.filter(doc => doc.status === 'ready');
    const totalChunks = readyDocuments.reduce((sum, doc) => sum + doc.chunks, 0);
    const totalEmbeddings = readyDocuments.reduce((sum, doc) => sum + doc.embeddings, 0);
    const avgRelevanceScore = queries.length > 0 
      ? queries.reduce((sum, q) => sum + q.relevanceScore, 0) / queries.length 
      : 0;
    const avgResponseTime = queries.length > 0
      ? queries.reduce((sum, q) => sum + q.responseTime, 0) / queries.length
      : 0;

    return {
      totalDocuments: documents.length,
      totalChunks,
      totalEmbeddings,
      avgRelevanceScore: Math.round(avgRelevanceScore * 100) / 100,
      avgResponseTime: Math.round(avgResponseTime),
      queriesPerDay: queries.length // Simplified for demo
    };
  }, [documents, queries]);
};

// Components
const StatusBadge: React.FC<{ status: RAGDocument['status'] }> = ({ status }) => {
  const variants = {
    ready: { variant: 'default' as const, text: 'Ready', icon: CheckCircle },
    processing: { variant: 'outline' as const, text: 'Processing', icon: RefreshCw },
    error: { variant: 'destructive' as const, text: 'Error', icon: Trash2 }
  };

  const { variant, text, icon: Icon } = variants[status];

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className={`w-3 h-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
      {text}
    </Badge>
  );
};

const MetricsOverview: React.FC<{ metrics: RAGMetrics }> = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-600">{metrics.totalDocuments}</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Database className="w-4 h-4 text-green-500" />
          Chunks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600">{metrics.totalChunks}</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-500" />
          Embeddings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-purple-600">{metrics.totalEmbeddings}</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          Relevance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-orange-600">{metrics.avgRelevanceScore}</div>
        <Progress value={metrics.avgRelevanceScore * 100} className="mt-2" />
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500" />
          Response Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-red-600">{metrics.avgResponseTime}ms</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-500" />
          Queries/Day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-indigo-600">{metrics.queriesPerDay}</div>
      </CardContent>
    </Card>
  </div>
);

const DocumentUploadForm: React.FC<{
  onUpload: (file: File, metadata: Partial<RAGDocument['metadata']>) => void;
  isUploading: boolean;
}> = ({ onUpload, isUploading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    source: '',
    author: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onUpload(file, metadata);
      setFile(null);
      setMetadata({ source: '', author: '', tags: [] });
      setTagInput('');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="file">Document File</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept=".pdf,.txt,.md,.doc,.docx"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="source">Source</Label>
        <Input
          id="source"
          value={metadata.source}
          onChange={(e) => setMetadata(prev => ({ ...prev, source: e.target.value }))}
          placeholder="Document source or URL"
        />
      </div>
      
      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={metadata.author}
          onChange={(e) => setMetadata(prev => ({ ...prev, author: e.target.value }))}
          placeholder="Document author"
        />
      </div>
      
      <div>
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {metadata.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
              {tag} ×
            </Badge>
          ))}
        </div>
      </div>
      
      <Button type="submit" disabled={!file || isUploading} className="w-full">
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </form>
  );
};

const DocumentTable: React.FC<{
  documents: RAGDocument[];
  onDelete: (id: string) => void;
  onReprocess: (id: string) => void;
}> = ({ documents, onDelete, onReprocess }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Document</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Chunks</TableHead>
        <TableHead>Embeddings</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {documents.map((doc) => (
        <TableRow key={doc.id}>
          <TableCell>
            <div>
              <div className="font-medium">{doc.title}</div>
              <div className="text-sm text-gray-500">
                {(doc.size / 1024 / 1024).toFixed(2)} MB
              </div>
              <div className="flex gap-1 mt-1">
                {doc.metadata.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="secondary">{doc.type.toUpperCase()}</Badge>
          </TableCell>
          <TableCell>
            <StatusBadge status={doc.status} />
          </TableCell>
          <TableCell>{doc.chunks}</TableCell>
          <TableCell>{doc.embeddings}</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReprocess(doc.id)}
                disabled={doc.status === 'processing'}
              >
                <RefreshCw className={`w-4 h-4 ${doc.status === 'processing' ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(doc.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const QueryInterface: React.FC<{ queries: RAGQuery[] }> = ({ queries }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSearching(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about your documents..."
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Search
        </Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold">Recent Queries</h3>
        {queries.map((q) => (
          <Card key={q.id}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium">{q.query}</p>
                <Badge variant="outline">{q.relevanceScore.toFixed(2)} relevance</Badge>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{q.results} results found</span>
                <span>{q.responseTime}ms response time</span>
                <span>{new Date(q.timestamp).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default function RAGHub() {
  const { documents, isUploading, uploadDocument, deleteDocument, reprocessDocument } = useRAGDocuments();
  const metrics = useRAGMetrics(documents, mockQueries);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-500" />
                RAG Hub 2.0
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Advanced Retrieval-Augmented Generation with intelligent document processing
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload New Document</DialogTitle>
                  <DialogDescription>
                    Add documents to your RAG knowledge base for intelligent retrieval
                  </DialogDescription>
                </DialogHeader>
                <DocumentUploadForm onUpload={uploadDocument} isUploading={isUploading} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <MetricsOverview metrics={metrics} />

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="search">Search & Query</TabsTrigger>
            <TabsTrigger value="pipeline">RAG Pipeline</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Library</CardTitle>
                <CardDescription>
                  Manage your knowledge base documents and their processing status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentTable
                  documents={documents}
                  onDelete={deleteDocument}
                  onReprocess={reprocessDocument}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Intelligent Search</CardTitle>
                <CardDescription>
                  Query your documents using natural language with semantic search
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QueryInterface queries={mockQueries} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline">
            <Card>
              <CardHeader>
                <CardTitle>RAG Pipeline Configuration</CardTitle>
                <CardDescription>
                  Configure document processing, chunking, and embedding strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Chunking Strategy</h3>
                    <Select defaultValue="semantic">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semantic">Semantic Chunking</SelectItem>
                        <SelectItem value="fixed">Fixed Size</SelectItem>
                        <SelectItem value="paragraph">Paragraph-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Embedding Model</h3>
                    <Select defaultValue="openai">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI text-embedding-3-large</SelectItem>
                        <SelectItem value="sentence">Sentence Transformers</SelectItem>
                        <SelectItem value="cohere">Cohere Embed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>RAG Configuration</CardTitle>
                <CardDescription>
                  Advanced settings for retrieval and generation optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label>Retrieval Top-K</Label>
                    <Input type="number" defaultValue="5" min="1" max="20" />
                    <p className="text-sm text-gray-500 mt-1">Number of most relevant chunks to retrieve</p>
                  </div>
                  
                  <div>
                    <Label>Similarity Threshold</Label>
                    <Input type="number" defaultValue="0.7" min="0" max="1" step="0.1" />
                    <p className="text-sm text-gray-500 mt-1">Minimum similarity score for relevant results</p>
                  </div>
                  
                  <div>
                    <Label>Chunk Overlap</Label>
                    <Input type="number" defaultValue="100" min="0" max="500" />
                    <p className="text-sm text-gray-500 mt-1">Character overlap between adjacent chunks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}