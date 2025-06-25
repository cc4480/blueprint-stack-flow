
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { toast } from 'sonner';
import { promptService } from '@/services/promptService';
import ApiKeyManager from '@/components/ApiKeyManager';
import PromptForm from '@/components/prompt-studio/PromptForm';
import PromptResults from '@/components/prompt-studio/PromptResults';

const PromptStudio = () => {
  const [apiKeySet, setApiKeySet] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);

  const handleApiKeyChange = (key: string | null) => {
    if (key) {
      promptService.setApiKey(key);
      setApiKeySet(true);
      toast.success('✅ DeepSeek API key configured successfully!');
    } else {
      setApiKeySet(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <Card className="mb-8 border-2 border-blue-400/30 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-6 h-6" />
              <span>NoCodeLos Blueprint Stack - Prompt Studio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!apiKeySet ? (
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromptStudio;
