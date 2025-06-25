
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'developer' | 'viewer';
  permissions: string[];
  apiKeys: string[];
  mfaEnabled: boolean;
  mfaSecret?: string;
  lastLogin: Date;
  failedAttempts: number;
  lockedUntil?: Date;
}

export interface AuthRequest extends Request {
  user?: User;
  session?: any;
}

class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
  private jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
  private tokenExpiry = '15m';
  private refreshTokenExpiry = '7d';
  private maxFailedAttempts = 5;
  private lockoutDuration = 15 * 60 * 1000; // 15 minutes

  // JWT Token Management
  generateTokens(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: this.tokenExpiry });
    const refreshToken = jwt.sign({ id: user.id }, this.jwtRefreshSecret, { expiresIn: this.refreshTokenExpiry });

    return { accessToken, refreshToken };
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtRefreshSecret);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Password Security
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter');
    if (!/\d/.test(password)) errors.push('Password must contain number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain special character');

    return { valid: errors.length === 0, errors };
  }

  // API Key Management
  generateApiKey(): string {
    return 'nls_' + crypto.randomBytes(32).toString('hex');
  }

  // Rate Limiting
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      this.rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  // RBAC System
  hasPermission(user: User, permission: string): boolean {
    if (user.role === 'admin') return true;
    return user.permissions.includes(permission);
  }

  getRolePermissions(role: string): string[] {
    const permissions = {
      admin: ['*'],
      developer: ['read', 'write', 'deploy', 'manage_projects'],
      viewer: ['read']
    };
    return permissions[role as keyof typeof permissions] || [];
  }

  // 2FA/MFA Support
  generate2FASecret(): string {
    return crypto.randomBytes(32).toString('base64');
  }

  verify2FA(secret: string, token: string): boolean {
    // Simplified TOTP verification - in production use speakeasy library
    const timeWindow = Math.floor(Date.now() / 30000);
    const expectedToken = crypto.createHmac('sha1', secret)
      .update(timeWindow.toString())
      .digest('hex')
      .slice(-6);
    return token === expectedToken;
  }

  // Session Management
  private sessions = new Map<string, { userId: string; createdAt: Date; lastAccess: Date; deviceInfo: any }>();

  createSession(userId: string, deviceInfo: any): string {
    const sessionId = crypto.randomUUID();
    this.sessions.set(sessionId, {
      userId,
      createdAt: new Date(),
      lastAccess: new Date(),
      deviceInfo
    });
    return sessionId;
  }

  validateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    // Check if session is expired (24 hours)
    const maxAge = 24 * 60 * 60 * 1000;
    if (Date.now() - session.lastAccess.getTime() > maxAge) {
      this.sessions.delete(sessionId);
      return false;
    }

    session.lastAccess = new Date();
    return true;
  }

  // Account Lockout
  async checkAccountLockout(email: string): Promise<{ locked: boolean; remaining?: number }> {
    // In production, this would check database
    const user = await this.getUserByEmail(email);
    if (!user) return { locked: false };

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 1000);
      return { locked: true, remaining };
    }

    return { locked: false };
  }

  async recordFailedAttempt(email: string): Promise<void> {
    // In production, update database
    console.log(`Failed login attempt for ${email}`);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    // Simplified - in production query database
    return null;
  }
}

// Middleware Functions
export const authService = new AuthService();

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !authService.hasPermission(req.user, permission)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  };
};

export const rateLimitMiddleware = (maxRequests: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (!authService.checkRateLimit(identifier, maxRequests, windowMs)) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    next();
  };
};
