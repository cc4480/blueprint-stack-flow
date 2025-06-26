
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Zap } from 'lucide-react';

interface FinalDetailsProps {
  selectedAppType: string;
  selectedDataSource: string;
  selectedFeatures: string[];
  additionalRequirements: string;
  isGenerating: boolean;
  onRequirementsChange: (value: string) => void;
  onGenerate: () => void;
}

const FinalDetails: React.FC<FinalDetailsProps> = ({
  selectedAppType,
  selectedDataSource,
  selectedFeatures,
  additionalRequirements,
  isGenerating,
  onRequirementsChange,
  onGenerate
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 mb-4">
          <p className="text-lg text-gray-100 font-medium">
            {selectedAppType} • {selectedDataSource} • {selectedFeatures.length} features
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-300 font-medium">Additional Requirements (Optional)</span>
          <textarea
            value={additionalRequirements}
            onChange={(e) => onRequirementsChange(e.target.value)}
            placeholder="Any specific design preferences, integrations, or custom functionality..."
            className="mt-2 w-full p-4 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 resize-none bg-gray-800 text-gray-100 placeholder-gray-400"
          />
        </label>
      </div>

      <div className="text-center">
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="gradient-logo hover:opacity-90 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 animate-spin" />
              <span>Generating Blueprint...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Generate NoCodeLos Blueprint</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FinalDetails;
