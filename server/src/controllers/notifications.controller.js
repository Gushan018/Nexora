const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id, userType: req.user.role },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    const unreadCount = await prisma.notification.count({ where: { userId: req.user.id, userType: req.user.role, isRead: false } });
    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { notificationId: parseInt(req.params.id), userId: req.user.id, userType: req.user.role },
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
      where: { userId: req.user.id, userType: req.user.role, isRead: false },
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
      where: { notificationId: parseInt(req.params.id), userId: req.user.id, userType: req.user.role },
    });
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead, deleteNotification };
