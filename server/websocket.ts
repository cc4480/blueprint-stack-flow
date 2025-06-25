
import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';
import { authService } from './auth';

interface SocketUser {
  id: string;
  email: string;
  role: string;
  rooms: string[];
}

interface CollaborationSession {
  id: string;
  participants: SocketUser[];
  document: any;
  lastModified: Date;
}

class WebSocketService {
  private io: SocketServer;
  private connectedUsers = new Map<string, SocketUser>();
  private collaborationSessions = new Map<string, CollaborationSession>();
  private activeChats = new Map<string, any[]>();

  constructor(server: Server) {
    this.io = new SocketServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling']
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('🔌 New WebSocket connection:', socket.id);

      // Authentication
      socket.on('authenticate', async (token: string) => {
        try {
          const user = authService.verifyToken(token);
          this.connectedUsers.set(socket.id, {
            id: user.id,
            email: user.email,
            role: user.role,
            rooms: []
          });
          
          socket.emit('authenticated', { success: true, user });
          this.broadcastUserPresence();
        } catch (error) {
          socket.emit('authentication_error', { error: 'Invalid token' });
          socket.disconnect();
        }
      });

      // Real-time collaboration
      socket.on('join_collaboration', (sessionId: string) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        socket.join(`collaboration:${sessionId}`);
        user.rooms.push(`collaboration:${sessionId}`);

        if (!this.collaborationSessions.has(sessionId)) {
          this.collaborationSessions.set(sessionId, {
            id: sessionId,
            participants: [],
            document: {},
            lastModified: new Date()
          });
        }

        const session = this.collaborationSessions.get(sessionId)!;
        session.participants.push(user);

        this.io.to(`collaboration:${sessionId}`).emit('user_joined', {
          user,
          participants: session.participants
        });
      });

      socket.on('document_change', (data: { sessionId: string; changes: any; cursor: any }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const session = this.collaborationSessions.get(data.sessionId);
        if (!session) return;

        session.document = data.changes;
        session.lastModified = new Date();

        socket.to(`collaboration:${data.sessionId}`).emit('document_updated', {
          changes: data.changes,
          cursor: data.cursor,
          user: user.email
        });
      });

      // Live chat support
      socket.on('join_chat', (roomId: string) => {
        socket.join(`chat:${roomId}`);
        
        if (!this.activeChats.has(roomId)) {
          this.activeChats.set(roomId, []);
        }

        socket.emit('chat_history', {
          messages: this.activeChats.get(roomId)
        });
      });

      socket.on('send_message', (data: { roomId: string; message: string; type: 'text' | 'file' }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const messageData = {
          id: Date.now().toString(),
          user: user.email,
          message: data.message,
          type: data.type,
          timestamp: new Date(),
          userId: user.id
        };

        const chatHistory = this.activeChats.get(data.roomId) || [];
        chatHistory.push(messageData);
        this.activeChats.set(data.roomId, chatHistory);

        this.io.to(`chat:${data.roomId}`).emit('new_message', messageData);
      });

      // Real-time notifications
      socket.on('subscribe_notifications', (userId: string) => {
        socket.join(`notifications:${userId}`);
      });

      // Live metrics and dashboard updates
      socket.on('subscribe_metrics', () => {
        const user = this.connectedUsers.get(socket.id);
        if (user && user.role === 'admin') {
          socket.join('metrics');
          this.sendLiveMetrics(socket);
        }
      });

      // Blueprint generation progress
      socket.on('subscribe_blueprint_progress', (sessionId: string) => {
        socket.join(`blueprint:${sessionId}`);
      });

      // Disconnect handling
      socket.on('disconnect', () => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          // Remove from collaboration sessions
          this.collaborationSessions.forEach((session) => {
            session.participants = session.participants.filter(p => p.id !== user.id);
          });

          this.connectedUsers.delete(socket.id);
          this.broadcastUserPresence();
        }
        console.log('🔌 WebSocket disconnected:', socket.id);
      });
    });

    // Periodic updates
    setInterval(() => {
      this.sendLiveMetrics();
      this.cleanupInactiveSessions();
    }, 30000); // Every 30 seconds
  }

  // Public methods for server-side events
  public sendNotification(userId: string, notification: any) {
    this.io.to(`notifications:${userId}`).emit('notification', notification);
  }

  public broadcastSystemAlert(message: string, type: 'info' | 'warning' | 'error' = 'info') {
    this.io.emit('system_alert', { message, type, timestamp: new Date() });
  }

  public sendBlueprintProgress(sessionId: string, progress: { step: string; percentage: number; message: string }) {
    this.io.to(`blueprint:${sessionId}`).emit('blueprint_progress', progress);
  }

  public sendLiveMetrics(socket?: any) {
    const metrics = {
      connectedUsers: this.connectedUsers.size,
      activeSessions: this.collaborationSessions.size,
      activeChats: this.activeChats.size,
      systemLoad: process.memoryUsage(),
      timestamp: new Date()
    };

    if (socket) {
      socket.emit('live_metrics', metrics);
    } else {
      this.io.to('metrics').emit('live_metrics', metrics);
    }
  }

  private broadcastUserPresence() {
    const onlineUsers = Array.from(this.connectedUsers.values()).map(user => ({
      id: user.id,
      email: user.email,
      role: user.role
    }));

    this.io.emit('user_presence', { onlineUsers, count: onlineUsers.length });
  }

  private cleanupInactiveSessions() {
    const now = Date.now();
    const maxInactiveTime = 30 * 60 * 1000; // 30 minutes

    this.collaborationSessions.forEach((session, sessionId) => {
      if (now - session.lastModified.getTime() > maxInactiveTime && session.participants.length === 0) {
        this.collaborationSessions.delete(sessionId);
      }
    });
  }

  // Get instance for external access
  public getIO(): SocketServer {
    return this.io;
  }
}

export default WebSocketService;
