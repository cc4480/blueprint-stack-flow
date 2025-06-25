
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: number;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeSession();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession() {
    this.track('session_start', 'engagement', 'new_session');
    console.log('📊 Analytics session initialized:', this.sessionId);
  }

  track(action: string, category: string, label?: string, value?: number) {
    const event: AnalyticsEvent = {
      action,
      category,
      label,
      value,
      timestamp: Date.now()
    };

    this.events.push(event);
    console.log('📈 Analytics Event:', event);

    // Store in localStorage for persistence
    this.persistEvents();

    // Send to external analytics if configured
    this.sendToExternalAnalytics(event);
  }

  private persistEvents() {
    try {
      localStorage.setItem('nocodelos_analytics', JSON.stringify(this.events));
    } catch (error) {
      console.warn('⚠️ Could not persist analytics events:', error);
    }
  }

  private sendToExternalAnalytics(event: AnalyticsEvent) {
    // Placeholder for external analytics integration
    // Could integrate with Google Analytics, Mixpanel, etc.
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }
  }

  // Specific tracking methods for common actions
  trackButtonClick(buttonName: string, location: string) {
    this.track('button_click', 'interaction', `${buttonName}_${location}`);
  }

  trackPromptGeneration(appType: string, features: string[]) {
    this.track('prompt_generated', 'conversion', appType, features.length);
  }

  trackDownload(fileName: string) {
    this.track('file_download', 'conversion', fileName);
  }

  trackSocialClick(platform: string) {
    this.track('social_click', 'engagement', platform);
  }

  trackScrollToSection(sectionName: string) {
    this.track('scroll_to_section', 'navigation', sectionName);
  }

  // Get analytics summary
  getAnalyticsSummary() {
    const summary = {
      totalEvents: this.events.length,
      sessionId: this.sessionId,
      categories: this.getCategorySummary(),
      topActions: this.getTopActions(),
      sessionDuration: Date.now() - (this.events[0]?.timestamp || Date.now())
    };

    console.log('📊 Analytics Summary:', summary);
    return summary;
  }

  private getCategorySummary() {
    const categories: Record<string, number> = {};
    this.events.forEach(event => {
      categories[event.category] = (categories[event.category] || 0) + 1;
    });
    return categories;
  }

  private getTopActions() {
    const actions: Record<string, number> = {};
    this.events.forEach(event => {
      actions[event.action] = (actions[event.action] || 0) + 1;
    });
    return Object.entries(actions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  }

  // Export analytics data
  exportAnalytics() {
    const data = {
      sessionId: this.sessionId,
      events: this.events,
      summary: this.getAnalyticsSummary()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${this.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('📥 Analytics data exported');
  }
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const analytics = AnalyticsService.getInstance();
