const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// ===========================================
// 1. GET ALL PENDING VENDORS
// ===========================================
const getPendingVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { isApproved: false },
      select: { vendorId: true, businessName: true, email: true, vendorType: true, registrationDate: true }
    });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 2. GET ALL CUSTOMERS
// ===========================================
const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      select: {
        customerId: true,
        name: true,
        email: true,
        contactNumber: true,
        registrationDate: true,
        isBlocked: true,
      },
      orderBy: { registrationDate: 'desc' },
    });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 3. GET CUSTOMER BY ID
// ===========================================
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { customerId: parseInt(id) },
      select: {
        customerId: true,
        name: true,
        email: true,
        contactNumber: true,
        registrationDate: true,
        isBlocked: true,
        orders: {
          select: {
            orderId: true,
            totalAmount: true,
            status: true,
            payment: {
              select: {
                status: true,
              },
            },
            orderItems: {
              select: {
                quantity: true,
                product: {
                  select: {
                    productName: true,
                    vendor: {
                      select: {
                        businessName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    const orders = customer.orders.map((order) => ({
      id: order.orderId,
      amount: Number(order.totalAmount),
      status: order.status,
      escrow: order.payment?.status || 'N/A',
      vendor: order.orderItems[0]?.product?.vendor?.businessName || 'N/A',
      item: order.orderItems[0]?.product?.productName || `Order #${order.orderId}`,
    }));

    res.status(200).json({
      ...customer,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 4. CREATE CUSTOMER
// ===========================================
const createCustomer = async (req, res) => {
  try {
    const { name, email, contactNumber, isBlocked } = req.body;
    const existingCustomer = await prisma.customer.findUnique({ where: { email } });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer email already exists." });
    }

    const defaultPassword = 'TempPass123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        contactNumber,
        isBlocked: !!isBlocked,
        password: hashedPassword,
      },
      select: {
        customerId: true,
        name: true,
        email: true,
        contactNumber: true,
        registrationDate: true,
        isBlocked: true,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 5. UPDATE CUSTOMER
// ===========================================
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, contactNumber, isBlocked } = req.body;

    const existingCustomer = await prisma.customer.findUnique({ where: { email } });
    if (existingCustomer && existingCustomer.customerId !== parseInt(id)) {
      return res.status(400).json({ message: "Customer email already exists." });
    }

    const customer = await prisma.customer.update({
      where: { customerId: parseInt(id) },
      data: {
        name,
        email,
        contactNumber,
        isBlocked: !!isBlocked,
      },
      select: {
        customerId: true,
        name: true,
        email: true,
        contactNumber: true,
        registrationDate: true,
        isBlocked: true,
      },
    });

    res.status(200).json(customer);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Customer not found." });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 6. DELETE CUSTOMER
// ===========================================
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.customer.delete({ where: { customerId: parseInt(id) } });
    res.status(200).json({ message: "Customer deleted successfully." });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Customer not found." });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 7. GET ADMIN PROFILE
// ===========================================
const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const admin = await prisma.admin.findUnique({
      where: { adminId },
      select: {
        adminId: true,
        name: true,
        email: true,
        contactNumber: true,
        profileImage: true,
        registrationDate: true,
        role: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 8. UPDATE ADMIN PROFILE
// ===========================================
const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, contactNumber, profileImage } = req.body;

    const updatedAdmin = await prisma.admin.update({
      where: { adminId },
      data: {
        ...(name !== undefined && { name }),
        ...(contactNumber !== undefined && { contactNumber }),
        ...(profileImage && { profileImage }),
      },
      select: {
        adminId: true,
        name: true,
        email: true,
        contactNumber: true,
        profileImage: true,
        registrationDate: true,
        role: true,
      },
    });

    res.status(200).json({ message: "Profile updated successfully.", admin: updatedAdmin });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Admin not found." });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 9. APPROVE A VENDOR
// ===========================================
const approveVendor = async (req, res) => {
  try {
    const { id } = req.params; 

    await prisma.vendor.update({
      where: { vendorId: parseInt(id) },
      data: { isApproved: true },
    });

    res.status(200).json({ message: "Vendor approved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 8. RELEASE ESCROW PAYMENT TO VENDOR
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

module.exports = {
  getPendingVendors,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAdminProfile,
  updateAdminProfile,
  approveVendor,
  releasePayment,
};