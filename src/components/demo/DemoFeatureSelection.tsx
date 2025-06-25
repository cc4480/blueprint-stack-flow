
import { Button } from '@/components/ui/button';

interface Feature {
  id: string;
  label: string;
  category: string;
}

interface DemoFeatureSelectionProps {
  features: Feature[];
  selectedFeatures: string[];
  onFeatureToggle: (featureId: string) => void;
  onContinue: () => void;
  appType: string;
  dataSource: string;
}

const DemoFeatureSelection = ({ 
  features, 
  selectedFeatures, 
  onFeatureToggle, 
  onContinue, 
  appType, 
  dataSource 
}: DemoFeatureSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-lg text-gray-600">
          Building: <span className="font-semibold text-purple-600">{appType}</span> with{" "}
          <span className="font-semibold text-purple-600">{dataSource}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {features.map(feature => (
          <label key={feature.id} className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-400 transition-all duration-300">
            <input
              type="checkbox"
              checked={selectedFeatures.includes(feature.id)}
              onChange={() => onFeatureToggle(feature.id)}
              className="w-5 h-5 text-purple-600 rounded"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-800">{feature.label}</span>
              <span className="text-xs text-purple-600 ml-2">({feature.category})</span>
            </div>
          </label>
        ))}
      </div>
      
      <div className="text-center">
        <Button
          onClick={onContinue}
          disabled={selectedFeatures.length === 0}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Continue to Final Details
        </Button>
      </div>
    </div>
  );
};

export default DemoFeatureSelection;
