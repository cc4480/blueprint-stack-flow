
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InteractiveDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    appType: "",
    dataSource: "",
    keyFeatures: []
  });
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const appTypes = [
    { id: "dashboard", label: "Business Dashboard", icon: "📊" },
    { id: "ecommerce", label: "E-commerce Store", icon: "🛒" },
    { id: "social", label: "Social Platform", icon: "👥" },
    { id: "productivity", label: "Productivity Tool", icon: "⚡" },
    { id: "portfolio", label: "Portfolio Site", icon: "🎨" }
  ];

  const dataSources = [
    { id: "supabase", label: "Supabase", icon: "🗄️" },
    { id: "api", label: "External API", icon: "🔌" },
    { id: "static", label: "Static Data", icon: "📝" },
    { id: "ai", label: "AI-Generated", icon: "🤖" }
  ];

  const features = [
    { id: "auth", label: "User Authentication" },
    { id: "payments", label: "Payment Processing" },
    { id: "realtime", label: "Real-time Updates" },
    { id: "mobile", label: "Mobile Responsive" },
    { id: "search", label: "Search Functionality" },
    { id: "analytics", label: "Analytics Dashboard" }
  ];

  const generatePrompt = () => {
    const prompt = `Build a ${formData.appType} app with ${formData.dataSource} integration. Include: ${formData.keyFeatures.join(", ")}. Use the NoCodeLos Blueprint Stack methodology for modular, maintainable code.`;
    setGeneratedPrompt(prompt);
    setCurrentStep(3);
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.includes(featureId)
        ? prev.keyFeatures.filter(f => f !== featureId)
        : [...prev.keyFeatures, featureId]
    }));
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
              Experience the instant power of an AI-crafted prompt
            </p>
          </div>

          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="text-2xl">
                {currentStep === 0 && "Step 1: Choose Your App Type"}
                {currentStep === 1 && "Step 2: Select Data Source"}
                {currentStep === 2 && "Step 3: Pick Key Features"}
                {currentStep === 3 && "Your Custom Prompt is Ready!"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, appType: type.label }));
                        setCurrentStep(1);
                      }}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-center group"
                    >
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {type.icon}
                      </div>
                      <div className="font-semibold text-gray-800">{type.label}</div>
                    </button>
                  ))}
                </div>
              )}

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
                        }}
                        className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-center group"
                      >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                          {source.icon}
                        </div>
                        <div className="font-semibold text-gray-800">{source.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                          checked={formData.keyFeatures.includes(feature.id)}
                          onChange={() => handleFeatureToggle(feature.id)}
                          className="w-5 h-5 text-purple-600 rounded"
                        />
                        <span className="font-medium text-gray-800">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="text-center">
                    <Button
                      onClick={generatePrompt}
                      disabled={formData.keyFeatures.length === 0}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Generate My Custom Prompt
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Your Custom Prompt:</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 font-mono text-sm text-gray-800 leading-relaxed">
                      {generatedPrompt}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold"
                      onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                    >
                      📋 Copy Prompt
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-400 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full font-semibold"
                      onClick={() => {
                        setCurrentStep(0);
                        setFormData({ appType: "", dataSource: "", keyFeatures: [] });
                        setGeneratedPrompt("");
                      }}
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
