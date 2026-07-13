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
      },
    });

    res.status(201).json({ message: "Product added successfully.", product });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ===============================================
// 2. GET SELLER'S PRODUCTS (For Seller)
// ===============================================
const getSellerProducts = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const products = await prisma.product.findMany({
      where: { vendorId },
      include: {
        category: { select: { categoryName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 3. GET ALL PRODUCTS (For everyone)
// ===============================================
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        vendor: { 
          select: { businessName: true }
        },
        category: true
      }
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ===============================================
// 4. GET A SINGLE PRODUCT BY ID (For everyone)
// ===============================================
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        productId: parseInt(id),
      },
      include: {
        vendor: { select: { businessName: true, location: true } },
        category: { select: { categoryName: true, categoryId: true } },
        reviews: { 
          include: {
            customer: { select: { name: true } }
          }
        }
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 5. UPDATE A PRODUCT (For Seller)
// ===============================================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, price, quantity, description, categoryId, imageUrl } = req.body;
    const vendorId = req.user.id;

    // Check if product belongs to this vendor
    const existingProduct = await prisma.product.findUnique({
      where: { productId: parseInt(id) }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (existingProduct.vendorId !== vendorId) {
      return res.status(403).json({ message: "You don't have permission to update this product." });
    }

    const updatedProduct = await prisma.product.update({
      where: { productId: parseInt(id) },
      data: {
        productName,
        price: price ? parseFloat(price) : undefined,
        quantity: quantity ? parseInt(quantity) : undefined,
        description,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        imageUrl,
      },
    });

    res.status(200).json({ message: "Product updated successfully!", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===============================================
// 6. DELETE A PRODUCT (For Seller)
// ===============================================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user.id;

    // Check if product belongs to this vendor
    const existingProduct = await prisma.product.findUnique({
      where: { productId: parseInt(id) }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (existingProduct.vendorId !== vendorId) {
      return res.status(403).json({ message: "You don't have permission to delete this product." });
    }

    await prisma.product.delete({
      where: { productId: parseInt(id) }
    });

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  addProduct,
  getSellerProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};