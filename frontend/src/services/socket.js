import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join a conversation room
  joinConversation(conversationId) {
    if (this.socket) {
      this.socket.emit('joinConversation', conversationId);
    }
  }

  // Leave a conversation room
  leaveConversation(conversationId) {
    if (this.socket) {
      this.socket.emit('leaveConversation', conversationId);
    }
  }

  // Send a message
  sendMessage(conversationId, message) {
    if (this.socket) {
      this.socket.emit('sendMessage', { conversationId, message });
    }
  }

  // Send typing indicator
  sendTyping(conversationId, isTyping) {
    if (this.socket) {
      this.socket.emit('typing', { conversationId, isTyping });
    }
  }

  // Mark message as read
  markMessageRead(conversationId, messageId) {
    if (this.socket) {
      this.socket.emit('messageRead', { conversationId, messageId });
    }
  }

  // Listen for new messages
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
      this.listeners.set('newMessage', callback);
    }
  }

  // Listen for typing indicators
  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
      this.listeners.set('userTyping', callback);
    }
  }

  // Listen for new notifications
  onNewNotification(callback) {
    if (this.socket) {
      this.socket.on('newNotification', callback);
      this.listeners.set('newNotification', callback);
    }
  }

  // Listen for active users count
  onActiveUsersCount(callback) {
    if (this.socket) {
      this.socket.on('activeUsersCount', callback);
      this.listeners.set('activeUsersCount', callback);
    }
  }

  // Listen for user status updates
  onUserStatusUpdate(callback) {
    if (this.socket) {
      this.socket.on('userStatusUpdate', callback);
      this.listeners.set('userStatusUpdate', callback);
    }
  }

  // Remove listener
  off(event) {
    if (this.socket && this.listeners.has(event)) {
      const callback = this.listeners.get(event);
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  // Remove all listeners
  offAll() {
    this.listeners.forEach((callback, event) => {
      if (this.socket) {
        this.socket.off(event, callback);
      }
    });
    this.listeners.clear();
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
