
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';

interface DemoStepNavigationProps {
  currentStep: number;
  showApiKey: boolean;
  onShowApiKey: () => void;
  getStepTitle: () => string;
}

const DemoStepNavigation = ({ currentStep, showApiKey, onShowApiKey, getStepTitle }: DemoStepNavigationProps) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-5xl font-bold mb-6 text-slate-400">
        Get Your First NoCodeLos Blueprint Stack Master Prompt in{" "}
        <span className="text-purple-600">30 Seconds</span>
      </h2>
      <p className="text-xl text-gray-600 mb-4">
        Experience the power of DeepSeek Reasoner with RAG 2.0, MCP & A2A protocols
      </p>
      <div className="flex justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Brain className="w-4 h-4 text-purple-600" />
          <span>DeepSeek Reasoner</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-4 h-4 text-blue-600">🗄️</span>
          <span>RAG 2.0</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-4 h-4 text-green-600">🔌</span>
          <span>MCP + A2A</span>
        </div>
      </div>
    </div>
  );
};

export default DemoStepNavigation;
