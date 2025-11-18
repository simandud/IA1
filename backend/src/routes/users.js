const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadAvatar,
  getUserMetrics
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, getUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, authorize('admin', 'manager'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/:id/metrics', protect, getUserMetrics);

module.exports = router;
