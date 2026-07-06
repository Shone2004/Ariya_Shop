const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const upload = multer({ storage });

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.json({
      success: true,
      url: req.file.path || req.file.secure_url
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

module.exports = router;
