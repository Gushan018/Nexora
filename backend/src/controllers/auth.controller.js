const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
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
      },
    });
    res.status(201).json({
      message: "Vendor registered successfully.",
      vendorId: vendor.vendorId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==========================================
// 4. SELLER REGISTER
// ==========================================
const registerSeller = async (req, res) => {
  try {
    const { shopName, business_name, email, password, contactNumber, contact_number, location, description } = req.body;
    const userExists = await prisma.vendor.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "This email address is already in use." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const seller = await prisma.vendor.create({
      data: {
        businessName: shopName || business_name,
        email,
        password: hashedPassword,
        contactNumber: contactNumber || contact_number,
        location,
        vendorType: 'RENTAL',
        description,
      },
    });
    res.status(201).json({
      message: "Seller registered successfully.",
      sellerId: seller.vendorId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==========================================
// 4b. EVENT COMPANY REGISTER
// ==========================================
const registerCompany = async (req, res) => {
  try {
    const { business_name, email, password, contact_number, location, description } = req.body;
    const userExists = await prisma.vendor.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "This email address is already in use." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const company = await prisma.vendor.create({
      data: {
        businessName: business_name,
        email,
        password: hashedPassword,
        contactNumber: contact_number,
        location,
        vendorType: 'EVENT_COMPANY',
        description,
      },
    });
    res.status(201).json({
      message: "Event Management Company registered successfully.",
      companyId: company.vendorId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==========================================
// 5. SELLER LOGIN
// ==========================================
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await prisma.vendor.findUnique({ where: { email } });
    if (!seller) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const token = generateToken(seller.vendorId, 'seller');
    res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: seller.vendorId, businessName: seller.businessName, email: seller.email, role: 'seller' }
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==========================================
// 6. VENDOR/PRODUCT LOGIN (Same as Vendor)
// ==========================================
const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await prisma.vendor.findUnique({ where: { email } });
    if (!vendor) {
      return res.status(400).json({ message: "Invalid email or password." });
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

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
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


// ==========================================
// 6. UNIFIED LOGIN
// ==========================================
const loginUnified = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check Admin
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const token = generateToken(admin.adminId, 'admin');
        return res.status(200).json({
          message: "Login successful!",
          token,
          user: { id: admin.adminId, email: admin.email, role: 'admin' }
        });
      }
    }

    // 2. Check Vendor / Seller
    const vendor = await prisma.vendor.findUnique({ where: { email } });
    if (vendor) {
      const isMatch = await bcrypt.compare(password, vendor.password);
      if (isMatch) {
        let role = 'vendor';
        if (vendor.vendorType === 'RENTAL' || email.includes('seller')) {
          role = 'seller';
        } else if (vendor.vendorType === 'EVENT_COMPANY') {
          role = 'company';
        }
        const token = generateToken(vendor.vendorId, role);
        return res.status(200).json({
          message: "Login successful!",
          token,
          user: { id: vendor.vendorId, businessName: vendor.businessName, email: vendor.email, role, vendorType: vendor.vendorType }
        });
      }
    }

    // 3. Check Customer
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (customer) {
      const isMatch = await bcrypt.compare(password, customer.password);
      if (isMatch) {
        const token = generateToken(customer.customerId, 'customer');
        return res.status(200).json({
          message: "Login successful!",
          token,
          user: { id: customer.customerId, name: customer.name, email: customer.email, role: 'customer' }
        });
      }
    }

    return res.status(400).json({ message: "Invalid email or password." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters." });
    }

    let user;
    if (role === 'customer') {
      user = await prisma.customer.findUnique({ where: { customerId: userId } });
    } else if (role === 'admin') {
      user = await prisma.admin.findUnique({ where: { adminId: userId } });
    } else {
      user = await prisma.vendor.findUnique({ where: { vendorId: userId } });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password).catch(() => false) || (currentPassword === user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (role === 'customer') {
      await prisma.customer.update({
        where: { customerId: userId },
        data: { password: hashedPassword }
      });
    } else if (role === 'admin') {
      await prisma.admin.update({
        where: { adminId: userId },
        data: { password: hashedPassword }
      });
    } else {
      await prisma.vendor.update({
        where: { vendorId: userId },
        data: { password: hashedPassword }
      });
    }

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { registerCustomer, loginCustomer, registerVendor, loginVendor, registerSeller, loginSeller, registerCompany, loginAdmin, loginUnified, changePassword };
