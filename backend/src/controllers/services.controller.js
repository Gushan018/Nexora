const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllServices = async (req, res) => {
  try {
    const { vendorId, categoryId, my } = req.query;
    const where = {};
    if (my === 'true' && req.user) {
      where.vendorId = req.user.id;
    } else if (vendorId) {
      where.vendorId = parseInt(vendorId);
    }
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
    const serviceId = parseInt(req.params.id);
    if (isNaN(serviceId)) return res.status(400).json({ message: 'Invalid service ID' });

    const service = await prisma.service.findUnique({
      where: { serviceId },
      include: {
        vendor: { select: { businessName: true, location: true, contactNumber: true } },
        category: true,
        reviews: { include: { customer: { select: { name: true } } } },
      },
    });

    if (!service) return res.status(404).json({ message: 'Service not found' });

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const resolveCategoryId = async (rawCategory) => {
  if (!rawCategory) return null;
  const parsed = parseInt(rawCategory);
  if (!isNaN(parsed) && String(parsed) === String(rawCategory).trim()) {
    return parsed;
  }
  const catName = String(rawCategory).trim();
  if (!catName) return null;
  let existingCat = await prisma.serviceCategory.findFirst({
    where: { categoryName: { equals: catName, mode: 'insensitive' } }
  });
  if (!existingCat) {
    try {
      existingCat = await prisma.serviceCategory.create({
        data: { categoryName: catName }
      });
    } catch (e) {
      existingCat = await prisma.serviceCategory.findFirst();
    }
  }
  return existingCat ? existingCat.categoryId : null;
};

const createService = async (req, res) => {
  try {
    const { serviceName, price, description, imageUrl, categoryId, category } = req.body;
    const catId = await resolveCategoryId(categoryId || category);
    const service = await prisma.service.create({
      data: {
        serviceName,
        price: parseFloat(price),
        description,
        imageUrl,
        categoryId: catId,
        vendorId: req.user.id,
        isApproved: true
      },
    });
    res.status(201).json({ message: 'Service created successfully.', service });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const existing = await prisma.service.findFirst({ where: { serviceId: parseInt(req.params.id), vendorId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'Service not found' });
    const { serviceName, price, description, imageUrl, categoryId, category } = req.body;
    const rawCat = categoryId !== undefined ? categoryId : category;
    const catId = rawCat !== undefined ? await resolveCategoryId(rawCat) : undefined;

    const service = await prisma.service.update({
      where: { serviceId: parseInt(req.params.id) },
      data: {
        serviceName,
        price: price ? parseFloat(price) : undefined,
        description,
        imageUrl,
        categoryId: catId !== undefined ? catId : undefined
      },
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
