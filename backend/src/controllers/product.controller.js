const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===============================================
// 1. ADD A NEW PRODUCT (For Seller)
// ===============================================
const addProduct = async (req, res) => {
  try {
    const { productName, price, quantity, description, categoryId } = req.body;
    const vendorId = req.user.id; 

    const product = await prisma.product.create({
      data: {
        productName,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description,
        vendorId,
        categoryId: categoryId ? parseInt(categoryId) : null,
        isApproved: false, 
      },
    });

    res.status(201).json({ message: "Product added successfully. Awaiting admin approval.", product });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ===============================================
// 2. GET ALL APPROVED PRODUCTS (For everyone)
// ===============================================
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isApproved: true }, 
      include: {
        vendor: { 
          select: { businessName: true }
        }
      }
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ===============================================
// 3. GET A SINGLE PRODUCT BY ID (For everyone)
// ===============================================
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        productId: parseInt(id),
        isApproved: true,
      },
      include: {
        vendor: { select: { businessName: true, location: true } },
        reviews: { 
          include: {
            customer: { select: { name: true } }
          }
        }
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found or not approved." });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
};