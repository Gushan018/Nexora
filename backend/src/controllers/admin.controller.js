const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===========================================
// 1. RELEASE ESCROW PAYMENT TO VENDOR
// ===========================================
const releasePayment = async (req, res) => {
  try {
    const { id } = req.params; 

    const payment = await prisma.payment.findUnique({ where: { paymentId: parseInt(id) } });

    if (!payment || payment.status !== 'HELD_IN_ESCROW') {
      return res.status(400).json({ message: "Payment is not held in escrow." });
    }

    await prisma.payment.update({
      where: { paymentId: parseInt(id) },
      data: { status: 'RELEASED' },
    });

    res.status(200).json({ message: "Funds successfully released to the vendor!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 2. GET ALL VENDORS (Admin scoped)
// ===========================================
const getAllVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        _count: { select: { services: true, products: true, eventPackages: true, reviews: true } },
        reviews: { select: { rating: true } }
      },
      orderBy: { registrationDate: 'desc' }
    });

    const result = vendors.map(v => {
      const avgRating = v.reviews.length > 0
        ? (v.reviews.reduce((sum, r) => sum + r.rating, 0) / v.reviews.length).toFixed(1)
        : 0;
      const { password, reviews, ...rest } = v;
      return { ...rest, averageRating: parseFloat(avgRating) };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 3. GET ALL CUSTOMERS
// ===========================================
const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        _count: { select: { bookings: true, orders: true, reviews: true } }
      },
      orderBy: { registrationDate: 'desc' }
    });

    const result = customers.map(c => {
      const { password, ...rest } = c;
      return rest;
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 4. GET ALL USERS (Combined list)
// ===========================================
const getAllUsers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      select: { customerId: true, name: true, email: true, role: true, profileImage: true, registrationDate: true }
    });
    const vendors = await prisma.vendor.findMany({
      select: { vendorId: true, businessName: true, email: true, vendorType: true, profileImage: true, registrationDate: true }
    });
    const admins = await prisma.admin.findMany({
      select: { adminId: true, email: true, role: true, registrationDate: true }
    });

    const mappedCustomers = customers.map(c => ({
      id: `CUS-${c.customerId}`,
      originalId: c.customerId,
      type: 'customer',
      name: c.name,
      email: c.email,
      role: c.role,
      profileImage: c.profileImage,
      status: 'Active',
      joined: c.registrationDate
    }));

    const mappedVendors = vendors.map(v => ({
      id: `VND-${v.vendorId}`,
      originalId: v.vendorId,
      type: 'vendor',
      name: v.businessName,
      email: v.email,
      role: 'vendor',
      profileImage: v.profileImage,
      status: 'Active',
      joined: v.registrationDate
    }));

    const mappedAdmins = admins.map(a => ({
      id: `ADM-${a.adminId}`,
      originalId: a.adminId,
      type: 'admin',
      name: a.email.split('@')[0],
      email: a.email,
      role: a.role,
      profileImage: null,
      status: 'Active',
      joined: a.registrationDate
    }));

    const allUsers = [...mappedAdmins, ...mappedVendors, ...mappedCustomers].sort(
      (a, b) => new Date(b.joined) - new Date(a.joined)
    );

    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 5. GET USER DETAILS BY ID
// ===========================================
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    let user = null;
    let type = '';

    const customer = await prisma.customer.findUnique({
      where: { customerId: parseInt(id) },
      include: { _count: { select: { bookings: true, orders: true, reviews: true } } }
    });
    if (customer) {
      const { password, ...rest } = customer;
      user = { ...rest, type: 'customer' };
      type = 'customer';
    }

    if (!user) {
      const vendor = await prisma.vendor.findUnique({
        where: { vendorId: parseInt(id) },
        include: {
          _count: { select: { services: true, products: true, eventPackages: true, reviews: true } },
          reviews: { select: { rating: true } }
        }
      });
      if (vendor) {
        const avgRating = vendor.reviews.length > 0
          ? (vendor.reviews.reduce((sum, r) => sum + r.rating, 0) / vendor.reviews.length).toFixed(1)
          : 0;
        const { password, reviews, ...rest } = vendor;
        user = { ...rest, type: 'vendor', averageRating: parseFloat(avgRating) };
        type = 'vendor';
      }
    }

    if (!user) {
      const admin = await prisma.admin.findUnique({
        where: { adminId: parseInt(id) }
      });
      if (admin) {
        const { password, ...rest } = admin;
        user = { ...rest, type: 'admin', name: admin.email.split('@')[0] };
        type = 'admin';
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 6. GET ADMIN DASHBOARD STATS
// ===========================================
const getAdminDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await prisma.customer.count();
    const totalVendors = await prisma.vendor.count();
    const totalAdmins = await prisma.admin.count();
    const totalBookings = await prisma.booking.count();
    const pendingBookings = await prisma.booking.count({ where: { status: 'PENDING' } });
    const completedBookings = await prisma.booking.count({ where: { status: 'COMPLETED' } });
    const totalServices = await prisma.service.count();
    const totalProducts = await prisma.product.count();
    const totalRevenue = await prisma.payment.aggregate({ _sum: { amount: true } });

    res.status(200).json({
      totalUsers: totalCustomers + totalVendors + totalAdmins,
      totalCustomers,
      totalVendors,
      totalAdmins,
      totalBookings,
      pendingBookings,
      completedBookings,
      totalServices,
      totalProducts,
      totalRevenue: totalRevenue._sum.amount || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  releasePayment,
  getAllVendors,
  getAllCustomers,
  getAllUsers,
  getUserDetails,
  getAdminDashboardStats
};
