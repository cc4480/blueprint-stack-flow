
import type { ConversationMessage, PromptGenerationResult } from './types';
import { HttpClient } from './http/httpClient';
import { ResponseProcessor } from './response/responseProcessor';

export class DeepSeekReasonerClient {
  private conversationHistory: ConversationMessage[] = [];
  private httpClient = new HttpClient();
  private responseProcessor = new ResponseProcessor();

  async generateWithReasoning(messages: ConversationMessage[]): Promise<{ reasoningContent: string; finalContent: string }> {
    console.log('🔑 DeepSeekReasonerClient: Starting generation', {
      messagesCount: messages.length,
      messageRoles: messages.map(m => m.role),
      firstMessagePreview: messages[0]?.content?.substring(0, 100) + '...'
    });

    const response = await this.httpClient.makeRequest(messages);

    if (!response.ok) {
      await this.httpClient.handleErrorResponse(response);
    }

    return await this.responseProcessor.processResponse(response);
  }

  async continueConversation(userMessage: string): Promise<PromptGenerationResult> {
    // Add user message to conversation history
    this.conversationHistory.push({ role: 'user', content: userMessage });

    const { reasoningContent, finalContent } = await this.generateWithReasoning(this.conversationHistory);

    // Add ONLY the final content to history, NOT the reasoning_content as per DeepSeek Reasoner docs
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
    // Clean messages to ensure no reasoning_content is included
    const cleanMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    this.conversationHistory.push(...cleanMessages);
  }
}
