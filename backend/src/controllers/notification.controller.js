const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.id,
        userType: req.user.role,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.updateMany({
      where: { notificationId: parseInt(id), userId: req.user.id, userType: req.user.role },
      data: { isRead: true }
    });
    if (notification.count === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead
};
