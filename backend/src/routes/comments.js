const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { commentValidation, validate } = require('../middleware/validator');

router.post('/', protect, commentValidation, validate, createComment);
router.get('/', protect, getComments);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.put('/:id/like', protect, likeComment);

module.exports = router;
