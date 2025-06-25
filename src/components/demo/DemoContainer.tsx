import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
interface DemoContainerProps {
  currentStep: number;
  showApiKey: boolean;
  onShowApiKey: () => void;
  getStepTitle: () => string;
  children: React.ReactNode;
  apiKeySet?: boolean;
}
const DemoContainer = ({
  currentStep,
  showApiKey,
  onShowApiKey,
  getStepTitle,
  children,
  apiKeySet = false
}: DemoContainerProps) => {
  return <Card className="shadow-2xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardTitle className="text-2xl flex items-center justify-between">
          <span>Step {currentStep + 1}: {getStepTitle()}</span>
          {!apiKeySet}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {children}
      </CardContent>
    </Card>;
};
export default DemoContainer;