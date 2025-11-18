const User = require('../models/User');
const Post = require('../models/Post');
const Task = require('../models/Task');

// @desc    Global search
// @route   GET /api/search
// @access  Private
exports.globalSearch = async (req, res, next) => {
  try {
    const { q, type } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchRegex = { $regex: q, $options: 'i' };
    let results = {};

    // Search users
    if (!type || type === 'users') {
      const users = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { position: searchRegex },
          { department: searchRegex }
        ]
      })
        .select('name email avatar position department')
        .limit(10);

      results.users = users;
    }

    // Search posts
    if (!type || type === 'posts') {
      const posts = await Post.find({
        $or: [
          { content: searchRegex },
          { tags: searchRegex }
        ],
        isPublished: true
      })
        .populate('author', 'name avatar position')
        .limit(10)
        .sort({ createdAt: -1 });

      results.posts = posts;
    }

    // Search tasks
    if (!type || type === 'tasks') {
      const tasks = await Task.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex }
        ],
        $and: [
          {
            $or: [
              { assignedTo: req.user.id },
              { createdBy: req.user.id },
              ...(req.user.role !== 'employee' ? [{}] : [])
            ]
          }
        ]
      })
        .populate('createdBy assignedTo', 'name avatar')
        .limit(10)
        .sort({ createdAt: -1 });

      results.tasks = tasks;
    }

    res.status(200).json({
      success: true,
      query: q,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users
// @route   GET /api/search/users
// @access  Private
exports.searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchRegex = { $regex: q, $options: 'i' };

    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { position: searchRegex },
        { department: searchRegex },
        { skills: searchRegex }
      ],
      isActive: true
    })
      .select('name email avatar position department skills')
      .limit(20);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};
