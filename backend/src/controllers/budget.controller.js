const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get the user's budget with categories
const getBudget = async (req, res) => {
  try {
    const customerId = req.user.id;
    let budget = await prisma.budget.findUnique({
      where: { customerId },
      include: { categories: true }
    });

    if (!budget) {
      // Create default empty budget if it doesn't exist
      budget = await prisma.budget.create({
        data: {
          customerId,
          totalBudget: 10000,
          categories: {
            create: [
              { name: 'Venue & Catering', allocated: 5000, spent: 0, color: 'bg-primary' },
              { name: 'Photography & Video', allocated: 2000, spent: 0, color: 'bg-accent' },
            ]
          }
        },
        include: { categories: true }
      });
    }
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update total budget
const updateTotalBudget = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { totalBudget } = req.body;
    const budget = await prisma.budget.update({
      where: { customerId },
      data: { totalBudget },
      include: { categories: true }
    });
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Add new category
const addCategory = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { name, allocated, spent, color } = req.body;
    
    const budget = await prisma.budget.findUnique({ where: { customerId } });
    if (!budget) return res.status(404).json({ message: "Budget not found" });

    const category = await prisma.budgetCategory.create({
      data: {
        budgetId: budget.id,
        name,
        allocated,
        spent: spent || 0,
        color: color || 'bg-primary'
      }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update existing category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, allocated, spent, color } = req.body;
    const category = await prisma.budgetCategory.update({
      where: { id: parseInt(id) },
      data: { name, allocated, spent, color }
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.budgetCategory.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getBudget,
  updateTotalBudget,
  addCategory,
  updateCategory,
  deleteCategory
};
