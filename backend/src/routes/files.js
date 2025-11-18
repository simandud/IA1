const express = require('express');
const router = express.Router();
const {
  uploadFile,
  getFileVersions,
  getCurrentVersion,
  restoreVersion,
  deleteFile
} = require('../controllers/fileVersionController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/:fileId/versions', protect, getFileVersions);
router.get('/:fileId/current', protect, getCurrentVersion);
router.put('/:fileId/restore/:version', protect, restoreVersion);
router.delete('/:fileId', protect, deleteFile);

module.exports = router;
