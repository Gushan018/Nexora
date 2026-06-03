const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const submitReview = async (req, res) => {
  try {
    const { rating, comment, vendorId, serviceId, productId } = req.body;
    const customerId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Valid rating (1-5) is required." });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        customerId,
        vendorId: vendorId ? parseInt(vendorId) : null,
        serviceId: serviceId ? parseInt(serviceId) : null,
        productId: productId ? parseInt(productId) : null,
      }
    });

    res.status(201).json({ message: "Review submitted successfully!", review });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const customerId = req.user.id;
    const reviews = await prisma.review.findMany({
      where: { customerId },
      include: {
        vendor: { select: { businessName: true } },
        service: { select: { serviceName: true } },
        product: { select: { productName: true } }
      },
      orderBy: { reviewDate: 'desc' }
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  submitReview,
  getMyReviews
};
