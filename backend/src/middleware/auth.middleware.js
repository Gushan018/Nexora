const jwt = require('jsonwebtoken');

// ===========================================
// 1. Protect Middleware (Check if user is logged in)
// ===========================================
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexora_super_secret_key_2026');
      req.user = { id: decoded.id, role: decoded.role };
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ===========================================
// 2. Restrict Middleware (Check user role)
// ===========================================

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const userRole = req.user.role;
    // Admins have universal permission
    if (userRole === 'admin') return next();

    // Exact role match
    if (roles.includes(userRole)) return next();

    // Legacy or alias role matching
    if (roles.includes('vendor') && ['vendor', 'seller', 'company', 'emc'].includes(userRole)) return next();
    if (roles.includes('seller') && ['seller', 'vendor'].includes(userRole)) return next();
    if (roles.includes('company') && ['company', 'emc', 'vendor'].includes(userRole)) return next();

    return res.status(403).json({ message: 'You do not have permission to perform this action' });
  };
};

module.exports = { protect, restrictTo };