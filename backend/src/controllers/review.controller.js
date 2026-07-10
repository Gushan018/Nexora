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

const getSellerReviews = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const reviews = await prisma.review.findMany({
      where: {
        OR: [
          { vendorId: vendorId },
          { product: { vendorId: vendorId } },
          { service: { vendorId: vendorId } }
        ]
      },
      include: {
        customer: { select: { name: true, profileImage: true } },
        product: { select: { productName: true } },
        service: { select: { serviceName: true } }
      },
      orderBy: { reviewDate: 'desc' }
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const vendorId = req.user.id;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: "Reply text is required." });
    }

    const review = await prisma.review.findUnique({
      where: { reviewId: parseInt(id) }
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    const updated = await prisma.review.update({
      where: { reviewId: parseInt(id) },
      data: {
        vendorReply: reply.trim(),
        vendorReplyDate: new Date()
      }
    });

    res.status(200).json({ message: "Reply submitted successfully.", review: updated });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteReviewReply = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user.id;

    const review = await prisma.review.findUnique({
      where: { reviewId: parseInt(id) }
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    const updated = await prisma.review.update({
      where: { reviewId: parseInt(id) },
      data: {
        vendorReply: null,
        vendorReplyDate: null
      }
    });

    res.status(200).json({ message: "Reply deleted successfully.", review: updated });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const reportReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const vendorId = req.user.id;

    const review = await prisma.review.findUnique({
      where: { reviewId: parseInt(id) }
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    const updated = await prisma.review.update({
      where: { reviewId: parseInt(id) },
      data: {
        isReported: true,
        reportReason: reason || null
      }
    });

    res.status(200).json({ message: "Review reported successfully.", review: updated });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const unreportReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { reviewId: parseInt(id) }
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    const updated = await prisma.review.update({
      where: { reviewId: parseInt(id) },
      data: {
        isReported: false,
        reportReason: null
      }
    });

    res.status(200).json({ message: "Report removed successfully.", review: updated });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  submitReview,
  getMyReviews,
  getSellerReviews,
  replyToReview,
  deleteReviewReply,
  reportReview,
  unreportReview
};
