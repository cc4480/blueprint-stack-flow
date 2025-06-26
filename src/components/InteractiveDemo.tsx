
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ApiKeyManager from "./ApiKeyManager";
import DemoHeader from "./demo/DemoHeader";
import AppTypeSelection from "./demo/steps/AppTypeSelection";
import DataSourceSelection from "./demo/steps/DataSourceSelection";
import FeatureSelection from "./demo/steps/FeatureSelection";
import FinalDetails from "./demo/steps/FinalDetails";
import GeneratedResultComponent from "./demo/steps/GeneratedResult";
import { StreamingService } from "./demo/StreamingService";
import { FormData, GeneratedResult } from "./demo/types";
import {
  assessComplexity,
  estimateBuildTime,
  generateComponentSuggestions,
  generateMCPEndpoints,
  generateA2AProtocols,
  generateRAGPipeline
} from "./demo/utils";

const InteractiveDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    appType: "",
    dataSource: "",
    features: [],
    additionalRequirements: ""
  });
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);

  useEffect(() => {
    console.log('🎯 NoCodeLos Blueprint Stack Interactive Demo initialized with DeepSeek integration');
  }, []);

  const handleApiKeyChange = (key: string | null) => {
    if (key) {
      setShowApiKey(false);
      console.log('✅ DeepSeek API key configured for NoCodeLos Blueprint Stack');
    }
  };

  const generatePrompt = async () => {
    if (formData.features.length === 0) {
      toast.error('Please select at least one feature');
      return;
    }

    setIsGenerating(true);
    console.log('🚀 Generating NoCodeLos Blueprint Stack prompt with RAG 2.0 + MCP + A2A...');

    try {
      const systemPrompt = `You are the NoCodeLos Blueprint Stack Master AI - Supreme Application Architect with deepseek-chat integration.

🎯 MISSION: Generate comprehensive, production-ready blueprints integrating RAG 2.0, MCP (Model Context Protocol), A2A (Agent-to-Agent), and deepseek-chat streaming capabilities.

⚡ CORE REQUIREMENTS:
1. **RAG 2.0 Database Integration**
   - Dynamic retrieval pipelines with >99.9% precision
   - Advanced chunking, embedding optimization, vector databases
   - Semantic search, hybrid retrieval, query expansion

2. **MCP Protocol Implementation** 
   - Complete A2A/MCP protocols for real-time communication
   - Zero latency via atomic transactions, conflict-free replication
   - MCP server configurations, endpoint schemas, tool definitions

3. **A2A Protocol Integration**
   - Multi-agent coordination, delegation, negotiation
   - Enterprise-grade security, authentication, authorization
   - Dynamic load balancing, fault tolerance

4. **DeepSeek Chat**
   - Real-time streaming responses with deepseek-chat model
   - Advanced problem decomposition, solution synthesis
   - Production-optimized reasoning workflows

Generate comprehensive development blueprints with unlimited detail, complete implementation guidance, and enterprise-grade quality.`;

      const userQuery = `Generate a comprehensive NoCodeLos Blueprint Stack development blueprint for:

**Application Type**: ${formData.appType}
**Data Source**: ${formData.dataSource} 
**Key Features**: ${formData.features.join(', ')}
**Additional Context**: ${formData.additionalRequirements || 'None provided'}

**INTEGRATION REQUIREMENTS**:
1. **RAG 2.0 Advanced Retrieval**: Complete document processing, vector optimization, hybrid search
2. **MCP Protocol**: Full server configurations, tool definitions, capability negotiation
3. **A2A Protocol**: Agent discovery, task workflows, multi-agent coordination
4. **DeepSeek Chat**: Real-time streaming integration, conversation management

Provide complete implementation guidance with code examples, configuration files, architectural patterns, and deployment strategies. Generate at least 10,000 characters of comprehensive content.`;

      let fullResponse = '';
      await StreamingService.streamChatResponse([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery }
      ], 
      (token) => {
        fullResponse += token;
      }, 
      () => {
        // Generation complete
        const complexity = assessComplexity(formData.features.length);
        const estimatedTime = estimateBuildTime(formData.features.length, complexity);
        const suggestedComponents = generateComponentSuggestions(formData);
        const mcpEndpoints = generateMCPEndpoints(formData);
        const a2aProtocols = generateA2AProtocols(formData);
        const ragPipeline = generateRAGPipeline();

        setGeneratedResult({
          prompt: fullResponse,
          estimatedBuildTime: estimatedTime,
          complexity,
          suggestedComponents,
          mcpEndpoints,
          a2aProtocols,
          ragPipeline
        });

        setCurrentStep(4);
        setIsGenerating(false);
        console.log('✅ NoCodeLos Blueprint Stack prompt generated with full DeepSeek integration');
        toast.success('🎉 Your NoCodeLos Blueprint Stack master prompt is ready!');
      }, 
      (error) => {
        setIsGenerating(false);
        console.error('❌ Blueprint Stack prompt generation failed:', error);
        toast.error('Failed to generate blueprint. Please ensure your DeepSeek API key is configured.');
      });
    } catch (error) {
      setIsGenerating(false);
      console.error('❌ Blueprint Stack prompt generation failed:', error);
      toast.error('Failed to generate blueprint. Please ensure your DeepSeek API key is configured.');
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId) 
        ? prev.features.filter(f => f !== featureId) 
        : [...prev.features, featureId]
    }));
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setFormData({
      appType: "",
      dataSource: "",
      features: [],
      additionalRequirements: ""
    });
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
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <DemoHeader />

          {showApiKey && (
            <div className="mb-8">
              <ApiKeyManager onApiKeyChange={handleApiKeyChange} />
            </div>
          )}

          <Card className="shadow-2xl border-gray-800 bg-gray-900 overflow-hidden">
            <CardHeader className="gradient-logo text-white">
              <CardTitle className="text-2xl flex items-center justify-between">
                <span>Step {currentStep + 1}: {getStepTitle()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-gray-900">
              {currentStep === 0 && (
                <AppTypeSelection
                  onSelect={(appType) => {
                    setFormData(prev => ({ ...prev, appType }));
                    setCurrentStep(1);
                  }}
                />
              )}

              {currentStep === 1 && (
                <DataSourceSelection
                  selectedAppType={formData.appType}
                  onSelect={(dataSource) => {
                    setFormData(prev => ({ ...prev, dataSource }));
                    setCurrentStep(2);
                  }}
                />
              )}

              {currentStep === 2 && (
                <FeatureSelection
                  selectedAppType={formData.appType}
                  selectedDataSource={formData.dataSource}
                  selectedFeatures={formData.features}
                  onFeatureToggle={handleFeatureToggle}
                  onContinue={() => setCurrentStep(3)}
                />
              )}

              {currentStep === 3 && (
                <FinalDetails
                  selectedAppType={formData.appType}
                  selectedDataSource={formData.dataSource}
                  selectedFeatures={formData.features}
                  additionalRequirements={formData.additionalRequirements}
                  isGenerating={isGenerating}
                  onRequirementsChange={(value) => 
                    setFormData(prev => ({ ...prev, additionalRequirements: value }))
                  }
                  onGenerate={generatePrompt}
                />
              )}

              {currentStep === 4 && generatedResult && (
                <GeneratedResultComponent
                  result={generatedResult}
                  onReset={resetDemo}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
