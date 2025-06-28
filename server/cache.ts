import NodeCache from 'node-cache';

// High-performance in-memory cache for 100k+ concurrent users
export class PerformanceCache {
  private static instance: PerformanceCache;
  private cache: NodeCache;
  private blueprintCache: NodeCache;
  private userCache: NodeCache;

  private constructor() {
    // Main cache - 1 hour TTL, check period 10 minutes
    this.cache = new NodeCache({ 
      stdTTL: 3600, 
      checkperiod: 600,
      useClones: false,
      maxKeys: 50000
    });

    // Blueprint cache - 6 hours TTL for generated blueprints
    this.blueprintCache = new NodeCache({ 
      stdTTL: 21600, 
      checkperiod: 1800,
      useClones: false,
      maxKeys: 10000
    });

    // User cache - 30 minutes TTL for user data
    this.userCache = new NodeCache({ 
      stdTTL: 1800, 
      checkperiod: 300,
      useClones: false,
      maxKeys: 100000
    });
  }

  static getInstance(): PerformanceCache {
    if (!PerformanceCache.instance) {
      PerformanceCache.instance = new PerformanceCache();
    }
    return PerformanceCache.instance;
  }

  // Blueprint caching
  setBlueprintPrompt(key: string, data: any): void {
    this.blueprintCache.set(`blueprint:${key}`, data);
  }

  getBlueprintPrompt(key: string): any {
    return this.blueprintCache.get(`blueprint:${key}`);
  }

  // User data caching
  setUser(userId: string, userData: any): void {
    this.userCache.set(`user:${userId}`, userData);
  }

  getUser(userId: string): any {
    return this.userCache.get(`user:${userId}`);
  }

  // General data caching
  set(key: string, value: any, ttl?: number): void {
    if (ttl) {
      this.cache.set(key, value, ttl);
    } else {
      this.cache.set(key, value);
    }
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  // Cache statistics for monitoring
  getStats() {
    return {
      main: this.cache.getStats(),
      blueprints: this.blueprintCache.getStats(),
      users: this.userCache.getStats()
    };
  }

  // Clear specific cache types
  clearBlueprintCache(): void {
    this.blueprintCache.flushAll();
  }

  clearUserCache(): void {
    this.userCache.flushAll();
  }

  clearAll(): void {
    this.cache.flushAll();
    this.blueprintCache.flushAll();
    this.userCache.flushAll();
  }
}

export const cache = PerformanceCache.getInstance();