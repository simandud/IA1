const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store active users
const activeUsers = new Map();

const initializeSocket = (io) => {
  // Authentication middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user._id})`);

    // Add user to active users
    activeUsers.set(socket.user._id.toString(), socket.id);

    // Emit active users count
    io.emit('activeUsersCount', activeUsers.size);

    // Join user's personal room
    socket.join(socket.user._id.toString());

    // Handle joining conversation rooms
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.user.name} joined conversation ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('leaveConversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${socket.user.name} left conversation ${conversationId}`);
    });

    // Handle sending messages
    socket.on('sendMessage', (data) => {
      const { conversationId, message } = data;

      // Emit message to all users in the conversation
      io.to(conversationId).emit('newMessage', {
        conversationId,
        message
      });
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { conversationId, isTyping } = data;

      // Emit typing status to other users in conversation
      socket.to(conversationId).emit('userTyping', {
        conversationId,
        userId: socket.user._id,
        userName: socket.user.name,
        isTyping
      });
    });

    // Handle message read receipts
    socket.on('messageRead', (data) => {
      const { conversationId, messageId } = data;

      io.to(conversationId).emit('messageReadUpdate', {
        conversationId,
        messageId,
        userId: socket.user._id
      });
    });

    // Handle notifications
    socket.on('notification', (data) => {
      const { recipientId, notification } = data;

      // Send notification to specific user
      io.to(recipientId).emit('newNotification', notification);
    });

    // Handle user status updates
    socket.on('updateStatus', (status) => {
      // Broadcast status update to all connected clients
      io.emit('userStatusUpdate', {
        userId: socket.user._id,
        status
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.user._id})`);

      // Remove user from active users
      activeUsers.delete(socket.user._id.toString());

      // Emit updated active users count
      io.emit('activeUsersCount', activeUsers.size);

      // Broadcast user offline status
      io.emit('userStatusUpdate', {
        userId: socket.user._id,
        status: 'offline'
      });
    });
  });

  return io;
};

// Helper function to emit notification to a specific user
const emitNotification = (io, userId, notification) => {
  io.to(userId.toString()).emit('newNotification', notification);
};

// Helper function to emit message to conversation
const emitMessageToConversation = (io, conversationId, message) => {
  io.to(conversationId.toString()).emit('newMessage', {
    conversationId,
    message
  });
};

// Helper function to check if user is online
const isUserOnline = (userId) => {
  return activeUsers.has(userId.toString());
};

// Helper function to get active users count
const getActiveUsersCount = () => {
  return activeUsers.size;
};

module.exports = {
  initializeSocket,
  emitNotification,
  emitMessageToConversation,
  isUserOnline,
  getActiveUsersCount
};
