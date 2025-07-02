
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import RAGHub from "./pages/RAGHub";
import MCPCenter from "./pages/MCPCenter";
import PromptStudio from "./pages/PromptStudio";
import A2AAgents from "./pages/A2AAgents";
import Analytics from "./pages/Analytics";
import Documentation from "./pages/Documentation";
import Projects from "./pages/Projects";
import Templates from "./pages/Templates";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import Navigation from "./components/Navigation";
import BlueprintGenerator from "./components/BlueprintGenerator";
import SystemStatus from "./components/SystemStatus";
import { analytics } from "./services/analyticsService";
import { performanceService } from "./services/performanceService";
import { performanceOptimizer } from "./utils/performanceOptimizer";
import { errorHandler } from "./utils/errorHandler";

const queryClient = new QueryClient();

const App: React.FC = () => {
  useEffect(() => {
    // Initialize services
    performanceService.initialize();
    analytics.track('app_loaded', 'lifecycle', 'application_start');
    
    // Initialize performance optimizations
    performanceOptimizer.preloadCriticalResources([
      '/lovable-uploads/cd49efdf-9fb4-4552-b98b-348b575a8c29.png'
    ]);
    
    // Load persisted error data
    errorHandler.loadPersistedErrors();
    
    // Make analytics available globally for error boundary
    window.analytics = analytics;
    
    console.log('🚀 NoCodeLos Blueprint Stack Demo Application Loaded');
    console.log('📊 Analytics and Performance Monitoring Active');
    console.log('🛡️ Error Boundary Protection Enabled');
    console.log('🔍 Real-time Console Logging Active');
    console.log('🎯 All Blueprint Stack components now available');
    console.log('⚡ Performance optimizations active');
    
    // Cleanup on unmount
    return () => {
      performanceService.cleanup();
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={300}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rag-hub" element={<RAGHub />} />
              <Route path="/mcp-center" element={<MCPCenter />} />
              <Route path="/prompt-studio" element={<PromptStudio />} />
              <Route path="/a2a-agents" element={<A2AAgents />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/blueprint-generator" element={<BlueprintGenerator />} />
              <Route path="/system-status" element={<SystemStatus />} />
              <Route path="/settings" element={<Settings />} />
              {/* Fallback routes for any authentication or onboarding flows */}
              <Route path="/auth" element={<Index />} />
              <Route path="/get-started" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
