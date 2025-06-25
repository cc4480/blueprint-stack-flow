
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

interface DemoContainerProps {
  currentStep: number;
  showApiKey: boolean;
  onShowApiKey: () => void;
  getStepTitle: () => string;
  children: React.ReactNode;
}

const DemoContainer = ({ currentStep, showApiKey, onShowApiKey, getStepTitle, children }: DemoContainerProps) => {
  return (
    <Card className="shadow-2xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardTitle className="text-2xl flex items-center justify-between">
          <span>Step {currentStep + 1}: {getStepTitle()}</span>
          {!showApiKey && currentStep < 4 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowApiKey}
              className="text-white hover:bg-white/20"
            >
              <Brain className="w-4 h-4 mr-2" />
              Setup DeepSeek AI
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {children}
      </CardContent>
    </Card>
  );
};

export default DemoContainer;
