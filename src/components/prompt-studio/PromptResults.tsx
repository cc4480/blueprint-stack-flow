
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, RefreshCw, Clock, BarChart3, Code } from 'lucide-react';
import { toast } from 'sonner';

interface PromptResultsProps {
  result: any;
  onReset: () => void;
}

const PromptResults = ({ result, onReset }: PromptResultsProps) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.prompt);
    toast.success('📋 Prompt copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([result.prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nocodelos-blueprint-prompt.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('📥 Prompt downloaded!');
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>Build Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{result.estimatedBuildTime}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <BarChart3 className="w-4 h-4" />
              <span>Complexity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={result.complexity === 'Advanced' ? 'destructive' : 'default'}>
              {result.complexity}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Code className="w-4 h-4" />
              <span>Components</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{result.suggestedComponents?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Blueprint Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={result.prompt}
            readOnly
            className="min-h-[300px] font-mono text-sm"
          />
          <div className="flex space-x-3 mt-4">
            <Button onClick={handleCopy} variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy Prompt
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={onReset} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate New
            </Button>
          </div>
        </CardContent>
      </Card>

      {result.reasoningContent && (
        <Card>
          <CardHeader>
            <CardTitle>DeepSeek Reasoning Process</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={result.reasoningContent}
              readOnly
              className="min-h-[200px] font-mono text-sm bg-gray-50"
            />
          </CardContent>
        </Card>
      )}

      {result.suggestedComponents && result.suggestedComponents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.suggestedComponents.map((component: string, index: number) => (
                <Badge key={index} variant="outline">
                  {component}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromptResults;
