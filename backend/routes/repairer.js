const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Repairer = require('../models/Repairer');
const authMiddleware = require('../middleware/authenticate'); // required for /me route

// REGISTER
router.post('/repairer/register', async (req, res) => {
  const { full_name, email, phone, brand, city, address, password } = req.body;

  try {
    const existing = await Repairer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRepairer = new Repairer({
      full_name,
      email,
      phone,
      brand,
      city,
      address,
      password: hashedPassword
    });

    await newRepairer.save();

    const token = jwt.sign({ userId: newRepairer._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({ token, role: 'repairer' }); 
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// LOGIN
router.post('/repairer/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const repairer = await Repairer.findOne({ email });
    if (!repairer) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const isMatch = await bcrypt.compare(password, repairer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: repairer._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, role: 'repairer' }); 
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// GET /api/repairer/me — Fetch current logged-in repairer's profile
router.get('/repairer/me', authMiddleware, async (req, res) => {
  try {
    const repairer = await Repairer.findById(req.user.userId).select('full_name brand city email');
    if (!repairer) {
      return res.status(404).json({ message: 'Repairer not found' });
    }
    res.json(repairer);
  } catch (error) {
    console.error('Error fetching repairer profile:', error);
    res.status(500).json({ message: 'Failed to fetch repairer profile' });
  }
});

module.exports = router;
