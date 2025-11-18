const express = require('express');
const router = express.Router();
const {
  createConversation,
  getConversations,
  sendMessage,
  getMessages,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { messageValidation, validate } = require('../middleware/validator');

router.post('/conversations', protect, createConversation);
router.get('/conversations', protect, getConversations);
router.post('/', protect, messageValidation, validate, sendMessage);
router.get('/:conversationId', protect, getMessages);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
