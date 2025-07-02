
// Custom Integration Example
import React, { useState } from 'react';
import { createStreamingHandler } from '../deepseek-streaming-backend';

const CustomStreamingComponent: React.FC = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setContent('');
    
    try {
      // This would be called from your frontend
      const response = await fetch('/api/custom-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.body) throw new Error('No response stream');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'token') {
                accumulated += data.content;
                setContent(accumulated);
                setProgress(`Generated ${accumulated.length} characters`);
              }
            } catch (e) {
              console.warn('Parse error:', e);
            }
          }
        }
        buffer = lines[lines.length - 1];
      }
    } catch (error) {
      console.error('Streaming error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={() => handleGenerate('Tell me about AI')}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Generating...' : 'Generate Content'}
      </button>
      
      {progress && (
        <div className="text-blue-400 text-sm">{progress}</div>
      )}
      
      {content && (
        <div className="bg-gray-800 p-4 rounded whitespace-pre-wrap">
          {content}
        </div>
      )}
    </div>
  );
};

export default CustomStreamingComponent;
