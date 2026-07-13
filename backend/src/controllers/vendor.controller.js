const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===============================================
// 1. GET ALL VENDORS
// ===============================================
const getAllVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      select: {
        vendorId: true,
        businessName: true,
        description: true,
        location: true,
        vendorType: true,
        eventPackages: true,
        reviews: {
          select: { rating: true }
        }
      },
    });

    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 2. GET A SINGLE VENDOR BY ID
// ===============================================
const getVendorById = async (req, res) => {
  try {
    const { id } = req.params; 

    const vendor = await prisma.vendor.findUnique({
      where: {
        vendorId: parseInt(id),
      },
      include: {
        
        services: true,
        products: true,
        eventPackages: true,
        reviews: { 
          include: {
            customer: { 
              select: { name: true }
            }
          }
        },
      },
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }
    
  
    delete vendor.password;

    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 3. GET LOGGED-IN VENDOR PROFILE
// ===============================================
const getVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const vendor = await prisma.vendor.findUnique({
      where: { vendorId: parseInt(vendorId) }
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    delete vendor.password;
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 4. UPDATE VENDOR PROFILE
// ===============================================
const updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { businessName, description, contactNumber, location, profileImage, currency, timezone, bookingLeadTime, instantBook, requireDeposits, cancellationPolicy, bankName, bankAccountNo, taxId } = req.body;

    const updatedVendor = await prisma.vendor.update({
      where: { vendorId: parseInt(vendorId) },
      data: {
        businessName,
        description,
        contactNumber,
        location,
        profileImage,
        currency,
        timezone,
        bookingLeadTime,
        instantBook: instantBook !== undefined ? Boolean(instantBook) : undefined,
        requireDeposits: requireDeposits !== undefined ? Boolean(requireDeposits) : undefined,
        cancellationPolicy,
        bankName,
        bankAccountNo,
        taxId
      }
    });

    delete updatedVendor.password;
    res.status(200).json({ message: "Profile updated successfully", vendor: updatedVendor });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 5. CREATE SERVICE
// ===============================================
const createService = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { serviceName, price, description, categoryId, pricingModel, serviceArea, imageUrl } = req.body;

    if (!serviceName || !price) {
      return res.status(400).json({ message: "Service name and price are required" });
    }

    const service = await prisma.service.create({
      data: {
        serviceName,
        price: parseFloat(price),
        description,
        pricingModel: pricingModel || null,
        serviceArea: serviceArea || null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        imageUrl: imageUrl || null,
        vendorId: parseInt(vendorId),
      }
    });

    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 6. UPDATE SERVICE
// ===============================================
const updateService = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { serviceId } = req.params;
    const { serviceName, price, description, categoryId, imageUrl, pricingModel, serviceArea } = req.body;

    const service = await prisma.service.findUnique({
      where: { serviceId: parseInt(serviceId) }
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.vendorId !== parseInt(vendorId)) {
      return res.status(403).json({ message: "Unauthorized to update this service" });
    }

    const updatedService = await prisma.service.update({
      where: { serviceId: parseInt(serviceId) },
      data: {
        serviceName: serviceName || service.serviceName,
        price: price ? parseFloat(price) : service.price,
        description: description !== undefined ? description : service.description,
        pricingModel: pricingModel !== undefined ? pricingModel : service.pricingModel,
        serviceArea: serviceArea !== undefined ? serviceArea : service.serviceArea,
        categoryId: categoryId ? parseInt(categoryId) : service.categoryId,
        imageUrl: imageUrl !== undefined ? imageUrl : service.imageUrl
      }
    });

    res.status(200).json({ message: "Service updated successfully", service: updatedService });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 7. DELETE SERVICE
// ===============================================
const deleteService = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { serviceId } = req.params;

    const service = await prisma.service.findUnique({
      where: { serviceId: parseInt(serviceId) }
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.vendorId !== parseInt(vendorId)) {
      return res.status(403).json({ message: "Unauthorized to delete this service" });
    }

    await prisma.service.delete({
      where: { serviceId: parseInt(serviceId) }
    });

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 8. GET VENDOR SERVICES
// ===============================================
const getVendorServices = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const services = await prisma.service.findMany({
      where: { vendorId: parseInt(vendorId) },
      include: { category: true }
    });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 9. GET SERVICE BY ID
// ===============================================
const getServiceById = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { serviceId } = req.params;

    const service = await prisma.service.findUnique({
      where: { serviceId: parseInt(serviceId) },
      include: { category: true }
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.vendorId !== parseInt(vendorId)) {
      return res.status(403).json({ message: "Unauthorized to view this service" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 10. GET ALL CATEGORIES
// ===============================================
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.serviceCategory.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 10. CREATE EVENT PACKAGE
// ===============================================
const createPackage = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { packageName, description, price, categoryId } = req.body;

    if (!packageName || !price) {
      return res.status(400).json({ message: "Package name and price are required" });
    }

    const eventPackage = await prisma.eventPackage.create({
      data: {
        packageName,
        description,
        price: parseFloat(price),
        categoryId: categoryId ? parseInt(categoryId) : null,
        vendorId: parseInt(vendorId),
      }
    });

    res.status(201).json({ message: "Package created successfully", package: eventPackage });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 11. UPDATE EVENT PACKAGE
// ===============================================
const updatePackage = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { packageId } = req.params;
    const { packageName, description, price, categoryId } = req.body;

    const eventPackage = await prisma.eventPackage.findUnique({
      where: { packageId: parseInt(packageId) }
    });

    if (!eventPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (eventPackage.vendorId !== parseInt(vendorId)) {
      return res.status(403).json({ message: "Unauthorized to update this package" });
    }

    const updatedPackage = await prisma.eventPackage.update({
      where: { packageId: parseInt(packageId) },
      data: {
        packageName: packageName || eventPackage.packageName,
        description: description !== undefined ? description : eventPackage.description,
        price: price ? parseFloat(price) : eventPackage.price,
        categoryId: categoryId ? parseInt(categoryId) : null
      }
    });

    res.status(200).json({ message: "Package updated successfully", package: updatedPackage });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 12. DELETE EVENT PACKAGE
// ===============================================
const deletePackage = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { packageId } = req.params;

    const eventPackage = await prisma.eventPackage.findUnique({
      where: { packageId: parseInt(packageId) }
    });

    if (!eventPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (eventPackage.vendorId !== parseInt(vendorId)) {
      return res.status(403).json({ message: "Unauthorized to delete this package" });
    }

    await prisma.eventPackage.delete({
      where: { packageId: parseInt(packageId) }
    });

    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 13. GET VENDOR PACKAGES
// ===============================================
const getVendorPackages = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const packages = await prisma.eventPackage.findMany({
      where: { vendorId: parseInt(vendorId) },
      include: { category: true }
    });

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 14. CREATE AVAILABILITY
// ===============================================
const createAvailability = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { date, startTime, endTime, isAvailable } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: "Date, start time, and end time are required" });
    }

    const availability = await prisma.availability.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        vendorId: parseInt(vendorId)
      }
    });

    res.status(201).json({ message: "Availability created successfully", availability });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 15. UPDATE AVAILABILITY
// ===============================================
const updateAvailability = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { availabilityId } = req.params;
    const { date, startTime, endTime, isAvailable } = req.body;

    const availability = await prisma.availability.findUnique({
      where: { availabilityId: parseInt(availabilityId) }
    });

    if (!availability) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    if (availability.vendorId !== parseInt(vendorId)) {
      return res.status(403).json({ message: "Unauthorized to update this availability" });
    }

    const updatedAvailability = await prisma.availability.update({
      where: { availabilityId: parseInt(availabilityId) },
      data: {
        date: date ? new Date(date) : availability.date,
        startTime: startTime || availability.startTime,
        endTime: endTime || availability.endTime,
        isAvailable: isAvailable !== undefined ? isAvailable : availability.isAvailable
      }
    });

    res.status(200).json({ message: "Availability updated successfully", availability: updatedAvailability });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 16. DELETE AVAILABILITY
// ===============================================
const deleteAvailability = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { availabilityId } = req.params;

    const availability = await prisma.availability.findUnique({
      where: { availabilityId: parseInt(availabilityId) }
    });

    if (!availability) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    if (availability.vendorId !== parseInt(vendorId)) {
      return res.status(403).json({ message: "Unauthorized to delete this availability" });
    }

    await prisma.availability.delete({
      where: { availabilityId: parseInt(availabilityId) }
    });

    res.status(200).json({ message: "Availability slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 17. GET VENDOR AVAILABILITY
// ===============================================
const getVendorAvailability = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const availability = await prisma.availability.findMany({
      where: { vendorId: parseInt(vendorId) },
      orderBy: { date: 'asc' }
    });

    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 18. GET VENDOR STATS
// ===============================================
const getVendorStats = async (req, res) => {
  try {
    const vendorId = req.user.id;

    // 1. Total Services
    const totalServices = await prisma.service.count({
      where: { vendorId: parseInt(vendorId) }
    });

    // 2. Total Packages
    const totalPackages = await prisma.eventPackage.count({
      where: { vendorId: parseInt(vendorId) }
    });

    // 3. Booking Stats
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { service: { vendorId: parseInt(vendorId) } },
          { package: { vendorId: parseInt(vendorId) } }
        ]
      },
      include: {
        service: true,
        package: true
      }
    });

    const activeBookings = bookings.filter(b => b.status === 'ACCEPTED').length;
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;

    // 4. Revenue Calculation (Completed Bookings)
    const totalRevenue = bookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + parseFloat(b.service?.price || b.package?.price || 0), 0);

    // 5. Recent Requests (Pending)
    const recentRequests = await prisma.booking.findMany({
      where: {
        status: 'PENDING',
        OR: [
          { service: { vendorId: parseInt(vendorId) } },
          { package: { vendorId: parseInt(vendorId) } }
        ]
      },
      include: {
        customer: { select: { name: true } },
        service: { select: { serviceName: true } },
        package: { select: { packageName: true } }
      },
      take: 5,
      orderBy: { bookingDate: 'desc' }
    });

    res.status(200).json({
      stats: {
        totalServices,
        totalPackages,
        activeBookings,
        pendingBookings,
        completedBookings,
        totalRevenue,
      },
      recentRequests
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 19. GENERATE AND DOWNLOAD REPORT
// ===============================================
const generateReport = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { format = 'json' } = req.query; // json, csv

    const vendor = await prisma.vendor.findUnique({
      where: { vendorId: parseInt(vendorId) }
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Gather all report data
    const totalServices = await prisma.service.count({
      where: { vendorId: parseInt(vendorId) }
    });

    const totalPackages = await prisma.eventPackage.count({
      where: { vendorId: parseInt(vendorId) }
    });

    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { service: { vendorId: parseInt(vendorId) } },
          { package: { vendorId: parseInt(vendorId) } }
        ]
      },
      include: {
        service: true,
        package: true,
        customer: { select: { name: true, email: true } }
      }
    });

    const services = await prisma.service.findMany({
      where: { vendorId: parseInt(vendorId) },
      include: { category: true }
    });

    const packages = await prisma.eventPackage.findMany({
      where: { vendorId: parseInt(vendorId) }
    });

    const reviews = await prisma.review.findMany({
      where: { vendorId: parseInt(vendorId) },
      include: { customer: { select: { name: true } } }
    });

    // Calculate statistics
    const activeBookings = bookings.filter(b => b.status === 'ACCEPTED').length;
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
    const rejectedBookings = bookings.filter(b => b.status === 'REJECTED').length;

    const totalRevenue = bookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + parseFloat(b.service?.price || b.package?.price || 0), 0);

    const averageRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
      : 0;

    const reportData = {
      generatedAt: new Date().toISOString(),
      vendor: {
        businessName: vendor.businessName,
        email: vendor.email,
        location: vendor.location,
        vendorType: vendor.vendorType,
      },
      summary: {
        totalServices,
        totalPackages,
        totalBookings: bookings.length,
        activeBookings,
        pendingBookings,
        completedBookings,
        rejectedBookings,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        averageRating: parseFloat(averageRating),
        totalReviews: reviews.length
      },
      services: services.map(s => ({
        serviceId: s.serviceId,
        serviceName: s.serviceName,
        price: parseFloat(s.price),
        category: s.category?.categoryName || 'Uncategorized',
        createdAt: s.createdAt
      })),
      packages: packages.map(p => ({
        packageId: p.packageId,
        packageName: p.packageName,
        price: parseFloat(p.price),
        createdAt: p.createdAt
      })),
      bookingBreakdown: {
        byStatus: {
          PENDING: pendingBookings,
          ACCEPTED: activeBookings,
          COMPLETED: completedBookings,
          REJECTED: rejectedBookings
        },
        recentBookings: bookings.slice(-10).map(b => ({
          bookingId: b.bookingId,
          customerName: b.customer.name,
          service: b.service?.serviceName || b.package?.packageName,
          status: b.status,
          eventDate: b.eventDate,
          price: parseFloat(b.service?.price || b.package?.price || 0)
        }))
      },
      reviews: reviews.map(r => ({
        rating: r.rating,
        comment: r.comment,
        customerName: r.customer.name,
        reviewDate: r.reviewDate
      }))
    };

    if (format === 'csv') {
      // Generate CSV format
      const csvContent = generateCSV(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="vendor-report-${Date.now()}.csv"`);
      res.send(csvContent);
    } else {
      // JSON format (default)
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="vendor-report-${Date.now()}.json"`);
      res.json(reportData);
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const generateCSV = (reportData) => {
  let csv = `VENDOR BUSINESS REPORT\n`;
  csv += `Generated: ${reportData.generatedAt}\n\n`;

  csv += `VENDOR INFORMATION\n`;
  csv += `Business Name,${reportData.vendor.businessName}\n`;
  csv += `Email,${reportData.vendor.email}\n`;
  csv += `Location,${reportData.vendor.location}\n`;
  csv += `Type,${reportData.vendor.vendorType}\n`;
  csv += `Status,Active\n\n`;

  csv += `SUMMARY STATISTICS\n`;
  csv += `Total Services,${reportData.summary.totalServices}\n`;
  csv += `Total Packages,${reportData.summary.totalPackages}\n`;
  csv += `Total Bookings,${reportData.summary.totalBookings}\n`;
  csv += `Active Bookings,${reportData.summary.activeBookings}\n`;
  csv += `Completed Bookings,${reportData.summary.completedBookings}\n`;
  csv += `Pending Bookings,${reportData.summary.pendingBookings}\n`;
  csv += `Total Revenue,LKR ${reportData.summary.totalRevenue.toLocaleString()}\n`;
  csv += `Average Rating,${reportData.summary.averageRating}/5\n`;
  csv += `Total Reviews,${reportData.summary.totalReviews}\n\n`;

  csv += `SERVICES\n`;
  csv += `Service Name,Category,Price (LKR),Status,Created Date\n`;
  reportData.services.forEach(s => {
    csv += `"${s.serviceName}","${s.category}","${s.price}","Active","${new Date(s.createdAt).toLocaleDateString()}"\n`;
  });
  csv += `\n`;

  csv += `PACKAGES\n`;
  csv += `Package Name,Price (LKR),Status,Created Date\n`;
  reportData.packages.forEach(p => {
    csv += `"${p.packageName}","${p.price}","Active","${new Date(p.createdAt).toLocaleDateString()}"\n`;
  });
  csv += `\n`;

  csv += `RECENT BOOKINGS\n`;
  csv += `Booking ID,Customer,Service/Package,Status,Event Date,Price\n`;
  reportData.bookingBreakdown.recentBookings.forEach(b => {
    csv += `"${b.bookingId}","${b.customerName}","${b.service}","${b.status}","${new Date(b.eventDate).toLocaleDateString()}","${b.price}"\n`;
  });

  return csv;
};

module.exports = {
  getAllVendors,
  getVendorById,
  getVendorProfile,
  updateVendorProfile,
  createService,
  updateService,
  deleteService,
  getVendorServices,
  getServiceById,
  getCategories,
  createPackage,
  updatePackage,
  deletePackage,
  getVendorPackages,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  getVendorAvailability,
  getVendorStats,
  generateReport
};