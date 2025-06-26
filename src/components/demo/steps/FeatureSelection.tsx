
import React from 'react';
import { Button } from '@/components/ui/button';
import { FEATURES } from '../constants';

interface FeatureSelectionProps {
  selectedAppType: string;
  selectedDataSource: string;
  selectedFeatures: string[];
  onFeatureToggle: (featureId: string) => void;
  onContinue: () => void;
}

const FeatureSelection: React.FC<FeatureSelectionProps> = ({
  selectedAppType,
  selectedDataSource,
  selectedFeatures,
  onFeatureToggle,
  onContinue
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-lg text-gray-300">
          Building: <span className="font-semibold text-purple-400">{selectedAppType}</span> with{" "}
          <span className="font-semibold text-purple-400">{selectedDataSource}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {FEATURES.map(feature => (
          <label
            key={feature.id}
            className="flex items-center space-x-3 p-4 border-2 border-gray-700 rounded-xl cursor-pointer hover:border-purple-400 transition-all duration-300 bg-gray-800"
          >
            <input
              type="checkbox"
              checked={selectedFeatures.includes(feature.id)}
              onChange={() => onFeatureToggle(feature.id)}
              className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-100">{feature.label}</span>
              <span className="text-xs text-purple-400 ml-2">({feature.category})</span>
            </div>
          </label>
        ))}
      </div>
      
      <div className="text-center">
        <Button
          onClick={onContinue}
          disabled={selectedFeatures.length === 0}
          className="gradient-logo hover:opacity-90 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Continue to Final Details
        </Button>
      </div>
    </div>
  );
};

export default FeatureSelection;
