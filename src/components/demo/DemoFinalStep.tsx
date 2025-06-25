
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

interface FormData {
  appType: string;
  dataSource: string;
  features: string[];
  additionalRequirements: string;
}

interface DemoFinalStepProps {
  formData: FormData;
  isGenerating: boolean;
  onRequirementsChange: (value: string) => void;
  onGenerate: () => void;
}

const DemoFinalStep = ({ formData, isGenerating, onRequirementsChange, onGenerate }: DemoFinalStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
          <p className="text-lg text-gray-800 font-medium">
            {formData.appType} • {formData.dataSource} • {formData.features.length} features
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Additional Requirements (Optional)</span>
          <textarea
            value={formData.additionalRequirements}
            onChange={e => onRequirementsChange(e.target.value)}
            placeholder="Any specific design preferences, integrations, or custom functionality..."
            className="mt-2 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 resize-none bg-zinc-950"
          />
        </label>
      </div>

      <div className="text-center">
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 animate-spin" />
              <span>Generating Blueprint...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Generate NoCodeLos Blueprint</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DemoFinalStep;
