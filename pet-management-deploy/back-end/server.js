require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('./config/schemaMigrations');

const app = express();
app.use(express.json({ limit: '10mb' }));
// Build allowed origins from env (FRONTEND_URLS) plus safe defaults.
const frontendUrlsEnv = process.env.FRONTEND_URLS || '';
const frontendUrls = frontendUrlsEnv.split(',').map(u => u.trim()).filter(Boolean);
const defaultOrigins = [
  'https://pet-care-mauve-pi.vercel.app',
  'https://pet-care-deploy-system.vercel.app',
  'https://pet-care-deploy-system.onrender.com',
  'http://localhost:3000'
];
const allowedOrigins = Array.from(new Set([...frontendUrls, ...defaultOrigins]));

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, curl) which have no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    console.warn('CORS: blocked origin', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Ensure OPTIONS preflight requests are handled
app.options('*', cors());
app.use(express.static('views'));
app.use('/uploads', express.static('uploads'));
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const notificationsRoutes = require('./routes/notificationRoutes');
const billingRoutes = require('./routes/billingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const petRecordRoutes = require('./routes/petRecordRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { startNotificationScheduler } = require('./services/notificationScheduler');


app.use('/appointments', appointmentRoutes);
app.use('/pet-records', petRecordRoutes);
app.use('/dashboard', dashboardRoutes);

app.use('/pets', petRoutes);

app.use('/api', authRoutes);

app.use('/services', serviceRoutes);
app.use('/billing', billingRoutes);

app.use('/notifications', notificationsRoutes);

app.use('/analytics', analyticsRoutes);

app.use("/api/payment", require("./routes/paymentRoutes"));

// Test email notification endpoint
app.post('/test-email', async (req, res) => {
  const { to, subject, message } = req.body;
  
  if (!to || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email (to) and message are required' 
    });
  }

  try {
    const { sendEmail, isConfigured } = require('./services/emailService');
    
    if (!isConfigured) {
      return res.status(500).json({ 
        success: false, 
        message: 'Email service not configured. Check EMAIL_USER and EMAIL_PASS environment variables.' 
      });
    }

    await sendEmail({ 
      to, 
      subject: subject || 'PetCare Test Notification', 
      text: message 
    });

    res.json({ 
      success: true, 
      message: 'Test email sent successfully!' 
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send test email', 
      error: error.message 
    });
  }
});

// Test database connection endpoint
app.get('/test-db', (req, res) => {
  db.query('SELECT NOW() AS currentTime, DATABASE() AS currentDatabase', (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        error: err.message,
        details: 'Database connection failed'
      });
    }
    res.json({ 
      success: true, 
      message: 'Database connected successfully',
      dbTime: result[0].currentTime,
      database: result[0].currentDatabase,
      host: process.env.DB_HOST || 'localhost'
    });
  });
});

// Serve PayPal pages
app.get('/paypal-success.html', (req, res) => {
  res.sendFile(__dirname + '/views/paypal-success.html');
});

app.get('/paypal-cancel.html', (req, res) => {
  res.sendFile(__dirname + '/views/paypal-cancel.html');
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
  console.log('CORS fixed for Vercel domain');
  startNotificationScheduler();
});
