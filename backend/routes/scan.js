// backend/routes/scan.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const Scan = require('../models/Scan');
const authenticate = require('../middleware/authenticate'); 

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;

    const python = spawn('python', ['backend-python/app.py', filePath]);

    python.on('close', async (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Python script failed.' });
      }

      const outputImagePath = path.join('output', 'result.jpg');

      const scan = new Scan({
        userId: req.user.id,
        imagePath: outputImagePath,
      });

      await scan.save();

      return res.json({
        message: 'Scan complete and saved.',
        resultPath: outputImagePath,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Scan processing failed' });
  }
});

module.exports = router;
// GET /api/scan - Get all scans for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ scans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve scans' });
  }
});
