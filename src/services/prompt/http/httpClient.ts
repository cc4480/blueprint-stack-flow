
import type { ConversationMessage } from '../types';

export class HttpClient {
  async makeRequest(messages: ConversationMessage[]): Promise<Response> {
    const cleanMessages = this.cleanMessages(messages);
    
    console.log('📤 HttpClient: Making request to edge function', {
      url: '/functions/v1/deepseek-reasoner',
      method: 'POST',
      hasAuth: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      authPrefix: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 8) + '...',
      payloadSize: JSON.stringify({ messages: cleanMessages }).length
    });

    let response;
    try {
      response = await fetch('/functions/v1/deepseek-reasoner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ messages: cleanMessages }),
      });
    } catch (fetchError) {
      console.error('❌ HttpClient: Network error during fetch', {
        error: fetchError.message,
        stack: fetchError.stack,
        name: fetchError.name
      });
      throw new Error(`Network error: ${fetchError.message}. Check your internet connection and Supabase configuration.`);
    }

    console.log('📡 HttpClient: Response received', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    });

    return response;
  }

  private cleanMessages(messages: ConversationMessage[]) {
    return messages.map((msg, index) => {
      const cleaned = {
        role: msg.role,
        content: msg.content
      };
      console.log(`🧹 HttpClient: Cleaned message ${index}`, {
        role: cleaned.role,
        contentLength: cleaned.content?.length || 0,
        originalKeys: Object.keys(msg),
        cleanedKeys: Object.keys(cleaned)
      });
      return cleaned;
    });
  }

  async handleErrorResponse(response: Response): Promise<never> {
    console.error('❌ HttpClient: Edge function error', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });
    
    let errorData;
    try {
      const responseText = await response.text();
      console.log('📄 HttpClient: Raw error response', {
        responseText,
        responseLength: responseText.length
      });
      
      try {
        errorData = JSON.parse(responseText);
        console.log('📋 HttpClient: Parsed error data', errorData);
      } catch (jsonError) {
        console.warn('⚠️ HttpClient: Failed to parse error as JSON', {
          jsonError: jsonError.message,
          responseText: responseText.substring(0, 500)
        });
        errorData = { error: responseText, raw: true };
      }
      
      throw new Error(errorData.error || `DeepSeek Reasoner API request failed with status ${response.status}. Raw response: ${responseText}`);
    } catch (readError) {
      console.error('❌ HttpClient: Failed to read error response', {
        readError: readError.message,
        originalStatus: response.status
      });
      throw new Error(`DeepSeek Reasoner API request failed with status ${response.status}. Could not read error details: ${readError.message}`);
    }
  }
}
