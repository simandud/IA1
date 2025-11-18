const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendTaskAssignmentEmail } = require('../utils/email');

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const taskData = {
      ...req.body,
      createdBy: req.user.id
    };

    const task = await Task.create(taskData);

    // Send notifications to assigned users
    if (task.assignedTo && task.assignedTo.length > 0) {
      const notifications = task.assignedTo.map(userId => ({
        recipient: userId,
        sender: req.user.id,
        type: 'task_assigned',
        content: `${req.user.name} assigned you a task: ${task.title}`,
        relatedId: task._id,
        relatedType: 'Task',
        link: `/tasks/${task._id}`
      }));

      await Notification.insertMany(notifications);

      // Send emails (don't wait)
      task.assignedTo.forEach(async (userId) => {
        const user = await User.findById(userId);
        if (user) {
          sendTaskAssignmentEmail(user, task).catch(err =>
            console.error('Task email error:', err)
          );
        }
      });
    }

    await task.populate('createdBy assignedTo', 'name avatar position');

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Filter by assigned user
    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    // Filter by creator
    if (req.query.createdBy) {
      query.createdBy = req.query.createdBy;
    }

    // Get only user's tasks if not admin/manager
    if (req.user.role === 'employee' && !req.query.assignedTo) {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query)
      .populate('createdBy assignedTo', 'name avatar position')
      .skip(skip)
      .limit(limit)
      .sort({ dueDate: 1, createdAt: -1 });

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy assignedTo', 'name avatar position department')
      .populate('comments.author', 'name avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // If status changed to completed, update metrics
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = Date.now();

      // Update assigned users' metrics
      if (task.assignedTo && task.assignedTo.length > 0) {
        await User.updateMany(
          { _id: { $in: task.assignedTo } },
          { $inc: { 'performanceMetrics.tasksCompleted': 1 } }
        );
      }
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('createdBy assignedTo', 'name avatar position');

    // Notify assigned users of update
    if (task.assignedTo && task.assignedTo.length > 0) {
      const notifications = task.assignedTo
        .filter(user => user._id.toString() !== req.user.id)
        .map(user => ({
          recipient: user._id,
          sender: req.user.id,
          type: 'task_updated',
          content: `${req.user.name} updated task: ${task.title}`,
          relatedId: task._id,
          relatedType: 'Task',
          link: `/tasks/${task._id}`
        }));

      await Notification.insertMany(notifications);
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Only creator or admin can delete
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.comments.push({
      author: req.user.id,
      content: req.body.content
    });

    await task.save();
    await task.populate('comments.author', 'name avatar');

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};
