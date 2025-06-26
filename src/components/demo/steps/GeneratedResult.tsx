
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, CheckCircle, Clock, Brain, Network, Database, GitBranch } from 'lucide-react';
import { GeneratedResult } from '../types';
import { toast } from 'sonner';

interface GeneratedResultProps {
  result: GeneratedResult;
  onReset: () => void;
}

const GeneratedResultComponent: React.FC<GeneratedResultProps> = ({ result, onReset }) => {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result.prompt);
    toast.success('📋 NoCodeLos Blueprint Stack prompt copied to clipboard!');
  };

  const downloadPrompt = () => {
    const blob = new Blob([result.prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nocodelos-blueprint-stack-master-prompt.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('📥 NoCodeLos Blueprint Stack prompt downloaded!');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-100 mb-2">
          Your NoCodeLos Blueprint Stack Master Prompt is Ready!
        </h3>
        <p className="text-gray-300">Generated with DeepSeek Reasoner + RAG 2.0 + MCP + A2A integration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 rounded-lg text-center">
          <Clock className="w-6 h-6 text-blue-300 mx-auto mb-2" />
          <div className="font-semibold text-blue-100">{result.estimatedBuildTime}</div>
          <div className="text-sm text-blue-300">Build Time</div>
        </div>
        <div className="bg-gradient-to-r from-purple-900 to-purple-800 p-4 rounded-lg text-center">
          <Brain className="w-6 h-6 text-purple-300 mx-auto mb-2" />
          <div className="font-semibold text-purple-100">{result.complexity}</div>
          <div className="text-sm text-purple-300">Complexity</div>
        </div>
        <div className="bg-gradient-to-r from-green-900 to-green-800 p-4 rounded-lg text-center">
          <Network className="w-6 h-6 text-green-300 mx-auto mb-2" />
          <div className="font-semibold text-green-100">{result.mcpEndpoints?.length || 0}</div>
          <div className="text-sm text-green-300">MCP Endpoints</div>
        </div>
        <div className="bg-gradient-to-r from-orange-900 to-orange-800 p-4 rounded-lg text-center">
          <GitBranch className="w-6 h-6 text-orange-300 mx-auto mb-2" />
          <div className="font-semibold text-orange-100">{result.a2aProtocols?.length || 0}</div>
          <div className="text-sm text-orange-300">A2A Protocols</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-xl p-6">
        <h4 className="text-xl font-bold text-gray-100 mb-4">Your NoCodeLos Blueprint Stack Master Prompt:</h4>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 font-mono text-sm text-gray-200 leading-relaxed max-h-96 overflow-y-auto">
          {result.prompt}
        </div>
      </div>

      {result.ragPipeline && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-6">
          <h4 className="font-semibold text-gray-100 mb-3 flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-300" />
            RAG 2.0 Pipeline:
          </h4>
          <p className="text-sm text-gray-200 font-mono">{result.ragPipeline}</p>
        </div>
      )}

      {result.mcpEndpoints && result.mcpEndpoints.length > 0 && (
        <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg p-6">
          <h4 className="font-semibold text-gray-100 mb-3 flex items-center">
            <Network className="w-5 h-5 mr-2 text-green-300" />
            MCP Endpoints:
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.mcpEndpoints.map((endpoint, index) => (
              <span
                key={index}
                className="bg-green-800 text-green-200 px-3 py-1 rounded-full text-sm font-mono"
              >
                {endpoint}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.a2aProtocols && result.a2aProtocols.length > 0 && (
        <div className="bg-gradient-to-r from-orange-900 to-red-900 rounded-lg p-6">
          <h4 className="font-semibold text-gray-100 mb-3 flex items-center">
            <GitBranch className="w-5 h-5 mr-2 text-orange-300" />
            A2A Protocols:
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.a2aProtocols.map((protocol, index) => (
              <span
                key={index}
                className="bg-orange-800 text-orange-200 px-3 py-1 rounded-full text-sm font-medium"
              >
                {protocol}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-6">
        <h4 className="font-semibold text-gray-100 mb-3">Suggested Components:</h4>
        <div className="flex flex-wrap gap-2">
          {result.suggestedComponents.map((component, index) => (
            <span
              key={index}
              className="bg-purple-800 text-purple-200 px-3 py-1 rounded-full text-sm font-medium"
            >
              {component}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={copyToClipboard}
          className="gradient-logo hover:opacity-90 text-white px-8 py-3 rounded-full font-semibold"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Blueprint
        </Button>
        <Button
          onClick={downloadPrompt}
          variant="outline"
          className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 rounded-full font-semibold bg-transparent"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          onClick={onReset}
          variant="ghost"
          className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 px-8 py-3 rounded-full font-semibold"
        >
          🔄 Create Another
        </Button>
      </div>
    </div>
  );
};

export default GeneratedResultComponent;
