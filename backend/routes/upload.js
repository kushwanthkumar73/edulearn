const express = require('express');
const router = express.Router();
const { cloudinary, uploadVideo, uploadImage } = require('../utils/cloudinary');
const auth = require('../middleware/auth');
const authorize = require('../middleware/roles');

// Upload video
router.post('/video', auth, authorize('instructor', 'admin'), uploadVideo.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No video file!' });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'edulearn/videos',
          resource_type: 'video',
          chunk_size: 6000000,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      duration: Math.round(result.duration || 0),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload image
router.post('/image', auth, authorize('instructor', 'admin'), uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file!' });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'edulearn/thumbnails' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;