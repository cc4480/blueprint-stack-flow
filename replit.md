# NoCodeLos Blueprint Stack - Replit Development Guide

## Overview

This is a comprehensive full-stack application implementing the NoCodeLos Blueprint Stack methodology. The system demonstrates advanced AI-driven development workflows using RAG 2.0, Model Context Protocol (MCP), and Agent-to-Agent (A2A) communication patterns. Built with modern web technologies, this application serves as both a demonstration platform and a practical tool for AI-powered development.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Styling**: Custom CSS variables with dark theme support
- **State Management**: TanStack React Query for server state
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: PostgreSQL-based session storage
- **Development Server**: Hot module replacement with Vite integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with type-safe migrations
- **Schema Management**: Shared schema between client and server
- **Session Store**: connect-pg-simple for PostgreSQL sessions

## Key Components

### 1. Interactive Demo System
- Multi-step form interface for application generation
- Real-time prompt generation with DeepSeek Reasoner integration
- Dynamic component selection and feature configuration
- Live preview and code generation capabilities

### 2. Blueprint Stack Modules
- **RAG 2.0 Hub**: Advanced retrieval-augmented generation with hybrid search
- **MCP Center**: Model Context Protocol implementation for tool orchestration
- **A2A Agents**: Agent-to-Agent communication and coordination
- **Prompt Studio**: Advanced prompt engineering with DeepSeek integration
- **Analytics Dashboard**: Real-time monitoring and performance metrics

### 3. AI Integration Layer
- DeepSeek Reasoner API integration for chain-of-thought reasoning
- Advanced prompt generation with context-aware templates
- Real-time analytics and performance tracking
- Error boundary protection with automatic recovery

### 4. Development Tools
- API key management system for external services
- Performance monitoring with detailed metrics
- Comprehensive error logging and debugging
- Development-focused console logging and tracking

## Data Flow

1. **User Input Processing**: Forms collect user requirements and preferences
2. **Prompt Generation**: Advanced algorithms create context-aware prompts
3. **AI Integration**: DeepSeek Reasoner processes prompts with reasoning chains
4. **Result Processing**: Responses are parsed and formatted for presentation
5. **Real-time Updates**: WebSocket-like patterns for live feedback
6. **Analytics Collection**: All interactions tracked for improvement

## External Dependencies

### Core AI Services
- **DeepSeek API**: Primary reasoning and generation engine
- **Neon Database**: Serverless PostgreSQL hosting
- **Vercel/Replit**: Deployment and hosting platforms

### Development Dependencies
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **React Query**: Server state management
- **Drizzle**: Type-safe ORM and migrations
- **Express**: Backend web framework

### Optional Integrations
- **OpenAI GPT-4**: Alternative AI model support
- **Anthropic Claude**: Constitutional AI integration
- **Pinecone/Chroma**: Vector database options for RAG

## Deployment Strategy

### Development Environment
- **Local Setup**: `npm run dev` starts both frontend and backend
- **Hot Reload**: Vite provides instant updates during development
- **Database**: Automatic connection to Neon PostgreSQL
- **Port Configuration**: Frontend on 5000, auto-proxied through Express

### Production Deployment
- **Build Process**: `npm run build` creates optimized bundles
- **Server Bundling**: esbuild creates single-file server bundle
- **Static Assets**: Vite builds optimized client assets
- **Environment Variables**: DATABASE_URL and API keys required

### Scaling Considerations
- **Autoscale**: Configured for automatic scaling on Replit
- **Database**: Neon provides automatic scaling and connection pooling
- **CDN**: Static assets can be served via CDN for global distribution
- **Monitoring**: Built-in analytics for performance tracking

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 25, 2025. Initial setup