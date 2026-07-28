const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserQuery = (req) => {
  if (req.user.role === 'customer') {
    return { customerId: req.user.id };
  }
  if (req.user.role === 'vendor' || req.user.role === 'seller' || req.user.role === 'service_provider' || req.user.role === 'event_company') {
    return { vendorId: req.user.id };
  }
  if (req.user.role === 'admin') {
    // Admin receives global/platform notifications or all notifications
    return {};
  }
  return {};
};

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: getUserQuery(req),
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    const unreadCount = await prisma.notification.count({ 
      where: { ...getUserQuery(req), isRead: false } 
    });
    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { notificationId: parseInt(req.params.id), ...getUserQuery(req) },
      data: { isRead: true },
    });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { ...getUserQuery(req), isRead: false },
      data: { isRead: true },
    });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await prisma.notification.deleteMany({
      where: { notificationId: parseInt(req.params.id), ...getUserQuery(req) },
    });
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead, deleteNotification };
