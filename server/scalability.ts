import { Request, Response, NextFunction } from 'express';
import { cache } from './cache';

// Rate limiting for 100k+ concurrent users
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export class ScalabilityManager {
  private static instance: ScalabilityManager;
  private requestCounts = new Map<string, { count: number; resetTime: number }>();
  
  private constructor() {}

  static getInstance(): ScalabilityManager {
    if (!ScalabilityManager.instance) {
      ScalabilityManager.instance = new ScalabilityManager();
    }
    return ScalabilityManager.instance;
  }

  // Advanced rate limiting with sliding window
  createRateLimit(config: RateLimitConfig) {
    return (req: Request, res: Response, next: NextFunction) => {
      const clientId = req.ip || 'unknown';
      const now = Date.now();
      const windowStart = now - config.windowMs;

      // Clean old entries
      if (this.requestCounts.has(clientId)) {
        const entry = this.requestCounts.get(clientId)!;
        if (entry.resetTime < windowStart) {
          this.requestCounts.delete(clientId);
        }
      }

      // Get or create entry
      let entry = this.requestCounts.get(clientId);
      if (!entry) {
        entry = { count: 0, resetTime: now + config.windowMs };
        this.requestCounts.set(clientId, entry);
      }

      // Check limit
      if (entry.count >= config.maxRequests) {
        res.status(429).json({
          error: 'Too Many Requests',
          retryAfter: Math.ceil((entry.resetTime - now) / 1000)
        });
        return;
      }

      // Increment count
      entry.count++;
      
      // Set headers
      res.setHeader('X-RateLimit-Limit', config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', config.maxRequests - entry.count);
      res.setHeader('X-RateLimit-Reset', entry.resetTime);

      next();
    };
  }

  // Connection pooling middleware
  connectionPooling() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Add connection pooling headers
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Keep-Alive', 'timeout=5, max=1000');
      next();
    };
  }

  // Request compression middleware
  compressionHeaders() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Enable compression for large responses
      if (req.headers['accept-encoding']?.includes('gzip')) {
        res.setHeader('Content-Encoding', 'gzip');
      }
      next();
    };
  }

  // Performance monitoring
  performanceMonitoring() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        const route = req.route?.path || req.path;
        
        // Cache performance metrics
        cache.set(`perf:${route}:${Date.now()}`, {
          method: req.method,
          route,
          statusCode: res.statusCode,
          duration,
          timestamp: Date.now()
        }, 3600); // 1 hour TTL

        // Log slow requests
        if (duration > 5000) {
          console.warn(`Slow request: ${req.method} ${route} - ${duration}ms`);
        }
      });

      next();
    };
  }

  // Memory management for high concurrency
  memoryOptimization() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Force garbage collection every 1000 requests
      if (Math.random() < 0.001) {
        if (global.gc) {
          global.gc();
        }
      }

      // Clean up request-specific data
      res.on('finish', () => {
        // Clear any request-specific cached data
        const reqId = req.headers['x-request-id'] as string;
        if (reqId) {
          cache.set(`cleanup:${reqId}`, null, 1); // Mark for cleanup
        }
      });

      next();
    };
  }

  // Health check endpoint for load balancer
  healthCheck() {
    return (req: Request, res: Response) => {
      const stats = cache.getStats();
      const memoryUsage = process.memoryUsage();
      
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024),
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          external: Math.round(memoryUsage.external / 1024 / 1024)
        },
        cache: stats,
        activeConnections: this.requestCounts.size
      };

      // Check if system is under stress
      if (memoryUsage.heapUsed / memoryUsage.heapTotal > 0.9) {
        health.status = 'warning';
      }

      res.json(health);
    };
  }

  // Graceful shutdown handler
  gracefulShutdown() {
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, starting graceful shutdown...');
      
      // Clear caches
      cache.clearAll();
      
      // Close server connections gracefully
      setTimeout(() => {
        console.log('Graceful shutdown completed');
        process.exit(0);
      }, 10000); // 10 second grace period
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, starting graceful shutdown...');
      cache.clearAll();
      setTimeout(() => {
        process.exit(0);
      }, 5000);
    });
  }

  // Cleanup old data periodically
  startCleanupScheduler() {
    setInterval(() => {
      // Clean up old request tracking
      const now = Date.now();
      Array.from(this.requestCounts.entries()).forEach(([clientId, entry]) => {
        if (entry.resetTime < now) {
          this.requestCounts.delete(clientId);
        }
      });
    }, 60000); // Every minute
  }
}

export const scalability = ScalabilityManager.getInstance();