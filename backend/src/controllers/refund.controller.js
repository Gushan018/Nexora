const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Customer creates refund request for an order
const requestRefund = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { orderId, reason, amount } = req.body;

    if (!orderId || !reason) {
      return res.status(400).json({ message: "orderId and reason are required." });
    }

    const order = await prisma.order.findUnique({
      where: { orderId: parseInt(orderId) }
    });

    if (!order || order.customerId !== customerId) {
      return res.status(404).json({ message: "Order not found." });
    }

    const existingRefund = await prisma.refundRequest.findFirst({
      where: { orderId: parseInt(orderId), status: 'PENDING' }
    });

    if (existingRefund) {
      return res.status(400).json({ message: "A pending refund request already exists for this order." });
    }

    const refund = await prisma.refundRequest.create({
      data: {
        orderId: parseInt(orderId),
        customerId,
        reason,
        amount: amount ? parseFloat(amount) : parseFloat(order.totalAmount),
        status: 'PENDING'
      }
    });

    res.status(201).json({ message: "Refund request submitted successfully", refund });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Customer views their refund requests
const getMyRefundRequests = async (req, res) => {
  try {
    const customerId = req.user.id;
    const refunds = await prisma.refundRequest.findMany({
      where: { customerId },
      include: {
        order: { select: { orderDate: true, totalAmount: true, status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(refunds);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Seller / Vendor views refund requests for their orders
const getSellerRefundRequests = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const vendorProducts = await prisma.product.findMany({
      where: { vendorId },
      select: { productId: true }
    });
    const productIds = vendorProducts.map(p => p.productId);

    const refunds = await prisma.refundRequest.findMany({
      where: {
        order: {
          orderItems: {
            some: { productId: { in: productIds } }
          }
        }
      },
      include: {
        customer: { select: { name: true, email: true } },
        order: {
          include: {
            orderItems: {
              include: { product: { select: { productName: true } } }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(refunds);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Seller / Vendor updates refund request status (APPROVED / REJECTED)
const updateRefundStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, sellerNotes } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be APPROVED or REJECTED." });
    }

    const refund = await prisma.refundRequest.update({
      where: { refundId: parseInt(id) },
      data: {
        status,
        sellerNotes: sellerNotes || null
      }
    });

    if (status === 'APPROVED') {
      await prisma.order.update({
        where: { orderId: refund.orderId },
        data: { status: 'CANCELLED' }
      });
    }

    res.status(200).json({ message: `Refund request ${status.toLowerCase()}`, refund });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  requestRefund,
  getMyRefundRequests,
  getSellerRefundRequests,
  updateRefundStatus
};
