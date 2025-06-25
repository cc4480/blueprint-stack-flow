
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Database, FileText } from 'lucide-react';
import DocumentUpload from './indexing/DocumentUpload';
import TagManager from './indexing/TagManager';
import IndexingStatus from './indexing/IndexingStatus';
import { ragService } from '@/services/ragService';
import { toast } from 'sonner';

const DocumentIndexer = () => {
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [metadata, setMetadata] = useState('{}');
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexedDocuments, setIndexedDocuments] = useState<string[]>([]);

  const handleContentLoaded = (loadedContent: string, filename: string) => {
    setContent(loadedContent);
    setSource(filename);
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
          <DocumentUpload onContentLoaded={handleContentLoaded} />

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

          <div className="space-y-2">
            <label className="text-sm font-medium">Source (Optional)</label>
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., documentation.pdf, website.com, etc."
              className="focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <TagManager tags={tags} onTagsChange={setTags} />

          <div className="space-y-2">
            <label className="text-sm font-medium">Metadata (JSON)</label>
            <Textarea
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              placeholder='{"author": "John Doe", "category": "technical", "date": "2024-01-01"}'
              className="min-h-[80px] focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            />
          </div>

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

      <IndexingStatus indexedDocuments={indexedDocuments} />
    </div>
  );
};

export default DocumentIndexer;
