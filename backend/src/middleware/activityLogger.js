const ActivityLog = require('../models/ActivityLog');

// Activity logger middleware
const logActivity = (action, description) => {
  return async (req, res, next) => {
    try {
      // Only log if user is authenticated
      if (req.user) {
        await ActivityLog.create({
          user: req.user.id,
          action,
          description: typeof description === 'function' ? description(req) : description,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.headers['user-agent'],
          metadata: {
            method: req.method,
            path: req.path,
            params: req.params,
            query: req.query
          }
        });
      }
    } catch (error) {
      console.error('Activity logging error:', error);
      // Don't block the request if logging fails
    }
    next();
  };
};

// Helper to log activity from controllers
const createActivityLog = async (userId, action, description, metadata = {}) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      description,
      metadata
    });
  } catch (error) {
    console.error('Activity logging error:', error);
  }
};

module.exports = { logActivity, createActivityLog };
