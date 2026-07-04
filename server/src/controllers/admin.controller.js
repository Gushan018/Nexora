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
// 2. GET ALL VENDORS
// ===========================================
const getAllVendors = async (req, res) => {
  try {
    const { isApproved } = req.query;
    const where = {};
    if (isApproved !== undefined) where.isApproved = isApproved === 'true';
    const vendors = await prisma.vendor.findMany({
      where,
      orderBy: { registrationDate: 'desc' },
    });
    vendors.forEach(v => delete v.password);
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// 3. APPROVE / REJECT VENDOR
// ===========================================
const approveVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    const vendor = await prisma.vendor.update({
      where: { vendorId: parseInt(id) },
      data: { isApproved },
    });
    delete vendor.password;
    res.status(200).json({ message: `Vendor ${isApproved ? 'approved' : 'rejected'} successfully`, vendor });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// 4. APPROVE PRODUCT / SERVICE / PACKAGE
// ===========================================
const approveContent = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { isApproved } = req.body;
    let result;
    if (type === 'product') {
      result = await prisma.product.update({ where: { productId: parseInt(id) }, data: { isApproved } });
    } else if (type === 'service') {
      result = await prisma.service.update({ where: { serviceId: parseInt(id) }, data: { isApproved } });
    } else if (type === 'package') {
      result = await prisma.eventPackage.update({ where: { packageId: parseInt(id) }, data: { isApproved } });
    } else {
      return res.status(400).json({ message: 'Invalid type. Use product, service, or package.' });
    }
    res.status(200).json({ message: `${type} ${isApproved ? 'approved' : 'rejected'}`, item: result });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// 5. GET ALL CUSTOMERS
// ===========================================
const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { registrationDate: 'desc' },
      select: { customerId: true, name: true, email: true, contactNumber: true, registrationDate: true },
    });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// 6. GET ALL BOOKINGS (Admin)
// ===========================================
const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { customer: { select: { name: true } }, service: { include: { vendor: { select: { businessName: true } } } }, package: { include: { vendor: { select: { businessName: true } } } }, payment: true },
      orderBy: { bookingDate: 'desc' },
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// 7. GET ALL PAYMENTS (Admin)
// ===========================================
const getAllPaymentsAdmin = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { booking: { include: { customer: { select: { name: true } }, service: true, package: true } }, order: { include: { customer: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// 8. ADMIN DASHBOARD STATS
// ===========================================
const getAdminDashboard = async (req, res) => {
  try {
    const totalVendors = await prisma.vendor.count();
    const pendingVendors = await prisma.vendor.count({ where: { isApproved: false } });
    const totalCustomers = await prisma.customer.count();
    const totalBookings = await prisma.booking.count();
    const totalRevenue = await prisma.payment.aggregate({ where: { status: { in: ['HELD_IN_ESCROW', 'RELEASED'] } }, _sum: { amount: true } });
    const pendingApprovals = await prisma.vendor.count({ where: { isApproved: false } }) + await prisma.product.count({ where: { isApproved: false } }) + await prisma.service.count({ where: { isApproved: false } }) + await prisma.eventPackage.count({ where: { isApproved: false } });
    res.status(200).json({ totalVendors, pendingVendors, totalCustomers, totalBookings, totalRevenue: totalRevenue._sum.amount || 0, pendingApprovals });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  releasePayment,
  getAllVendors,
  approveVendor,
  approveContent,
  getAllCustomers,
  getAllBookingsAdmin,
  getAllPaymentsAdmin,
  getAdminDashboard,
};