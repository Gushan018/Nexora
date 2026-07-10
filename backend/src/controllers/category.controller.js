const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===============================================
// 1. GET ALL SERVICE CATEGORIES
// ===============================================
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { categoryName: 'asc' }
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllCategories
};