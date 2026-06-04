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


    const paymentStatus = paymentMethod === 'ONLINE' ? 'HELD_IN_ESCROW' : 'PENDING';

    const payment = await prisma.payment.create({
      data: {
        bookingId: bookingId ? parseInt(bookingId) : null,
        orderId: orderId ? parseInt(orderId) : null,
        amount: parseFloat(amount),
        paymentMethod: paymentMethod, // "ONLINE" or "BANK_SLIP"
        transactionId: transactionId || null,
        receiptUrl: receiptUrl || null,
        status: paymentStatus,
        paidAt: paymentMethod === 'ONLINE' ? new Date() : null,
      }
    });


    if (orderId && paymentStatus === 'HELD_IN_ESCROW') {
      await prisma.order.update({
        where: { orderId: parseInt(orderId) },
        data: { status: 'PROCESSING' }
      });
    }

    res.status(201).json({ 
      message: paymentMethod === 'ONLINE' 
        ? "Payment successful! Funds are held in securely in Escrow." 
        : "Bank slip uploaded! Awaiting admin verification.", 
      payment 
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
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
  getMyPayments
};