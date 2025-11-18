const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { uploadMultipleToS3 } = require('../utils/fileUpload');

// @desc    Create post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    const { content, tags, visibility } = req.body;

    let images = [];
    let attachments = [];

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      const uploadedFiles = await uploadMultipleToS3(req.files, 'posts');

      uploadedFiles.forEach(file => {
        if (file.fileType.startsWith('image/')) {
          images.push(file.fileUrl);
        } else {
          attachments.push(file);
        }
      });
    }

    const post = await Post.create({
      author: req.user.id,
      content,
      images,
      attachments,
      tags,
      visibility
    });

    // Update user metrics
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'performanceMetrics.postsCreated': 1 }
    });

    // Populate author
    await post.populate('author', 'name avatar position');

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = { isPublished: true };

    // Filter by tag
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // Filter by author
    if (req.query.author) {
      query.author = req.query.author;
    }

    // Search in content
    if (req.query.search) {
      query.content = { $regex: req.query.search, $options: 'i' };
    }

    const posts = await Post.find(query)
      .populate('author', 'name avatar position department')
      .populate('likes.user', 'name avatar')
      .skip(skip)
      .limit(limit)
      .sort({ isPinned: -1, createdAt: -1 });

    const total = await Post.countDocuments(query);

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

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar position department')
      .populate('likes.user', 'name avatar')
      .populate('shares.user', 'name avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Make sure user is post owner
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'name avatar position');

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Make sure user is post owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if post has already been liked
    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push({ user: req.user.id });

      // Create notification for post author (not for self-likes)
      if (post.author.toString() !== req.user.id) {
        await Notification.create({
          recipient: post.author,
          sender: req.user.id,
          type: 'like',
          content: `${req.user.name} liked your post`,
          relatedId: post._id,
          relatedType: 'Post',
          link: `/posts/${post._id}`
        });
      }
    }

    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Share post
// @route   PUT /api/posts/:id/share
// @access  Private
exports.sharePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Add share
    post.shares.push({ user: req.user.id });
    await post.save();

    // Create notification for post author
    if (post.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.author,
        sender: req.user.id,
        type: 'share',
        content: `${req.user.name} shared your post`,
        relatedId: post._id,
        relatedType: 'Post',
        link: `/posts/${post._id}`
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};
