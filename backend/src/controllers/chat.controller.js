const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all conversations for a user
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role; // 'customer' or 'vendor'
    
    let conversations;
    
    if (role === 'customer') {
      conversations = await prisma.conversation.findMany({
        where: { customerId: userId },
        include: {
          vendor: { select: { businessName: true, vendorId: true } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 }
        },
        orderBy: { updatedAt: 'desc' }
      });
    } else if (role === 'vendor') {
      conversations = await prisma.conversation.findMany({
        where: { vendorId: userId },
        include: {
          customer: { select: { name: true, customerId: true } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 }
        },
        orderBy: { updatedAt: 'desc' }
      });
    } else {
      return res.status(403).json({ message: "Not authorized to view conversations." });
    }
    
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get messages for a specific conversation
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const messages = await prisma.message.findMany({
      where: { conversationId: parseInt(conversationId) },
      orderBy: { createdAt: 'asc' }
    });
    
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { conversationId, vendorId, text } = req.body;
    const userId = req.user.id;
    const role = req.user.role;
    
    let actualConversationId = conversationId;
    
    // If conversation doesn't exist, create it (e.g., customer initiating chat)
    if (!actualConversationId && role === 'customer' && vendorId) {
      let conversation = await prisma.conversation.findUnique({
        where: {
          customerId_vendorId: {
            customerId: userId,
            vendorId: parseInt(vendorId)
          }
        }
      });
      
      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            customerId: userId,
            vendorId: parseInt(vendorId)
          }
        });
      }
      actualConversationId = conversation.id;
    }
    
    if (!actualConversationId) {
      return res.status(400).json({ message: "Conversation ID required." });
    }
    
    const message = await prisma.message.create({
      data: {
        text,
        senderType: role,
        conversationId: parseInt(actualConversationId)
      }
    });
    
    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: parseInt(actualConversationId) },
      data: { updatedAt: new Date() }
    });
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage
};
