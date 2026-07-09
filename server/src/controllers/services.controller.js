const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllServices = async (req, res) => {
  try {
    const { vendorId, categoryId } = req.query;
    const where = { isApproved: true };
    if (vendorId) where.vendorId = parseInt(vendorId);
    if (categoryId) where.categoryId = parseInt(categoryId);
    const services = await prisma.service.findMany({
      where,
      include: { vendor: { select: { businessName: true, location: true } }, category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await prisma.service.findFirst({
      where: { serviceId: parseInt(req.params.id), isApproved: true },
      include: { vendor: { select: { businessName: true, location: true, contactNumber: true } }, category: true, reviews: { include: { customer: { select: { name: true } } } } },
    });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const { serviceName, price, description, imageUrl, categoryId } = req.body;
    const service = await prisma.service.create({
      data: { serviceName, price: parseFloat(price), description, imageUrl, categoryId: categoryId ? parseInt(categoryId) : null, vendorId: req.user.id, isApproved: false },
    });
    res.status(201).json({ message: 'Service created. Awaiting admin approval.', service });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const existing = await prisma.service.findFirst({ where: { serviceId: parseInt(req.params.id), vendorId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'Service not found' });
    const { serviceName, price, description, imageUrl, categoryId } = req.body;
    const service = await prisma.service.update({
      where: { serviceId: parseInt(req.params.id) },
      data: { serviceName, price: price ? parseFloat(price) : undefined, description, imageUrl, categoryId: categoryId !== undefined ? (categoryId ? parseInt(categoryId) : null) : undefined },
    });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const existing = await prisma.service.findFirst({ where: { serviceId: parseInt(req.params.id), vendorId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'Service not found' });
    await prisma.service.delete({ where: { serviceId: parseInt(req.params.id) } });
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getAllServices, getServiceById, createService, updateService, deleteService };
