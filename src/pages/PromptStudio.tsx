
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { toast } from 'sonner';
import { promptService } from '@/services/promptService';
import ApiKeyManager from '@/components/ApiKeyManager';
import PromptForm from '@/components/prompt-studio/PromptForm';
import PromptResults from '@/components/prompt-studio/PromptResults';
import DemoContainer from '@/components/demo/DemoContainer';

const PromptStudio = () => {
  const [apiKeySet, setApiKeySet] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [currentStep] = useState(0); // For the demo container

  const handleApiKeyChange = (key: string | null) => {
    if (key) {
      promptService.setApiKey(key);
      setApiKeySet(true);
      setShowApiKey(false); // Hide API key form after successful setup
      toast.success('✅ DeepSeek API key configured successfully!');
    } else {
      setApiKeySet(false);
    }
  };

  const handleShowApiKey = () => {
    setShowApiKey(true);
  };

  const handleGeneratePrompt = async (formData: any) => {
    setIsGenerating(true);
    try {
      const result = await promptService.generatePrompt({
        appType: formData.appType,
        dataSource: formData.dataSource,
        features: formData.features,
        platform: 'web',
        additionalContext: formData.additionalRequirements
      });
      
      setGeneratedResult(result);
      toast.success('🎉 Prompt generated successfully!');
    } catch (error) {
      console.error('Failed to generate prompt:', error);
      toast.error('Failed to generate prompt. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetResults = () => {
    setGeneratedResult(null);
  };

  const getStepTitle = () => {
    if (!apiKeySet || showApiKey) return 'Setup DeepSeek AI';
    if (!generatedResult) return 'Choose Your App Type';
    return 'Generated Blueprint';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent mb-4">
            Stack Master Prompt in 30 Seconds
          </h1>
          <p className="text-gray-600 text-lg">
            Experience the power of DeepSeek Reasoner with RAG 2.0, MCP & A2A protocols
          </p>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">DeepSeek Reasoner</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">RAG 2.0</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">MCP + A2A</span>
            </div>
          </div>
        </div>

        <DemoContainer
          currentStep={currentStep}
          showApiKey={showApiKey}
          onShowApiKey={handleShowApiKey}
          getStepTitle={getStepTitle}
          apiKeySet={apiKeySet}
        >
          {(!apiKeySet || showApiKey) ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Configure Your DeepSeek API Key
                </h2>
                <p className="text-gray-600">
                  Set up your API key to start generating advanced prompts with RAG 2.0, MCP & A2A protocols
                </p>
              </div>
              <ApiKeyManager onApiKeyChange={handleApiKeyChange} />
            </div>
          ) : (
            <div className="space-y-6">
              {!generatedResult ? (
                <PromptForm 
                  onGenerate={handleGeneratePrompt}
                  isGenerating={isGenerating}
                />
              ) : (
                <PromptResults 
                  result={generatedResult}
                  onReset={resetResults}
                />
              )}
            </div>
          )}
        </DemoContainer>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-red-50 rounded-2xl p-8 border border-purple-200/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent mb-4">
              Proof That It Works
            </h2>
            <p className="text-gray-600 mb-6">
              The NoCodeLos Blueprint Stack combines cutting-edge AI protocols for enterprise-grade applications
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Advanced Reasoning</h3>
                <p className="text-sm text-gray-600">DeepSeek Reasoner provides transparent chain-of-thought processing</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-purple-600 rounded"></div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">RAG 2.0 Integration</h3>
                <p className="text-sm text-gray-600">Advanced retrieval-augmented generation with vector databases</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">MCP & A2A Protocols</h3>
                <p className="text-sm text-gray-600">Standardized agent communication and tool integration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptStudio;
