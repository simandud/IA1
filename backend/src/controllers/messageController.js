const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');

// @desc    Create or get conversation
// @route   POST /api/messages/conversations
// @access  Private
exports.createConversation = async (req, res, next) => {
  try {
    const { participants, type, name } = req.body;

    // Add current user to participants if not already
    if (!participants.includes(req.user.id)) {
      participants.push(req.user.id);
    }

    // For private conversations, check if already exists
    if (type === 'private' && participants.length === 2) {
      const existingConversation = await Conversation.findOne({
        type: 'private',
        participants: { $all: participants, $size: 2 }
      }).populate('participants', 'name avatar position');

      if (existingConversation) {
        return res.status(200).json({
          success: true,
          data: existingConversation
        });
      }
    }

    const conversation = await Conversation.create({
      participants,
      type,
      name
    });

    await conversation.populate('participants', 'name avatar position');

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user conversations
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate('participants', 'name avatar position isActive')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'name avatar' }
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversation, content, attachments } = req.body;

    // Verify user is part of conversation
    const conv = await Conversation.findOne({
      _id: conversation,
      participants: req.user.id
    });

    if (!conv) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or you are not a participant'
      });
    }

    const message = await Message.create({
      conversation,
      sender: req.user.id,
      content,
      attachments,
      readBy: [{ user: req.user.id }]
    });

    // Update conversation
    conv.lastMessage = message._id;
    conv.updatedAt = Date.now();

    // Update unread count for other participants
    conv.participants.forEach(participantId => {
      if (participantId.toString() !== req.user.id) {
        const currentCount = conv.unreadCount.get(participantId.toString()) || 0;
        conv.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await conv.save();

    // Create notifications for other participants
    const otherParticipants = conv.participants.filter(
      p => p.toString() !== req.user.id
    );

    const notifications = otherParticipants.map(participantId => ({
      recipient: participantId,
      sender: req.user.id,
      type: 'message',
      content: `${req.user.name} sent you a message`,
      relatedId: message._id,
      relatedType: 'Message',
      link: `/messages/${conversation}`
    }));

    await Notification.insertMany(notifications);

    await message.populate('sender', 'name avatar position');

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for conversation
// @route   GET /api/messages/:conversationId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Verify user is part of conversation
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      participants: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or you are not a participant'
      });
    }

    const messages = await Message.find({
      conversation: req.params.conversationId,
      isDeleted: false
    })
      .populate('sender', 'name avatar position')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 1 });

    const total = await Message.countDocuments({
      conversation: req.params.conversationId,
      isDeleted: false
    });

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        'readBy.user': { $ne: req.user.id }
      },
      {
        $push: { readBy: { user: req.user.id } }
      }
    );

    // Reset unread count for this user
    conversation.unreadCount.set(req.user.id, 0);
    await conversation.save();

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only sender can delete
    if (message.sender.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    message.isDeleted = true;
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
