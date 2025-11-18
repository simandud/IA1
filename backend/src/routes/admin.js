const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  toggleUserStatus,
  updateUserRole,
  getAllPosts,
  deletePost,
  getPerformanceReport
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin or manager role
router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', authorize('admin'), toggleUserStatus);
router.put('/users/:id/role', authorize('admin'), updateUserRole);
router.get('/posts', getAllPosts);
router.delete('/posts/:id', authorize('admin'), deletePost);
router.get('/performance', getPerformanceReport);

module.exports = router;
