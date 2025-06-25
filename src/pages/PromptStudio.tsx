
import React, { useState } from 'react';
import { Brain, Wand2 } from 'lucide-react';
import PromptForm from '@/components/prompt-studio/PromptForm';
import PromptResults from '@/components/prompt-studio/PromptResults';
import DemoContainer from '@/components/demo/DemoContainer';
import { promptService } from '@/services/promptService';
import { toast } from 'sonner';

const PromptStudio = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGeneratePrompt = async (formData: any) => {
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
      toast.error('Failed to generate blueprint. Please check the DeepSeek API key configuration.');
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
          showApiKey={false}
          onShowApiKey={() => {}}
          getStepTitle={getStepTitle}
          apiKeySet={true}
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
