
import type { PromptGenerationRequest, PromptGenerationResult } from './types';
import { DeepSeekClient } from './deepseekClient';
import { PromptTemplates } from './promptTemplates';
import { MetadataGenerators } from './metadataGenerators';

class PromptService {
  private deepSeekClient: DeepSeekClient;

  constructor() {
    this.deepSeekClient = new DeepSeekClient();
  }

  async generatePrompt(request: PromptGenerationRequest): Promise<PromptGenerationResult> {
    console.log('🚀 Generating unlimited NoCodeLos Blueprint Stack master prompt with DeepSeek Reasoner');

    try {
      // Build unlimited advanced system prompt for NoCodeLos Blueprint Stack
      const systemPrompt = PromptTemplates.buildUnlimitedMasterSystemPrompt();
      
      // Create comprehensive user query with full RAG 2.0 context
      const userQuery = PromptTemplates.buildComprehensiveMasterQuery(request);

      // Prepare messages for DeepSeek Reasoner
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: userQuery }
      ];

      const { reasoningContent, finalContent } = await this.deepSeekClient.generateWithReasoning(messages);

      // Add to conversation history for multi-turn conversations
      this.deepSeekClient.addToConversationHistory([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery },
        { role: 'assistant', content: finalContent }
      ]);

      // Generate comprehensive metadata with unlimited RAG 2.0, MCP, A2A integration
      const complexity = MetadataGenerators.assessComplexity(request.features.length);
      const estimatedTime = MetadataGenerators.estimateBuildTime(request.features.length, complexity);
      const suggestedComponents = MetadataGenerators.generateComponentSuggestions(request);
      const mcpEndpoints = MetadataGenerators.generateMCPEndpoints(request);
      const a2aProtocols = MetadataGenerators.generateA2AProtocols(request);
      const ragPipeline = MetadataGenerators.generateRAGPipeline(request);

      console.log('✅ Unlimited NoCodeLos Blueprint Stack master prompt generated with full DeepSeek integration');
      
      return {
        prompt: finalContent,
        estimatedBuildTime: estimatedTime,
        complexity,
        suggestedComponents,
        reasoningContent,
        mcpEndpoints,
        a2aProtocols,
        ragPipeline
      };

    } catch (error) {
      console.error('❌ DeepSeek Reasoner + RAG 2.0 unlimited generation failed:', error);
      throw error;
    }
  }

  async continueConversation(userMessage: string): Promise<PromptGenerationResult> {
    return this.deepSeekClient.continueConversation(userMessage);
  }
}

// Export the service instance
export const promptService = new PromptService();
