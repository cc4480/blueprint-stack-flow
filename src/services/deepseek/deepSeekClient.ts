
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

    console.log('🔗 Starting DeepSeek API request...');
    console.log('📊 API Key status:', this.apiKey ? 'Configured' : 'Missing');
    console.log('📝 System prompt length:', systemPrompt.length);
    console.log('📝 User query length:', userQuery.length);

    // Clear conversation history to avoid token bloat
    this.conversationHistory = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userQuery }
    ];

    // Set up AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('⏰ DeepSeek API request timed out after 30 seconds');
    }, 30000); // Reduced to 30 second timeout

    try {
      console.log('🌐 Making request to DeepSeek API...');
      
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',
          messages: this.conversationHistory,
          temperature: 0.3, // Lower temperature for more consistent responses
          max_tokens: 2000, // Further reduced tokens for faster response
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ DeepSeek API error:', response.status, errorText);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your DeepSeek API key configuration.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status === 400) {
          throw new Error('Bad request. The prompt may be too long or contain invalid content.');
        } else {
          throw new Error(`DeepSeek API request failed: ${response.status} - ${errorText}`);
        }
      }

      const data: DeepSeekReasonerResponse = await response.json();
      
      console.log('📦 Response data structure:', {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length,
        hasMessage: !!data.choices?.[0]?.message,
        hasContent: !!data.choices?.[0]?.message?.content,
        hasReasoning: !!data.choices?.[0]?.message?.reasoning_content
      });
      
      if (!data.choices || data.choices.length === 0) {
        console.error('❌ No choices in DeepSeek response:', data);
        throw new Error('No response generated from DeepSeek API');
      }

      if (!data.choices[0].message || !data.choices[0].message.content) {
        console.error('❌ Invalid message structure in DeepSeek response:', data.choices[0]);
        throw new Error('Invalid response structure from DeepSeek API');
      }

      console.log('✅ DeepSeek API response received successfully');
      console.log('📝 Content length:', data.choices[0].message.content.length);
      console.log('🧠 Has reasoning:', !!data.choices[0].message.reasoning_content);

      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏰ DeepSeek API request timed out');
        throw new Error('Request timed out. Please try again with a simpler request or check your connection.');
      }
      
      console.error('❌ DeepSeek API error details:', error);
      throw error;
    }
  }
}
