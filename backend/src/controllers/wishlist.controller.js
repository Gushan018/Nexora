const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getWishlist = async (req, res) => {
  try {
    const customerId = parseInt(req.user.id);
    if (!prisma.wishlist) {
      return res.status(200).json([]);
    }
    const wishlist = await prisma.wishlist.findMany({
      where: { customerId },
      include: {
        product: { include: { vendor: true } },
        service: { include: { vendor: true } },
        package: { include: { vendor: true } },
      }
    });
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const customerId = parseInt(req.user.id);
    const { productId, serviceId, packageId } = req.body;

    if (!prisma.wishlist) {
      return res.status(200).json({ message: "Wishlist feature unavailable.", item: null });
    }

    const existing = await prisma.wishlist.findFirst({
      where: {
        customerId,
        OR: [
          { productId: productId || -1 },
          { serviceId: serviceId || -1 },
          { packageId: packageId || -1 }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Item already in wishlist." });
    }

    const newItem = await prisma.wishlist.create({
      data: {
        customerId,
        productId,
        serviceId,
        packageId
      }
    });

    res.status(201).json({ message: "Added to wishlist.", item: newItem });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = parseInt(req.user.id);

    if (!prisma.wishlist) {
      return res.status(200).json({ message: "Removed from wishlist." });
    }

    await prisma.wishlist.delete({
      where: {
        wishlistId: parseInt(id),
        customerId
      }
    });

    res.status(200).json({ message: "Removed from wishlist." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
