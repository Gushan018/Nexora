const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===========================================
// 1. ADD ITEM TO CART (Customer)
// ===========================================
const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const customerId = req.user.id;


    let cart = await prisma.cart.findUnique({
      where: { customerId: parseInt(customerId) },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { customerId: parseInt(customerId) }
      });
    }

    const product = await prisma.product.findUnique({
      where: { productId: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found. Please refresh the page." });
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
    if (error.code === 'P2003') {
      return res.status(401).json({ message: "Your session is invalid because the database was reset. Please log out and log back in." });
    }
    console.error("Add to cart error:", error);
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
      return res.status(200).json({ cartItems: [] });
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

// ===========================================
// 4. UPDATE ITEM QUANTITY (Customer)
// ===========================================
const updateCartItemQuantity = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
       return res.status(400).json({ message: "Quantity must be at least 1." });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { cartItemId: parseInt(cartItemId) },
      data: { quantity: parseInt(quantity) },
    });

    res.status(200).json({ message: "Quantity updated successfully.", item: updatedItem });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Cart item not found.' });
    }
    console.error("Update quantity error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  addItemToCart,
  getMyCart,
  removeItemFromCart,
  updateCartItemQuantity,
};