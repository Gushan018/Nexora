const { PrismaClient } = require('@prisma/client');
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
// 2. APPROVE A VENDOR
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
// 3. RELEASE ESCROW PAYMENT TO VENDOR
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
  approveVendor,
  releasePayment
};