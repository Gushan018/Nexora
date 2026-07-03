const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.serviceCategory.findMany({ orderBy: { categoryName: 'asc' } });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) return res.status(400).json({ message: 'Category name is required' });
    const existing = await prisma.serviceCategory.findFirst({ where: { categoryName } });
    if (existing) return res.status(400).json({ message: 'Category already exists' });
    const category = await prisma.serviceCategory.create({ data: { categoryName } });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const category = await prisma.serviceCategory.update({
      where: { categoryId: parseInt(req.params.id) },
      data: { categoryName },
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await prisma.serviceCategory.delete({ where: { categoryId: parseInt(req.params.id) } });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
