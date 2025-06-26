
import React from 'react';
import { Brain, Database, Network } from 'lucide-react';

const DemoHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-5xl font-bold mb-6 gradient-logo-text">
        Get Your First NoCodeLos Blueprint Stack Master Prompt in{" "}
        <span className="text-purple-400">30 Seconds</span>
      </h2>
      <p className="text-xl text-gray-300 mb-4">
        Experience the power of DeepSeek Reasoner with RAG 2.0, MCP & A2A protocols
      </p>
      <div className="flex justify-center space-x-6 text-sm text-gray-400">
        <div className="flex items-center space-x-1">
          <Brain className="w-4 h-4 text-purple-400" />
          <span>DeepSeek Reasoner</span>
        </div>
        <div className="flex items-center space-x-1">
          <Database className="w-4 h-4 text-blue-400" />
          <span>RAG 2.0</span>
        </div>
        <div className="flex items-center space-x-1">
          <Network className="w-4 h-4 text-green-400" />
          <span>MCP + A2A</span>
        </div>
      </div>
    </div>
  );
};

export default DemoHeader;
