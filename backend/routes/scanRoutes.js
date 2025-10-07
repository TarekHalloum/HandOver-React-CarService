const express = require('express');
const router = express.Router();
const { getScans, createScan } = require('../controllers/scanController');
const authMiddleware = require('../middleware/authenticate');

router.get('/scan', authMiddleware, getScans);
router.post('/scan', authMiddleware, createScan); // ← add this

module.exports = router;
