const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// ===================================
// Routes Import 
// ===================================
const authRoutes = require('./routes/auth.routes');
const vendorRoutes = require('./routes/vendor.routes');
const bookingRoutes = require('./routes/booking.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes'); 
const customerRoutes = require('./routes/customer.routes');
const reviewRoutes = require('./routes/review.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const messagesRoutes = require('./routes/messages.routes');
const uploadRoutes = require('./routes/upload.routes');
const categoriesRoutes = require('./routes/categories.routes');
const packageRoutes = require('./routes/package.routes');
const servicesRoutes = require('./routes/services.routes');
const availabilityRoutes = require('./routes/availability.routes');
const budgetRoutes = require('./routes/budget.routes');
const refundRoutes = require('./routes/refund.routes');

// ===================================

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', (req, res, next) => {
  console.log('API request:', req.method, req.path);
  next();
});

// ===================================
// Routes 
// ===================================
// Public system settings (used by frontend to show branding - no auth required)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Registering public settings route');
app.get('/api/settings', async (req, res) => {
  try {
    console.log('🔍 /api/settings route hit');
    let settings = await prisma.systemSetting.findFirst();
    if (!settings) {
      console.log('📝 Creating default settings');
      settings = await prisma.systemSetting.create({ data: {} });
    }
    console.log('✅ Sending settings:', settings);
    res.status(200).json(settings);
  } catch (error) {
    console.warn('⚠️ Warning in /api/settings (using default fallback):', error.message);
    res.status(200).json({
      systemName: 'Nexora Event Ecosystem',
      logoUrl: '/logo.png',
      commissionRate: 5.0,
      autoApproveVendors: true,
      maintenanceMode: false
    });
  }
});

// Admin protected routes
const { getSystemSettings } = require('./controllers/admin.controller');

app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/customers', customerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/chat', messagesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/refunds', refundRoutes);

// ===================================

// Test Route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Nexora API is Running Perfectly!' });
});

console.log('📍 Mounted API Modules:');
console.log('  • ' + [
  '/api/auth', '/api/vendors', '/api/bookings', '/api/products',
  '/api/cart', '/api/orders', '/api/payments', '/api/admin',
  '/api/customers', '/api/reviews', '/api/notifications', '/api/wishlist',
  '/api/messages', '/api/upload', '/api/categories', '/api/packages',
  '/api/services', '/api/availability', '/api/budget', '/api/refunds', '/api/settings'
].join('\n  • '));

// Server Start 
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;

