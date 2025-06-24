
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
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
