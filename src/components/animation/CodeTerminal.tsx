
import React from 'react';
import { Terminal, Zap } from 'lucide-react';

interface CodeTerminalProps {
  typingText: string;
  showingCode: boolean;
  currentStep: number;
}

const CodeTerminal = ({ typingText, showingCode, currentStep }: CodeTerminalProps) => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg border border-gray-700/50 overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-3 flex items-center gap-3 border-b border-gray-600/50">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300 text-sm font-mono">Lovable AI Builder</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span className="text-xs text-gray-400">Building...</span>
        </div>
      </div>
      
      {/* Code Content */}
      <div className="p-6 h-72 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
        <pre className="text-green-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {typingText}
          {showingCode && (
            <span className="animate-pulse bg-green-400 text-black px-1">|</span>
          )}
        </pre>
        
        {/* Progress indicator */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center gap-2 bg-gray-800/80 rounded-full px-3 py-2 backdrop-blur-sm">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-300">Step {currentStep + 1}/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeTerminal;
