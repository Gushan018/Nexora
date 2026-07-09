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

    const booking = await prisma.booking.create({
      data: {
        customerId,
        serviceId: serviceId ? parseInt(serviceId) : null,
        packageId: packageId ? parseInt(packageId) : null,
        eventDate: new Date(eventDate),
        location,
      },
    });

    res.status(201).json({ message: "Booking request sent successfully!", booking });
  } catch (error) {
    console.error("Booking Error:", error);
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
        service: {
          include: {
            vendor: true
          }
        },
        package: {
          include: {
            vendor: true
          }
        },
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
        customer: { select: { name: true, contactNumber: true } },
        service: { select: { serviceName: true } },
        package: { select: { packageName: true } },
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


    if (!['ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { bookingId: parseInt(id) },
      data: { 
        status: status,
        vendorResponseDate: new Date(),
      },
    });

    res.status(200).json({ message: `Booking status updated to ${status}`, booking: updatedBooking });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


module.exports = {
  createBooking,
  getMyBookings,
  getVendorBookings,      
  updateBookingStatus,    
};