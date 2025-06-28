// Load testing utility for 100k+ concurrent users
import { performance } from 'perf_hooks';

export class LoadTestSimulator {
  private activeConnections = 0;
  private maxConnections = 0;
  private testMetrics: any[] = [];

  async simulateConcurrentUsers(userCount: number, duration: number = 60000) {
    console.log(`🚀 Starting load test with ${userCount} concurrent users for ${duration/1000}s`);
    
    const startTime = performance.now();
    const promises: Promise<any>[] = [];

    for (let i = 0; i < userCount; i++) {
      promises.push(this.simulateUser(i, duration));
      
      // Stagger user creation to simulate realistic load
      if (i % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    await Promise.allSettled(promises);
    
    const endTime = performance.now();
    const totalDuration = endTime - startTime;

    console.log(`✅ Load test completed in ${totalDuration/1000}s`);
    console.log(`📊 Max concurrent connections: ${this.maxConnections}`);
    console.log(`🎯 Success rate: ${this.calculateSuccessRate()}%`);
    
    return this.generateReport();
  }

  private async simulateUser(userId: number, duration: number) {
    this.activeConnections++;
    this.maxConnections = Math.max(this.maxConnections, this.activeConnections);
    
    const userStartTime = performance.now();
    const requests: any[] = [];

    try {
      // Simulate user behavior patterns
      const actions = [
        () => this.simulatePageLoad(userId),
        () => this.simulateAPICall(userId, '/api/blueprint-prompts'),
        () => this.simulateBlueprintGeneration(userId),
        () => this.simulateHealthCheck(userId)
      ];

      const endTime = Date.now() + duration;
      
      while (Date.now() < endTime) {
        const action = actions[Math.floor(Math.random() * actions.length)];
        const requestStart = performance.now();
        
        try {
          await action();
          const requestEnd = performance.now();
          requests.push({
            userId,
            duration: requestEnd - requestStart,
            success: true,
            timestamp: Date.now()
          });
        } catch (error) {
          const requestEnd = performance.now();
          requests.push({
            userId,
            duration: requestEnd - requestStart,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: Date.now()
          });
        }

        // Random delay between requests (500ms - 3s)
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 2500));
      }

    } finally {
      this.activeConnections--;
      const userEndTime = performance.now();
      
      this.testMetrics.push({
        userId,
        totalDuration: userEndTime - userStartTime,
        requests,
        requestCount: requests.length
      });
    }
  }

  private async simulatePageLoad(userId: number) {
    // Simulate page load with realistic delays
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 300));
    return { userId, action: 'page_load', success: true };
  }

  private async simulateAPICall(userId: number, endpoint: string) {
    // Simulate API call
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'GET',
        headers: {
          'User-Agent': `LoadTest-User-${userId}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      
      return { userId, action: 'api_call', endpoint, success: true };
    } catch (error) {
      throw error;
    }
  }

  private async simulateBlueprintGeneration(userId: number) {
    // Simulate blueprint generation (less frequent, more resource intensive)
    if (Math.random() < 0.1) { // 10% chance of blueprint generation
      try {
        const response = await fetch('http://localhost:5000/api/stream-blueprint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': `LoadTest-User-${userId}`
          },
          body: JSON.stringify({
            prompt: `Test blueprint for user ${userId}`,
            systemPrompt: 'Generate a simple test blueprint'
          })
        });

        if (!response.ok) {
          throw new Error(`Blueprint generation failed: ${response.status}`);
        }

        return { userId, action: 'blueprint_generation', success: true };
      } catch (error) {
        throw error;
      }
    }
    
    return { userId, action: 'blueprint_generation', skipped: true };
  }

  private async simulateHealthCheck(userId: number) {
    try {
      const response = await fetch('http://localhost:5000/health', {
        method: 'GET',
        headers: {
          'User-Agent': `LoadTest-User-${userId}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      return { userId, action: 'health_check', success: true };
    } catch (error) {
      throw error;
    }
  }

  private calculateSuccessRate(): number {
    const allRequests = this.testMetrics.flatMap(user => user.requests);
    const successfulRequests = allRequests.filter(req => req.success);
    return Math.round((successfulRequests.length / allRequests.length) * 100);
  }

  private generateReport() {
    const allRequests = this.testMetrics.flatMap(user => user.requests);
    const durations = allRequests.map(req => req.duration);
    
    return {
      totalUsers: this.testMetrics.length,
      totalRequests: allRequests.length,
      successRate: this.calculateSuccessRate(),
      maxConcurrentConnections: this.maxConnections,
      averageResponseTime: durations.reduce((a, b) => a + b, 0) / durations.length,
      minResponseTime: Math.min(...durations),
      maxResponseTime: Math.max(...durations),
      p95ResponseTime: this.calculatePercentile(durations, 95),
      p99ResponseTime: this.calculatePercentile(durations, 99),
      requestsPerSecond: allRequests.length / (Math.max(...allRequests.map(r => r.timestamp)) - Math.min(...allRequests.map(r => r.timestamp))) * 1000
    };
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * (percentile / 100)) - 1;
    return sorted[index];
  }

  // Quick benchmark for database operations
  async benchmarkDatabase(operations: number = 1000) {
    console.log(`🎯 Benchmarking database with ${operations} operations...`);
    
    const { storage } = await import('./storage');
    const startTime = performance.now();
    
    const promises = [];
    for (let i = 0; i < operations; i++) {
      promises.push(storage.getBlueprintPrompts());
    }
    
    await Promise.all(promises);
    
    const endTime = performance.now();
    const opsPerSecond = operations / ((endTime - startTime) / 1000);
    
    console.log(`📊 Database benchmark: ${opsPerSecond.toFixed(2)} ops/sec`);
    return opsPerSecond;
  }
}

// CLI utility for running load tests
if (require.main === module) {
  const loadTest = new LoadTestSimulator();
  
  // Default: 1000 concurrent users for 30 seconds
  const userCount = parseInt(process.argv[2]) || 1000;
  const duration = parseInt(process.argv[3]) || 30000;
  
  loadTest.simulateConcurrentUsers(userCount, duration)
    .then(report => {
      console.log('📈 Load Test Report:', JSON.stringify(report, null, 2));
    })
    .catch(error => {
      console.error('❌ Load test failed:', error);
    });
}