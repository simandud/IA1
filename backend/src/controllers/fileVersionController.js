const FileVersion = require('../models/FileVersion');
const { uploadToS3, deleteFromS3 } = require('../utils/fileUpload');
const { v4: uuidv4 } = require('uuid');

// @desc    Upload file with versioning
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { relatedTo, relatedId, fileId, changeLog } = req.body;

    // Check if this is a new file or a new version
    let version = 1;
    let finalFileId = fileId;

    if (fileId) {
      // This is a new version of an existing file
      // Mark previous versions as not current
      await FileVersion.updateMany(
        { fileId },
        { isCurrentVersion: false }
      );

      // Get the latest version number
      const latestVersion = await FileVersion.findOne({ fileId })
        .sort({ version: -1 });

      version = latestVersion ? latestVersion.version + 1 : 1;
    } else {
      // This is a new file
      finalFileId = uuidv4();
    }

    // Upload to S3
    const uploadedFile = await uploadToS3(req.file, 'files');

    // Create file version record
    const fileVersion = await FileVersion.create({
      fileId: finalFileId,
      fileName: req.file.originalname,
      fileUrl: uploadedFile.fileUrl,
      fileType: uploadedFile.fileType,
      fileSize: uploadedFile.fileSize,
      version,
      uploadedBy: req.user.id,
      relatedTo,
      relatedId,
      isCurrentVersion: true,
      changeLog
    });

    await fileVersion.populate('uploadedBy', 'name avatar');

    res.status(201).json({
      success: true,
      data: fileVersion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get file versions
// @route   GET /api/files/:fileId/versions
// @access  Private
exports.getFileVersions = async (req, res, next) => {
  try {
    const versions = await FileVersion.find({ fileId: req.params.fileId })
      .populate('uploadedBy', 'name avatar')
      .sort({ version: -1 });

    res.status(200).json({
      success: true,
      count: versions.length,
      data: versions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current file version
// @route   GET /api/files/:fileId/current
// @access  Private
exports.getCurrentVersion = async (req, res, next) => {
  try {
    const fileVersion = await FileVersion.findOne({
      fileId: req.params.fileId,
      isCurrentVersion: true
    }).populate('uploadedBy', 'name avatar');

    if (!fileVersion) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.status(200).json({
      success: true,
      data: fileVersion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore file version
// @route   PUT /api/files/:fileId/restore/:version
// @access  Private
exports.restoreVersion = async (req, res, next) => {
  try {
    // Mark all versions as not current
    await FileVersion.updateMany(
      { fileId: req.params.fileId },
      { isCurrentVersion: false }
    );

    // Mark specified version as current
    const fileVersion = await FileVersion.findOneAndUpdate(
      { fileId: req.params.fileId, version: req.params.version },
      { isCurrentVersion: true },
      { new: true }
    ).populate('uploadedBy', 'name avatar');

    if (!fileVersion) {
      return res.status(404).json({
        success: false,
        message: 'File version not found'
      });
    }

    res.status(200).json({
      success: true,
      data: fileVersion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete file and all versions
// @route   DELETE /api/files/:fileId
// @access  Private
exports.deleteFile = async (req, res, next) => {
  try {
    const versions = await FileVersion.find({ fileId: req.params.fileId });

    // Delete all versions from S3
    for (const version of versions) {
      await deleteFromS3(version.fileUrl);
    }

    // Delete all version records
    await FileVersion.deleteMany({ fileId: req.params.fileId });

    res.status(200).json({
      success: true,
      message: 'File and all versions deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
