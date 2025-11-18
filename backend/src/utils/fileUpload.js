const { s3 } = require('../config/aws');
const path = require('path');
const crypto = require('crypto');

// Generate unique ID
const generateUniqueId = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Upload file to S3
exports.uploadToS3 = async (file, folder = 'general') => {
  try {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${generateUniqueId()}${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();

    return {
      fileName: file.originalname,
      fileUrl: result.Location,
      fileType: file.mimetype,
      fileSize: file.size
    };
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error('Error uploading file');
  }
};

// Upload multiple files to S3
exports.uploadMultipleToS3 = async (files, folder = 'general') => {
  try {
    const uploadPromises = files.map(file => this.uploadToS3(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('S3 Multiple Upload Error:', error);
    throw new Error('Error uploading files');
  }
};

// Delete file from S3
exports.deleteFromS3 = async (fileUrl) => {
  try {
    const key = fileUrl.split('.com/')[1];

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('S3 Delete Error:', error);
    throw new Error('Error deleting file');
  }
};
