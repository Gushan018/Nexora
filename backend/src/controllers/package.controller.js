const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const prisma = new PrismaClient();

const getMyPackages = async (req, res) => {
  try {
    const packages = await prisma.eventPackage.findMany({
      where: { vendorId: req.user.id },
      include: {
        services: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(packages);
  } catch (error) {
    console.error('getMyPackages error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createPackage = async (req, res) => {
  try {
    const { packageName, description, price, category, categoryId, duration, maxGuests, services, images } = req.body;

    if (!packageName) {
      return res.status(400).json({ message: 'Package name is required' });
    }

    let categoryStr = category || '';
    if (!categoryStr && categoryId) {
      const cat = await prisma.serviceCategory.findUnique({ where: { categoryId: parseInt(categoryId) } }).catch(() => null);
      categoryStr = cat ? cat.categoryName : String(categoryId);
    }

    const pkg = await prisma.eventPackage.create({
      data: {
        packageName,
        description: description || '',
        price: parseFloat(price) || 0,
        category: categoryStr,
        duration: duration || '',
        maxGuests: maxGuests != null ? parseInt(maxGuests) : 0,
        vendorId: req.user.id,
        services: {
          create: (services || []).filter((s) => s && String(s).trim()).map((name) => ({ name: String(name).trim() })),
        },
        images: {
          create: (images || []).filter((u) => u && String(u).trim()).map((url) => ({ url: String(url).trim() })),
        },
      },
      include: { services: true, images: true },
    });

    res.status(201).json(pkg);
  } catch (error) {
    console.error('createPackage error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getPackageById = async (req, res) => {
  try {
    const pkg = await prisma.eventPackage.findFirst({
      where: { packageId: parseInt(req.params.id), vendorId: req.user.id },
      include: { services: true, images: true },
    });

    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json(pkg);
  } catch (error) {
    console.error('getPackageById error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updatePackage = async (req, res) => {
  try {
    const { packageName, description, price, category, categoryId, duration, maxGuests, services, images } = req.body;

    const existing = await prisma.eventPackage.findFirst({
      where: { packageId: parseInt(req.params.id), vendorId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Package not found' });
    }

    let categoryStr = category || '';
    if (!categoryStr && categoryId) {
      const cat = await prisma.serviceCategory.findUnique({ where: { categoryId: parseInt(categoryId) } }).catch(() => null);
      categoryStr = cat ? cat.categoryName : String(categoryId);
    }

    const pkg = await prisma.eventPackage.update({
      where: { packageId: parseInt(req.params.id) },
      data: {
        packageName,
        description: description || '',
        price: price != null ? parseFloat(price) : 0,
        category: categoryStr,
        duration: duration || '',
        maxGuests: maxGuests != null ? parseInt(maxGuests) : 0,
        services: {
          deleteMany: {},
          create: (services || []).filter((s) => s && String(s).trim()).map((name) => ({ name: String(name).trim() })),
        },
        images: {
          deleteMany: {},
          create: (images || []).filter((u) => u && String(u).trim()).map((url) => ({ url: String(url).trim() })),
        },
      },
      include: { services: true, images: true },
    });

    res.status(200).json(pkg);
  } catch (error) {
    console.error('updatePackage error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deletePackage = async (req, res) => {
  try {
    const packageId = parseInt(req.params.id);
    const existing = await prisma.eventPackage.findFirst({
      where: { packageId, vendorId: req.user.id },
      include: { images: true },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await prisma.packageService.deleteMany({ where: { packageId } }).catch(() => {});
    await prisma.packageImage.deleteMany({ where: { packageId } }).catch(() => {});
    await prisma.booking.updateMany({
      where: { packageId },
      data: { packageId: null }
    }).catch(() => {});

    for (const img of existing.images || []) {
      try {
        const filePath = path.join(__dirname, '..', '..', 'uploads', 'packages', path.basename(img.url));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        // ignore image deletion errors
      }
    }

    await prisma.eventPackage.delete({
      where: { packageId },
    });

    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('deletePackage error:', error);
    res.status(500).json({ message: 'Failed to delete package', error: error.message });
  }
};

const getAllPublicPackages = async (req, res) => {
  try {
    const packages = await prisma.eventPackage.findMany({
      include: {
        services: true,
        images: true,
        vendor: { select: { businessName: true, location: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(packages);
  } catch (error) {
    console.error('getAllPublicPackages error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getMyPackages,
  createPackage,
  getPackageById,
  updatePackage,
  deletePackage,
  getAllPublicPackages,
};
