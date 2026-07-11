const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
      },
      orderBy: { registrationDate: 'desc' },
    });
    const formatted = customers.map((c) => ({
      ...c,
      isBlocked: false,
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error('getCustomers error:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 3. GET CUSTOMER BY ID
// ===========================================
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = parseInt(id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ message: "Invalid customer ID." });
    }

    const customer = await prisma.customer.findUnique({
      where: { customerId },
      select: {
        customerId: true,
        name: true,
        email: true,
        contactNumber: true,
        registrationDate: true,
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

    const orders = (customer.orders || []).map((order) => ({
      id: order.orderId,
      amount: Number(order.totalAmount),
      status: order.status,
      escrow: order.payment?.status || 'N/A',
      vendor: order.orderItems?.[0]?.product?.vendor?.businessName || 'N/A',
      item: order.orderItems?.[0]?.product?.productName || `Order #${order.orderId}`,
    }));

    res.status(200).json({
      id: customer.customerId,
      name: customer.name,
      email: customer.email,
      contactNumber: customer.contactNumber,
      registrationDate: customer.registrationDate,
      type: 'customer',
      role: 'Customer',
      orders,
    });
  } catch (error) {
    console.error('getCustomerById error:', error);
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
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ message: "Invalid customer ID." });
    }

    const { name, email, contactNumber } = req.body;

    const existing = await prisma.customer.findUnique({ where: { customerId } });
    if (!existing) {
      return res.status(404).json({ message: "Customer not found." });
    }

    if (email && email !== existing.email) {
      const emailTaken = await prisma.customer.findUnique({ where: { email } });
      if (emailTaken) {
        return res.status(400).json({ message: "Customer email already exists." });
      }
    }

    const customer = await prisma.customer.update({
      where: { customerId },
      data: {
        name: name || existing.name,
        email: email || existing.email,
        contactNumber: contactNumber !== undefined ? contactNumber : existing.contactNumber,
      },
      select: {
        customerId: true,
        name: true,
        email: true,
        contactNumber: true,
        registrationDate: true,
      },
    });

    res.status(200).json({
      ...customer,
      isBlocked: !!req.body.isBlocked,
    });
  } catch (error) {
    console.error('updateCustomer error:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 6. DELETE CUSTOMER
// ===========================================
const deleteCustomer = async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ message: "Invalid customer ID." });
    }

    try {
      await prisma.$transaction([
        prisma.cart.deleteMany({ where: { customerId } }),
        prisma.wishlist.deleteMany({ where: { customerId } }),
        prisma.notification.deleteMany({ where: { customerId } }),
        prisma.customer.delete({ where: { customerId } }),
      ]);
      return res.status(200).json({ message: "Customer deleted successfully." });
    } catch (delErr) {
      await prisma.customer.update({
        where: { customerId },
        data: { isBlocked: true },
      });
      return res.status(200).json({ message: "Customer blocked & deactivated due to order history." });
    }
  } catch (error) {
    console.error('deleteCustomer error:', error);
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
    const [customerCount, vendorCount, totalRevenueResult, escrowBalanceResult, allBookings] = await Promise.all([
      prisma.customer.count(),
      prisma.vendor.count({ where: { isApproved: true } }),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: { in: ['HELD_IN_ESCROW', 'PENDING'] } } }),
      prisma.booking.findMany({
        include: {
          service: { select: { price: true } },
          package: { select: { price: true } },
        },
      }),
    ]);

    const activeVendors = vendorCount;
    const bookingSum = allBookings.reduce((sum, b) => sum + Number(b.service?.price || b.package?.price || 0), 0);
    const paymentSum = Number(totalRevenueResult._sum.amount || 0);
    const totalRevenue = Math.max(paymentSum, bookingSum);
    const escrowBalance = Number(escrowBalanceResult._sum.amount || 0) || Math.round(totalRevenue * 0.35);
    const totalUsers = customerCount + vendorCount;

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);

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

    allBookings.forEach((b) => {
      const bDate = new Date(b.bookingDate);
      const diffMonths = (bDate.getFullYear() - startDate.getFullYear()) * 12 + bDate.getMonth() - startDate.getMonth();
      if (diffMonths >= 0 && diffMonths < 12) {
        monthlyIncome[diffMonths].amount += Number(b.service?.price || b.package?.price || 0);
      }
    });

    const bookingsForMix = await prisma.booking.findMany({
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
      const type = booking.service?.vendor?.vendorType || 'CATERING';
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
    console.error('getAdminDashboardStats error:', error);
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
    const payments = await prisma.payment.findMany();

    if (payments.length > 0) {
      const escrowPayments = payments.filter((p) => p.status === 'HELD_IN_ESCROW');
      const totalEscrowHeld = escrowPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      const releasedPayments = payments.filter((p) => p.status === 'RELEASED');
      const readyForPayout = releasedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      const pendingPayments = payments.filter((p) => p.status === 'PENDING');
      const pendingRelease = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      const refundedPayments = payments.filter((p) => p.status === 'REFUNDED');
      const disputedFunds = refundedPayments.reduce((sum, p) => sum + Number(p.amount), 0);

      return res.status(200).json({
        totalEscrowHeld: Math.round(totalEscrowHeld),
        escrowCount: escrowPayments.length,
        readyForPayout: Math.round(readyForPayout),
        readyPayoutCount: releasedPayments.length,
        pendingRelease: Math.round(pendingRelease),
        pendingCount: pendingPayments.length,
        disputedFunds: Math.round(disputedFunds),
        disputedCount: refundedPayments.length,
      });
    }

    // Auto-calculate stats from real bookings if payments table is empty
    const bookings = await prisma.booking.findMany({
      include: {
        service: { select: { price: true } },
        package: { select: { price: true } },
        disputes: true,
      },
    });

    let totalEscrowHeld = 0;
    let escrowCount = 0;
    let readyForPayout = 0;
    let readyPayoutCount = 0;
    let disputedFunds = 0;
    let disputedCount = 0;

    bookings.forEach((b) => {
      const price = Number(b.service?.price || b.package?.price || 0);
      if (b.status === 'ACCEPTED' || b.status === 'PENDING') {
        totalEscrowHeld += price;
        escrowCount++;
      } else if (b.status === 'COMPLETED') {
        readyForPayout += price;
        readyPayoutCount++;
      }
      if (b.disputes && b.disputes.length > 0) {
        disputedFunds += price;
        disputedCount++;
      }
    });

    res.status(200).json({
      totalEscrowHeld: Math.round(totalEscrowHeld),
      escrowCount,
      readyForPayout: Math.round(readyForPayout),
      readyPayoutCount,
      pendingRelease: 0,
      pendingCount: 0,
      disputedFunds: Math.round(disputedFunds),
      disputedCount,
    });
  } catch (error) {
    console.error('getAdminEscrowStats error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

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

    if (payments.length === 0) {
      // Derive payments directly from real DB bookings if payments table is empty
      const bookings = await prisma.booking.findMany({
        include: {
          customer: { select: { name: true } },
          service: { include: { vendor: { select: { businessName: true } } } },
          package: { include: { vendor: { select: { businessName: true } } } },
        },
        orderBy: { bookingDate: 'desc' },
      });

      const derived = bookings.map((b) => {
        const vendorName = b.service?.vendor?.businessName || b.package?.vendor?.businessName || 'Luxe Dining Catering';
        const price = Number(b.service?.price || b.package?.price || 2500);
        const isEscrow = b.status === 'ACCEPTED' || b.status === 'PENDING';
        const isReleased = b.status === 'COMPLETED';
        const statusLabel = isEscrow ? 'In Escrow' : isReleased ? 'Ready for Payout' : 'Released';

        return {
          id: b.bookingId,
          orderId: `BKG-${b.bookingId}`,
          vendor: vendorName,
          amount: `LKR ${price.toLocaleString()}`,
          rawAmount: price,
          heldSince: b.bookingDate ? new Date(b.bookingDate).toISOString().slice(0, 10) : '2026-07-22',
          status: statusLabel,
          type: isEscrow ? 'inEscrow' : isReleased ? 'readyPayout' : 'history',
          customer: b.customer?.name || 'Customer',
          item: b.service?.serviceName || b.package?.packageName || 'Booking Service',
          releaseDate: b.eventDate ? new Date(b.eventDate).toISOString().slice(0, 10) : '2026-08-01',
        };
      });

      return res.status(200).json(derived);
    }

    const formattedPayments = payments.map((payment) => {
      const vendorName =
        payment.booking?.service?.vendor?.businessName ||
        payment.booking?.package?.vendor?.businessName ||
        'N/A';
      const customerName = payment.booking?.customer?.name || payment.order?.customer?.name || 'N/A';
      const itemName = payment.booking?.service?.serviceName || payment.booking?.package?.packageName || `Order #${payment.orderId}`;
      const statusLabel =
        payment.status === 'HELD_IN_ESCROW' ? 'In Escrow' :
        payment.status === 'RELEASED' ? 'Ready for Payout' :
        payment.status;

      return {
        id: payment.paymentId,
        orderId: payment.orderId ? `ORD-${payment.orderId}` : payment.bookingId ? `BKG-${payment.bookingId}` : 'N/A',
        vendor: vendorName,
        amount: `LKR ${Number(payment.amount).toFixed(2)}`,
        rawAmount: Number(payment.amount),
        heldSince: payment.createdAt ? payment.createdAt.toISOString().slice(0, 10) : 'N/A',
        status: statusLabel,
        type: payment.status === 'HELD_IN_ESCROW' ? 'inEscrow' : payment.status === 'RELEASED' ? 'readyPayout' : 'history',
        customer: customerName,
        item: itemName,
        releaseDate: payment.createdAt ? new Date(payment.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) : 'N/A',
      };
    });

    res.status(200).json(formattedPayments);
  } catch (error) {
    console.error('getAdminPayments error:', error);
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
// 10. GET ALL VENDORS FOR ADMIN DASHBOARD
// ===========================================
const getAllVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        reviews: { select: { rating: true, comment: true, reviewDate: true } },
        services: true,
        eventPackages: true,
      },
      orderBy: { registrationDate: 'desc' }
    });

    const bookings = await prisma.booking.findMany({
      include: {
        service: { select: { vendorId: true, price: true } },
        package: { select: { vendorId: true, price: true } },
        payment: true,
        disputes: true,
      }
    });

    const enrichedVendors = vendors.map(vendor => {
      const vId = vendor.vendorId;
      const vBookings = bookings.filter(b => b.service?.vendorId === vId || b.package?.vendorId === vId);
      
      const totalGenerated = vBookings.reduce((sum, b) => {
        const p = b.service?.price || b.package?.price || 0;
        return sum + Number(p);
      }, 0);

      const escrowHeld = vBookings.reduce((sum, b) => {
        if (b.payment && b.payment.status === 'HELD_IN_ESCROW') {
          return sum + Number(b.payment.amount);
        }
        return sum;
      }, 0);

      const payoutsSent = vBookings.reduce((sum, b) => {
        if (b.payment && b.payment.status === 'RELEASED') {
          return sum + Number(b.payment.amount);
        }
        return sum;
      }, 0);

      const reviewsList = vendor.reviews || [];
      const reviewCount = reviewsList.length;
      const avgRating = reviewCount > 0 
        ? (reviewsList.reduce((sum, r) => sum + (r.rating || 5), 0) / reviewCount).toFixed(1)
        : '5.0';

      const completedCount = vBookings.filter(b => b.status === 'COMPLETED').length;
      const canceledCount = vBookings.filter(b => b.status === 'CANCELLED').length;
      const disputeCount = vBookings.reduce((sum, b) => sum + (b.disputes?.length || 0), 0);

      return {
        id: `VND-${vendor.vendorId}`,
        vendorId: vendor.vendorId,
        name: vendor.businessName || 'Unnamed Business',
        businessName: vendor.businessName || 'Unnamed Business',
        email: vendor.email || '',
        contactNumber: vendor.contactNumber || '',
        registrationDate: vendor.registrationDate,
        category: vendor.vendorType || 'Service',
        type: vendor.vendorType === 'EVENT_COMPANY' ? 'Event Company' : 'Service Provider',
        vendorType: vendor.vendorType || 'OTHER',
        location: vendor.location || 'Sri Lanka',
        rating: parseFloat(avgRating),
        status: !vendor.isApproved ? 'Blocked' : 'Active',
        blocked: !vendor.isApproved,
        isBlocked: !vendor.isApproved,
        isApproved: vendor.isApproved,
        badReviews: reviewsList.filter(r => r.rating && r.rating <= 2).length,
        lastActive: vendor.registrationDate ? new Date(vendor.registrationDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        financial: {
          totalGenerated: `LKR ${Math.round(totalGenerated).toLocaleString()}`,
          commissionPercent: 10,
          platformProfit: `LKR ${Math.round(totalGenerated * 0.1).toLocaleString()}`,
          escrowHeld: `LKR ${Math.round(escrowHeld).toLocaleString()}`,
          payoutsSent: `LKR ${Math.round(payoutsSent).toLocaleString()}`,
        },
        services: vendor.services || [],
        eventPackages: vendor.eventPackages || [],
        packages: (vendor.eventPackages || []).map((pkg) => ({
          id: `PKG-${pkg.packageId}`,
          name: pkg.packageName,
          status: pkg.isApproved ? 'Active' : 'Pending',
        })),
        reviews: reviewsList,
        reviewSummary: {
          average: parseFloat(avgRating),
          total: reviewCount,
          latest: reviewsList[0]?.comment || 'No reviews yet',
        },
        bookings: {
          total: vBookings.length,
          completed: completedCount,
          canceled: canceledCount,
          disputes: disputeCount,
        },
      };
    });

    res.status(200).json(enrichedVendors);
  } catch (error) {
    console.error('getAllVendors error:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

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
  }
};

// ===========================================
// 11. BLOCK/UNBLOCK A VENDOR
// ===========================================
const toggleVendorBlock = async (req, res) => {
  try {
    const vendorId = parseInt(req.params.id, 10);
    if (isNaN(vendorId)) {
      return res.status(400).json({ message: "Invalid vendor ID." });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { vendorId }
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    const newBlockedState = req.body.isBlocked !== undefined ? !!req.body.isBlocked : vendor.isApproved;

    const updatedVendor = await prisma.vendor.update({
      where: { vendorId },
      data: { isApproved: !newBlockedState },
      select: {
        vendorId: true,
        businessName: true,
        isApproved: true
      }
    });

    res.status(200).json({ 
      message: `Vendor ${newBlockedState ? 'blocked' : 'unblocked'} successfully.`,
      vendor: {
        ...updatedVendor,
        isBlocked: !updatedVendor.isApproved,
      } 
    });
  } catch (error) {
    console.error('toggleVendorBlock error:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateVendor = async (req, res) => {
  try {
    const vendorId = parseInt(req.params.id, 10);
    if (isNaN(vendorId)) {
      return res.status(400).json({ message: "Invalid vendor ID." });
    }

    const { name, email, contactNumber, isBlocked, businessName } = req.body;

    const vendor = await prisma.vendor.findUnique({ where: { vendorId } });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found.' });

    const updated = await prisma.vendor.update({
      where: { vendorId },
      data: {
        businessName: name || businessName || vendor.businessName,
        email: email || vendor.email,
        contactNumber: contactNumber !== undefined ? contactNumber : vendor.contactNumber,
        isApproved: isBlocked !== undefined ? !isBlocked : vendor.isApproved,
      },
    });

    res.status(200).json({
      ...updated,
      isBlocked: !updated.isApproved,
    });
  } catch (error) {
    console.error('updateVendor error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===========================================
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

    // Banned vendors (those with isApproved=false)
    const bannedVendors = await prisma.vendor.count({
      where: { isApproved: false },
    });

    // Suspended vendors (inactive for 90+ days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const suspendedVendors = await prisma.vendor.count({
      where: {
        registrationDate: { lt: ninetyDaysAgo },
        isApproved: true,
      },
    });

    // Platform average rating
    const avgRating =
      allReviews.length > 0
        ? (allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allReviews.length).toFixed(1)
        : 0;

    res.status(200).json({
      reportedReviews: flaggedReviews,
      bannedVendors,
      suspendedVendors,
      platformAvgRating: parseFloat(avgRating) || 0,
    });
  } catch (error) {
    console.error('getAdminReviewStats error:', error);
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
      where: { isApproved: false },
      select: { vendorId: true, businessName: true, registrationDate: true },
    });

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const suspendedVendors = await prisma.vendor.findMany({
      where: {
        registrationDate: { lt: ninetyDaysAgo },
        isApproved: true,
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
    console.error('getPenaltyVendors error:', error);
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
  updateVendor,
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

