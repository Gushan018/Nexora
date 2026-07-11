const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getVendorAvailability = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { from, to } = req.query;
    const where = { vendorId: parseInt(vendorId) };
    if (from) where.date = { ...where.date, gte: new Date(from) };
    if (to) where.date = { ...where.date, lte: new Date(to) };
    const availability = await prisma.availability.findMany({ where, orderBy: { date: 'asc' } });
    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const setAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime, isAvailable } = req.body;
    if (!date || !startTime || !endTime) return res.status(400).json({ message: 'Date, startTime, and endTime are required' });
    const existing = await prisma.availability.findFirst({ where: { vendorId: req.user.id, date: new Date(date) } });
    if (existing) {
      const updated = await prisma.availability.update({
        where: { availabilityId: existing.availabilityId },
        data: { startTime, endTime, isAvailable: isAvailable !== undefined ? isAvailable : true },
      });
      return res.status(200).json(updated);
    }
    const availability = await prisma.availability.create({
      data: { vendorId: req.user.id, date: new Date(date), startTime, endTime, isAvailable: isAvailable !== undefined ? isAvailable : true },
    });
    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const setBulkAvailability = async (req, res) => {
  try {
    const { slots } = req.body;
    if (!slots || !Array.isArray(slots)) return res.status(400).json({ message: 'slots array is required' });
    const results = [];
    for (const slot of slots) {
      const existing = await prisma.availability.findFirst({ where: { vendorId: req.user.id, date: new Date(slot.date) } });
      if (existing) {
        const updated = await prisma.availability.update({
          where: { availabilityId: existing.availabilityId },
          data: { startTime: slot.startTime, endTime: slot.endTime, isAvailable: slot.isAvailable !== undefined ? slot.isAvailable : true },
        });
        results.push(updated);
      } else {
        const created = await prisma.availability.create({
          data: { vendorId: req.user.id, date: new Date(slot.date), startTime: slot.startTime, endTime: slot.endTime, isAvailable: slot.isAvailable !== undefined ? slot.isAvailable : true },
        });
        results.push(created);
      }
    }
    res.status(200).json({ message: `${results.length} availability slots saved`, results });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteAvailability = async (req, res) => {
  try {
    const existing = await prisma.availability.findFirst({ where: { availabilityId: parseInt(req.params.id), vendorId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'Availability not found' });
    await prisma.availability.delete({ where: { availabilityId: parseInt(req.params.id) } });
    res.status(200).json({ message: 'Availability deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getVendorAvailability, setAvailability, setBulkAvailability, deleteAvailability };
