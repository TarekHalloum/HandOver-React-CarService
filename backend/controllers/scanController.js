const ScanResult = require('../models/ScanResult');

// GET /api/scan — return all scans for current user
const getScans = async (req, res) => {
  try {
    const userId = req.user.userId; // from decoded JWT
    const scans = await ScanResult.find({ userId }).sort({ scanDate: -1 });
    res.json(scans);
  } catch (error) {
    console.error('Error fetching scans:', error);
    res.status(500).json({ message: 'Server error fetching scans' });
  }
};

const createScan = async (req, res) => {
  try {
    console.log('🛠️ Scan POST body:', req.body);
    console.log('🔐 Authenticated user:', req.user);

    const { imageUrl, brand, damagedParts } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    const newScan = new ScanResult({
      userId: req.user.userId, // ensure this is NOT undefined
      imageUrl,
      brand: brand || '',
      damagedParts: damagedParts || [],
      scanDate: new Date()
    });

    await newScan.save();
    res.status(201).json(newScan);
  } catch (err) {
    console.error('❌ Scan creation failed:', err);
    res.status(500).json({ error: 'Scan processing failed', details: err.message });
  }
};


module.exports = {
  getScans,
  createScan
};
