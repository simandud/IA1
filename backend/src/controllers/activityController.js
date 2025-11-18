const ActivityLog = require('../models/ActivityLog');

// @desc    Get user activity logs
// @route   GET /api/activity
// @access  Private
exports.getActivities = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by user (admins can view all, others only their own)
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    } else if (req.query.userId) {
      query.user = req.query.userId;
    }

    // Filter by action type
    if (req.query.action) {
      query.action = req.query.action;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const activities = await ActivityLog.find(query)
      .populate('user', 'name avatar position')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: activities
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get activity statistics
// @route   GET /api/activity/stats
// @access  Private (Admin/Manager)
exports.getActivityStats = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;

    // Get activity counts by action type
    const activityCounts = await ActivityLog.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get activity timeline (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activityTimeline = await ActivityLog.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get recent activities
    const recentActivities = await ActivityLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('action description createdAt');

    res.status(200).json({
      success: true,
      data: {
        activityCounts,
        activityTimeline,
        recentActivities
      }
    });
  } catch (error) {
    next(error);
  }
};
