// Performance optimization utilities to prevent layout shifts and improve user experience

interface LayoutStabilityConfig {
  enablePreloading: boolean;
  enableImageSizeReservation: boolean;
  enableFontLoading: boolean;
  enableAnimationOptimization: boolean;
}

class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private config: LayoutStabilityConfig = {
    enablePreloading: true,
    enableImageSizeReservation: true,
    enableFontLoading: true,
    enableAnimationOptimization: true
  };

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Prevent layout shifts by preloading critical images
  preloadCriticalImages(images: string[]) {
    if (!this.config.enablePreloading) return;

    images.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Reserve space for dynamic content to prevent CLS
  createStableContainer(minHeight: number = 600): React.CSSProperties {
    return {
      minHeight: `${minHeight}px`,
      contain: 'layout style'
    };
  }

  // Optimize animations for GPU acceleration
  optimizeAnimation(element: HTMLElement) {
    if (!this.config.enableAnimationOptimization) return;

    element.style.willChange = 'transform';
    element.style.transform = 'translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
  }

  // Lazy load images with intersection observer
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Monitor Core Web Vitals
  measureWebVitals() {
    if ('PerformanceObserver' in window) {
      // Monitor LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.startTime > 2500) {
            console.warn('⚠️ LCP is slow:', entry.startTime);
          }
        });
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // Monitor FID
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          const fid = (entry as any).processingStart - entry.startTime;
          if (fid > 100) {
            console.warn('⚠️ FID is slow:', fid);
          }
        });
      }).observe({ type: 'first-input', buffered: true });
    }
  }

  // Debounce function for performance-critical operations
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), wait);
    };
  }

  // Throttle function for scroll/resize events
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

export const performanceOptimizer = PerformanceOptimizer.getInstance();

// React hooks for performance optimization
export const useStableContainer = (minHeight: number = 600) => {
  return performanceOptimizer.createStableContainer(minHeight);
};

export const useDebounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
) => {
  return performanceOptimizer.debounce(func, wait);
};

export const useThrottle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
) => {
  return performanceOptimizer.throttle(func, limit);
};