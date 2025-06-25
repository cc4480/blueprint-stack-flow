
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Plus, X, Database, CheckCircle } from 'lucide-react';
import { ragService } from '@/services/ragService';
import { toast } from 'sonner';

const DocumentIndexer = () => {
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [metadata, setMetadata] = useState('{}');
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexedDocuments, setIndexedDocuments] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContent(text);
      setSource(file.name);
      toast.success(`File "${file.name}" loaded successfully`);
    };
    reader.readAsText(file);
  };

  const handleIndexDocument = async () => {
    if (!content.trim()) {
      toast.error('Please provide content to index');
      return;
    }

    setIsIndexing(true);
    console.log('📚 RAG 2.0: Starting document indexing process...');

    try {
      let parsedMetadata = {};
      try {
        parsedMetadata = JSON.parse(metadata);
      } catch (error) {
        console.warn('Invalid metadata JSON, using empty object');
      }

      const documentId = await ragService.indexDocument(
        content,
        parsedMetadata,
        source || undefined,
        tags.length > 0 ? tags : undefined
      );

      setIndexedDocuments([...indexedDocuments, documentId]);
      
      // Clear form
      setContent('');
      setSource('');
      setTags([]);
      setMetadata('{}');
      
      toast.success(`Document indexed successfully! ID: ${documentId.substring(0, 8)}...`);
      console.log('✅ RAG 2.0: Document indexed with ID:', documentId);
    } catch (error) {
      console.error('❌ RAG 2.0: Document indexing failed:', error);
      toast.error('Failed to index document. Please check your configuration.');
    } finally {
      setIsIndexing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-400/30">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>RAG 2.0 Knowledge Indexer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Document</label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.json"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Choose File</span>
              </Button>
              <span className="text-sm text-gray-500">
                Supports .txt, .md, .json files
              </span>
            </div>
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Content *</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter or paste your document content here..."
              className="min-h-[200px] focus:ring-2 focus:ring-purple-500"
            />
            <div className="text-xs text-gray-500">
              {content.length} characters
            </div>
          </div>

          {/* Source */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Source (Optional)</label>
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., documentation.pdf, website.com, etc."
              className="focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex items-center space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add a tag..."
                className="flex-1 focus:ring-2 focus:ring-purple-500"
              />
              <Button
                onClick={handleAddTag}
                variant="outline"
                size="sm"
                disabled={!newTag.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Metadata (JSON)</label>
            <Textarea
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              placeholder='{"author": "John Doe", "category": "technical", "date": "2024-01-01"}'
              className="min-h-[80px] focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            />
          </div>

          {/* Index Button */}
          <Button
            onClick={handleIndexDocument}
            disabled={isIndexing || !content.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isIndexing ? (
              <>
                <Database className="w-4 h-4 mr-2 animate-spin" />
                Indexing Document...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Index Document
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Indexed Documents Status */}
      {indexedDocuments.length > 0 && (
        <Card className="border-2 border-green-400/30">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Recently Indexed Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {indexedDocuments.map((docId, index) => (
                <div key={docId} className="flex items-center space-x-2 p-2 bg-green-50 rounded-md">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-mono">Document #{index + 1}: {docId.substring(0, 16)}...</span>
                  <Badge variant="secondary" className="text-xs">Indexed</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentIndexer;
