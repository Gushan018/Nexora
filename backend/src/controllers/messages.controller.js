const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: parse participant ID from conversation string (e.g., "cust-1", "vend-2", "1-2", "2")
const parseParticipantId = (conversationId) => {
  if (!conversationId) return null;
  const str = String(conversationId);
  if (str.includes('-')) {
    const parts = str.split('-');
    const lastPart = parts[parts.length - 1];
    const parsed = parseInt(lastPart, 10);
    return isNaN(parsed) ? null : parsed;
  }
  const parsed = parseInt(str, 10);
  return isNaN(parsed) ? null : parsed;
};

// Helper: resolve user/participant details by ID
const resolveParticipantDetails = async (partnerId, partnerType) => {
  if (!partnerId) return null;

  if (partnerType === 'vendor' || partnerType === 'seller' || partnerType === 'company') {
    const vendor = await prisma.vendor.findUnique({
      where: { vendorId: partnerId },
      select: { vendorId: true, businessName: true, contactNumber: true, email: true, bannerImage: true, logoImage: true }
    }).catch(() => null);

    if (vendor) {
      return {
        id: vendor.vendorId,
        name: vendor.businessName,
        type: 'vendor',
        phone: vendor.contactNumber || '',
        email: vendor.email,
        avatar: vendor.logoImage || vendor.businessName.charAt(0).toUpperCase()
      };
    }
  }

  if (partnerType === 'customer' || partnerType === 'user') {
    const customer = await prisma.customer.findUnique({
      where: { customerId: partnerId },
      select: { customerId: true, name: true, contactNumber: true, email: true, profileImage: true }
    }).catch(() => null);

    if (customer) {
      return {
        id: customer.customerId,
        name: customer.name,
        type: 'customer',
        phone: customer.contactNumber || '',
        email: customer.email,
        avatar: customer.profileImage || customer.name.charAt(0).toUpperCase()
      };
    }
  }

  // Fallback
  return {
    id: partnerId,
    name: `User #${partnerId}`,
    type: partnerType || 'user',
    phone: '',
    email: '',
    avatar: 'U'
  };
};

// ================================================
// 1. GET CONVERSATIONS LIST
// ================================================
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role || 'customer';
    const isVendorLike = ['vendor', 'seller', 'company'].includes(userRole);

    // A. Gather partner IDs from Message table
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, senderType: isVendorLike ? 'vendor' : 'customer' },
          { receiverId: userId, receiverType: isVendorLike ? 'vendor' : 'customer' }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    const partnerMap = new Map(); // partnerKey -> { partnerId, partnerType, lastMessage, lastMessageTime, unreadCount }

    for (const msg of messages) {
      const isSender = msg.senderId === userId && (isVendorLike ? ['vendor', 'seller', 'company'].includes(msg.senderType) : ['customer', 'user'].includes(msg.senderType));
      const partnerId = isSender ? msg.receiverId : msg.senderId;
      let partnerType = isSender ? msg.receiverType : msg.senderType;
      
      if (['vendor', 'seller', 'company'].includes(partnerType)) partnerType = 'vendor';
      if (['customer', 'user'].includes(partnerType)) partnerType = 'customer';
      
      if (!partnerId) continue;
      const partnerKey = `${partnerType}-${partnerId}`;

      if (!partnerMap.has(partnerKey)) {
        partnerMap.set(partnerKey, {
          partnerId,
          partnerType,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: 0
        });
      }

      if (!isSender && !msg.isRead) {
        const item = partnerMap.get(partnerKey);
        item.unreadCount += 1;
      }
    }

    // B. Gather partner IDs from Booking table
    let bookingPartners = [];

    if (isVendorLike) {
      const services = await prisma.service.findMany({ where: { vendorId: userId }, select: { serviceId: true } }).catch(() => []);
      const packages = await prisma.eventPackage.findMany({ where: { vendorId: userId }, select: { packageId: true } }).catch(() => []);
      const serviceIds = services.map(s => s.serviceId);
      const packageIds = packages.map(p => p.packageId);

      if (serviceIds.length > 0 || packageIds.length > 0) {
        bookingPartners = await prisma.booking.findMany({
          where: {
            OR: [
              ...(serviceIds.length ? [{ serviceId: { in: serviceIds } }] : []),
              ...(packageIds.length ? [{ packageId: { in: packageIds } }] : []),
            ]
          },
          select: { customerId: true, bookingDate: true },
          orderBy: { bookingDate: 'desc' }
        }).catch(() => []);
      }
    } else {
      bookingPartners = await prisma.booking.findMany({
        where: { customerId: userId },
        include: {
          service: { select: { vendorId: true } },
          package: { select: { vendorId: true } }
        },
        orderBy: { bookingDate: 'desc' }
      }).catch(() => []);
    }

    for (const b of bookingPartners) {
      const partnerId = isVendorLike ? b.customerId : (b.service?.vendorId || b.package?.vendorId);
      const partnerType = isVendorLike ? 'customer' : 'vendor';
      const partnerKey = `${partnerType}-${partnerId}`;

      if (partnerId && !partnerMap.has(partnerKey)) {
        partnerMap.set(partnerKey, {
          partnerId,
          partnerType,
          lastMessage: 'Start a conversation',
          lastMessageTime: b.bookingDate || new Date(),
          unreadCount: 0
        });
      }
    }

    // C. Build response objects
    const conversations = [];
    for (const [key, data] of partnerMap.entries()) {
      const details = await resolveParticipantDetails(data.partnerId, data.partnerType);
      const prefix = details?.type === 'vendor' ? 'vend' : 'cust';
      conversations.push({
        conversationId: `${prefix}-${data.partnerId}`,
        participantId: data.partnerId,
        participantName: details?.name || `User #${data.partnerId}`,
        participantAvatar: details?.avatar || 'U',
        participantPhone: details?.phone || '',
        participantType: details?.type || 'user',
        lastMessage: data.lastMessage,
        lastMessageTime: new Date(data.lastMessageTime).toISOString(),
        unreadCount: data.unreadCount,
        online: true
      });
    }

    // Sort by lastMessageTime descending
    conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    res.status(200).json(conversations);
  } catch (error) {
    console.error('getConversations error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ================================================
// 2. GET MESSAGES FOR A CONVERSATION
// ================================================
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const partnerId = parseParticipantId(conversationId);
    if (!partnerId) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    const isVendorLike = ['vendor', 'seller', 'company'].includes(req.user.role || 'customer');
    const partnerType = isVendorLike ? 'customer' : 'vendor';
    const participant = await resolveParticipantDetails(partnerId, partnerType);

    // Fetch messages between userId and partnerId
    const messagesList = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
          { conversationId: String(conversationId) }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark unread messages sent by partner as read
    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: userId,
        isRead: false
      },
      data: { isRead: true }
    }).catch(() => {});

    const formattedMessages = messagesList.map(m => ({
      id: m.messageId,
      messageId: m.messageId,
      senderId: m.senderId,
      receiverId: m.receiverId,
      senderType: m.senderType,
      receiverType: m.receiverType,
      text: m.content,
      content: m.content,
      isMe: m.senderId === userId,
      createdAt: m.createdAt
    }));

    res.status(200).json({
      messages: formattedMessages,
      conversationId,
      participant
    });
  } catch (error) {
    console.error('getMessages error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ================================================
// 3. SEND A MESSAGE
// ================================================
const sendMessage = async (req, res) => {
  try {
    let { receiverId, message, conversationId, text } = req.body;
    const msgText = (text || message || '').trim();

    if (!receiverId && conversationId) {
      receiverId = parseParticipantId(conversationId);
    }

    const targetReceiverId = parseInt(receiverId, 10);
    if (isNaN(targetReceiverId) || !msgText) {
      return res.status(400).json({ message: 'Receiver ID and message content are required' });
    }

    const senderId = req.user.id;
    const isVendorLike = ['vendor', 'seller', 'company'].includes(req.user.role || 'user');
    const senderType = isVendorLike ? 'vendor' : 'customer';
    const receiverType = isVendorLike ? 'customer' : 'vendor';
    const convId = conversationId || `${isVendorLike ? 'cust' : 'vend'}-${targetReceiverId}`;

    const msg = await prisma.message.create({
      data: {
        conversationId: String(convId),
        senderId,
        senderType,
        receiverId: targetReceiverId,
        receiverType,
        content: msgText,
      }
    });

    res.status(201).json({
      message: 'Message sent successfully',
      id: msg.messageId,
      messageId: msg.messageId,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      senderType: msg.senderType,
      receiverType: msg.receiverType,
      text: msg.content,
      content: msg.content,
      isMe: true,
      createdAt: msg.createdAt,
    });
  } catch (error) {
    console.error('sendMessage error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage
};
