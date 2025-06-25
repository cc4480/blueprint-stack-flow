
import OpenAI from 'openai';
import type { ConversationMessage, DeepSeekChunk, PromptGenerationResult } from './types';

export class DeepSeekClient {
  private client: OpenAI | null = null;
  private conversationHistory: ConversationMessage[] = [];

  setApiKey(key: string) {
    this.client = new OpenAI({
      apiKey: key,
      baseURL: "https://api.deepseek.com",
      dangerouslyAllowBrowser: true
    });
    console.log('🔑 DeepSeek Reasoner client configured for unlimited RAG 2.0 + MCP + A2A master blueprint generation');
  }

  async generateWithReasoning(messages: ConversationMessage[]): Promise<{ reasoningContent: string; finalContent: string }> {
    if (!this.client) {
      throw new Error('DeepSeek API key not configured. Please set your API key to enable unlimited RAG 2.0, MCP, and A2A protocols.');
    }

    const response = await this.client.chat.completions.create({
      model: 'deepseek-reasoner',
      messages: messages,
      stream: true,
      temperature: 0.8,
    });

    let reasoningContent = "";
    let finalContent = "";

    // Process streaming response with proper typing
    for await (const chunk of response) {
      const deepSeekChunk = chunk as unknown as DeepSeekChunk;
      const delta = deepSeekChunk.choices[0]?.delta;
      
      if (delta?.reasoning_content) {
        reasoningContent += delta.reasoning_content;
      }
      if (delta?.content) {
        finalContent += delta.content;
      }
    }

    return { reasoningContent, finalContent };
  }

  async continueConversation(userMessage: string): Promise<PromptGenerationResult> {
    if (!this.client) {
      throw new Error('DeepSeek API key not configured.');
    }

    // Add user message to conversation history
    this.conversationHistory.push({ role: 'user', content: userMessage });

    const { reasoningContent, finalContent } = await this.generateWithReasoning(this.conversationHistory);

    // Add assistant response to history
    this.conversationHistory.push({ role: 'assistant', content: finalContent });

    console.log('✅ Multi-turn conversation completed with DeepSeek Reasoner');

    return {
      prompt: finalContent,
      estimatedBuildTime: '5-8 days',
      complexity: 'Advanced',
      suggestedComponents: [],
      reasoningContent,
      mcpEndpoints: [],
      a2aProtocols: [],
      ragPipeline: 'Continuous Learning Pipeline'
    };
  }

  addToConversationHistory(messages: ConversationMessage[]) {
    this.conversationHistory.push(...messages);
  }
}
