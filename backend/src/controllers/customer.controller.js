const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get Customer Profile
const getCustomerProfile = async (req, res) => {
  try {
    const customerId = req.user.id;
    const customer = await prisma.customer.findUnique({
      where: { customerId },
      select: {
        customerId: true,
        name: true,
        email: true,
        contactNumber: true,
        profileImage: true,
        bio: true,
        registrationDate: true,
      }
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update Customer Profile
const updateCustomerProfile = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { name, contactNumber, profileImage, bio } = req.body;

    const updatedCustomer = await prisma.customer.update({
      where: { customerId },
      data: {
        ...(name && { name }),
        ...(contactNumber !== undefined && { contactNumber }),
        ...(profileImage && { profileImage }),
        ...(bio !== undefined && { bio })
      },
      select: {
        customerId: true,
        name: true,
        email: true,
        contactNumber: true,
        profileImage: true,
        bio: true,
        registrationDate: true,
      }
    });

    res.status(200).json({ message: "Profile updated successfully.", customer: updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Customer Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const customerId = parseInt(req.user.id);

    const activeOrders = await prisma.order.count({
      where: { customerId, status: { notIn: ['DELIVERED', 'CANCELLED'] } }
    });

    const pendingBookings = await prisma.booking.count({
      where: { customerId, status: 'PENDING' }
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const upcomingEvents = await prisma.booking.count({
      where: { customerId, status: 'ACCEPTED', eventDate: { gte: startOfToday } }
    });

    const wishlisted = prisma.wishlist ? await prisma.wishlist.count({ where: { customerId } }).catch(() => 0) : 0; 

    const recentOrders = await prisma.order.findMany({
      where: { customerId },
      orderBy: { orderDate: 'desc' },
      take: 3,
      include: { orderItems: { include: { product: true } } }
    });

    const upcomingBookingsList = await prisma.booking.findMany({
      where: { customerId, status: { in: ['ACCEPTED', 'PENDING'] }, eventDate: { gte: startOfToday } },
      orderBy: { bookingDate: 'desc' },
      take: 5,
      include: { service: { include: { vendor: true } }, package: { include: { vendor: true } } }
    });

    const recommendedVendors = await prisma.vendor.findMany({
      take: 2,
    });

    const actionRequired = upcomingBookingsList.filter(b => b.status === 'ACCEPTED');

    res.status(200).json({
      activeOrders,
      pendingBookings,
      upcomingEvents,
      wishlisted,
      recentOrders,
      upcomingBookingsList,
      recommendedVendors,
      actionRequired
    });
  } catch (error) {
    console.error('Error fetching customer dashboard stats:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getCustomerProfile,
  updateCustomerProfile,
  getDashboardStats
};
