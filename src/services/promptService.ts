
export interface PromptGenerationRequest {
  appType: string;
  dataSource: string;
  features: string[];
  platform: string;
  additionalContext?: string;
}

export interface PromptGenerationResult {
  prompt: string;
  estimatedBuildTime: string;
  complexity: string;
  suggestedComponents: string[];
}

class PromptService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
    console.log('🔑 API key configured for prompt service');
  }

  async generatePrompt(request: PromptGenerationRequest): Promise<PromptGenerationResult> {
    console.log('🚀 Generating prompt with request:', request);

    if (!this.apiKey) {
      throw new Error('API key not configured. Please set your DeepSeek API key first.');
    }

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are the NoCodeLos Blueprint Stack AI assistant. Generate comprehensive, production-ready prompts for building full-stack applications using modern no-code/low-code tools like Lovable, Cursor, and Replit. 

Your prompts should be:
- Specific and actionable
- Include modern tech stack recommendations
- Focus on scalable architecture
- Include UI/UX best practices
- Mention performance optimization
- Include error handling strategies

Format your response as a detailed prompt that someone could use directly with AI development tools.`
            },
            {
              role: 'user',
              content: `Generate a comprehensive development prompt for building a ${request.appType} application using ${request.dataSource} as the data source. Key features to include: ${request.features.join(', ')}. Additional context: ${request.additionalContext || 'None provided'}.`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedPrompt = data.choices[0].message.content;

      // Generate additional metadata
      const complexity = this.assessComplexity(request.features.length);
      const estimatedTime = this.estimateBuildTime(request.features.length, complexity);
      const suggestedComponents = this.generateComponentSuggestions(request);

      console.log('✅ Prompt generation completed successfully');
      
      return {
        prompt: generatedPrompt,
        estimatedBuildTime: estimatedTime,
        complexity,
        suggestedComponents
      };

    } catch (error) {
      console.error('❌ Prompt generation failed:', error);
      throw error;
    }
  }

  private assessComplexity(featureCount: number): string {
    if (featureCount <= 2) return 'Simple';
    if (featureCount <= 4) return 'Moderate';
    if (featureCount <= 6) return 'Complex';
    return 'Advanced';
  }

  private estimateBuildTime(featureCount: number, complexity: string): string {
    const baseTime = {
      'Simple': 2,
      'Moderate': 5,
      'Complex': 10,
      'Advanced': 20
    };
    
    const days = baseTime[complexity as keyof typeof baseTime] || 5;
    return `${days}-${days + 3} days`;
  }

  private generateComponentSuggestions(request: PromptGenerationRequest): string[] {
    const components = ['Header', 'Footer', 'Layout'];
    
    if (request.features.includes('auth')) {
      components.push('AuthProvider', 'LoginForm', 'SignupForm');
    }
    
    if (request.features.includes('payments')) {
      components.push('PaymentForm', 'PricingCard', 'CheckoutFlow');
    }
    
    if (request.features.includes('realtime')) {
      components.push('WebSocketProvider', 'LiveChat', 'NotificationCenter');
    }
    
    if (request.features.includes('analytics')) {
      components.push('Dashboard', 'MetricsCard', 'ChartContainer');
    }
    
    if (request.features.includes('search')) {
      components.push('SearchBar', 'FilterPanel', 'ResultsList');
    }

    return components;
  }
}

// Export the service instance
export const promptService = new PromptService();
