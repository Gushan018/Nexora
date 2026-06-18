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
    cart.cartItems.forEach(item => {
      totalAmount += (item.quantity * parseFloat(item.product.price));
    });


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

module.exports = {
  placeOrder,
  getMyOrders
};