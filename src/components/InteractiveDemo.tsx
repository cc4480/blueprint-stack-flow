import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download, Zap, CheckCircle, Clock, Brain } from "lucide-react";
import { toast } from "sonner";
import ApiKeyManager from "./ApiKeyManager";
import { promptService, PromptGenerationRequest } from "../services/promptService";

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
  const [generatedResult, setGeneratedResult] = useState<{
    prompt: string;
    estimatedBuildTime: string;
    complexity: string;
    suggestedComponents: string[];
  } | null>(null);

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
    console.log('🎯 Interactive Demo initialized');
  }, []);

  const handleApiKeyChange = (key: string | null) => {
    if (key) {
      promptService.setApiKey(key);
      setShowApiKey(false);
      console.log('✅ API key configured in prompt service');
    }
  };

  const generatePrompt = async () => {
    if (formData.features.length === 0) {
      toast.error('Please select at least one feature');
      return;
    }

    setIsGenerating(true);
    console.log('🚀 Starting prompt generation process...');

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
      
      console.log('✅ Prompt generation completed:', result);
      toast.success('🎉 Your custom prompt is ready!');
      
    } catch (error) {
      console.error('❌ Prompt generation failed:', error);
      toast.error('Failed to generate prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
    
    console.log('🔄 Features updated:', formData.features);
  };

  const copyToClipboard = async () => {
    if (generatedResult) {
      await navigator.clipboard.writeText(generatedResult.prompt);
      toast.success('📋 Prompt copied to clipboard!');
      console.log('📋 Prompt copied to clipboard');
    }
  };

  const downloadPrompt = () => {
    if (generatedResult) {
      const blob = new Blob([generatedResult.prompt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nocodelos-blueprint-prompt.txt';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('📥 Prompt downloaded!');
      console.log('📥 Prompt file downloaded');
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setFormData({ appType: "", dataSource: "", features: [], additionalRequirements: "" });
    setGeneratedResult(null);
    console.log('🔄 Demo reset to beginning');
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return "Choose Your App Type";
      case 1: return "Select Data Source";
      case 2: return "Pick Key Features";
      case 3: return "Add Final Details";
      case 4: return "Your Custom Prompt is Ready!";
      default: return "";
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              Get Your First System-Generated Prompt in{" "}
              <span className="text-purple-600">30 Seconds</span>
            </h2>
            <p className="text-xl text-gray-600">
              Experience the instant power of an AI-crafted prompt using the NoCodeLos Blueprint Stack
            </p>
          </div>

          {/* API Key Setup */}
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
                    🤖 Setup AI
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* Step 0: App Type Selection */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, appType: type.label }));
                        setCurrentStep(1);
                        console.log('📱 App type selected:', type.label);
                      }}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-center group"
                    >
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {type.icon}
                      </div>
                      <div className="font-semibold text-gray-800 mb-2">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 1: Data Source Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-lg text-gray-600">
                      Building: <span className="font-semibold text-purple-600">{formData.appType}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dataSources.map((source) => (
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

              {/* Step 2: Feature Selection */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-lg text-gray-600">
                      Building: <span className="font-semibold text-purple-600">{formData.appType}</span> with{" "}
                      <span className="font-semibold text-purple-600">{formData.dataSource}</span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {features.map((feature) => (
                      <label
                        key={feature.id}
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-400 transition-all duration-300"
                      >
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature.id)}
                          onChange={() => handleFeatureToggle(feature.id)}
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
                      onClick={() => setCurrentStep(3)}
                      disabled={formData.features.length === 0}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Continue to Final Details
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Requirements */}
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
                        onChange={(e) => setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                        placeholder="Any specific design preferences, integrations, or custom functionality..."
                        className="mt-2 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 resize-none"
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
                          <span>Generating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Zap className="w-5 h-5" />
                          <span>Generate My Custom Prompt</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Generated Result */}
              {currentStep === 4 && generatedResult && (
                <div className="space-y-6">
                  {/* Success Header */}
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Your NoCodeLos Blueprint Stack Prompt is Ready!
                    </h3>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                      <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold text-blue-800">{generatedResult.estimatedBuildTime}</div>
                      <div className="text-sm text-blue-600">Build Time</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                      <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="font-semibold text-purple-800">{generatedResult.complexity}</div>
                      <div className="text-sm text-purple-600">Complexity</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg text-center">
                      <Zap className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="font-semibold text-green-800">{generatedResult.suggestedComponents.length}</div>
                      <div className="text-sm text-green-600">Components</div>
                    </div>
                  </div>

                  {/* Generated Prompt */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Your Custom Blueprint Stack Prompt:</h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 font-mono text-sm text-gray-800 leading-relaxed max-h-96 overflow-y-auto">
                      {generatedResult.prompt}
                    </div>
                  </div>

                  {/* Suggested Components */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Suggested Components:</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedResult.suggestedComponents.map((component, index) => (
                        <span 
                          key={index}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={copyToClipboard}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Prompt
                    </Button>
                    <Button
                      onClick={downloadPrompt}
                      variant="outline"
                      className="border-purple-400 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full font-semibold"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={resetDemo}
                      variant="ghost"
                      className="text-gray-600 hover:text-gray-800 px-8 py-3 rounded-full font-semibold"
                    >
                      🔄 Try Another
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
