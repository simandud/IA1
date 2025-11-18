const express = require('express');
const router = express.Router();
const {
  globalSearch,
  searchUsers
} = require('../controllers/searchController');
const { protect } = require('../middleware/auth');

router.get('/', protect, globalSearch);
router.get('/users', protect, searchUsers);

module.exports = router;
