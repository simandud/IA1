const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  sharePost
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { postValidation, validate } = require('../middleware/validator');
const upload = require('../middleware/upload');

router.post('/', protect, upload.array('files', 5), postValidation, validate, createPost);
router.get('/', protect, getPosts);
router.get('/:id', protect, getPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);
router.put('/:id/share', protect, sharePost);

module.exports = router;
