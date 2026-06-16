const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        vendorType: true,
        isApproved: true,
        eventPackages: true,
        services: {
          include: { category: true }
        },
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

module.exports = {
  getAllVendors,
  getVendorById,
};