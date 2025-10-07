const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const RepairRequest = require('../models/RepairRequest');
const Repairer = require('../models/Repairer');
const authMiddleware = require('../middleware/authenticate');

// POST /api/repair-requests — User sends a repair request
router.post('/repair-requests', authMiddleware, async (req, res) => {
  try {
    const { repairerId, scanId } = req.body;

    const newRequest = new RepairRequest({
      userId: req.user.userId,
      repairerId,
      scanId,
      status: 'pending'
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating repair request:', error);
    res.status(500).json({ error: 'Failed to create repair request' });
  }
});

// GET /api/repair-requests/user — Get all requests made by current user
router.get('/repair-requests/user', authMiddleware, async (req, res) => {
  try {
    const requests = await RepairRequest.find({ userId: req.user.userId })
      .populate('repairerId', 'fullName'); 

    const formatted = requests.map((r) => ({
      ...r._doc,
      repairerName: r.repairerId?.full_name || 'Repairer',
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching user repair requests:', error);
    res.status(500).json({ error: 'Failed to fetch repair requests' });
  }
});

// GET /api/repair-requests/repairer — All requests sent to the logged-in repairer
router.get('/repair-requests/repairer', authMiddleware, async (req, res) => {
  try {
    const requests = await RepairRequest.find({ repairerId: req.user.userId })
      .populate('userId', 'fullName email') // ✅ Include full name for display
      .populate('scanId');                   // ✅ Include scan details (damagedParts, scanDate)

    res.json(requests);
  } catch (error) {
    console.error('Error fetching repairer requests:', error);
    res.status(500).json({ error: 'Failed to fetch repairer requests' });
  }
});

// PUT /api/repair-requests/:id/respond — Accept or decline a request
router.put('/repair-requests/:id/respond', authMiddleware, async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status, reason } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateFields = { status };
    if (status === 'declined') {
      updateFields.rejectionReason = reason || '';
    } else {
      updateFields.rejectionReason = '';
    }

    const updated = await RepairRequest.findOneAndUpdate(
      { _id: requestId, repairerId: req.user.userId },
      updateFields,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Repair request not found or unauthorized' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating repair request status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// GET /api/repairers?brand=Subaru — List repairers for a brand
router.get('/repairers', async (req, res) => {
  try {
    const { brand } = req.query;

    if (!brand) {
      return res.status(400).json({ error: 'Brand is required' });
    }

    const repairers = await Repairer.find({ brand });
    res.json(repairers);
  } catch (error) {
    console.error('Error fetching repairers:', error);
    res.status(500).json({ error: 'Failed to fetch repairers' });
  }
});

module.exports = router;
