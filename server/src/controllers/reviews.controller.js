const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getVendorReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await prisma.review.findMany({
      where: { vendorId: parseInt(id) },
      include: { customer: { select: { name: true, contactNumber: true } }, service: { select: { serviceName: true } }, product: { select: { productName: true } } },
      orderBy: { reviewDate: 'desc' },
    });
    const avg = await prisma.review.aggregate({ where: { vendorId: parseInt(id) }, _avg: { rating: true }, _count: { rating: true } });
    res.status(200).json({ reviews, averageRating: avg._avg.rating || 0, totalReviews: avg._count.rating || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getServiceReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await prisma.review.findMany({
      where: { serviceId: parseInt(id) },
      include: { customer: { select: { name: true } } },
      orderBy: { reviewDate: 'desc' },
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(id) },
      include: { customer: { select: { name: true } } },
      orderBy: { reviewDate: 'desc' },
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { rating, comment, vendorId, serviceId, productId } = req.body;
    if (!rating || !vendorId) return res.status(400).json({ message: 'Rating and vendorId are required' });
    const review = await prisma.review.create({
      data: { rating: parseInt(rating), comment, customerId: req.user.id, vendorId: parseInt(vendorId), serviceId: serviceId ? parseInt(serviceId) : null, productId: productId ? parseInt(productId) : null },
    });
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const existing = await prisma.review.findFirst({ where: { reviewId: parseInt(req.params.id), customerId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'Review not found' });
    await prisma.review.delete({ where: { reviewId: parseInt(req.params.id) } });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getVendorReviews, getServiceReviews, getProductReviews, createReview, deleteReview };
