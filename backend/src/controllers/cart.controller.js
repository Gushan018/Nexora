const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===========================================
// 1. ADD ITEM TO CART (Customer)
// ===========================================
const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const customerId = req.user.id;


    const cart = await prisma.cart.findUnique({
      where: { customerId },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this customer." });
    }


    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.cartId,
        productId: parseInt(productId),
      },
    });

    if (existingCartItem) {
   
      await prisma.cartItem.update({
        where: { cartItemId: existingCartItem.cartItemId },
        data: { quantity: existingCartItem.quantity + parseInt(quantity) },
      });
    } else {
  
      await prisma.cartItem.create({
        data: {
          cartId: cart.cartId,
          productId: parseInt(productId),
          quantity: parseInt(quantity),
        },
      });
    }

    res.status(200).json({ message: "Product added to cart successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ===========================================
// 2. GET MY CART (Customer)
// ===========================================
const getMyCart = async (req, res) => {
  try {
    const customerId = req.user.id;

    const cart = await prisma.cart.findUnique({
      where: { customerId },
      include: {
        cartItems: { 
          include: {
            product: {
              select: { productName: true, price: true, imageUrl: true }
            }
          }
        }
      }
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ===========================================
// 3. REMOVE ITEM FROM CART (Customer)
// ===========================================
const removeItemFromCart = async (req, res) => {
    try {
      const { cartItemId } = req.params; 
  
      await prisma.cartItem.delete({
        where: { cartItemId: parseInt(cartItemId) },
      });
  
      res.status(200).json({ message: "Item removed from cart successfully." });
    } catch (error) {

      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Cart item not found.' });
      }
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };

module.exports = {
  addItemToCart,
  getMyCart,
  removeItemFromCart,
};