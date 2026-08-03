// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const path = require('path');
// require('dotenv').config();

// const config = require('./config');
// const connectDB = require('./config/database');
// const errorHandler = require('./middleware/errorHandler');

// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const customerRoutes = require('./routes/customers');
// const employeeRoutes = require('./routes/employees');
// const serviceRoutes = require('./routes/services');
// const projectRoutes = require('./routes/projects');
// const taskRoutes = require('./routes/tasks');
// const quoteRoutes = require('./routes/quotes');
// const contractRoutes = require('./routes/contracts');
// const invoiceRoutes = require('./routes/invoices');
// const paymentRoutes = require('./routes/payments');
// const appointmentRoutes = require('./routes/appointments');
// const messageRoutes = require('./routes/messages');
// const notificationRoutes = require('./routes/notifications');
// const materialRoutes = require('./routes/materials');
// const inventoryRoutes = require('./routes/inventory');
// const supplierRoutes = require('./routes/suppliers');
// const purchaseRoutes = require('./routes/purchases');
// const equipmentRoutes = require('./routes/equipment');
// const inspectionRoutes = require('./routes/inspections');
// const reportRoutes = require('./routes/reports');
// const issueRoutes = require('./routes/issues');
// const supportRoutes = require('./routes/support');
// const blogRoutes = require('./routes/blog');
// const faqRoutes = require('./routes/faqs');
// const reviewRoutes = require('./routes/reviews');
// const testimonialRoutes = require('./routes/testimonials');
// const settingRoutes = require('./routes/settings');
// const sessionRoutes = require('./routes/sessions');
// const analyticsRoutes = require('./routes/analytics');
// const uploadRoutes = require('./routes/uploads');
// const contactRoutes = require('./routes/contact');
// const estimatorRoutes = require('./routes/estimator');
// const youtubeRoutes = require('./routes/youtube');

// const app = express();

// app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
// app.use(cors({ origin: config.clientUrl, credentials: true }));
// app.use(morgan(config.isDev ? 'dev' : 'combined'));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 200,
//   message: { success: false, message: 'Too many requests, please try again later.' },
// });
// app.use('/api', limiter);

// app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/employees', employeeRoutes);
// app.use('/api/services', serviceRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/quotes', quoteRoutes);
// app.use('/api/contracts', contractRoutes);
// app.use('/api/invoices', invoiceRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/materials', materialRoutes);
// app.use('/api/inventory', inventoryRoutes);
// app.use('/api/suppliers', supplierRoutes);
// app.use('/api/purchases', purchaseRoutes);
// app.use('/api/equipment', equipmentRoutes);
// app.use('/api/inspections', inspectionRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/issues', issueRoutes);
// app.use('/api/support', supportRoutes);
// app.use('/api/blog', blogRoutes);
// app.use('/api/faqs', faqRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/testimonials', testimonialRoutes);
// app.use('/api/settings', settingRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/sessions', sessionRoutes);
// app.use('/api/uploads', uploadRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/estimator', estimatorRoutes);
// app.use('/api/youtube', youtubeRoutes);

// app.get('/api/health', (req, res) => {
//   res.json({ success: true, message: 'Elite Construction API is running', timestamp: new Date().toISOString() });
// });

// app.use(errorHandler);

// connectDB().then(() => {
//   app.listen(config.port, () => {
//     console.log(`Elite Construction API running on port ${config.port} in ${config.nodeEnv} mode`);
//   });
// }).catch(err => {
//   console.error('Failed to connect to MongoDB:', err.message);
//   process.exit(1);
// });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const config = require('./config');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const customerRoutes = require('./routes/customers');
const employeeRoutes = require('./routes/employees');
const serviceRoutes = require('./routes/services');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const quoteRoutes = require('./routes/quotes');
const contractRoutes = require('./routes/contracts');
const invoiceRoutes = require('./routes/invoices');
const paymentRoutes = require('./routes/payments');
const appointmentRoutes = require('./routes/appointments');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const materialRoutes = require('./routes/materials');
const inventoryRoutes = require('./routes/inventory');
const supplierRoutes = require('./routes/suppliers');
const purchaseRoutes = require('./routes/purchases');
const equipmentRoutes = require('./routes/equipment');
const inspectionRoutes = require('./routes/inspections');
const reportRoutes = require('./routes/reports');
const issueRoutes = require('./routes/issues');
const supportRoutes = require('./routes/support');
const blogRoutes = require('./routes/blog');
const faqRoutes = require('./routes/faqs');
const reviewRoutes = require('./routes/reviews');
const testimonialRoutes = require('./routes/testimonials');
const settingRoutes = require('./routes/settings');
const sessionRoutes = require('./routes/sessions');
const analyticsRoutes = require('./routes/analytics');
const uploadRoutes = require('./routes/uploads');
const contactRoutes = require('./routes/contact');
const estimatorRoutes = require('./routes/estimator');
const youtubeRoutes = require('./routes/youtube');
const activityLogsRoutes = require('./routes/activityLogs');
const activityTracker = require('./middleware/activityTracker');
const validateRoutes = require('./routes/validate');
const projectRequestRoutes = require('./routes/projectRequests');
const teamMemberRoutes = require('./routes/teamMembers');

const app = express();

app.set('trust proxy', 1);

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(morgan(config.isDev ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Refuse to start in production with the default/known JWT secret
if (config.isProd && config.jwt.secret === 'default_secret_change_me') {
  console.error('❌ Refusing to start in production with the default JWT_SECRET. Set a strong JWT_SECRET in server/.env');
  process.exit(1);
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Activity tracker — logs all API requests
app.use(activityTracker);

// ============================================
// ✅ ROOT ROUTE - FIXES THE 404 ERROR
// ============================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Elite Construction API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      api: '/api/*',
      docs: 'https://github.com/tumusenge7/eliteConstration'
    }
  });
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/estimator', estimatorRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/activity-logs', activityLogsRoutes);
app.use('/api/validate', validateRoutes);
app.use('/api/project-requests', projectRequestRoutes);
app.use('/api/team-members', teamMemberRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Elite Construction API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      root: '/',
      health: '/api/health',
      api: '/api/*'
    }
  });
});

// Global error handler
app.use(errorHandler);

// Database connection and server start
connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(` Elite Construction API running on port ${config.port} in ${config.nodeEnv} mode`);
    console.log(` Health check: http://localhost:${config.port}/api/health`);
    console.log(` Root: http://localhost:${config.port}/`);
  });
}).catch(err => {
  console.error(' Failed to connect to MongoDB:', err.message);
  process.exit(1);
});

module.exports = app;