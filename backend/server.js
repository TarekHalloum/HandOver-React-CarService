const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Route imports
const authRoutes = require('./routes/auth');
const repairRequestRoutes = require('./routes/repairRequestRoutes');
const repairerRoutes = require('./routes/repairer');
const scanRoutes = require('./routes/scanRoutes'); // ✅ uses ScanResult

const app = express();
app.use(cors());
app.use(express.json());

// Static files from Python
app.use('/images', express.static(path.join(__dirname, 'backend-python/output')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', scanRoutes); // ✅ /api/scan comes from scanRoutes using ScanResult
app.use('/api', repairRequestRoutes);
app.use('/api', repairerRoutes);

// 📧 Contact form
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'tarekhalloum2025@hotmail.com',
      subject: `Contact Form: ${name}`,
      text: `Email: ${email}\n\nMessage:\n${message}`,
      reply_to: email
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email failed:', error);
    res.status(500).json({ success: false, message: 'Email failed to send' });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
