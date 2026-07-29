const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===========================================
// 1. MAKE A PAYMENT (For Booking or Order)
// ===========================================
const makePayment = async (req, res) => {
  try {
    const { bookingId, orderId, amount, paymentMethod, transactionId, receiptUrl } = req.body;

    if (!bookingId && !orderId) {
      return res.status(400).json({ message: "Please provide either a bookingId or an orderId." });
    }

    const numericOrderId = orderId ? parseInt(orderId, 10) : null;
    const numericBookingId = bookingId ? parseInt(bookingId, 10) : null;

    // Validate existence of order if orderId provided
    if (numericOrderId) {
      const orderObj = await prisma.order.findUnique({ where: { orderId: numericOrderId } });
      if (!orderObj) {
        return res.status(404).json({ message: "Order not found." });
      }

      // Check if payment already exists for this order
      const existingPayment = await prisma.payment.findUnique({ where: { orderId: numericOrderId } });
      if (existingPayment) {
        return res.status(200).json({ 
          message: "Payment for this order has already been processed.", 
          payment: existingPayment 
        });
      }
    }

    // Validate existence of booking if bookingId provided
    if (numericBookingId) {
      const bookingObj = await prisma.booking.findUnique({ where: { bookingId: numericBookingId } });
      if (!bookingObj) {
        return res.status(404).json({ message: "Booking not found." });
      }

      // Check if payment already exists for this booking
      const existingPayment = await prisma.payment.findUnique({ where: { bookingId: numericBookingId } });
      if (existingPayment) {
        return res.status(200).json({ 
          message: "Payment for this booking has already been processed.", 
          payment: existingPayment 
        });
      }
    }

    const paymentStatus = paymentMethod === 'ONLINE' ? 'HELD_IN_ESCROW' : 'PENDING';

    const payment = await prisma.payment.create({
      data: {
        bookingId: numericBookingId,
        orderId: numericOrderId,
        amount: parseFloat(amount) || 0,
        paymentMethod: paymentMethod || 'ONLINE',
        transactionId: transactionId || null,
        receiptUrl: receiptUrl || null,
        status: paymentStatus,
        paidAt: paymentMethod === 'ONLINE' ? new Date() : null,
      }
    });

    if (numericOrderId && paymentStatus === 'HELD_IN_ESCROW') {
      await prisma.order.update({
        where: { orderId: numericOrderId },
        data: { status: 'PROCESSING' }
      });
    }

    res.status(201).json({ 
      message: paymentMethod === 'ONLINE' 
        ? "Payment successful! Funds are held securely in Escrow." 
        : "Bank slip uploaded! Awaiting admin verification.", 
      payment 
    });

  } catch (error) {
    console.error('makePayment Error:', error);
    res.status(500).json({ message: error.message || "Server Error processing payment.", error: error.message });
  }
};


// ===========================================
// 2. GET MY PAYMENTS (Customer)
// ===========================================
const getMyPayments = async (req, res) => {
  try {
    const customerId = req.user.id;

 
    const payments = await prisma.payment.findMany({
      where: {
        OR: [
          { booking: { customerId: customerId } },
          { order: { customerId: customerId } }
        ]
      },
      include: {
        booking: { select: { eventDate: true, service: { select: { serviceName: true } } } },
        order: { select: { orderDate: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  makePayment,
  getMyPayments,
  getPaymentHistory: getMyPayments
};