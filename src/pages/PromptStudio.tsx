
import React, { useState } from 'react';
import { Brain, Wand2 } from 'lucide-react';
import ApiKeyManager from '@/components/ApiKeyManager';
import PromptForm from '@/components/prompt-studio/PromptForm';
import PromptResults from '@/components/prompt-studio/PromptResults';
import DemoContainer from '@/components/demo/DemoContainer';
import { promptService } from '@/services/promptService';
import { toast } from 'sonner';

const PromptStudio = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(true); // Always true since we use Supabase secrets
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleApiKeyChange = (key: string | null) => {
    setApiKeySet(!!key);
    if (key) {
      setShowApiKeyManager(false); // Close the API key manager when key is set
      console.log('✅ DeepSeek API key configured for NoCodeLos Blueprint Stack');
    } else {
      console.log('❌ DeepSeek API key removed from NoCodeLos Blueprint Stack');
    }
  };

  const handleShowApiKey = () => {
    setShowApiKeyManager(true);
  };

  const handleGeneratePrompt = async (formData: any) => {
    if (!apiKeySet) {
      toast.error('Please configure your DeepSeek API key first');
      setShowApiKeyManager(true);
      return;
    }

    setIsGenerating(true);
    console.log('🚀 Starting NoCodeLos Blueprint generation with DeepSeek Reasoner...');

    try {
      const result = await promptService.generatePrompt({
        appType: formData.appType,
        dataSource: formData.dataSource,
        features: formData.features,
        platform: 'react',
        additionalContext: formData.additionalRequirements
      });

      setResult(result);
      setCurrentStep(1);
      console.log('✅ NoCodeLos Blueprint generated successfully');
      toast.success('🎉 Blueprint generated successfully!');
    } catch (error) {
      console.error('❌ Blueprint generation failed:', error);
      toast.error('Failed to generate blueprint. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCurrentStep(0);
    console.log('🔄 Reset to prompt form');
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return 'Configure Your Blueprint';
      case 1:
        return 'Generated Blueprint';
      default:
        return 'NoCodeLos Blueprint Studio';
    }
  };

  // Show API key manager if requested or if no API key is set
  if (showApiKeyManager) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent mb-4">
              NoCodeLos Blueprint Studio
            </h1>
            <p className="text-gray-600 text-lg">
              Configure DeepSeek API for advanced AI-powered blueprint generation
            </p>
          </div>
          <ApiKeyManager onApiKeyChange={handleApiKeyChange} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent mb-4">
            <Brain className="inline-block w-12 h-12 mr-4 text-blue-600" />
            NoCodeLos Blueprint Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate comprehensive development blueprints with RAG 2.0, MCP & A2A protocols using DeepSeek Reasoner AI
          </p>
        </div>

        <DemoContainer
          currentStep={currentStep}
          showApiKey={showApiKeyManager}
          onShowApiKey={handleShowApiKey}
          getStepTitle={getStepTitle}
          apiKeySet={apiKeySet}
        >
          {currentStep === 0 && (
            <PromptForm 
              onGenerate={handleGeneratePrompt}
              isGenerating={isGenerating}
            />
          )}
          
          {currentStep === 1 && result && (
            <PromptResults 
              result={result}
              onReset={handleReset}
            />
          )}
        </DemoContainer>
      </div>
    </div>
  );
};

export default PromptStudio;
