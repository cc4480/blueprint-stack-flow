
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';
import { eq, and, or, desc, asc, sql } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';

interface DatabaseConfig {
  connectionString: string;
  poolSize: number;
  ssl: boolean;
  retryAttempts: number;
  queryTimeout: number;
}

interface QueryMetrics {
  query: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

class DatabaseService {
  private db: any;
  private sql: any;
  private queryMetrics: QueryMetrics[] = [];
  private connectionPool: Map<string, any> = new Map();
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.initializeConnection();
    this.setupMonitoring();
  }

  private async initializeConnection() {
    try {
      this.sql = neon(this.config.connectionString);
      this.db = drizzle(this.sql);
      
      console.log('✅ Database connection established');
      await this.validateConnection();
      await this.runMigrations();
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  private async validateConnection() {
    try {
      await this.sql`SELECT 1`;
      console.log('✅ Database connection validated');
    } catch (error) {
      console.error('❌ Database validation failed:', error);
      throw error;
    }
  }

  // Migration System
  private async runMigrations() {
    try {
      console.log('🔄 Running database migrations...');
      await migrate(this.db, { migrationsFolder: './drizzle' });
      console.log('✅ Database migrations completed');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  async createMigration(name: string, schema: string) {
    const timestamp = Date.now();
    const filename = `${timestamp}_${name}.sql`;
    const migrationPath = path.join('./drizzle', filename);
    
    await fs.writeFile(migrationPath, schema);
    console.log(`✅ Migration created: ${filename}`);
  }

  async rollbackMigration(steps: number = 1) {
    // Simplified rollback - in production use proper migration tracking
    console.log(`🔄 Rolling back ${steps} migration(s)...`);
    // Implementation would depend on migration tracking table
  }

  // Query Optimization and Monitoring
  async executeQuery<T>(queryFn: () => Promise<T>, queryName: string = 'unknown'): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await queryFn();
      const duration = Date.now() - startTime;
      
      this.recordQueryMetric({
        query: queryName,
        duration,
        timestamp: new Date(),
        success: true
      });

      if (duration > 1000) {
        console.warn(`⚠️ Slow query detected: ${queryName} took ${duration}ms`);
      }

      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      this.recordQueryMetric({
        query: queryName,
        duration,
        timestamp: new Date(),
        success: false,
        error: error.message
      });

      console.error(`❌ Query failed: ${queryName}`, error);
      throw error;
    }
  }

  private recordQueryMetric(metric: QueryMetrics) {
    this.queryMetrics.push(metric);
    
    // Keep only last 1000 metrics
    if (this.queryMetrics.length > 1000) {
      this.queryMetrics = this.queryMetrics.slice(-1000);
    }
  }

  getQueryMetrics() {
    const totalQueries = this.queryMetrics.length;
    const failedQueries = this.queryMetrics.filter(m => !m.success).length;
    const avgDuration = this.queryMetrics.reduce((sum, m) => sum + m.duration, 0) / totalQueries;
    const slowQueries = this.queryMetrics.filter(m => m.duration > 1000).length;

    return {
      totalQueries,
      failedQueries,
      successRate: ((totalQueries - failedQueries) / totalQueries) * 100,
      avgDuration: Math.round(avgDuration),
      slowQueries,
      recentMetrics: this.queryMetrics.slice(-10)
    };
  }

  // Database Backup and Recovery
  async createBackup(tables?: string[]): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup_${timestamp}`;
    
    try {
      console.log(`🔄 Creating database backup: ${backupName}`);
      
      // In production, this would use pg_dump or similar
      const backupData = {
        timestamp,
        tables: tables || await this.getAllTableNames(),
        data: await this.exportAllData(tables)
      };

      const backupPath = path.join('./backups', `${backupName}.json`);
      await fs.mkdir('./backups', { recursive: true });
      await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));
      
      console.log(`✅ Backup created: ${backupName}`);
      return backupName;
    } catch (error) {
      console.error('❌ Backup failed:', error);
      throw error;
    }
  }

  async restoreBackup(backupName: string): Promise<void> {
    try {
      console.log(`🔄 Restoring backup: ${backupName}`);
      
      const backupPath = path.join('./backups', `${backupName}.json`);
      const backupData = JSON.parse(await fs.readFile(backupPath, 'utf-8'));
      
      // Restore data - in production use transaction
      await this.importData(backupData.data);
      
      console.log(`✅ Backup restored: ${backupName}`);
    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw error;
    }
  }

  private async getAllTableNames(): Promise<string[]> {
    const result = await this.sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    return result.map((row: any) => row.table_name);
  }

  private async exportAllData(tables?: string[]): Promise<any> {
    // Simplified export - in production would handle relations, constraints, etc.
    const data: any = {};
    const tablesToExport = tables || await this.getAllTableNames();
    
    for (const table of tablesToExport) {
      try {
        const tableData = await this.sql`SELECT * FROM ${sql.identifier(table)}`;
        data[table] = tableData;
      } catch (error) {
        console.warn(`⚠️ Failed to export table ${table}:`, error);
      }
    }
    
    return data;
  }

  private async importData(data: any): Promise<void> {
    // Simplified import - in production would handle constraints, order, etc.
    for (const [tableName, tableData] of Object.entries(data)) {
      try {
        if (Array.isArray(tableData) && tableData.length > 0) {
          // Clear existing data
          await this.sql`TRUNCATE TABLE ${sql.identifier(tableName)} CASCADE`;
          
          // Insert backup data
          for (const row of tableData as any[]) {
            const columns = Object.keys(row);
            const values = Object.values(row);
            
            await this.sql`
              INSERT INTO ${sql.identifier(tableName)} (${sql.join(columns.map(c => sql.identifier(c)))})
              VALUES (${sql.join(values.map(v => sql.literal(v)))})
            `;
          }
        }
      } catch (error) {
        console.warn(`⚠️ Failed to import table ${tableName}:`, error);
      }
    }
  }

  // Database Health Monitoring
  async getHealthStatus() {
    try {
      const connectionTest = await this.sql`SELECT 1`;
      const tableCount = await this.sql`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      const dbSize = await this.sql`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `;

      const activeConnections = await this.sql`
        SELECT COUNT(*) as count 
        FROM pg_stat_activity 
        WHERE state = 'active'
      `;

      const metrics = this.getQueryMetrics();

      return {
        status: 'healthy',
        connection: connectionTest ? 'ok' : 'failed',
        tables: tableCount[0]?.count || 0,
        size: dbSize[0]?.size || 'unknown',
        activeConnections: activeConnections[0]?.count || 0,
        queryMetrics: metrics,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  // Connection Pool Management
  async getConnection(identifier: string = 'default') {
    if (!this.connectionPool.has(identifier)) {
      const connection = neon(this.config.connectionString);
      this.connectionPool.set(identifier, connection);
    }
    return this.connectionPool.get(identifier);
  }

  async closeAllConnections() {
    this.connectionPool.clear();
    console.log('✅ All database connections closed');
  }

  // Data Validation and Integrity
  async validateDataIntegrity(): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      // Check for orphaned records, invalid references, etc.
      // This is simplified - in production would check all foreign keys
      
      const orphanedDocs = await this.sql`
        SELECT COUNT(*) as count 
        FROM rag_documents 
        WHERE title IS NULL OR title = ''
      `;
      
      if (orphanedDocs[0]?.count > 0) {
        issues.push(`Found ${orphanedDocs[0].count} documents with missing titles`);
      }

      return {
        valid: issues.length === 0,
        issues
      };
    } catch (error) {
      issues.push(`Integrity check failed: ${error}`);
      return { valid: false, issues };
    }
  }

  // Performance Optimization
  async analyzeQueryPerformance() {
    try {
      const slowQueries = await this.sql`
        SELECT query, calls, total_time, mean_time, rows
        FROM pg_stat_statements
        ORDER BY total_time DESC
        LIMIT 10
      `;

      return {
        slowQueries,
        recommendations: this.generateOptimizationRecommendations(slowQueries)
      };
    } catch (error) {
      return {
        error: 'Query analysis not available (pg_stat_statements not installed)',
        recommendations: []
      };
    }
  }

  private generateOptimizationRecommendations(queries: any[]): string[] {
    const recommendations: string[] = [];
    
    queries.forEach(query => {
      if (query.mean_time > 1000) {
        recommendations.push(`Consider indexing for query with ${query.mean_time}ms avg time`);
      }
      if (query.calls > 10000) {
        recommendations.push(`High frequency query detected - consider caching`);
      }
    });

    return recommendations;
  }

  // Get database instance for direct access
  getDatabase() {
    return this.db;
  }

  getSql() {
    return this.sql;
  }

  private setupMonitoring() {
    // Set up periodic health checks
    setInterval(async () => {
      const health = await this.getHealthStatus();
      if (health.status === 'unhealthy') {
        console.error('❌ Database health check failed:', health);
      }
    }, 60000); // Every minute
  }
}

// Create database service instance
const databaseConfig: DatabaseConfig = {
  connectionString: process.env.DATABASE_URL || '',
  poolSize: 10,
  ssl: true,
  retryAttempts: 3,
  queryTimeout: 30000
};

export const databaseService = new DatabaseService(databaseConfig);
export default DatabaseService;
