
import { PromptGenerationRequest, PromptGenerationResult } from './types/promptTypes';
import { DeepSeekClient } from './deepseek/deepSeekClient';
import { PromptBuilder } from './prompts/promptBuilder';
import { MetadataGenerator } from './metadata/metadataGenerator';

class PromptService {
  private deepSeekClient: DeepSeekClient;
  private promptBuilder: PromptBuilder;
  private metadataGenerator: MetadataGenerator;

  constructor() {
    this.deepSeekClient = new DeepSeekClient();
    this.promptBuilder = new PromptBuilder();
    this.metadataGenerator = new MetadataGenerator();
  }

  setApiKey(key: string) {
    this.deepSeekClient.setApiKey(key);
  }

  async generatePrompt(request: PromptGenerationRequest): Promise<PromptGenerationResult> {
    console.log('🚀 Generating NoCodeLos Blueprint Stack master prompt with DeepSeek Reasoner');

    try {
      // Build optimized system prompt for faster generation
      const systemPrompt = this.promptBuilder.buildOptimizedSystemPrompt();
      
      // Create focused user query for faster processing
      const userQuery = this.promptBuilder.buildFocusedQuery(request);

      // Generate response using DeepSeek
      const data = await this.deepSeekClient.generateResponse(systemPrompt, userQuery);
      
      const assistantResponse = data.choices[0].message;
      
      // Extract reasoning content for transparency
      const reasoningContent = assistantResponse.reasoning_content;
      const finalPrompt = assistantResponse.content;

      // Generate comprehensive metadata
      const complexity = this.metadataGenerator.assessComplexity(request.features.length);
      const estimatedTime = this.metadataGenerator.estimateBuildTime(request.features.length, complexity);
      const suggestedComponents = this.metadataGenerator.generateComponentSuggestions(request);
      const mcpEndpoints = this.metadataGenerator.generateMCPEndpoints(request);
      const a2aProtocols = this.metadataGenerator.generateA2AProtocols(request);
      const ragPipeline = this.metadataGenerator.generateRAGPipeline(request);

      console.log('✅ NoCodeLos Blueprint Stack master prompt generated successfully');
      
      return {
        prompt: finalPrompt,
        estimatedBuildTime: estimatedTime,
        complexity,
        suggestedComponents,
        reasoningContent,
        mcpEndpoints,
        a2aProtocols,
        ragPipeline
      };

    } catch (error) {
      console.error('❌ DeepSeek Reasoner generation failed:', error);
      throw error;
    }
  }
}

// Export the service instance
export const promptService = new PromptService();
