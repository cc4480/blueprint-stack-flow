
import { DeepSeekReasonerResponse } from '../types/promptTypes';

export class DeepSeekClient {
  private apiKey: string | null = null;
  private conversationHistory: Array<{ role: string; content: string }> = [];

  setApiKey(key: string) {
    this.apiKey = key;
    console.log('🔑 DeepSeek API key configured for NoCodeLos Blueprint Stack integration');
  }

  async generateResponse(systemPrompt: string, userQuery: string): Promise<DeepSeekReasonerResponse> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured. Please set your API key to enable RAG 2.0, MCP, and A2A protocols.');
    }

    // Clear conversation history to avoid token bloat
    this.conversationHistory = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userQuery }
    ];

    // Set up AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('⏰ DeepSeek API request timed out after 45 seconds');
    }, 45000); // 45 second timeout

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',
          messages: this.conversationHistory,
          temperature: 0.7,
          max_tokens: 4000, // Limit tokens for faster response
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ DeepSeek API error:', response.status, errorText);
        throw new Error(`DeepSeek API request failed: ${response.status} - ${errorText}`);
      }

      const data: DeepSeekReasonerResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response generated from DeepSeek API');
      }

      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏰ DeepSeek API request timed out');
        throw new Error('Request timed out. Please try again with a simpler request or check your connection.');
      }
      
      throw error;
    }
  }
}
