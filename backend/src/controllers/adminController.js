const User = require('../models/User');
const Post = require('../models/Post');
const Task = require('../models/Task');
const Message = require('../models/Message');

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalPosts = await Post.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const totalMessages = await Message.countDocuments();

    // Users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Users by department
    const usersByDepartment = await User.aggregate([
      { $match: { department: { $exists: true, $ne: null } } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // Tasks by status
    const tasksByStatus = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const recentPosts = await Post.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const recentTasks = await Task.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          totalPosts,
          totalTasks,
          completedTasks,
          totalMessages
        },
        usersByRole,
        usersByDepartment,
        tasksByStatus,
        recentActivity: {
          posts: recentPosts,
          tasks: recentTasks
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filters (admin view)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    if (req.query.role) {
      query.role = req.query.role;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate/Deactivate user
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['employee', 'manager', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts (admin view with moderation)
// @route   GET /api/admin/posts
// @access  Private (Admin)
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'name avatar position')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments();

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any post (moderation)
// @route   DELETE /api/admin/posts/:id
// @access  Private (Admin)
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get performance report
// @route   GET /api/admin/performance
// @access  Private (Admin/Manager)
exports.getPerformanceReport = async (req, res, next) => {
  try {
    // Top performers by tasks completed
    const topPerformers = await User.find({ isActive: true })
      .select('name avatar position department performanceMetrics')
      .sort({ 'performanceMetrics.tasksCompleted': -1 })
      .limit(10);

    // Most active posters
    const mostActivePoster = await User.find({ isActive: true })
      .select('name avatar position performanceMetrics')
      .sort({ 'performanceMetrics.postsCreated': -1 })
      .limit(10);

    // Department performance
    const departmentPerformance = await User.aggregate([
      { $match: { department: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$department',
          avgTasksCompleted: { $avg: '$performanceMetrics.tasksCompleted' },
          totalTasks: { $sum: '$performanceMetrics.tasksCompleted' },
          employeeCount: { $sum: 1 }
        }
      },
      { $sort: { totalTasks: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        topPerformers,
        mostActivePoster,
        departmentPerformance
      }
    });
  } catch (error) {
    next(error);
  }
};
