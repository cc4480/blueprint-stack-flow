
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { promptService, PromptGenerationRequest } from "../services/promptService";
import DemoStepNavigation from "./demo/DemoStepNavigation";
import DemoAppTypeSelection from "./demo/DemoAppTypeSelection";
import DemoDataSourceSelection from "./demo/DemoDataSourceSelection";
import DemoFeatureSelection from "./demo/DemoFeatureSelection";
import DemoFinalStep from "./demo/DemoFinalStep";
import DemoResultDisplay from "./demo/DemoResultDisplay";
import DemoContainer from "./demo/DemoContainer";

const InteractiveDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    appType: "",
    dataSource: "",
    features: [] as string[],
    additionalRequirements: ""
  });
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  const appTypes = [
    { id: "dashboard", label: "Business Dashboard", icon: "📊", description: "Analytics and data visualization" },
    { id: "ecommerce", label: "E-commerce Store", icon: "🛒", description: "Online shopping platform" },
    { id: "social", label: "Social Platform", icon: "👥", description: "Community and networking" },
    { id: "productivity", label: "Productivity Tool", icon: "⚡", description: "Task and project management" },
    { id: "portfolio", label: "Portfolio Site", icon: "🎨", description: "Professional showcase" },
    { id: "saas", label: "SaaS Application", icon: "🚀", description: "Software as a Service" }
  ];

  const dataSources = [
    { id: "supabase", label: "Supabase", icon: "🗄️", description: "Real-time database" },
    { id: "api", label: "External API", icon: "🔌", description: "Third-party integrations" },
    { id: "static", label: "Static Data", icon: "📝", description: "JSON or hardcoded data" },
    { id: "ai", label: "AI-Generated", icon: "🤖", description: "Dynamic AI content" }
  ];

  const features = [
    { id: "auth", label: "User Authentication", category: "Security" },
    { id: "payments", label: "Payment Processing", category: "Commerce" },
    { id: "realtime", label: "Real-time Updates", category: "Communication" },
    { id: "mobile", label: "Mobile Responsive", category: "Design" },
    { id: "search", label: "Search Functionality", category: "Features" },
    { id: "analytics", label: "Analytics Dashboard", category: "Business" },
    { id: "notifications", label: "Push Notifications", category: "Communication" },
    { id: "file-upload", label: "File Upload/Storage", category: "Features" }
  ];

  useEffect(() => {
    console.log('🎯 NoCodeLos Blueprint Stack Interactive Demo initialized with DeepSeek integration');
  }, []);

  const handleSelectAppType = (appType: string) => {
    setFormData(prev => ({ ...prev, appType }));
    setCurrentStep(1);
    console.log('📱 App type selected:', appType);
  };

  const handleSelectDataSource = (dataSource: string) => {
    setFormData(prev => ({ ...prev, dataSource }));
    setCurrentStep(2);
    console.log('💾 Data source selected:', dataSource);
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId) 
        ? prev.features.filter(f => f !== featureId) 
        : [...prev.features, featureId]
    }));
  };

  const generatePrompt = async () => {
    if (formData.features.length === 0) {
      toast.error('Please select at least one feature');
      return;
    }

    setIsGenerating(true);
    console.log('🚀 Generating NoCodeLos Blueprint Stack prompt with RAG 2.0 + MCP + A2A...');

    try {
      const request: PromptGenerationRequest = {
        appType: formData.appType,
        dataSource: formData.dataSource,
        features: formData.features,
        platform: "web",
        additionalContext: formData.additionalRequirements
      };

      const result = await promptService.generatePrompt(request);
      setGeneratedResult(result);
      setCurrentStep(4);
      console.log('✅ NoCodeLos Blueprint Stack prompt generated with full DeepSeek integration:', result);
      toast.success('🎉 Your NoCodeLos Blueprint Stack master prompt is ready!');
    } catch (error) {
      console.error('❌ Blueprint Stack prompt generation failed:', error);
      toast.error('Failed to generate blueprint. Please check the edge function configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedResult) {
      await navigator.clipboard.writeText(generatedResult.prompt);
      toast.success('📋 NoCodeLos Blueprint Stack prompt copied to clipboard!');
    }
  };

  const downloadPrompt = () => {
    if (generatedResult) {
      const blob = new Blob([generatedResult.prompt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nocodelos-blueprint-stack-master-prompt.txt';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('📥 NoCodeLos Blueprint Stack prompt downloaded!');
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setFormData({ appType: "", dataSource: "", features: [], additionalRequirements: "" });
    setGeneratedResult(null);
    console.log('🔄 NoCodeLos Blueprint Stack demo reset');
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return "Choose Your App Type";
      case 1: return "Select Data Source";
      case 2: return "Pick Key Features";
      case 3: return "Add Final Details";
      case 4: return "Your NoCodeLos Blueprint Stack Master Prompt is Ready!";
      default: return "";
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="container mx-auto px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <DemoStepNavigation 
            currentStep={currentStep}
            showApiKey={false}
            onShowApiKey={() => {}}
            getStepTitle={getStepTitle}
          />

          <DemoContainer
            currentStep={currentStep}
            showApiKey={false}
            onShowApiKey={() => {}}
            getStepTitle={getStepTitle}
            apiKeySet={true}
          >
            {currentStep === 0 && (
              <DemoAppTypeSelection 
                appTypes={appTypes}
                onSelectAppType={handleSelectAppType}
              />
            )}

            {currentStep === 1 && (
              <DemoDataSourceSelection
                dataSources={dataSources}
                selectedAppType={formData.appType}
                onSelectDataSource={handleSelectDataSource}
              />
            )}

            {currentStep === 2 && (
              <DemoFeatureSelection
                features={features}
                selectedFeatures={formData.features}
                onFeatureToggle={handleFeatureToggle}
                onContinue={() => setCurrentStep(3)}
                appType={formData.appType}
                dataSource={formData.dataSource}
              />
            )}

            {currentStep === 3 && (
              <DemoFinalStep
                formData={formData}
                isGenerating={isGenerating}
                onRequirementsChange={(value) => setFormData(prev => ({ ...prev, additionalRequirements: value }))}
                onGenerate={generatePrompt}
              />
            )}

            {currentStep === 4 && generatedResult && (
              <DemoResultDisplay
                result={generatedResult}
                onCopyToClipboard={copyToClipboard}
                onDownloadPrompt={downloadPrompt}
                onResetDemo={resetDemo}
              />
            )}
          </DemoContainer>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
