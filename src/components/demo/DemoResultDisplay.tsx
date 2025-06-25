
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Brain, Network, GitBranch, Database, Copy, Download } from 'lucide-react';

interface GeneratedResult {
  prompt: string;
  estimatedBuildTime: string;
  complexity: string;
  suggestedComponents: string[];
  reasoningContent?: string;
  mcpEndpoints?: string[];
  a2aProtocols?: string[];
  ragPipeline?: string;
}

interface DemoResultDisplayProps {
  result: GeneratedResult;
  onCopyToClipboard: () => void;
  onDownloadPrompt: () => void;
  onResetDemo: () => void;
}

const DemoResultDisplay = ({ result, onCopyToClipboard, onDownloadPrompt, onResetDemo }: DemoResultDisplayProps) => {
  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Your NoCodeLos Blueprint Stack Master Prompt is Ready!
        </h3>
        <p className="text-gray-600">Generated with DeepSeek Reasoner + RAG 2.0 + MCP + A2A integration</p>
      </div>

      {/* Advanced Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg text-center">
          <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="font-semibold text-blue-800">{result.estimatedBuildTime}</div>
          <div className="text-sm text-blue-600">Build Time</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg text-center">
          <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="font-semibold text-purple-800">{result.complexity}</div>
          <div className="text-sm text-purple-600">Complexity</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg text-center">
          <Network className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="font-semibold text-green-800">{result.mcpEndpoints?.length || 0}</div>
          <div className="text-sm text-green-600">MCP Endpoints</div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg text-center">
          <GitBranch className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="font-semibold text-orange-800">{result.a2aProtocols?.length || 0}</div>
          <div className="text-sm text-orange-600">A2A Protocols</div>
        </div>
      </div>

      {/* Generated Prompt */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-4">Your NoCodeLos Blueprint Stack Master Prompt:</h4>
        <div className="bg-white border border-gray-200 rounded-lg p-6 font-mono text-sm text-gray-800 leading-relaxed max-h-96 overflow-y-auto">
          {result.prompt}
        </div>
      </div>

      {/* Additional Details */}
      {result.ragPipeline && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            RAG 2.0 Pipeline:
          </h4>
          <p className="text-sm text-gray-700 font-mono">{result.ragPipeline}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onCopyToClipboard}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Blueprint
        </Button>
        <Button
          onClick={onDownloadPrompt}
          variant="outline"
          className="border-purple-400 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full font-semibold"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          onClick={onResetDemo}
          variant="ghost"
          className="text-gray-600 hover:text-gray-800 px-8 py-3 rounded-full font-semibold"
        >
          🔄 Create Another
        </Button>
      </div>
    </div>
  );
};

export default DemoResultDisplay;
