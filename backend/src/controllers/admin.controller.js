const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

// ===========================================
<<<<<<< HEAD
// 1. RELEASE ESCROW PAYMENT TO VENDOR
=======
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
// 9. GET ADMIN DASHBOARD STATS
// ===========================================
const getAdminDashboardStats = async (req, res) => {
  try {
    const [totalUsers, activeVendors, totalRevenueResult, escrowBalanceResult] = await Promise.all([
      prisma.customer.count(),
      prisma.vendor.count({ where: { isApproved: true, isBlocked: false } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'RELEASED' } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'HELD_IN_ESCROW' } }),
    ]);

    const totalRevenue = Number(totalRevenueResult._sum.amount || 0);
    const escrowBalance = Number(escrowBalanceResult._sum.amount || 0);

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);

    const recentPayments = await prisma.payment.findMany({
      where: { status: 'RELEASED', createdAt: { gte: startDate } },
      select: { amount: true, createdAt: true },
    });

    const monthlyIncome = Array.from({ length: 12 }, (_, index) => {
      const monthIndex = startDate.getMonth() + index;
      const date = new Date(startDate.getFullYear(), monthIndex, 1);
      return {
        label: date.toLocaleString('en-US', { month: 'short' }),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        amount: 0,
      };
    });

    recentPayments.forEach((payment) => {
      const paidDate = payment.createdAt;
      const diffMonths = (paidDate.getFullYear() - startDate.getFullYear()) * 12 + paidDate.getMonth() - startDate.getMonth();
      if (diffMonths >= 0 && diffMonths < 12) {
        monthlyIncome[diffMonths].amount += Number(payment.amount);
      }
    });

    const bookingsForMix = await prisma.booking.findMany({
      where: { serviceId: { not: null }, status: { in: ['ACCEPTED', 'COMPLETED'] } },
      include: { service: { include: { vendor: true } } },
    });

    const vendorTypeLabels = {
      PHOTOGRAPHER: 'Photography',
      SALON: 'Salon',
      RENTAL: 'Rental',
      CATERING: 'Catering',
      DJ: 'DJ',
      EVENT_COMPANY: 'Event Company',
      OTHER: 'Other',
    };

    const mixCounts = bookingsForMix.reduce((acc, booking) => {
      const type = booking.service?.vendor?.vendorType || 'OTHER';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const totalMixCount = Object.values(mixCounts).reduce((sum, value) => sum + value, 0) || 1;
    const serviceRevenueMix = Object.entries(mixCounts)
      .map(([type, count]) => ({
        label: vendorTypeLabels[type] || 'Other',
        value: Math.round((count / totalMixCount) * 100),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const latestBookings = await prisma.booking.findMany({
      orderBy: { bookingDate: 'desc' },
      take: 3,
      include: {
        customer: { select: { name: true } },
        service: { select: { serviceName: true } },
        package: { select: { packageName: true } },
      },
    });

    const latestVendors = await prisma.vendor.findMany({
      orderBy: { registrationDate: 'desc' },
      take: 2,
      select: { vendorId: true, businessName: true, registrationDate: true },
    });

    const recentActivities = [
      ...latestBookings.map((booking) => ({
        id: `booking-${booking.bookingId}`,
        type: 'Booking',
        text: `New booking from ${booking.customer?.name || 'Unknown Customer'} — ${booking.service?.serviceName || booking.package?.packageName || 'Booking'}`,
        createdAt: booking.bookingDate,
      })),
      ...latestVendors.map((vendor) => ({
        id: `vendor-${vendor.vendorId}`,
        type: 'Vendor',
        text: `Vendor "${vendor.businessName}" registered`,
        createdAt: vendor.registrationDate,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    res.status(200).json({
      totalUsers,
      activeVendors,
      totalRevenue,
      escrowBalance,
      monthlyIncome,
      serviceRevenueMix,
      recentActivities,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
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
// 9. GET SYSTEM SETTINGS
// ===========================================
const getSystemSettings = async (req, res) => {
  try {
    let settings = await prisma.systemSetting.findFirst();

    if (!settings) {
      settings = await prisma.systemSetting.create({ data: {} });
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// 10. UPDATE SYSTEM SETTINGS
// ===========================================
const updateSystemSettings = async (req, res) => {
  try {
    const {
      platformName,
      supportEmail,
      defaultTimezone,
      defaultCurrency,
      maintenanceMode,
      commissionPercent,
      logoUrl,
      paymentGateway,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      smtpFromEmail,
      smtpSecure,
      authLockoutEnabled,
      authFailedAttemptsLimit,
      authPasswordMinLength,
      authTwoFactorEnabled,
    } = req.body;

    let settings = await prisma.systemSetting.findFirst();
    if (!settings) {
      settings = await prisma.systemSetting.create({ data: {} });
    }

    const updatedSettings = await prisma.systemSetting.update({
      where: { id: settings.id },
      data: {
        ...(platformName !== undefined && { platformName }),
        ...(supportEmail !== undefined && { supportEmail }),
        ...(defaultTimezone !== undefined && { defaultTimezone }),
        ...(defaultCurrency !== undefined && { defaultCurrency }),
        ...(maintenanceMode !== undefined && { maintenanceMode }),
        ...(commissionPercent !== undefined && { commissionPercent: Number(commissionPercent) }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(paymentGateway !== undefined && { paymentGateway }),
        ...(smtpHost !== undefined && { smtpHost }),
        ...(smtpPort !== undefined && { smtpPort: smtpPort === '' ? null : Number(smtpPort) }),
        ...(smtpUser !== undefined && { smtpUser }),
        ...(smtpPassword !== undefined && { smtpPassword }),
        ...(smtpFromEmail !== undefined && { smtpFromEmail }),
        ...(smtpSecure !== undefined && { smtpSecure }),
        ...(authLockoutEnabled !== undefined && { authLockoutEnabled }),
        ...(authFailedAttemptsLimit !== undefined && { authFailedAttemptsLimit: Number(authFailedAttemptsLimit) }),
        ...(authPasswordMinLength !== undefined && { authPasswordMinLength: Number(authPasswordMinLength) }),
        ...(authTwoFactorEnabled !== undefined && { authTwoFactorEnabled }),
      },
    });

    res.status(200).json({ message: 'System settings updated successfully.', settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// 11. APPROVE A VENDOR
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
// 11. GET ALL DISPUTES FOR ADMIN
// ===========================================
const getAllDisputes = async (req, res) => {
  try {
    // If Prisma client hasn't been regenerated after schema changes,
    // `prisma.dispute` may be undefined and calling into it will throw.
    // Return an empty array in that case as a safe fallback so the
    // admin UI can still render instead of showing a 500.
    if (!prisma.dispute) {
      return res.status(200).json([]);
    }

    const disputes = await prisma.dispute.findMany({
      include: {
        booking: {
          include: {
            service: { include: { vendor: true } },
            package: { include: { vendor: true } },
            customer: { select: { name: true } },
          },
        },
        customer: true,
        vendor: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedDisputes = disputes.map((dispute) => {
      const bookingReference = dispute.booking ? `BK-${dispute.booking.bookingId}` : 'N/A';
      const vendorName =
        dispute.vendor?.businessName ||
        dispute.booking?.service?.vendor?.businessName ||
        dispute.booking?.package?.vendor?.businessName ||
        'N/A';
      const customerName =
        dispute.customer?.name ||
        dispute.booking?.customer?.name ||
        'N/A';
      const serviceName =
        dispute.booking?.service?.serviceName ||
        dispute.booking?.package?.packageName ||
        'N/A';
      const amount = dispute.booking?.service?.price || dispute.booking?.package?.price || 0;
      const amountLabel = amount ? `LKR ${Number(amount).toFixed(2)}` : 'LKR 0.00';

      return {
        id: dispute.disputeId,
        disputeId: `DSP-${dispute.disputeId}`,
        orderId: bookingReference,
        amount: amountLabel,
        raisedBy: dispute.raisedBy || 'Customer',
        reporter: dispute.reporter || customerName,
        reason: dispute.subject,
        date: dispute.createdAt.toISOString().slice(0, 10),
        status: dispute.status.toLowerCase(),
        service: serviceName,
        vendor: vendorName,
        customer: customerName,
        paidAmount: amountLabel,
        chat: [],
        evidence: [],
      };
    });

    res.status(200).json(formattedDisputes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 12. UPDATE DISPUTE STATUS
// ===========================================
const updateDisputeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['OPEN', 'INVESTIGATING', 'RESOLVED', 'REJECTED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid dispute status.' });
    }

    const dispute = await prisma.dispute.findUnique({ where: { disputeId: parseInt(id) } });
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found.' });
    }

    const updatedDispute = await prisma.dispute.update({
      where: { disputeId: parseInt(id) },
      data: { status },
    });

    res.status(200).json({ message: 'Dispute status updated successfully.', dispute: updatedDispute });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 13. REJECT VENDOR REGISTRATION
// ===========================================
const rejectVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findUnique({ where: { vendorId: parseInt(id) } });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    await prisma.vendor.update({
      where: { vendorId: parseInt(id) },
      data: { isApproved: false, isBlocked: true },
    });

    res.status(200).json({ message: 'Vendor registration rejected successfully.' });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 14. GET ESCROW & PAYMENT STATS FOR ADMIN
// ===========================================
const getAdminEscrowStats = async (req, res) => {
  try {
    // Total Escrow Held (HELD_IN_ESCROW status)
    const escrowPayments = await prisma.payment.findMany({
      where: { status: 'HELD_IN_ESCROW' },
    });

    const totalEscrowHeld = escrowPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const escrowCount = escrowPayments.length;

    // Ready for Payout (RELEASED status that haven't been paid yet)
    const releasedPayments = await prisma.payment.findMany({
      where: { status: 'RELEASED' },
    });

    const readyForPayout = releasedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const readyPayoutCount = releasedPayments.length;

    // Pending Release (PENDING status)
    const pendingPayments = await prisma.payment.findMany({
      where: { status: 'PENDING' },
    });

    const pendingRelease = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const pendingCount = pendingPayments.length;

    // Disputed Funds (REFUNDED status - treated as disputed)
    const refundedPayments = await prisma.payment.findMany({
      where: { status: 'REFUNDED' },
    });

    const disputedFunds = refundedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const disputedCount = refundedPayments.length;

    res.status(200).json({
      totalEscrowHeld: Math.round(totalEscrowHeld),
      escrowCount,
      readyForPayout: Math.round(readyForPayout),
      readyPayoutCount,
      pendingRelease: Math.round(pendingRelease),
      pendingCount,
      disputedFunds: Math.round(disputedFunds),
      disputedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// 15. GET ADMIN ESCROW PAYMENTS
// ===========================================
const getAdminPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        booking: {
          include: {
            customer: { select: { name: true } },
            service: { include: { vendor: { select: { businessName: true } } } },
            package: { include: { vendor: { select: { businessName: true } } } },
          },
        },
        order: {
          include: {
            customer: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedPayments = payments.map((payment) => {
      const vendorName =
        payment.booking?.service?.vendor?.businessName ||
        payment.booking?.package?.vendor?.businessName ||
        'N/A';
      const customerName = payment.booking?.customer?.name || payment.order?.customer?.name || 'N/A';
      const itemName = payment.booking?.service?.serviceName || payment.booking?.package?.packageName || `Order #${payment.orderId}`;
      const statusLabel =
        payment.status === 'HELD_IN_ESCROW' ? 'In Escrow' :
        payment.status === 'RELEASED' ? 'Released' :
        payment.status;

      return {
        id: payment.paymentId,
        orderId: payment.orderId ? `ORD-${payment.orderId}` : payment.bookingId ? `BK-${payment.bookingId}` : 'N/A',
        vendor: vendorName,
        amount: `LKR ${Number(payment.amount).toFixed(2)}`,
        heldSince: payment.createdAt.toISOString().slice(0, 10),
        status: statusLabel,
        type: payment.status === 'HELD_IN_ESCROW' ? 'inEscrow' : 'history',
        customer: customerName,
        item: itemName,
        releaseDate: payment.createdAt ? new Date(payment.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) : 'N/A',
      };
    });

    res.status(200).json(formattedPayments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 15. GET ALL BOOKINGS FOR ADMIN
// ===========================================
const getAllBookingsForAdmin = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: { select: { name: true, contactNumber: true } },
        service: { include: { vendor: { select: { businessName: true } } } },
        package: { include: { vendor: { select: { businessName: true } } } },
        payment: true,
        disputes: true,
      },
      orderBy: { bookingDate: 'desc' },
    });

    const formatted = bookings.map((booking) => ({
      id: booking.bookingId,
      bookingId: `BKG-${booking.bookingId}`,
      customer: booking.customer?.name || 'N/A',
      vendor:
        booking.service?.vendor?.businessName ||
        booking.package?.vendor?.businessName ||
        'N/A',
      date: booking.eventDate.toISOString().slice(0, 10),
      value: booking.service?.price
        ? `LKR ${Number(booking.service.price).toFixed(2)}`
        : booking.package?.price
        ? `LKR ${Number(booking.package.price).toFixed(2)}`
        : 'LKR 0.00',
      status: booking.status,
      issue: booking.disputes?.length > 0,
      paymentStatus: booking.payment?.status || 'N/A',
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 8. RELEASE ESCROW PAYMENT TO VENDOR
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
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
<<<<<<< HEAD
// 2. GET ALL VENDORS (Admin scoped)
=======
// 10. GET ALL VENDORS FOR ADMIN DASHBOARD
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
// ===========================================
const getAllVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
<<<<<<< HEAD
      include: {
        _count: { select: { services: true, products: true, eventPackages: true, reviews: true } },
        reviews: { select: { rating: true } }
=======
      select: {
        vendorId: true,
        businessName: true,
        description: true,
        location: true,
        vendorType: true,
        isApproved: true,
        isBlocked: true,
        registrationDate: true,
        reviews: {
          select: { rating: true }
        },
        services: true,
        eventPackages: true,
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
      },
      orderBy: { registrationDate: 'desc' }
    });

<<<<<<< HEAD
    const result = vendors.map(v => {
      const avgRating = v.reviews.length > 0
        ? (v.reviews.reduce((sum, r) => sum + r.rating, 0) / v.reviews.length).toFixed(1)
        : 0;
      const { password, reviews, ...rest } = v;
      return { ...rest, averageRating: parseFloat(avgRating) };
    });

    res.status(200).json(result);
=======
    const enrichedVendors = vendors.map(vendor => {
      const reviewCount = vendor.reviews?.length || 0;
      const avgRating = vendor.reviews?.length > 0 
        ? (vendor.reviews.reduce((sum, r) => sum + r.rating, 0) / vendor.reviews.length).toFixed(1)
        : 0;
      
      return {
        id: `VND-${vendor.vendorId}`,
        vendorId: vendor.vendorId,
        name: vendor.businessName,
        category: vendor.vendorType,
        type: vendor.vendorType === 'EVENT_COMPANY' ? 'Event Company' : 'Service Provider',
        location: vendor.location || 'Unknown',
        rating: parseFloat(avgRating),
        status: vendor.isApproved ? 'Verified' : 'Pending',
        blocked: vendor.isBlocked || false,
        badReviews: reviewCount > 0 ? Math.max(0, 5 - reviewCount) : 0,
        lastActive: new Date(vendor.registrationDate).toISOString().split('T')[0],
        financial: {
          totalGenerated: `LKR${Math.floor(Math.random() * 500000).toLocaleString()}`,
          commissionPercent: 10,
          platformProfit: `LKR${Math.floor(Math.random() * 50000).toLocaleString()}`,
          escrowHeld: `LKR${Math.floor(Math.random() * 100000).toLocaleString()}`,
          payoutsSent: `LKR${Math.floor(Math.random() * 400000).toLocaleString()}`,
        },
        packages: vendor.eventPackages.map((pkg, index) => ({
          id: `PKG-${101 + index}`,
          name: pkg.packageName || `Package ${index + 1}`,
          status: index % 12 === 7 ? 'Suspended' : 'Active',
        })),
        bookings: {
          total: 0,
          completed: 0,
          canceled: 0,
          disputes: 0,
        },
        auditLog: [],
        reviews: {
          average: parseFloat(avgRating),
          total: reviewCount,
          latest: reviewCount > 0 ? 'Top rated vendor review sample' : 'No reviews yet',
        },
        orders: [],
      };
    });

    res.status(200).json(enrichedVendors);
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

<<<<<<< HEAD
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
=======
const getAdminVendorById = async (req, res) => {
  try {
    const vendorId = parseInt(req.params.id, 10);
    const vendor = await prisma.vendor.findUnique({
      where: { vendorId },
      include: {
        eventPackages: true,
        services: true,
        reviews: {
          include: { customer: { select: { name: true } } }
        }
      }
    });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { service: { vendorId } },
          { package: { vendorId } }
        ]
      },
      include: {
        service: { select: { serviceName: true, price: true } },
        package: { select: { packageName: true, price: true } },
        payment: true,
        disputes: true,
      },
    });

    const totalGenerated = bookings.reduce((sum, booking) => {
      if (booking.service && booking.service.price) return sum + Number(booking.service.price);
      if (booking.package && booking.package.price) return sum + Number(booking.package.price);
      return sum;
    }, 0);

    const escrowHeld = bookings.reduce((sum, booking) => {
      const payment = booking.payment;
      if (payment && payment.status === 'HELD_IN_ESCROW') {
        return sum + Number(payment.amount);
      }
      return sum;
    }, 0);

    const payoutsSent = bookings.reduce((sum, booking) => {
      const payment = booking.payment;
      if (payment && payment.status === 'RELEASED') {
        return sum + Number(payment.amount);
      }
      return sum;
    }, 0);

    const bookingStats = {
      total: bookings.length,
      completed: bookings.filter((booking) => booking.status === 'COMPLETED').length,
      canceled: bookings.filter((booking) => booking.status === 'CANCELLED').length,
      disputes: bookings.reduce((count, booking) => count + (booking.disputes?.length || 0), 0),
    };

    const sortedReviews = [...vendor.reviews].sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
    const latestReview = sortedReviews[0]?.comment || 'No reviews yet';
    const reviewCount = vendor.reviews.length;
    const averageRating = reviewCount > 0
      ? Number((vendor.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(1))
      : 0;

    const formattedVendor = {
      id: `VND-${vendor.vendorId}`,
      vendorId: vendor.vendorId,
      name: vendor.businessName,
      description: vendor.description,
      location: vendor.location,
      category: vendor.vendorType,
      type: vendor.vendorType === 'EVENT_COMPANY' ? 'Event Company' : 'Service Provider',
      status: vendor.isApproved ? 'Verified' : 'Pending',
      blocked: vendor.isBlocked,
      lastActive: new Date(vendor.registrationDate).toISOString().split('T')[0],
      financial: {
        totalGenerated: `LKR${totalGenerated.toLocaleString()}`,
        platformProfit: `LKR${Math.round(totalGenerated * 0.1).toLocaleString()}`,
        commissionPercent: 10,
        escrowHeld: `LKR${escrowHeld.toLocaleString()}`,
        payoutsSent: `LKR${payoutsSent.toLocaleString()}`,
      },
      packages: vendor.eventPackages.map((pkg) => ({
        id: `PKG-${pkg.packageId}`,
        name: pkg.packageName,
        status: pkg.isApproved ? 'Active' : 'Pending',
      })),
      bookings: bookingStats,
      auditLog: [],
      reviews: {
        average: averageRating,
        total: reviewCount,
        latest: latestReview,
      },
      orders: bookings.slice(0, 3).map((booking) => ({
        id: `BKG-${booking.bookingId}`,
        item: booking.service?.serviceName || booking.package?.packageName || 'Booking',
        amount: `LKR ${((booking.service?.price || booking.package?.price) ?? 0).toLocaleString()}`,
        status: booking.status,
        escrow: booking.payment?.status || 'N/A',
        date: booking.eventDate.toISOString().slice(0, 10),
      })),
    };

    res.status(200).json(formattedVendor);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
  }
};

// ===========================================
<<<<<<< HEAD
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
=======
// 11. BLOCK/UNBLOCK A VENDOR
// ===========================================
const toggleVendorBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const vendor = await prisma.vendor.findUnique({
      where: { vendorId: parseInt(id) }
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    const updatedVendor = await prisma.vendor.update({
      where: { vendorId: parseInt(id) },
      data: { isBlocked: !!isBlocked },
      select: {
        vendorId: true,
        businessName: true,
        isBlocked: true
      }
    });

    res.status(200).json({ 
      message: `Vendor ${isBlocked ? 'blocked' : 'unblocked'} successfully.`,
      vendor: updatedVendor 
    });
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
<<<<<<< HEAD
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
=======
// REVIEW STATS FOR ADMIN DASHBOARD
// ===========================================
const getAdminReviewStats = async (req, res) => {
  try {
    const allReviews = await prisma.review.findMany({
      include: {
        vendor: true,
        customer: true,
      },
    });

    // Flagged reviews (low-rated reviews: 1-2 stars)
    const flaggedReviews = allReviews.filter((r) => r.rating <= 2).length;

    // Banned vendors (those with isBlocked=true)
    const bannedVendors = await prisma.vendor.count({
      where: { isBlocked: true },
    });

    // Suspended vendors (inactive for 90+ days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const suspendedVendors = await prisma.vendor.count({
      where: {
        registrationDate: { lt: ninetyDaysAgo },
        isBlocked: false,
      },
    });

    // Platform average rating
    const avgRating =
      allReviews.length > 0
        ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
        : 0;

    res.status(200).json({
      reportedReviews: flaggedReviews,
      bannedVendors,
      suspendedVendors,
      platformAvgRating: parseFloat(avgRating),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// GET ALL FLAGGED REVIEWS FOR ADMIN
// ===========================================
const getAllFlaggedReviews = async (req, res) => {
  try {
    const flaggedReviews = await prisma.review.findMany({
      where: { rating: { lte: 2 } },
      include: {
        customer: true,
        vendor: true,
      },
      orderBy: { reviewDate: 'desc' },
    });

    const formatted = flaggedReviews.map((review) => ({
      id: `REV-${review.reviewId}`,
      customerId: `CUST-${review.customerId}`,
      customerName: review.customer?.name || 'Unknown',
      vendorId: `VND-${review.vendorId}`,
      vendorName: review.vendor?.businessName || 'Unknown',
      rating: review.rating,
      comment: review.comment || '',
      flaggedReason: review.rating === 1 ? 'Low Rating' : 'Potentially Abusive Language',
      flaggedBy: 'System',
      flaggedDate: new Date(review.reviewDate).toISOString().split('T')[0],
      status: 'flagged',
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// GET ALL REVIEWS FOR ADMIN MODERATION
// ===========================================
const getAllReviewsForModeration = async (req, res) => {
  try {
    const allReviews = await prisma.review.findMany({
      include: {
        customer: true,
        vendor: true,
      },
      orderBy: { reviewDate: 'desc' },
    });

    const formatted = allReviews.map((review) => ({
      id: `REV-${review.reviewId}`,
      customerId: `CUST-${review.customerId}`,
      customerName: review.customer?.name || 'Unknown',
      vendorId: `VND-${review.vendorId}`,
      vendorName: review.vendor?.businessName || 'Unknown',
      rating: review.rating,
      comment: review.comment || '',
      flaggedReason: review.rating <= 2 ? 'Low Rating' : null,
      flaggedBy: review.rating <= 2 ? 'System' : null,
      flaggedDate: review.rating <= 2 ? new Date(review.reviewDate).toISOString().split('T')[0] : null,
      status: review.rating <= 2 ? 'flagged' : 'approved',
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// GET PENALTY VENDORS (BANNED/SUSPENDED)
// ===========================================
const getPenaltyVendors = async (req, res) => {
  try {
    const bannedVendors = await prisma.vendor.findMany({
      where: { isBlocked: true },
      select: { vendorId: true, businessName: true, registrationDate: true },
    });

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const suspendedVendors = await prisma.vendor.findMany({
      where: {
        registrationDate: { lt: ninetyDaysAgo },
        isBlocked: false,
      },
      select: { vendorId: true, businessName: true, registrationDate: true },
    });

    const formatted = [
      ...bannedVendors.map((vendor, idx) => ({
        id: `PEN-${800 + idx}`,
        vendorId: `VND-${vendor.vendorId}`,
        vendorName: vendor.businessName,
        penaltyDate: new Date(vendor.registrationDate).toISOString().split('T')[0],
        reason: 'Policy Violation',
        reasonType: 'bad-reviews',
        status: 'banned',
      })),
      ...suspendedVendors.map((vendor, idx) => ({
        id: `PEN-${900 + idx}`,
        vendorId: `VND-${vendor.vendorId}`,
        vendorName: vendor.businessName,
        penaltyDate: new Date(vendor.registrationDate).toISOString().split('T')[0],
        reason: 'Inactive (90 Days)',
        reasonType: 'inactive',
        status: 'suspended',
      })),
    ];

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// DISPUTE STATS FOR ADMIN DASHBOARD
// ===========================================
const getAdminDisputeStats = async (req, res) => {
  try {
    if (!prisma.dispute) {
      return res.status(200).json({
        activeDisputes: 0,
        disputedFunds: 0,
        resolvedThisMonth: 0,
        avgResolutionTime: 0,
      });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Active disputes (OPEN, INVESTIGATING)
    const activeDisputes = await prisma.dispute.count({
      where: {
        status: { in: ['OPEN', 'INVESTIGATING'] },
      },
    });

    // All disputes for calculations
    const allDisputes = await prisma.dispute.findMany({
      include: {
        booking: {
          include: {
            service: { select: { price: true } },
            package: { select: { price: true } },
          },
        },
      },
    });

    // Disputed funds (sum of prices for active disputes)
    const disputedFunds = allDisputes
      .filter((d) => ['OPEN', 'INVESTIGATING'].includes(d.status))
      .reduce((sum, dispute) => {
        const amount = dispute.booking?.service?.price || dispute.booking?.package?.price || 0;
        return sum + Number(amount);
      }, 0);

    // Resolved this month
    const resolvedThisMonth = allDisputes.filter(
      (d) => d.status === 'RESOLVED' && new Date(d.updatedAt) >= thirtyDaysAgo
    ).length;

    // Average resolution time
    const resolvedDisputes = allDisputes.filter((d) => d.status === 'RESOLVED');
    let avgResolutionTime = 0;
    if (resolvedDisputes.length > 0) {
      const totalTime = resolvedDisputes.reduce((sum, dispute) => {
        const createdAt = new Date(dispute.createdAt);
        const updatedAt = new Date(dispute.updatedAt);
        const hours = (updatedAt - createdAt) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);
      avgResolutionTime = (totalTime / resolvedDisputes.length / 24).toFixed(1);
    }

    res.status(200).json({
      activeDisputes,
      disputedFunds: `LKR ${Math.round(disputedFunds).toLocaleString()}`,
      resolvedThisMonth,
      avgResolutionTime: `${avgResolutionTime} Days`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// BROADCAST NOTIFICATIONS (Alerts to Users/Vendors)
// ===========================================

const VALID_TARGET_ROLES = ['all', 'customer', 'vendor'];
const VALID_BROADCAST_TYPES = ['info', 'warning', 'success'];

const getBroadcastAudience = async (req, res) => {
  try {
    const [customerCount, vendorCount] = await Promise.all([
      prisma.customer.count({ where: { isBlocked: false } }),
      prisma.vendor.count({ where: { isBlocked: false } }),
    ]);

    res.status(200).json({
      all: customerCount + vendorCount,
      customer: customerCount,
      vendor: vendorCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getBroadcasts = async (req, res) => {
  try {
    const broadcasts = await prisma.broadcast.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.status(200).json(broadcasts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createBroadcast = async (req, res) => {
  try {
    const { title, message, type = 'info', targetRole = 'all' } = req.body;

    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'Title and message are required' });
    }
    if (!VALID_TARGET_ROLES.includes(targetRole)) {
      return res.status(400).json({ message: 'Invalid target audience' });
    }
    if (!VALID_BROADCAST_TYPES.includes(type)) {
      return res.status(400).json({ message: 'Invalid notification type' });
    }

    const [customers, vendors] = await Promise.all([
      targetRole === 'all' || targetRole === 'customer'
        ? prisma.customer.findMany({ where: { isBlocked: false }, select: { customerId: true } })
        : Promise.resolve([]),
      targetRole === 'all' || targetRole === 'vendor'
        ? prisma.vendor.findMany({ where: { isBlocked: false }, select: { vendorId: true } })
        : Promise.resolve([]),
    ]);

    const notificationMessage = `${title.trim()}: ${message.trim()}`;

    const notificationRows = [
      ...customers.map((c) => ({
        userId: c.customerId,
        userType: 'customer',
        customerId: c.customerId,
        type,
        message: notificationMessage,
      })),
      ...vendors.map((v) => ({
        userId: v.vendorId,
        userType: 'vendor',
        type,
        message: notificationMessage,
      })),
    ];

    const [broadcast] = await prisma.$transaction([
      prisma.broadcast.create({
        data: {
          title: title.trim(),
          message: message.trim(),
          type,
          targetRole,
          recipientCount: notificationRows.length,
        },
      }),
      ...(notificationRows.length > 0
        ? [prisma.notification.createMany({ data: notificationRows })]
        : []),
    ]);

    res.status(201).json(broadcast);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
// IMPERSONATION ("Login as User")
// ===========================================

const impersonateUser = async (req, res) => {
  try {
    const { role, id } = req.params;
    const targetId = parseInt(id, 10);

    if (!['customer', 'vendor'].includes(role) || Number.isNaN(targetId)) {
      return res.status(400).json({ message: 'Invalid impersonation target' });
    }

    const target =
      role === 'customer'
        ? await prisma.customer.findUnique({ where: { customerId: targetId } })
        : await prisma.vendor.findUnique({ where: { vendorId: targetId } });

    if (!target) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign(
      { id: targetId, role, impersonatedBy: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    await prisma.impersonationLog.create({
      data: { adminId: req.user.id, targetRole: role, targetId },
    });

    const user =
      role === 'customer'
        ? { id: target.customerId, name: target.name, email: target.email, role: 'customer' }
        : { id: target.vendorId, businessName: target.businessName, email: target.email, role: 'vendor' };

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
  }
};

module.exports = {
<<<<<<< HEAD
  releasePayment,
  getAllVendors,
  getAllCustomers,
  getAllUsers,
  getUserDetails,
  getAdminDashboardStats
};
=======
  getPendingVendors,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAdminProfile,
  updateAdminProfile,
  getSystemSettings,
  updateSystemSettings,
  approveVendor,
  rejectVendor,
  getAdminEscrowStats,
  getAdminPayments,
  getAllBookingsForAdmin,
  releasePayment,
  getAllVendors,
  getAdminVendorById,
  getAllDisputes,
  updateDisputeStatus,
  toggleVendorBlock,
  getAdminDashboardStats,
  getAdminDisputeStats,
  getAdminReviewStats,
  getAllFlaggedReviews,
  getAllReviewsForModeration,
  getPenaltyVendors,
  getBroadcastAudience,
  getBroadcasts,
  createBroadcast,
  impersonateUser,
};

>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
