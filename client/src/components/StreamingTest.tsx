import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const StreamingTest: React.FC = () => {
  const [streamResult, setStreamResult] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  const testStreaming = async () => {
    setIsStreaming(true);
    setStreamResult('Starting test...\n');

    try {
      const response = await fetch('/api/stream-blueprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Create a simple hello world app',
          temperature: 0.7
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream available');
      }

      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          console.log('Received line:', line);
          setStreamResult(prev => prev + line + '\n');
          
          if (line.startsWith('data:')) {
            try {
              const jsonData = line.slice(5).trim();
              if (jsonData) {
                const data = JSON.parse(jsonData);
                console.log('Parsed data:', data);
              }
            } catch (e) {
              console.log('Parse error:', e);
            }
          }
        }
        
        buffer = lines[lines.length - 1];
      }
    } catch (error) {
      console.error('Streaming test failed:', error);
      setStreamResult(prev => prev + `Error: ${error}\n`);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Streaming Test</h2>
      
      <Button 
        onClick={testStreaming}
        disabled={isStreaming}
        className="mb-4"
      >
        {isStreaming ? 'Testing...' : 'Test Streaming'}
      </Button>
      
      <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto whitespace-pre-wrap">
        {streamResult || 'Click "Test Streaming" to start...'}
      </div>
    </div>
  );
};

export default StreamingTest;