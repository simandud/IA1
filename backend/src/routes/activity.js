const express = require('express');
const router = express.Router();
const {
  getActivities,
  getActivityStats
} = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getActivities);
router.get('/stats', protect, authorize('admin', 'manager'), getActivityStats);

module.exports = router;
