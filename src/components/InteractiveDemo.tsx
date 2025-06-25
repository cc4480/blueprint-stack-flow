import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ApiKeyManager from "./ApiKeyManager";
import { promptService, PromptGenerationRequest } from "../services/promptService";
import DemoStepNavigation from "./demo/DemoStepNavigation";
import DemoAppTypeSelection from "./demo/DemoAppTypeSelection";
import DemoFeatureSelection from "./demo/DemoFeatureSelection";
import DemoResultDisplay from "./demo/DemoResultDisplay";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const InteractiveDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showApiKey, setShowApiKey] = useState(false);
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

  const handleApiKeyChange = (key: string | null) => {
    if (key) {
      promptService.setApiKey(key);
      setShowApiKey(false);
      console.log('✅ DeepSeek API key configured for NoCodeLos Blueprint Stack');
    }
  };

  const handleSelectAppType = (appType: string) => {
    setFormData(prev => ({ ...prev, appType }));
    setCurrentStep(1);
    console.log('📱 App type selected:', appType);
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
      toast.error('Failed to generate blueprint. Please ensure your DeepSeek API key is configured.');
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
            showApiKey={showApiKey}
            onShowApiKey={() => setShowApiKey(true)}
            getStepTitle={getStepTitle}
          />

          {showApiKey && (
            <div className="mb-8">
              <ApiKeyManager onApiKeyChange={handleApiKeyChange} />
            </div>
          )}

          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="text-2xl flex items-center justify-between">
                <span>Step {currentStep + 1}: {getStepTitle()}</span>
                {!showApiKey && currentStep < 4 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Setup DeepSeek AI
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {currentStep === 0 && (
                <DemoAppTypeSelection 
                  appTypes={appTypes}
                  onSelectAppType={handleSelectAppType}
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

              {currentStep === 4 && generatedResult && (
                <DemoResultDisplay
                  result={generatedResult}
                  onCopyToClipboard={copyToClipboard}
                  onDownloadPrompt={downloadPrompt}
                  onResetDemo={resetDemo}
                />
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-lg text-gray-600">
                      Building: <span className="font-semibold text-purple-600">{formData.appType}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dataSources.map(source => (
                      <button
                        key={source.id}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, dataSource: source.label }));
                          setCurrentStep(2);
                          console.log('💾 Data source selected:', source.label);
                        }}
                        className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-center group"
                      >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                          {source.icon}
                        </div>
                        <div className="font-semibold text-gray-800 mb-2">{source.label}</div>
                        <div className="text-sm text-gray-600">{source.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
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
                        onChange={e => setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                        placeholder="Any specific design preferences, integrations, or custom functionality..."
                        className="mt-2 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 resize-none bg-zinc-950"
                      />
                    </label>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={generatePrompt}
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
