const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

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
const notificationRoutes = require('./routes/notification.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const chatRoutes = require('./routes/chat.routes');
const uploadRoutes = require('./routes/upload.routes');

// ===================================

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
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
    console.error('❌ Error in /api/settings:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
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
app.use('/api/notifications', notificationRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

// ===================================

// Test Route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Event Nest API is Running Perfectly!' });
});

console.log('Mounted routes:');
console.log(app.router && app.router.stack && app.router.stack.map((layer) => layer.route && layer.route.path));

// Server Start 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
