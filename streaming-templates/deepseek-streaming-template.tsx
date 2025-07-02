
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, Download, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StreamingTemplateProps {
  apiEndpoint?: string;
  placeholder?: string;
  title?: string;
  description?: string;
}

export const DeepSeekStreamingTemplate: React.FC<StreamingTemplateProps> = ({
  apiEndpoint = '/api/stream-blueprint',
  placeholder = 'Enter your prompt here...',
  title = 'AI Streaming Generator',
  description = 'Generate content with real-time streaming'
}) => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamProgress, setStreamProgress] = useState('');

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a prompt to generate content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setIsStreaming(true);
    setGeneratedContent('');
    setStreamProgress('🚀 Initializing streaming...');

    // 5-minute timeout
    const timeoutId = setTimeout(() => {
      setGeneratedContent('Generation timeout after 5 minutes. Please try again with a shorter prompt.');
      setStreamProgress('⏱️ Timeout reached');
      setIsGenerating(false);
      setIsStreaming(false);
    }, 5 * 60 * 1000);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          temperature: 0.7,
          systemPrompt: "You are an expert AI assistant. Provide detailed, helpful responses."
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response stream received from server');
      }

      // Stream processing
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedContent = '';

      setStreamProgress('📡 Connected to stream...');

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setStreamProgress(`✅ Stream completed! Total: ${accumulatedContent.length} characters`);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6);
              
              if (jsonStr === '[DONE]') {
                setStreamProgress(`✅ Generation completed! Total: ${accumulatedContent.length} characters`);
                setIsStreaming(false);
                return;
              }

              const data = JSON.parse(jsonStr);
              
              if (data.type === 'token' && data.content) {
                accumulatedContent += data.content;
                setGeneratedContent(accumulatedContent);
                setStreamProgress(`📝 Generating... ${accumulatedContent.length} characters`);
              } else if (data.type === 'complete') {
                setStreamProgress(`✅ Generation completed! Total: ${data.totalCharacters || accumulatedContent.length} characters`);
                setIsStreaming(false);
                return;
              } else if (data.type === 'error') {
                throw new Error(data.error || 'Unknown streaming error');
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming data:', parseError, 'Raw line:', line);
            }
          }
        }
        
        buffer = lines[lines.length - 1];
      }
    } catch (error) {
      console.error('Streaming generation failed:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setGeneratedContent('Content generation was cancelled due to timeout. The AI reasoning requires more processing time for complex requests.');
          setStreamProgress('⏱️ Generation timeout (5 minutes exceeded)');
        } else if (error.message.includes('500')) {
          setGeneratedContent(`Server error: ${error.message}. Please check if the API key is configured.`);
          setStreamProgress('❌ Server connection failed');
        } else {
          setGeneratedContent(`Generation failed: ${error.message}`);
          setStreamProgress('❌ Generation error');
        }
      } else {
        setGeneratedContent('Unknown error occurred during content generation.');
        setStreamProgress('❌ Unknown error');
      }
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsGenerating(false);
      setIsStreaming(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedContent) {
      await navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    }
  };

  const downloadContent = () => {
    if (generatedContent) {
      const blob = new Blob([generatedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-content-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          {title}
        </h2>
        <p className="text-gray-400">{description}</p>
      </div>

      {/* Input Section */}
      <Card className="bg-gray-900 border-blue-400/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="min-h-32 bg-gray-800 border-gray-600 text-white resize-none"
            disabled={isGenerating}
          />
          
          <div className="flex gap-3">
            <Button
              onClick={generateContent}
              disabled={isGenerating || !prompt.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>

            {generatedContent && (
              <>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={downloadContent}
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </>
            )}
          </div>

          {/* Streaming Progress */}
          {(isGenerating || streamProgress) && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                {isStreaming && <Loader2 className="h-4 w-4 animate-spin text-blue-400" />}
                <span className="text-sm text-blue-300 font-medium">
                  {streamProgress || 'Preparing content generation...'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Output Section */}
      {generatedContent && (
        <Card className="bg-gray-900 border-green-400/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-400" />
                Generated Content
              </div>
              <Badge variant="secondary" className="bg-green-900/30 text-green-300">
                {generatedContent.length} characters
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono">
                {generatedContent}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeepSeekStreamingTemplate;
