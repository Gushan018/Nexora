const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ================================================
// 1. CREATE A NEW BOOKING (Customer)
// ================================================
const createBooking = async (req, res) => {
  try {
    const { serviceId, packageId, eventDate, location } = req.body;
    const customerId = req.user.id; 

    if (!serviceId && !packageId) {
      return res.status(400).json({ message: "Please select a service or a package." });
    }

    if (!eventDate) {
      return res.status(400).json({ message: "Event date is required." });
    }

    const parsedDate = new Date(eventDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid event date format." });
    }

    const targetServiceId = serviceId ? parseInt(serviceId) : null;
    const targetPackageId = packageId ? parseInt(packageId) : null;

    // Check for existing accepted booking on the same date
    const existingConflict = await prisma.booking.findFirst({
      where: {
        eventDate: parsedDate,
        status: 'ACCEPTED',
        OR: [
          ...(targetServiceId ? [{ serviceId: targetServiceId }] : []),
          ...(targetPackageId ? [{ packageId: targetPackageId }] : [])
        ]
      }
    });

    if (existingConflict) {
      return res.status(400).json({ message: "This slot/date is already booked and accepted." });
    }

    const booking = await prisma.booking.create({
      data: {
        customerId,
        serviceId: serviceId ? parseInt(serviceId) : null,
        packageId: packageId ? parseInt(packageId) : null,
        eventDate: new Date(eventDate),
        location,
        status: 'PENDING', 
      },
      include: {
        service: { select: { vendorId: true, serviceName: true } },
        package: { select: { vendorId: true, packageName: true } },
      },
    });

    const vendorId = booking.service?.vendorId || booking.package?.vendorId;
    if (vendorId) {
      await prisma.notification.create({
        data: {
          type: 'new_booking',
          message: `New booking received for ${booking.service?.serviceName || booking.package?.packageName || 'a service'}`,
          vendorId,
        },
      });
    }

    res.status(201).json({ message: "Booking request sent successfully!", booking });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ================================================
// 2. GET MY BOOKINGS (Customer)
// ================================================
const getMyBookings = async (req, res) => {
  try {
    const customerId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { customerId },
      include: {
        service: { select: { serviceName: true, price: true } },
        package: { select: { packageName: true, price: true } },
      },
      orderBy: {
        eventDate: 'desc', 
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ================================================
// 3. GET BOOKING REQUESTS FOR VENDOR
// ================================================
const getVendorBookings = async (req, res) => {
  try {
    const vendorId = req.user.id; 


    const vendorServices = await prisma.service.findMany({
      where: { vendorId },
      select: { serviceId: true },
    });
    const vendorPackages = await prisma.eventPackage.findMany({
      where: { vendorId },
      select: { packageId: true },
    });

    const serviceIds = vendorServices.map(s => s.serviceId);
    const packageIds = vendorPackages.map(p => p.packageId);

   
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { serviceId: { in: serviceIds } },
          { packageId: { in: packageIds } },
        ],
      },
      include: {
        customer: { select: { name: true, contactNumber: true, email: true } },
        service: { select: { serviceName: true, price: true } },
        package: { select: { packageName: true, price: true } },
        payment: { select: { paymentId: true, amount: true, status: true } }
      },
      orderBy: { bookingDate: 'desc' },
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ================================================
// 4. UPDATE BOOKING STATUS (Vendor)
// ================================================
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body; 


    const validStatuses = ['ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const bookingId = parseInt(id);
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const existing = await prisma.booking.findUnique({ where: { bookingId } });
    if (!existing) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { bookingId },
      data: { 
        status: status,
        vendorResponseDate: new Date(),
      },
    });

    await prisma.notification.create({
      data: {
        type: 'booking_status',
        message: `Your booking status has been updated to ${status}`,
        customerId: updatedBooking.customerId,
      },
    });

    res.status(200).json({ message: `Booking status updated to ${status}`, booking: updatedBooking });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ================================================
// 5. GET BOOKING BY ID (Vendor)
// ================================================
const getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { bookingId: parseInt(req.params.id) },
      include: {
        customer: { select: { name: true, email: true, contactNumber: true } },
        service: { select: { serviceName: true, price: true } },
        package: { select: { packageName: true, price: true, category: true } },
        payment: true,
      },
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getVendorBookings,      
  updateBookingStatus,
  getBookingById,
};