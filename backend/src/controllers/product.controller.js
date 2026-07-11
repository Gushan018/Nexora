const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===============================================
// 1. ADD A NEW PRODUCT (For Seller)
// ===============================================
const addProduct = async (req, res) => {
  try {
    const { productName, price, quantity, description, categoryId, imageUrl } = req.body;
    const vendorId = req.user.id; 

    const product = await prisma.product.create({
      data: {
        productName,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description,
        imageUrl,
        vendorId,
        categoryId: categoryId ? parseInt(categoryId) : null,
        isApproved: true, 
      },
    });

    res.status(201).json({ message: "Product added successfully.", product });
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
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid product ID format." });
    }
    const product = await prisma.product.findFirst({
      where: {
        productId: numericId,
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

const updateProduct = async (req, res) => {
  try {
    const existing = await prisma.product.findFirst({ where: { productId: parseInt(req.params.id), vendorId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'Product not found' });
    const { productName, price, quantity, description, categoryId, imageUrl } = req.body;
    const product = await prisma.product.update({
      where: { productId: parseInt(req.params.id) },
      data: {
        productName,
        price: price ? parseFloat(price) : undefined,
        quantity: quantity !== undefined ? parseInt(quantity) : undefined,
        description,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        categoryId: categoryId !== undefined ? (categoryId ? parseInt(categoryId) : null) : undefined
      },
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const existing = await prisma.product.findFirst({ where: { productId: parseInt(req.params.id), vendorId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'Product not found' });
    await prisma.product.delete({ where: { productId: parseInt(req.params.id) } });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

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

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
};