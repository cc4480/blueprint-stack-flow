
// Basic Usage Example
import React from 'react';
import { DeepSeekStreamingTemplate } from '../deepseek-streaming-template';

const MyApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <DeepSeekStreamingTemplate
        title="My AI Assistant"
        description="Generate content with AI streaming"
        placeholder="Ask me anything..."
        apiEndpoint="/api/stream-blueprint"
      />
    </div>
  );
};

export default MyApp;
