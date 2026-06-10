const express = require('express');
const cors = require('cors');
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

// ===================================

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ===================================
// Routes 
// ===================================
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes); 

// ===================================

// Test Route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Nexora API is Running Perfectly!' });
});

// Server Start 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
