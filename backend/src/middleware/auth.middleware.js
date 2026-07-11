const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===========================================
// 1. Protect Middleware (Check if user is logged in)
// ===========================================
const protect = async (req, res, next) => {
  let token;


  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      
      token = req.headers.authorization.split(' ')[1];

     
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      req.user = { id: decoded.id, role: decoded.role };

      next(); 
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


// ===========================================
// 2. Restrict Middleware (Check user role)
// ===========================================

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next();
  };
};

module.exports = { protect, restrictTo };