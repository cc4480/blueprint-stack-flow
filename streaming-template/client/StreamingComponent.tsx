
import React, { useState } from 'react';
import { streamingService } from './streamingService';

interface StreamingComponentProps {
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

export default function StreamingComponent({ 
  placeholder = "Enter your prompt here...",
  buttonText = "Generate",
  className = ""
}: StreamingComponentProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [streamProgress, setStreamProgress] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setIsStreaming(true);
    setGeneratedContent('');
    setStreamProgress('Initializing generation...');

    try {
      const result = await streamingService.streamGeneration(
        prompt,
        "You are a helpful assistant.",
        {
          onToken: (content, totalChars) => {
            setGeneratedContent(prev => prev + content);
          },
          onProgress: (message) => {
            setStreamProgress(message);
          },
          onComplete: (totalChars, duration) => {
            setStreamProgress(`✅ Generation completed! ${totalChars} characters in ${duration}ms`);
            setIsStreaming(false);
          },
          onError: (error) => {
            setGeneratedContent(`Error: ${error}`);
            setStreamProgress('❌ Generation failed');
            setIsStreaming(false);
          }
        }
      );
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className={`streaming-component ${className}`}>
      <div className="input-section">
        <textarea
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="prompt-textarea"
          rows={4}
        />
        <button 
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="generate-button"
        >
          {isGenerating ? (isStreaming ? 'Streaming...' : 'Generating...') : buttonText}
        </button>

        {/* Streaming Progress */}
        {(isGenerating || streamProgress) && (
          <div className="progress-section">
            <div className="progress-indicator">
              {isStreaming && <div className="spinner" />}
              <span className="progress-text">
                {streamProgress || 'Preparing generation...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <div className="output-section">
          <h3>Generated Content</h3>
          <div className="content-display">
            <pre className="generated-text">
              {generatedContent}
            </pre>
          </div>
          <div className="action-buttons">
            <button 
              onClick={() => navigator.clipboard.writeText(generatedContent)}
              className="copy-button"
            >
              Copy Content
            </button>
            <button 
              onClick={() => {
                const blob = new Blob([generatedContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'generated-content.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="download-button"
            >
              Download
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .streaming-component {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .input-section {
          margin-bottom: 20px;
        }

        .prompt-textarea {
          width: 100%;
          min-height: 120px;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-family: inherit;
          font-size: 14px;
          resize: vertical;
          margin-bottom: 12px;
        }

        .generate-button {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .generate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .generate-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .progress-section {
          margin-top: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .progress-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #e2e8f0;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .progress-text {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .output-section {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .output-section h3 {
          margin: 0;
          padding: 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-size: 16px;
          font-weight: 600;
        }

        .content-display {
          max-height: 400px;
          overflow-y: auto;
          background: #ffffff;
        }

        .generated-text {
          margin: 0;
          padding: 16px;
          white-space: pre-wrap;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 13px;
          line-height: 1.5;
          color: #1e293b;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          padding: 16px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .copy-button,
        .download-button {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .copy-button:hover,
        .download-button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
