const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get customer's budget summary and items
const getBudgetSummary = async (req, res) => {
  try {
    const customerId = req.user.id;
    let budget = await prisma.budget.findFirst({
      where: { customerId },
      include: {
        items: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!budget) {
      budget = await prisma.budget.create({
        data: {
          customerId,
          title: "My Event Budget",
          totalBudget: 500000
        },
        include: { items: true }
      });
    }

    const categories = budget.items.map((item) => ({
      id: item.budgetItemId,
      name: item.title || item.category,
      allocated: item.estimatedCost || 0,
      spent: item.actualCost || 0,
      color: item.notes || 'bg-primary',
    }));

    const totalEstimated = budget.items.reduce((sum, item) => sum + Number(item.estimatedCost || 0), 0);
    const totalActual = budget.items.reduce((sum, item) => sum + Number(item.actualCost || 0), 0);

    res.status(200).json({
      budgetId: budget.budgetId,
      totalBudget: Number(budget.totalBudget || 500000),
      categories,
      budget,
      summary: {
        totalBudget: Number(budget.totalBudget || 500000),
        totalEstimated,
        totalActual,
        remainingBudget: Number(budget.totalBudget || 500000) - totalActual,
        itemCount: budget.items.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Set or update total budget amount
const setTotalBudget = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { title, totalBudget, eventDate } = req.body;
    const amount = typeof req.body === 'number' ? req.body : totalBudget;

    let budget = await prisma.budget.findFirst({ where: { customerId } });

    if (budget) {
      budget = await prisma.budget.update({
        where: { budgetId: budget.budgetId },
        data: {
          title: title !== undefined ? title : budget.title,
          totalBudget: amount !== undefined ? parseFloat(amount) : budget.totalBudget,
          eventDate: eventDate ? new Date(eventDate) : budget.eventDate
        }
      });
    } else {
      budget = await prisma.budget.create({
        data: {
          customerId,
          title: title || "My Event Budget",
          totalBudget: amount ? parseFloat(amount) : 500000,
          eventDate: eventDate ? new Date(eventDate) : null
        }
      });
    }

    res.status(200).json({ message: "Budget updated successfully", budget, totalBudget: Number(budget.totalBudget) });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Add custom expense item / category to budget
const addBudgetItem = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { category, title, name, estimatedCost, actualCost, allocated, spent, color, isPaid, notes } = req.body;

    const itemTitle = name || title;
    if (!itemTitle) {
      return res.status(400).json({ message: "Item/Category name is required." });
    }

    let budget = await prisma.budget.findFirst({ where: { customerId } });

    if (!budget) {
      budget = await prisma.budget.create({
        data: { customerId, title: "My Event Budget", totalBudget: 500000 }
      });
    }

    const item = await prisma.budgetItem.create({
      data: {
        budgetId: budget.budgetId,
        category: category || itemTitle,
        title: itemTitle,
        estimatedCost: allocated !== undefined ? parseFloat(allocated) : estimatedCost ? parseFloat(estimatedCost) : 0,
        actualCost: spent !== undefined ? parseFloat(spent) : actualCost ? parseFloat(actualCost) : 0,
        isPaid: isPaid || false,
        notes: color || notes || 'bg-primary'
      }
    });

    const formatted = {
      id: item.budgetItemId,
      name: item.title,
      allocated: item.estimatedCost,
      spent: item.actualCost,
      color: item.notes,
    };

    res.status(201).json({ message: "Budget category added", item: formatted, ...formatted });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update budget item / category
const updateBudgetItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title, name, estimatedCost, actualCost, allocated, spent, color, isPaid, notes } = req.body;

    const itemTitle = name || title;
    const item = await prisma.budgetItem.update({
      where: { budgetItemId: parseInt(id) },
      data: {
        category: category || itemTitle,
        title: itemTitle,
        estimatedCost: allocated !== undefined ? parseFloat(allocated) : estimatedCost !== undefined ? parseFloat(estimatedCost) : undefined,
        actualCost: spent !== undefined ? parseFloat(spent) : actualCost !== undefined ? parseFloat(actualCost) : undefined,
        isPaid,
        notes: color || notes
      }
    });

    const formatted = {
      id: item.budgetItemId,
      name: item.title,
      allocated: item.estimatedCost,
      spent: item.actualCost,
      color: item.notes,
    };

    res.status(200).json({ message: "Budget category updated", item: formatted, ...formatted });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete budget item / category
const deleteBudgetItem = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.budgetItem.delete({
      where: { budgetItemId: parseInt(id) }
    });
    res.status(200).json({ message: "Budget item deleted" });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Sync bookings and orders automatically into budget
const syncBudgetFromBookingsAndOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    let budget = await prisma.budget.findFirst({ where: { customerId } });

    if (!budget) {
      budget = await prisma.budget.create({
        data: { customerId, title: "My Event Budget", totalBudget: 0 }
      });
    }

    const bookings = await prisma.booking.findMany({
      where: { customerId, status: 'ACCEPTED' },
      include: { service: true, package: true }
    });

    const orders = await prisma.order.findMany({
      where: { customerId, status: { in: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } }
    });

    let syncCount = 0;

    for (const b of bookings) {
      const title = `Booking: ${b.service?.serviceName || b.package?.packageName || 'Event Booking'}`;
      const cost = parseFloat(b.service?.price || b.package?.price || 0);

      const existing = await prisma.budgetItem.findFirst({
        where: { budgetId: budget.budgetId, title }
      });

      if (!existing && cost > 0) {
        await prisma.budgetItem.create({
          data: {
            budgetId: budget.budgetId,
            category: "Bookings",
            title,
            estimatedCost: cost,
            actualCost: cost,
            isPaid: true
          }
        });
        syncCount++;
      }
    }

    for (const o of orders) {
      const title = `Order #${o.orderId}`;
      const cost = parseFloat(o.totalAmount);

      const existing = await prisma.budgetItem.findFirst({
        where: { budgetId: budget.budgetId, title }
      });

      if (!existing && cost > 0) {
        await prisma.budgetItem.create({
          data: {
            budgetId: budget.budgetId,
            category: "Purchases",
            title,
            estimatedCost: cost,
            actualCost: cost,
            isPaid: o.status !== 'PENDING'
          }
        });
        syncCount++;
      }
    }

    res.status(200).json({ message: `Synced ${syncCount} items into your budget.`, syncCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getBudgetSummary,
  setTotalBudget,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
  syncBudgetFromBookingsAndOrders
};
