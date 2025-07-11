
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Save, Play, Download, Loader2, Copy, CheckCircle } from 'lucide-react';
import ApiKeyManager from '@/components/ApiKeyManager';
import { useToast } from '@/hooks/use-toast';

const PromptStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(`You are an expert AI architect and Lovable 2.0 platform specialist. Your role is to create comprehensive application prompts specifically optimized for the Lovable no-code platform.

## Lovable 2.0 Platform Knowledge:
**Core Stack**: React + Tailwind CSS + Vite + Shadcn UI + Supabase (PostgreSQL)
**Primary AI Model**: Anthropic Claude 3.7 Sonnet with Agentic Chat Mode
**Philosophy**: "Vibe coding" - conversational AI-first development approach

## Supported Technologies & Integrations:
**Frontend**: React, Tailwind CSS, Vite, Shadcn UI components
**Creative Coding**: p5.js, Three.js, Fabric.js for interactive experiences
**Backend**: Supabase (PostgreSQL database, Auth, Storage, Edge Functions)
**Authentication**: Supabase Auth, Clerk, Magic.link
**Payments**: Stripe integration for subscriptions and one-time payments
**Email**: Resend for transactional and marketing emails
**AI Media**: Replicate for AI-generated images, videos, and audio
**Version Control**: GitHub with deep, real-time two-way synchronization
**Hosting**: One-click publishing with Vercel, Netlify integration
**Domains**: Entri for native domain purchasing and management
**Automation**: Make.com, Zapier for workflow automation
**Design**: Figma import via Builder.io integration
**External APIs**: Mapbox, Together.ai, PostHog, Firecrawl, Perplexity, Google Workspace, Twilio, Slack, YouTube

## Prompt Generation Standards:
Create prompts that are 9,000-10,000 characters long and include:

1. **Application Overview** - Clear project description and objectives
2. **Lovable-Native Architecture** - Full-stack design using Lovable's stack
3. **Supabase Database Design** - Complete PostgreSQL schema with RLS policies
4. **React Component Structure** - Detailed component hierarchy with Shadcn UI
5. **Authentication System** - Supabase Auth or Clerk implementation
6. **Payment Integration** - Stripe setup for monetization
7. **Email Automation** - Resend integration for communications
8. **AI Features** - Replicate integration where applicable
9. **Responsive Design** - Mobile-first Tailwind CSS approach
10. **Deployment Strategy** - One-click Lovable publishing workflow

## Key Requirements:
- All prompts must be Lovable-platform compatible
- Use conversational tone suitable for vibe coding
- Include specific implementation details for Lovable's stack
- Provide clear feature specifications
- Ensure production-ready architecture
- Focus on rapid prototyping and iteration
- Include proper error handling and user experience considerations

Always generate comprehensive prompts that leverage Lovable's full platform capabilities and follow the conversational AI development approach.`);
  const [savedToDB, setSavedToDB] = useState(false);
  const { toast } = useToast();

  const handleApiKeyChange = (key: string | null) => {
    // API key is now handled server-side
    console.log('API key configured');
  };

  const saveBlueprintToDatabase = async (userPrompt: string, generatedBlueprint: string, metadata: any) => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const blueprintData = {
        userPrompt,
        generatedBlueprint,
        reasoningContent: metadata.reasoning || '',
        estimatedBuildTime: 'Variable based on complexity',
        complexity: 'AI-Generated',
        suggestedComponents: [],
        mcpEndpoints: [],
        a2aProtocols: [],
        ragPipeline: 'RAG 2.0 Integration',
        sessionId: sessionId,
        tokensUsed: metadata.tokens_used || 0,
        modelUsed: 'deepseek-reasoner',
        temperature: 0.7
      };

      await fetch('/api/blueprint-prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blueprintData),
      });

      console.log('Blueprint automatically saved to database');
    } catch (error) {
      console.error('Failed to save blueprint to database:', error);
    }
  };

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to Clipboard",
        description: `${type} has been copied to your clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportAsFile = (content: string, filename: string) => {
    try {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Blueprint exported as ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportCompleteBlueprint = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `master-blueprint-${timestamp}.md`;
    
    const completeContent = `# AI Master Blueprint - Generated ${new Date().toLocaleDateString()}

## User Prompt
${prompt}

## Generated Blueprint
${response}

## Project Metadata
- **Generated**: ${new Date().toLocaleString()}
- **Model**: DeepSeek Reasoner v4.0
- **Template Version**: AI Master Blueprint Template v4.0

---
*Generated by NoCodeLos Blueprint Stack v4.0 - AI Master Blueprint Template*
*Automatically saved to database for future reference*
`;
    
    exportAsFile(completeContent, filename);
  };

  const clearResults = () => {
    setResponse('');
    setSavedToDB(false);
  };

  const executePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setResponse('');
    setStreamingText('Initializing DeepSeek streaming...');

    try {
      const response = await fetch('/api/deepseek/reason', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': `prompt-studio-${Date.now()}`
        },
        body: JSON.stringify({
          prompt,
          systemPrompt,
          temperature: 0.7,
          maxSteps: 10
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setResponse(`Error: ${errorData.error || 'Request failed'}`);
        return;
      }

      if (!response.body) {
        setResponse('Error: No response stream received');
        return;
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let accumulatedResponse = "";

      setStreamingText('Streaming response from DeepSeek...');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line.startsWith('data:')) {
            try {
              const jsonData = line.slice(5).trim();
              if (jsonData && jsonData !== '[DONE]') {
                const data = JSON.parse(jsonData);
                
                if (data.type === 'token' && data.content) {
                  accumulatedResponse += data.content;
                  setResponse(accumulatedResponse);
                  setStreamingText(`Streaming... ${accumulatedResponse.length} characters`);
                } else if (data.type === 'complete') {
                  setStreamingText(`✅ Blueprint completed! ${data.totalCharacters || accumulatedResponse.length} characters`);
                  
                  // Automatically save to database
                  await saveBlueprintToDatabase(prompt, accumulatedResponse, data);
                  setSavedToDB(true);
                  
                  toast({
                    title: "Blueprint Generated Successfully",
                    description: "Your master blueprint has been generated and automatically saved to the database.",
                  });
                  return;
                } else if (data.type === 'error') {
                  setResponse(`Error: ${data.error}`);
                  setStreamingText('❌ Generation failed');
                  return;
                }
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming data:', parseError);
            }
          }
        }
        buffer = lines[lines.length - 1];
      }

      // If we reach here, save the final response
      if (accumulatedResponse) {
        await saveBlueprintToDatabase(prompt, accumulatedResponse, {});
        setSavedToDB(true);
        setStreamingText(`✅ Blueprint completed! ${accumulatedResponse.length} characters`);
        
        toast({
          title: "Blueprint Generated Successfully", 
          description: "Your master blueprint has been generated and automatically saved to the database.",
        });
      }

    } catch (error) {
      console.error('Streaming error:', error);
      setStreamingText('❌ Generation failed');
      setResponse('Error executing prompt. Please check your connection and try again.');
      toast({
        title: "Generation Failed",
        description: "Failed to generate blueprint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-6 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-4">
            Prompt Engineering Studio v4.0
          </h1>
          <p className="text-purple-300 text-lg">
            AI Master Blueprint generation with DeepSeek reasoning and real-time streaming
          </p>
        </div>

        <div className="mb-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-400/30 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-green-400">DeepSeek API configured with AI Master Blueprint Template v4.0</p>
          </div>
          
          <div className="max-w-2xl mx-auto p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
            <h3 className="text-blue-300 font-medium mb-2">AI Master Blueprint Template v4.0 Features:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-200">
              <div>✓ AI-native architecture patterns</div>
              <div>✓ Production-ready code examples</div>
              <div>✓ RAG 2.0 integration guides</div>
              <div>✓ MCP protocol implementations</div>
              <div>✓ A2A agent coordination</div>
              <div>✓ Complete deployment strategies</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-blue-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-400" />
                Prompt Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="mt-2 bg-black border-purple-400/30"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="user-prompt">User Prompt</Label>
                <Textarea
                  id="user-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Create a comprehensive e-commerce platform with AI-powered product recommendations, real-time inventory management, secure payment processing, and advanced analytics dashboard. Include user authentication, order tracking, and responsive design for mobile and desktop."
                  className="mt-2 bg-black border-purple-400/30"
                  rows={8}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={executePrompt}
                  disabled={isLoading || !prompt.trim()}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isLoading ? 'Processing...' : 'Execute'}
                </Button>
                <Button variant="outline" className="border-blue-400/50">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-400" />
                AI Response
                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Enhanced streaming status display */}
              {isLoading && streamingText && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-400/40 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                        <div className="absolute inset-0 w-5 h-5 rounded-full border-2 border-blue-400/20 animate-pulse"></div>
                      </div>
                      <div>
                        <span className="text-blue-300 font-medium text-sm">{streamingText}</span>
                        <div className="text-xs text-blue-400/70 mt-1">DeepSeek Reasoner Active</div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
              
              <Textarea
                value={response}
                readOnly
                className="bg-black border-green-400/30 text-green-300"
                rows={12}
                placeholder={isLoading ? "DeepSeek is processing your request..." : "AI response will appear here..."}
              />
              {response && (
                <div className="flex gap-2 mt-4">
                  {savedToDB && (
                    <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-900/20">
                      <Save className="w-3 h-3 mr-1" />
                      Auto-Saved
                    </Badge>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(response, 'Blueprint')}
                    className="border-green-400/50 text-green-300 hover:bg-green-900/20"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={exportCompleteBlueprint}
                    className="border-green-400/50 text-green-300 hover:bg-green-900/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PromptStudio;
