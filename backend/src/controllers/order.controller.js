const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===========================================
// 1. PLACE AN ORDER (Customer Checkout)
// ===========================================
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const customerId = req.user.id;


    const cart = await prisma.cart.findUnique({
      where: { customerId },
      include: {
        cartItems: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }


    let totalAmount = 0;
    for (const item of cart.cartItems) {
      if (item.quantity > item.product.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${item.product.productName}. Available: ${item.product.quantity}` });
      }
      totalAmount += (item.quantity * parseFloat(item.product.price));
    }


    const newOrder = await prisma.$transaction(async (prisma) => {
      

      const order = await prisma.order.create({
        data: {
          customerId,
          shippingAddress,
          totalAmount,
          status: 'PENDING'
        }
      });


      const orderItemsData = cart.cartItems.map(item => ({
        orderId: order.orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product.price
      }));

      await prisma.orderItem.createMany({
        data: orderItemsData
      });

      // Decrement product stock
      for (const item of cart.cartItems) {
        await prisma.product.update({
          where: { productId: item.productId },
          data: { quantity: { decrement: item.quantity } }
        });
      }

 
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.cartId }
      });

      return order;
    });

    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 2. GET MY ORDERS (Customer)
// ===========================================
const getMyOrders = async (req, res) => {
  try {
    const customerId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { customerId },
      include: {
        customer: { select: { name: true, email: true } },
        orderItems: {
          include: {
            product: { select: { productName: true, imageUrl: true } }
          }
        }
      },
      orderBy: { orderDate: 'desc' }
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 3. GET SELLER ORDERS (Seller)
// ===========================================
const getSellerOrders = async (req, res) => {
  try {
    const vendorId = req.user.id;

    // Find all order items that belong to this seller's products
    const orderItems = await prisma.orderItem.findMany({
      where: {
        product: {
          vendorId: vendorId
        }
      },
      include: {
        order: {
          include: {
            customer: {
              select: { name: true, email: true, contactNumber: true }
            }
          },
          select: {
            orderId: true,
            orderDate: true,
            status: true,
            shippingAddress: true,
            totalAmount: true,
            customer: true
          }
        },
        product: {
          select: { productName: true, imageUrl: true, price: true }
        }
      },
      orderBy: {
        order: {
          orderDate: 'desc'
        }
      }
    });

    // Group items by orderId for better UI representation if needed
    // But for now, returning raw items is fine as well.
    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ===========================================
// 4. UPDATE ORDER STATUS (Seller/Admin)
// ===========================================
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const vendorId = req.user.id;

    // Security Check: Verify that the seller owns at least one product in this order
    // (Admins can bypass this if we wanted, but for now we stick to seller/vendor role)
    if (req.user.role !== 'admin') {
      const sellerItem = await prisma.orderItem.findFirst({
        where: {
          orderId: parseInt(id),
          product: {
            vendorId: vendorId
          }
        }
      });

      if (!sellerItem) {
        return res.status(403).json({ message: "You are not authorized to update this order's status as it contains none of your products." });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { orderId: parseInt(id) },
      data: { status }
    });

    if (status === 'DELIVERED') {
      const payment = await prisma.payment.findUnique({
        where: { orderId: parseInt(id) }
      });

      if (payment && payment.status === 'HELD_IN_ESCROW') {
        await prisma.payment.update({
          where: { paymentId: payment.paymentId },
          data: { status: 'RELEASED' }
        });
      }
    } else if (status === 'CANCELLED') {
      const payment = await prisma.payment.findUnique({
        where: { orderId: parseInt(id) }
      });

      if (payment && (payment.status === 'HELD_IN_ESCROW' || payment.status === 'PENDING')) {
        await prisma.payment.update({
          where: { paymentId: payment.paymentId },
          data: { status: 'REFUNDED' }
        });
      }
    }

    res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus
};