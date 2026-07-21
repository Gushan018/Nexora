const { PrismaClient } = require('@prisma/client');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const prisma = new PrismaClient();

// Helper: build Prisma OR condition that avoids empty arrays in `in`
function buildBookingWhere(vendorId) {
  const serviceIds = [];
  const packageIds = [];
  // We'll populate these inline in each query instead
  return { vendorId };
}

function orIn(field, ids) {
  if (!ids || ids.length === 0) return [];
  return [{ [field]: { in: ids } }];
}

// ===============================================
// 1. GET ALL APPROVED VENDORS
// ===============================================
const getAllVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        isApproved: true, 
      },
      select: {
       
        vendorId: true,
        businessName: true,
        description: true,
        location: true,
      
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

    const vendor = await prisma.vendor.findFirst({
      where: {
        vendorId: parseInt(id),
        isApproved: true,
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
      return res.status(404).json({ message: "Vendor not found or not approved." });
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
const getMyProfile = async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { vendorId: req.user.id },
      select: {
        vendorId: true,
        businessName: true,
        email: true,
        description: true,
        contactNumber: true,
        location: true,
        registrationNumber: true,
        establishedYear: true,
        address: true,
        bannerImage: true,
        logoImage: true,
        socialFacebook: true,
        socialInstagram: true,
        socialTwitter: true,
        website: true,
        vendorType: true,
        registrationDate: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
      ...vendor,
      profileImage: vendor.logoImage,
      coverImage: vendor.bannerImage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 4. UPDATE LOGGED-IN VENDOR PROFILE
// ===============================================
const updateMyProfile = async (req, res) => {
  try {
    const {
      businessName,
      email,
      description,
      contactNumber,
      location,
      registrationNumber,
      establishedYear,
      address,
      bannerImage,
      logoImage,
      profileImage,
      coverImage,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      website,
    } = req.body;

    const updateData = {
      businessName,
      description,
      contactNumber,
      location,
      registrationNumber,
      establishedYear: establishedYear ? parseInt(establishedYear) : null,
      address,
      bannerImage: bannerImage || coverImage,
      logoImage: logoImage || profileImage,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      website,
    };
    if (email) updateData.email = email;
    if (req.body.vendorType) updateData.vendorType = req.body.vendorType;

    const vendor = await prisma.vendor.update({
      where: { vendorId: req.user.id },
      data: updateData,
      select: {
        vendorId: true,
        businessName: true,
        email: true,
        description: true,
        contactNumber: true,
        location: true,
        registrationNumber: true,
        establishedYear: true,
        address: true,
        bannerImage: true,
        logoImage: true,
        socialFacebook: true,
        socialInstagram: true,
        socialTwitter: true,
        website: true,
        vendorType: true,
        registrationDate: true,
      },
    });

    res.status(200).json({
      message: "Profile updated successfully.",
      ...vendor,
      profileImage: vendor.logoImage,
      coverImage: vendor.bannerImage,
    });
  } catch (error) {
    console.error("updateMyProfile error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 5. GET DASHBOARD STATS FOR VENDOR
// ===============================================
const getDashboard = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    let vendor = await prisma.vendor.findUnique({ where: { vendorId: userId } });
    if (!vendor) {
      vendor = await prisma.vendor.findFirst({ where: { userId: userId } });
    }
    const vendorId = vendor ? vendor.vendorId : userId;
    const now = new Date();

    const totalPackages = await prisma.eventPackage.count({ where: { vendorId } });
    const serviceIds = (await prisma.service.findMany({ where: { vendorId }, select: { serviceId: true } })).map(s => s.serviceId);
    const packageIds = (await prisma.eventPackage.findMany({ where: { vendorId }, select: { packageId: true } })).map(p => p.packageId);

    const orConditions = [...orIn('serviceId', serviceIds), ...orIn('packageId', packageIds)];
    const bookingWhere = orConditions.length > 0 ? { OR: orConditions } : { bookingId: -1 };

    const totalBookings = await prisma.booking.count({ where: bookingWhere });
    const pendingBookings = await prisma.booking.count({
      where: { ...bookingWhere, status: 'PENDING' },
    });
    const completedBookings = await prisma.booking.count({
      where: { ...bookingWhere, status: 'COMPLETED' },
    });

    const payments = (serviceIds.length || packageIds.length)
      ? await prisma.payment.findMany({
          where: {
            status: { in: ['HELD_IN_ESCROW', 'RELEASED'] },
            booking: bookingWhere
          },
        })
      : [];
    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyPayments = (serviceIds.length || packageIds.length)
      ? await prisma.payment.findMany({
          where: {
            status: { in: ['HELD_IN_ESCROW', 'RELEASED'] },
            booking: bookingWhere,
            createdAt: { gte: sixMonthsAgo },
          },
          select: { amount: true, createdAt: true },
        })
      : [];
    const revenueByMonth = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('en-US', { month: 'short' });
      revenueByMonth[key] = 0;
    }
    for (const p of monthlyPayments) {
      const key = p.createdAt.toLocaleString('en-US', { month: 'short' });
      revenueByMonth[key] = (revenueByMonth[key] || 0) + parseFloat(p.amount || 0);
    }
    const revenueChart = Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue }));

    const upcomingEvents = await prisma.booking.findMany({
      where: { ...bookingWhere, status: { in: ['PENDING', 'ACCEPTED'] } },
      include: { customer: { select: { name: true } }, service: { select: { serviceName: true } }, package: { select: { packageName: true } } },
      orderBy: { eventDate: 'asc' },
      take: 5,
    });

    const recentPendingRequests = await prisma.booking.findMany({
      where: { ...bookingWhere, status: 'PENDING' },
      include: {
        customer: { select: { name: true, email: true } },
        service: { select: { serviceName: true } },
        package: { select: { packageName: true } },
      },
      orderBy: { bookingDate: 'desc' },
      take: 5,
    });

    res.status(200).json({
      stats: {
        totalPackages,
        totalServices: serviceIds.length,
        totalBookings,
        activeBookings: pendingBookings + completedBookings,
        pendingBookings,
        completedBookings,
        totalRevenue: Math.round(totalRevenue),
      },
      revenueChart,
      recentRequests: recentPendingRequests.map(b => ({
        bookingId: b.bookingId,
        customer: b.customer,
        service: b.service,
        package: b.package,
        bookingDate: b.bookingDate,
        eventDate: b.eventDate,
        status: b.status,
      })),
      upcomingEvents: upcomingEvents.map(e => ({
        id: e.bookingId,
        customer: e.customer?.name || 'Customer',
        event: e.service?.serviceName || e.package?.packageName || 'Event',
        date: e.eventDate,
        status: e.status,
      })),
    });
  } catch (error) {
    console.error("Error in getDashboard:", error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===============================================
// 6. GET REPORTS & ANALYTICS FOR VENDOR
// ===============================================
function buildDateFilter(year, month) {
  if (!year && !month) return null;
  const y = parseInt(year) || new Date().getFullYear();
  if (month) {
    const m = parseInt(month) - 1;
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);
    return { gte: start, lt: end };
  }
  return { gte: new Date(y, 0, 1), lt: new Date(y + 1, 0, 1) };
}

const getReports = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { year, month, type } = req.query;
    const dateFilter = buildDateFilter(year, month);
    const serviceIds = (await prisma.service.findMany({ where: { vendorId }, select: { serviceId: true } })).map(s => s.serviceId);
    const packageIds = (await prisma.eventPackage.findMany({ where: { vendorId }, select: { packageId: true } })).map(p => p.packageId);
    const now = new Date();

    const bookingWhere = { OR: [...orIn('serviceId', serviceIds), ...orIn('packageId', packageIds)] };
    if (dateFilter) bookingWhere.eventDate = dateFilter;

    const allBookings = await prisma.booking.findMany({
      where: bookingWhere,
      include: { package: { select: { packageName: true, category: true } }, service: { select: { serviceName: true } } },
    });

    const totalBookings = allBookings.length;
    const completedBookings = allBookings.filter(b => b.status === 'COMPLETED').length;

    const paymentWhere = [];
    if (serviceIds.length) paymentWhere.push({ booking: { serviceId: { in: serviceIds } } });
    if (packageIds.length) paymentWhere.push({ booking: { packageId: { in: packageIds } } });

    const paymentsWhereClause = paymentWhere.length
      ? { OR: paymentWhere, status: { in: ['HELD_IN_ESCROW', 'RELEASED'] } }
      : { status: { in: ['HELD_IN_ESCROW', 'RELEASED'] } };
    if (dateFilter) paymentsWhereClause.createdAt = dateFilter;

    const payments = serviceIds.length || packageIds.length
      ? await prisma.payment.findMany({
          where: paymentsWhereClause,
          include: { booking: { include: { customer: { select: { name: true } }, service: { select: { serviceName: true } }, package: { select: { packageName: true, category: true } } } } },
          orderBy: { createdAt: 'desc' },
        })
      : [];
    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const reviews = await prisma.review.findMany({
      where: { vendorId },
      select: { rating: true },
    });
    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyPayments = serviceIds.length || packageIds.length
      ? await prisma.payment.findMany({
          where: { ...paymentsWhereClause, createdAt: { gte: sixMonthsAgo } },
          select: { amount: true, createdAt: true },
        })
      : [];
    const revenueData = {};
    const bookingTrendsData = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('en-US', { month: 'short' });
      revenueData[key] = 0;
      bookingTrendsData[key] = 0;
    }
    for (const p of monthlyPayments) {
      const key = p.createdAt.toLocaleString('en-US', { month: 'short' });
      revenueData[key] = (revenueData[key] || 0) + parseFloat(p.amount);
    }
    for (const b of allBookings) {
      const key = b.eventDate.toLocaleString('en-US', { month: 'short' });
      bookingTrendsData[key] = (bookingTrendsData[key] || 0) + 1;
    }
    const revenueChart = Object.entries(revenueData).map(([month, revenue]) => ({ month, revenue: Math.round(revenue) }));
    const bookingTrends = Object.entries(bookingTrendsData).map(([month, bookings]) => ({ month, bookings }));

    const categoryCount = {};
    for (const b of allBookings) {
      const cat = b.package?.category || b.service?.serviceName || 'Other';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    }
    const packagePerformance = Object.entries(categoryCount).map(([name, value], i) => ({
      name,
      value,
      color: ['#D4AF37', '#C8A646', '#B8973C', '#E8C547', '#F0D878'][i % 5],
    }));

    const categoryRevenue = {};
    for (const p of payments) {
      const cat = p.booking?.package?.category || p.booking?.service?.serviceName || 'Other';
      categoryRevenue[cat] = (categoryRevenue[cat] || 0) + parseFloat(p.amount);
    }
    const totalCatRevenue = Object.values(categoryRevenue).reduce((s, v) => s + v, 0) || 1;
    const revenueBreakdown = Object.entries(categoryRevenue).map(([category, amount]) => ({
      category,
      amount: `Rs. ${Math.round(amount).toLocaleString()}`,
      percentage: Math.round((amount / totalCatRevenue) * 100),
    }));

    const customers = await prisma.customer.findMany({ select: { registrationDate: true } });
    const customerGrowth = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('en-US', { month: 'short' });
      customerGrowth[key] = customers.filter(c => new Date(c.registrationDate) <= new Date(d.getFullYear(), d.getMonth() + 1, 0)).length;
    }
    const customerGrowthChart = Object.entries(customerGrowth).map(([month, customers]) => ({ month, customers }));

    const pkgBookings = {};
    for (const b of allBookings) {
      const name = b.package?.packageName || b.service?.serviceName || 'Service';
      pkgBookings[name] = (pkgBookings[name] || 0) + 1;
    }
    const pkgRevenue = {};
    for (const p of payments) {
      const name = p.booking?.package?.packageName || p.booking?.service?.serviceName || 'Service';
      pkgRevenue[name] = (pkgRevenue[name] || 0) + parseFloat(p.amount);
    }
    const topPackages = Object.entries(pkgBookings).map(([name, bookings]) => ({
      name,
      bookings,
      revenue: `Rs. ${Math.round(pkgRevenue[name] || 0).toLocaleString()}`,
    })).sort((a, b) => b.bookings - a.bookings).slice(0, 5);

    const recentTransactions = payments.slice(0, 10).map(p => ({
      id: `TXN-${p.paymentId}`,
      customer: p.booking?.customer?.name || 'Unknown',
      package: p.booking?.package?.packageName || p.booking?.service?.serviceName || 'Service',
      amount: `Rs. ${parseFloat(p.amount).toLocaleString()}`,
      method: p.paymentMethod === 'ONLINE' ? 'Credit Card' : 'Bank Transfer',
      date: p.createdAt.toISOString().split('T')[0],
      status: p.status === 'RELEASED' ? 'Completed' : 'Pending',
    }));

    const result = {
      analyticsCards: [
        { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, change: '+32%', icon: 'DollarSign' },
        { label: 'Total Bookings', value: String(totalBookings), change: '+23%', icon: 'Calendar' },
        { label: 'Completed Events', value: String(completedBookings), change: '+18%', icon: 'TrendingUp' },
        { label: 'Avg Rating', value: avgRating.toFixed(1), change: `+${(avgRating / 5 * 100).toFixed(0)}%`, icon: 'Users' },
      ],
      revenueChart,
      bookingTrends,
      packagePerformance,
      customerGrowth: customerGrowthChart,
      revenueBreakdown,
      topPackages,
      recentTransactions,
    };

    let responseData = result;
    if (type) {
      const filtered = { analyticsCards: result.analyticsCards };
      if (type === 'revenue' || type === 'payment') {
        filtered.revenueChart = result.revenueChart;
        filtered.revenueBreakdown = result.revenueBreakdown;
      }
      if (type === 'booking' || type === 'completion') {
        filtered.bookingTrends = result.bookingTrends;
      }
      if (type === 'package') {
        filtered.packagePerformance = result.packagePerformance;
        filtered.topPackages = result.topPackages;
      }
      if (type === 'customer') {
        filtered.customerGrowth = result.customerGrowth;
      }
      if (type === 'payment') {
        filtered.recentTransactions = result.recentTransactions;
      }
      responseData = filtered;
    }

    const format = req.query.format;
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="vendor-report-${Date.now()}.csv"`);
      let csv = "Metric,Value\n";
      csv += `Total Bookings,${totalBookings}\n`;
      csv += `Completed Bookings,${completedBookings}\n`;
      csv += `Total Revenue,Rs. ${totalRevenue}\n`;
      csv += `Average Rating,${avgRating}\n`;
      return res.status(200).send(csv);
    }

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="vendor-report-${Date.now()}.json"`);
      return res.status(200).send(JSON.stringify(responseData, null, 2));
    }

    return res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===============================================
// 6b. EXPORT REPORT AS PDF
// ===============================================
const exportReportPDF = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { year, month, type } = req.query;
    const dateFilter = buildDateFilter(year, month);

    const vendor = await prisma.vendor.findUnique({ where: { vendorId }, select: { businessName: true } });
    const serviceIds = (await prisma.service.findMany({ where: { vendorId }, select: { serviceId: true } })).map(s => s.serviceId);
    const packageIds = (await prisma.eventPackage.findMany({ where: { vendorId }, select: { packageId: true } })).map(p => p.packageId);

    const bookingWhere = { OR: [...orIn('serviceId', serviceIds), ...orIn('packageId', packageIds)] };
    if (dateFilter) bookingWhere.eventDate = dateFilter;

    const allBookings = await prisma.booking.findMany({ where: bookingWhere, include: { package: { select: { packageName: true } }, service: { select: { serviceName: true } } } });
    const bookingPayments = await prisma.payment.findMany({
      where: { bookingId: { in: allBookings.map(b => b.bookingId) }, status: { in: ['HELD_IN_ESCROW', 'RELEASED'] } },
      select: { amount: true },
    });
    const totalRevenue = bookingPayments.reduce((s, p) => s + parseFloat(p.amount), 0);

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report-${vendor?.businessName || 'vendor'}-${year || 'all'}.pdf"`);
    doc.pipe(res);

    doc.fontSize(20).font('Helvetica-Bold').text('EventNest - Report', { align: 'center' });
    doc.fontSize(14).font('Helvetica').text(vendor?.businessName || 'Vendor', { align: 'center' });
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });
    if (year) doc.text(`Period: ${year}${month ? ` / ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(month)-1]}` : ''}`, { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(12).font('Helvetica-Bold').text('Summary');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`Total Bookings: ${allBookings.length}`);
    doc.text(`Completed: ${allBookings.filter(b => b.status === 'COMPLETED').length}`);
    doc.text(`Total Revenue: Rs. ${Math.round(totalRevenue).toLocaleString()}`);
    doc.moveDown(1);

    if (!type || type === 'booking' || type === 'completion') {
      doc.fontSize(12).font('Helvetica-Bold').text('Booking Details');
      doc.moveDown(0.5);

      const headers = ['Booking ID', 'Customer', 'Event', 'Date', 'Status'];
      const colWidths = [80, 120, 120, 100, 80];
      let y = doc.y;
      doc.fontSize(8).font('Helvetica-Bold');
      doc.rect(40, y, colWidths.reduce((a, b) => a + b, 0), 16).fill('#D4AF37');
      doc.fill('#000000');
      let x = 40;
      headers.forEach((h, i) => { doc.text(h, x + 2, y + 4, { width: colWidths[i], align: 'left' }); x += colWidths[i]; });
      y += 16;
      doc.font('Helvetica').fontSize(7);

      const bookingsToShow = allBookings.slice(0, 50);
      for (const b of bookingsToShow) {
        if (y > 720) { doc.addPage(); y = 40; }
        doc.rect(40, y, colWidths.reduce((a, b) => a + b, 0), 14).stroke('#ddd');
        x = 40;
        const vals = [String(b.bookingId), b.customer?.name || '-', b.package?.packageName || b.service?.serviceName || 'Event', b.eventDate ? new Date(b.eventDate).toLocaleDateString() : '-', b.status];
        vals.forEach((v, i) => { doc.text(v, x + 2, y + 3, { width: colWidths[i], align: 'left' }); x += colWidths[i]; });
        y += 14;
      }
      doc.moveDown(1);
    }

    if (!type || type === 'revenue' || type === 'payment') {
      if (doc.y > 700) { doc.addPage(); }
      doc.fontSize(12).font('Helvetica-Bold').text('Transactions', doc.x, doc.y + 10);
      doc.moveDown(0.5);

      const paymentWhere = [];
      if (serviceIds.length) paymentWhere.push({ booking: { serviceId: { in: serviceIds } } });
      if (packageIds.length) paymentWhere.push({ booking: { packageId: { in: packageIds } } });
      const pwc = paymentWhere.length ? { OR: paymentWhere, status: { in: ['HELD_IN_ESCROW', 'RELEASED'] } } : { status: { in: ['HELD_IN_ESCROW', 'RELEASED'] } };
      if (dateFilter) pwc.createdAt = dateFilter;

      const payments = (serviceIds.length || packageIds.length)
        ? await prisma.payment.findMany({ where: pwc, include: { booking: { include: { customer: { select: { name: true } }, package: { select: { packageName: true } } } } }, orderBy: { createdAt: 'desc' }, take: 50 })
        : [];

      const txHeaders = ['TXN ID', 'Customer', 'Package', 'Amount', 'Date'];
      const txColWidths = [70, 110, 120, 80, 100];
      let ty = doc.y;
      doc.fontSize(8).font('Helvetica-Bold');
      doc.rect(40, ty, txColWidths.reduce((a, b) => a + b, 0), 16).fill('#D4AF37');
      doc.fill('#000000');
      let tx = 40;
      txHeaders.forEach((h, i) => { doc.text(h, tx + 2, ty + 4, { width: txColWidths[i], align: 'left' }); tx += txColWidths[i]; });
      ty += 16;
      doc.font('Helvetica').fontSize(7);

      for (const p of payments) {
        if (ty > 720) { doc.addPage(); ty = 40; }
        doc.rect(40, ty, txColWidths.reduce((a, b) => a + b, 0), 14).stroke('#ddd');
        tx = 40;
        const vals = [`TXN-${p.paymentId}`, p.booking?.customer?.name || '-', p.booking?.package?.packageName || 'Service', `Rs. ${parseFloat(p.amount).toLocaleString()}`, new Date(p.createdAt).toLocaleDateString()];
        vals.forEach((v, i) => { doc.text(v, tx + 2, ty + 3, { width: txColWidths[i], align: 'left' }); tx += txColWidths[i]; });
        ty += 14;
      }
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===============================================
// 6c. EXPORT REPORT AS EXCEL
// ===============================================
const exportReportExcel = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { year, month, type } = req.query;
    const dateFilter = buildDateFilter(year, month);

    const vendor = await prisma.vendor.findUnique({ where: { vendorId }, select: { businessName: true } });
    const serviceIds = (await prisma.service.findMany({ where: { vendorId }, select: { serviceId: true } })).map(s => s.serviceId);
    const packageIds = (await prisma.eventPackage.findMany({ where: { vendorId }, select: { packageId: true } })).map(p => p.packageId);

    const bookingWhere = { OR: [...orIn('serviceId', serviceIds), ...orIn('packageId', packageIds)] };
    if (dateFilter) bookingWhere.eventDate = dateFilter;

    const allBookings = await prisma.booking.findMany({
      where: bookingWhere,
      include: { customer: { select: { name: true, email: true } }, package: { select: { packageName: true } }, service: { select: { serviceName: true } } },
      orderBy: { eventDate: 'desc' },
    });

    const paymentWhere = [];
    if (serviceIds.length) paymentWhere.push({ booking: { serviceId: { in: serviceIds } } });
    if (packageIds.length) paymentWhere.push({ booking: { packageId: { in: packageIds } } });
    const pwc = paymentWhere.length ? { OR: paymentWhere, status: { in: ['HELD_IN_ESCROW', 'RELEASED'] } } : { status: { in: ['HELD_IN_ESCROW', 'RELEASED'] } };
    if (dateFilter) pwc.createdAt = dateFilter;

    const payments = (serviceIds.length || packageIds.length)
      ? await prisma.payment.findMany({ where: pwc, include: { booking: { include: { customer: { select: { name: true } }, package: { select: { packageName: true } } } } }, orderBy: { createdAt: 'desc' } })
      : [];

    const wb = new ExcelJS.Workbook();
    wb.creator = 'EventNest';
    wb.created = new Date();

    if (!type || type === 'summary' || type === 'revenue' || type === 'booking') {
      const ws = wb.addWorksheet('Summary');
      ws.columns = [
        { header: 'Metric', key: 'metric', width: 25 },
        { header: 'Value', key: 'value', width: 20 },
      ];
      ws.addRow({ metric: 'Business Name', value: vendor?.businessName || '-' });
      ws.addRow({ metric: 'Report Period', value: year || 'All Time' });
      ws.addRow({ metric: 'Generated', value: new Date().toLocaleDateString() });
      ws.addRow({});
      ws.addRow({ metric: 'Total Bookings', value: allBookings.length });
      ws.addRow({ metric: 'Completed', value: allBookings.filter(b => b.status === 'COMPLETED').length });
      ws.addRow({ metric: 'Pending', value: allBookings.filter(b => b.status === 'PENDING').length });
      ws.addRow({ metric: 'Total Revenue', value: `Rs. ${payments.reduce((s, p) => s + parseFloat(p.amount), 0).toLocaleString()}` });
      ws.addRow({ metric: 'Total Transactions', value: payments.length });
      ws.getRow(1).font = { bold: true };
    }

    if (!type || type === 'booking' || type === 'completion') {
      const ws = wb.addWorksheet('Bookings');
      ws.columns = [
        { header: 'Booking ID', key: 'id', width: 12 },
        { header: 'Customer', key: 'customer', width: 20 },
        { header: 'Email', key: 'email', width: 28 },
        { header: 'Event', key: 'event', width: 20 },
        { header: 'Event Date', key: 'date', width: 14 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Total Amount', key: 'amount', width: 14 },
      ];
      for (const b of allBookings) {
        ws.addRow({
          id: b.bookingId,
          customer: b.customer?.name || '-',
          email: b.customer?.email || '-',
          event: b.package?.packageName || b.service?.serviceName || 'Event',
          date: b.eventDate ? new Date(b.eventDate).toLocaleDateString() : '-',
          status: b.status,
          amount: '-',
        });
      }
      ws.getRow(1).font = { bold: true };
    }

    if (!type || type === 'revenue' || type === 'payment') {
      const ws = wb.addWorksheet('Transactions');
      ws.columns = [
        { header: 'Transaction ID', key: 'id', width: 16 },
        { header: 'Customer', key: 'customer', width: 20 },
        { header: 'Package', key: 'package', width: 20 },
        { header: 'Amount', key: 'amount', width: 14 },
        { header: 'Method', key: 'method', width: 14 },
        { header: 'Date', key: 'date', width: 14 },
        { header: 'Status', key: 'status', width: 12 },
      ];
      for (const p of payments) {
        ws.addRow({
          id: `TXN-${p.paymentId}`,
          customer: p.booking?.customer?.name || 'Unknown',
          package: p.booking?.package?.packageName || 'Service',
          amount: `Rs. ${parseFloat(p.amount).toLocaleString()}`,
          method: p.paymentMethod === 'ONLINE' ? 'Credit Card' : 'Bank Transfer',
          date: new Date(p.createdAt).toLocaleDateString(),
          status: p.status === 'RELEASED' ? 'Completed' : 'Pending',
        });
      }
      ws.getRow(1).font = { bold: true };
    }

    if (!type || type === 'package') {
      const ws = wb.addWorksheet('Packages');
      ws.columns = [
        { header: 'Package Name', key: 'name', width: 25 },
        { header: 'Bookings', key: 'bookings', width: 12 },
        { header: 'Revenue', key: 'revenue', width: 16 },
      ];
      const pkgMap = {};
      for (const b of allBookings) {
        const n = b.package?.packageName || b.service?.serviceName || 'Service';
        if (!pkgMap[n]) pkgMap[n] = { bookings: 0, revenue: 0 };
        pkgMap[n].bookings++;
      }
      for (const p of payments) {
        const n = p.booking?.package?.packageName || p.booking?.service?.serviceName || 'Service';
        if (!pkgMap[n]) pkgMap[n] = { bookings: 0, revenue: 0 };
        pkgMap[n].revenue += parseFloat(p.amount);
      }
      Object.entries(pkgMap).sort((a, b) => b[1].bookings - a[1].bookings).forEach(([name, data]) => {
        ws.addRow({ name, bookings: data.bookings, revenue: `Rs. ${Math.round(data.revenue).toLocaleString()}` });
      });
      ws.getRow(1).font = { bold: true };
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="report-${vendor?.businessName || 'vendor'}-${year || 'all'}.xlsx"`);
    await wb.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===============================================
// 7. GET VENDOR'S OWN SERVICES
// ===============================================
const getMyServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { vendorId: parseInt(req.user.id) },
      include: {
        category: { select: { categoryId: true, categoryName: true } },
        bookings: { select: { bookingId: true } },
        reviews: { select: { reviewId: true, rating: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(services);
  } catch (error) {
    console.error('getMyServices error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===============================================
// 8. GET VENDOR'S OWN PRODUCTS
// ===============================================
const getMyProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { vendorId: req.user.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===============================================
// 9. GET VENDOR PAYMENTS
// ===============================================
const getVendorPayments = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const serviceIds = (await prisma.service.findMany({ where: { vendorId }, select: { serviceId: true } })).map(s => s.serviceId);
    const packageIds = (await prisma.eventPackage.findMany({ where: { vendorId }, select: { packageId: true } })).map(p => p.packageId);

    const paymentWhere = [];
    if (serviceIds.length) paymentWhere.push({ booking: { serviceId: { in: serviceIds } } });
    if (packageIds.length) paymentWhere.push({ booking: { packageId: { in: packageIds } } });

    const payments = paymentWhere.length
      ? await prisma.payment.findMany({
          where: {
            OR: paymentWhere,
            status: { in: ['HELD_IN_ESCROW', 'RELEASED'] },
          },
          include: {
            booking: {
              include: {
                customer: { select: { name: true } },
                service: { select: { serviceName: true } },
                package: { select: { packageName: true, category: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        })
      : [];

    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const revenueChart = await getMonthlyRevenue(serviceIds, packageIds);
    const revenueBreakdown = getRevenueBreakdown(payments);
    const recentTransactions = payments.slice(0, 10).map(p => ({
      id: `TXN-${p.paymentId}`,
      customer: p.booking?.customer?.name || 'Unknown',
      package: p.booking?.package?.packageName || p.booking?.service?.serviceName || 'Service',
      amount: `Rs. ${parseFloat(p.amount).toLocaleString()}`,
      method: p.paymentMethod === 'ONLINE' ? 'Credit Card' : 'Bank Transfer',
      date: p.createdAt.toISOString().split('T')[0],
      status: p.status === 'RELEASED' ? 'Completed' : 'Pending',
    }));

    res.status(200).json({
      analyticsCards: [
        { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, change: '+0%', icon: 'DollarSign' },
        { label: 'Total Transactions', value: String(payments.length), change: '+0%', icon: 'CreditCard' },
        { label: 'Pending Payments', value: payments.filter(p => p.status !== 'RELEASED').length.toString(), change: '0', icon: 'Clock' },
      ],
      revenueChart,
      revenueBreakdown,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

async function getMonthlyRevenue(serviceIds, packageIds) {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const where = {
    status: { in: ['HELD_IN_ESCROW', 'RELEASED'] },
    createdAt: { gte: sixMonthsAgo },
  };
  if (serviceIds.length) where.booking = { serviceId: { in: serviceIds } };

  const payments = await prisma.payment.findMany({ where, select: { amount: true, createdAt: true } });
  const byMonth = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    byMonth[d.toLocaleString('en-US', { month: 'short' })] = 0;
  }
  for (const p of payments) {
    const key = p.createdAt.toLocaleString('en-US', { month: 'short' });
    byMonth[key] = (byMonth[key] || 0) + parseFloat(p.amount);
  }
  return Object.entries(byMonth).map(([month, revenue]) => ({ month, revenue: Math.round(revenue) }));
}

function getRevenueBreakdown(payments) {
  const byCategory = {};
  for (const p of payments) {
    const cat = p.booking?.package?.category || p.booking?.service?.serviceName || 'Other';
    byCategory[cat] = (byCategory[cat] || 0) + parseFloat(p.amount);
  }
  const total = Object.values(byCategory).reduce((s, v) => s + v, 0) || 1;
  return Object.entries(byCategory).map(([category, amount]) => ({
    category,
    amount: `Rs. ${Math.round(amount).toLocaleString()}`,
    percentage: Math.round((amount / total) * 100),
  }));
}

module.exports = {
  getAllVendors,
  getVendorById,
  getMyProfile,
  updateMyProfile,
  getDashboard,
  getReports,
  exportReportPDF,
  exportReportExcel,
  getMyServices,
  getMyProducts,
  getVendorPayments,
};