const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await prisma.notification.findMany({
      where: {
        customerId: userId, // Assuming these notifications are for the customer
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
    const notification = await prisma.notification.update({
      where: { notificationId: parseInt(id) },
      data: { isRead: true }
    });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead
};
