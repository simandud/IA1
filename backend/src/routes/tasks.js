const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  addComment
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskValidation, validate } = require('../middleware/validator');

router.post('/', protect, taskValidation, validate, createTask);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.post('/:id/comments', protect, addComment);

module.exports = router;
