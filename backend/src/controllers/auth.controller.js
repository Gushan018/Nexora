const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ==========================================
// 1. CUSTOMER REGISTER
// ==========================================
const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, contact_number } = req.body;
    const userExists = await prisma.customer.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "This email address is already in use." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        contactNumber: contact_number,
      },
    });
    await prisma.cart.create({
      data: { customerId: customer.customerId },
    });
    const token = generateToken(customer.customerId, 'customer');
    res.status(201).json({ message: "Customer registered successfully!", token });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==========================================
// 2. CUSTOMER LOGIN
// ==========================================
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const token = generateToken(customer.customerId, 'customer');
    res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: customer.customerId, name: customer.name, email: customer.email, role: 'customer' }
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==========================================
// 3. VENDOR REGISTER
// ==========================================
const registerVendor = async (req, res) => {
  try {
    const {
      business_name,
      email,
      password,
      contact_number,
      location,
      vendor_type,
      description,
    } = req.body;
    const userExists = await prisma.vendor.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "This email address is already in use." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const vendor = await prisma.vendor.create({
      data: {
        businessName: business_name,
        email,
        password: hashedPassword,
        contactNumber: contact_number,
        location,
        vendorType: vendor_type,
        description,
        isApproved: false,
      },
    });
    res.status(201).json({
      message: "Vendor registration successful. Awaiting admin approval.",
      vendorId: vendor.vendorId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==========================================
// 4. VENDOR LOGIN
// ==========================================
const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await prisma.vendor.findUnique({ where: { email } });
    if (!vendor) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    if (!vendor.isApproved) {
      return res.status(403).json({ message: "Your account has not yet been approved by the admin." });
    }
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const token = generateToken(vendor.vendorId, 'vendor');
    res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: vendor.vendorId, businessName: vendor.businessName, email: vendor.email, role: 'vendor' }
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// ==========================================
// 5. ADMIN LOGIN
// ==========================================
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password." });
    }


    if (password !== admin.password) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = generateToken(admin.adminId, 'admin');

    res.status(200).json({
      message: "Admin Login successful!",
      token,
      user: { id: admin.adminId, email: admin.email, role: 'admin' }
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


module.exports = { registerCustomer, loginCustomer, registerVendor, loginVendor, loginAdmin };