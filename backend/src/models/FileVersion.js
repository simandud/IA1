const mongoose = require('mongoose');

const fileVersionSchema = new mongoose.Schema({
  fileId: {
    type: String,
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  version: {
    type: Number,
    required: true,
    default: 1
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedTo: {
    type: String,
    enum: ['post', 'task', 'message'],
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  isCurrentVersion: {
    type: Boolean,
    default: true
  },
  changeLog: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
fileVersionSchema.index({ fileId: 1, version: -1 });
fileVersionSchema.index({ relatedTo: 1, relatedId: 1 });

module.exports = mongoose.model('FileVersion', fileVersionSchema);
