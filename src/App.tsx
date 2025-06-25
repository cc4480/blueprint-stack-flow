
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
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import Navigation from "./components/Navigation";
import { analytics } from "./services/analyticsService";
import { performanceService } from "./services/performanceService";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize services
    performanceService.initialize();
    analytics.track('app_loaded', 'lifecycle', 'application_start');
    
    // Make analytics available globally for error boundary
    window.analytics = analytics;
    
    console.log('🚀 NoCodeLos Blueprint Stack Demo Application Loaded');
    console.log('📊 Analytics and Performance Monitoring Active');
    console.log('🛡️ Error Boundary Protection Enabled');
    console.log('🔍 Real-time Console Logging Active');
    
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
              {/* PLACEHOLDER ROUTES - TO BE IMPLEMENTED */}
              <Route path="/prompt-studio" element={<Index />} />
              <Route path="/a2a-agents" element={<Index />} />
              <Route path="/analytics" element={<Dashboard />} />
              <Route path="/docs" element={<Index />} />
              <Route path="/projects" element={<Index />} />
              <Route path="/templates" element={<Index />} />
              <Route path="/integrations" element={<Index />} />
              <Route path="/settings" element={<Index />} />
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
