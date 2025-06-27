
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { bugTracker } from './utils/bugTracker';

// Add global error handlers for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Send to error service if available
  if (typeof window !== 'undefined' && (window as any).analytics) {
    (window as any).analytics.track('error_occurred', 'system', 'unhandled_promise_rejection');
  }
  
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Send to error service if available
  if (typeof window !== 'undefined' && (window as any).analytics) {
    (window as any).analytics.track('error_occurred', 'system', 'global_error');
  }
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
