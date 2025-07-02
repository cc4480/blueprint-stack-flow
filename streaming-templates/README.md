
# Streaming Templates

This folder contains production-ready streaming implementations that can be used with any application.

## Available Templates

### 1. DeepSeek Streaming Blueprint Generator
- **File**: `deepseek-streaming-template.tsx`
- **Description**: Complete React component for streaming AI responses with DeepSeek API
- **Features**: Real-time streaming, progress tracking, error handling, timeout management
- **Backend**: `deepseek-streaming-backend.ts`

## Usage

Each template is a complete, standalone implementation that you can copy and use in any project. Simply:

1. Copy the template files to your project
2. Install the required dependencies
3. Configure your API keys
4. Import and use the components

## Dependencies Required

```json
{
  "react": "^18.0.0",
  "@radix-ui/react-*": "latest",
  "lucide-react": "latest",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest"
}
```

## Environment Variables

```
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```
