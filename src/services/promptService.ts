
interface PromptGenerationRequest {
  appType: string;
  dataSource: string;
  keyFeatures: string[];
  additionalRequirements?: string;
}

interface PromptGenerationResponse {
  prompt: string;
  estimatedBuildTime: string;
  complexity: 'Simple' | 'Medium' | 'Complex';
  suggestedComponents: string[];
}

export class PromptService {
  private static instance: PromptService;
  private apiKey: string | null = null;
  private baseURL = 'https://api.deepseek.com';

  static getInstance(): PromptService {
    if (!PromptService.instance) {
      PromptService.instance = new PromptService();
    }
    return PromptService.instance;
  }

  setApiKey(key: string) {
    this.apiKey = key;
    console.log('✅ DeepSeek API key configured');
  }

  async generatePrompt(request: PromptGenerationRequest): Promise<PromptGenerationResponse> {
    console.log('🚀 Starting prompt generation with request:', request);
    
    try {
      if (!this.apiKey) {
        // Fallback to local generation if no API key
        return this.generateLocalPrompt(request);
      }

      const messages = [
        {
          role: "system",
          content: "You are an expert NoCodeLos Blueprint Stack prompt engineer. Generate production-ready Lovable app prompts using modular, maintainable architecture principles. Always include specific component structure, state management, and UI/UX considerations."
        },
        {
          role: "user",
          content: `Generate a comprehensive Lovable app prompt for:
          
App Type: ${request.appType}
Data Source: ${request.dataSource}
Key Features: ${request.keyFeatures.join(', ')}
Additional Requirements: ${request.additionalRequirements || 'None'}

The prompt should follow NoCodeLos Blueprint Stack methodology:
1. Modular component architecture
2. Clear state management strategy
3. Responsive design with Tailwind CSS
4. Error handling and validation
5. Production-ready code structure

Format the response as a complete prompt that can be directly used in Lovable.`
        }
      ];

      console.log('📡 Sending request to DeepSeek API...');
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Received response from DeepSeek API');

      const generatedPrompt = data.choices[0].message.content;
      
      return {
        prompt: generatedPrompt,
        estimatedBuildTime: this.calculateBuildTime(request),
        complexity: this.determineComplexity(request),
        suggestedComponents: this.getSuggestedComponents(request)
      };

    } catch (error) {
      console.error('❌ Error generating prompt:', error);
      // Fallback to local generation
      return this.generateLocalPrompt(request);
    }
  }

  private generateLocalPrompt(request: PromptGenerationRequest): PromptGenerationResponse {
    console.log('🔄 Using local prompt generation fallback');
    
    const prompt = `Build a ${request.appType} using React and TypeScript with the following specifications:

## Core Features
${request.keyFeatures.map(feature => `- ${feature}`).join('\n')}

## Data Integration
- Integrate with ${request.dataSource} for data management
- Implement proper error handling and loading states
- Use React Query for data fetching and state management

## Technical Requirements
- Use Tailwind CSS for responsive design
- Implement component-based architecture with proper separation of concerns
- Include proper TypeScript interfaces for all data structures
- Add form validation and user feedback
- Ensure mobile-first responsive design

## UI/UX Guidelines
- Modern, clean interface with consistent spacing
- Intuitive navigation and user flow
- Loading indicators and error states
- Accessibility considerations (ARIA labels, keyboard navigation)

## Additional Specifications
${request.additionalRequirements || 'Follow React best practices and modern development patterns'}

Please structure the code with reusable components, proper state management, and maintainable architecture following the NoCodeLos Blueprint Stack methodology.`;

    return {
      prompt,
      estimatedBuildTime: this.calculateBuildTime(request),
      complexity: this.determineComplexity(request),
      suggestedComponents: this.getSuggestedComponents(request)
    };
  }

  private calculateBuildTime(request: PromptGenerationRequest): string {
    const baseTime = 2; // hours
    const featureMultiplier = request.keyFeatures.length * 0.5;
    const complexityMultiplier = request.appType.includes('Dashboard') ? 2 : 1;
    
    const totalHours = baseTime + featureMultiplier + complexityMultiplier;
    
    if (totalHours <= 4) return `${Math.ceil(totalHours)} hours`;
    if (totalHours <= 24) return `${Math.ceil(totalHours / 8)} day${totalHours > 8 ? 's' : ''}`;
    return `${Math.ceil(totalHours / 24)} day${totalHours > 24 ? 's' : ''}`;
  }

  private determineComplexity(request: PromptGenerationRequest): 'Simple' | 'Medium' | 'Complex' {
    const score = request.keyFeatures.length + 
                 (request.appType.includes('Dashboard') ? 2 : 0) +
                 (request.dataSource.includes('API') ? 1 : 0);
    
    if (score <= 3) return 'Simple';
    if (score <= 6) return 'Medium';
    return 'Complex';
  }

  private getSuggestedComponents(request: PromptGenerationRequest): string[] {
    const components = ['Header', 'Layout', 'Button'];
    
    if (request.keyFeatures.includes('auth')) components.push('LoginForm', 'AuthProvider');
    if (request.keyFeatures.includes('search')) components.push('SearchBar', 'FilterPanel');
    if (request.keyFeatures.includes('analytics')) components.push('Dashboard', 'ChartComponent');
    if (request.keyFeatures.includes('payments')) components.push('PaymentForm', 'PricingCard');
    if (request.keyFeatures.includes('realtime')) components.push('NotificationPanel', 'LiveUpdater');
    if (request.keyFeatures.includes('mobile')) components.push('MobileMenu', 'TouchGestures');
    
    return components;
  }
}

export const promptService = PromptService.getInstance();
