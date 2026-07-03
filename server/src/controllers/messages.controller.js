const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let conversations = [];
    if (userRole === 'vendor') {
      const vendorServices = await prisma.service.findMany({
        where: { vendorId: userId },
        select: { serviceId: true },
      });
      const vendorPackages = await prisma.eventPackage.findMany({
        where: { vendorId: userId },
        select: { packageId: true },
      });
      const serviceIds = vendorServices.map(s => s.serviceId);
      const packageIds = vendorPackages.map(p => p.packageId);

      const bookings = await prisma.booking.findMany({
        where: {
          OR: [
            ...(serviceIds.length ? [{ serviceId: { in: serviceIds } }] : []),
            ...(packageIds.length ? [{ packageId: { in: packageIds } }] : []),
          ],
        },
        include: { customer: { select: { customerId: true, name: true } } },
        orderBy: { bookingDate: 'desc' },
      });

      const seen = new Set();
      for (const b of bookings) {
        if (!b.customer) continue;
        const cid = b.customer.customerId;
        if (seen.has(cid)) continue;
        seen.add(cid);

        const lastMsg = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: cid, receiverId: userId, senderType: 'customer', receiverType: 'vendor' },
              { senderId: userId, receiverId: cid, senderType: 'vendor', receiverType: 'customer' },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });

        const unread = await prisma.message.count({
          where: { senderId: cid, receiverId: userId, senderType: 'customer', receiverType: 'vendor', isRead: false },
        });

        conversations.push({
          conversationId: `cust-${cid}`,
          participantId: cid,
          participantName: b.customer.name,
          participantAvatar: b.customer.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
          lastMessage: lastMsg?.content || 'Start a conversation',
          lastMessageTime: (lastMsg?.createdAt || b.bookingDate).toISOString(),
          unreadCount: unread,
          online: false,
        });
      }
    } else if (userRole === 'customer') {
      const bookings = await prisma.booking.findMany({
        where: { customerId: userId },
        include: {
          service: { select: { vendor: { select: { vendorId: true, businessName: true } } } },
          package: { select: { vendor: { select: { vendorId: true, businessName: true } } } },
        },
        orderBy: { bookingDate: 'desc' },
      });

      const seen = new Set();
      for (const b of bookings) {
        const vendor = b.service?.vendor || b.package?.vendor;
        if (!vendor || seen.has(vendor.vendorId)) continue;
        seen.add(vendor.vendorId);

        const lastMsg = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: vendor.vendorId, senderType: 'customer', receiverType: 'vendor' },
              { senderId: vendor.vendorId, receiverId: userId, senderType: 'vendor', receiverType: 'customer' },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });

        const unread = await prisma.message.count({
          where: { senderId: vendor.vendorId, receiverId: userId, senderType: 'vendor', receiverType: 'customer', isRead: false },
        });

        conversations.push({
          conversationId: `vend-${vendor.vendorId}`,
          participantId: vendor.vendorId,
          participantName: vendor.businessName,
          participantAvatar: vendor.businessName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
          lastMessage: lastMsg?.content || 'Start a conversation',
          lastMessageTime: (lastMsg?.createdAt || b.bookingDate).toISOString(),
          unreadCount: unread,
          online: false,
        });
      }
    }

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const parts = conversationId.split('-');
    const otherRole = parts[0];
    const otherId = parseInt(parts[1]);

    if (isNaN(otherId)) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    const where = {
      OR: [
        { senderId: userId, receiverId: otherId, senderType: userRole, receiverType: otherRole === 'cust' ? 'customer' : 'vendor' },
        { senderId: otherId, receiverId: userId, senderType: otherRole === 'cust' ? 'customer' : 'vendor', receiverType: userRole },
      ],
    };

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    await prisma.message.updateMany({
      where: { senderId: otherId, receiverId: userId, senderType: otherRole === 'cust' ? 'customer' : 'vendor', receiverType: userRole, isRead: false },
      data: { isRead: true },
    });

    res.status(200).json({ messages, conversationId });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    if (!receiverId || !message || !message.trim()) {
      return res.status(400).json({ message: 'receiverId and message are required' });
    }

    const senderId = req.user.id;
    const senderType = req.user.role;
    const receiverType = senderType === 'vendor' ? 'customer' : 'vendor';
    const convId = senderType === 'vendor'
      ? `cust-${receiverId}`
      : `vend-${receiverId}`;

    const msg = await prisma.message.create({
      data: {
        conversationId: convId,
        senderId,
        senderType,
        receiverId: parseInt(receiverId),
        receiverType,
        content: message.trim(),
      },
    });

    res.status(201).json({
      message: 'Message sent',
      id: msg.messageId,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      text: msg.content,
      createdAt: msg.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage };
