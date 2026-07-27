const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database tables...');

  // 1. Clear existing data
  if (prisma.dispute) await prisma.dispute.deleteMany();
  if (prisma.refundRequest) await prisma.refundRequest.deleteMany();
  if (prisma.budgetItem) await prisma.budgetItem.deleteMany();
  if (prisma.budgetCategory) await prisma.budgetCategory.deleteMany();
  if (prisma.budget) await prisma.budget.deleteMany();
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  if (prisma.wishlist) await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.eventPackage.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.admin.deleteMany();

  // Reset auto-increment sequences so IDs start from 1
  const sequences = [
    'admin_admin_id_seq', 'customer_customer_id_seq', 'vendor_vendor_id_seq',
    'service_category_category_id_seq', 'service_service_id_seq', 'product_product_id_seq',
    'event_package_package_id_seq', 'availability_availability_id_seq', 'booking_booking_id_seq',
    'cart_cart_id_seq', 'cart_item_cart_item_id_seq', 'order_order_id_seq',
    'order_item_order_item_id_seq', 'payment_payment_id_seq', 'review_review_id_seq',
    'notification_notification_id_seq'
  ];
  for (const seq of sequences) {
    try { 
      await prisma.$executeRawUnsafe(`ALTER SEQUENCE "${seq}" RESTART WITH 1;`); 
    } catch (e) { 
      // Ignore sequence errors
    }
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  // ============ ADMIN ACCOUNTS ============
  console.log('Creating Admin accounts...');
  await prisma.admin.create({
    data: {
      name: 'EventNest Super Admin',
      email: 'admin@eventnest.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  await prisma.admin.create({
    data: {
      name: 'Platform Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // ============ SERVICE CATEGORIES ============
  console.log('Creating default service categories...');
  const categories = [
    { categoryName: 'Catering' },
    { categoryName: 'Photography' },
    { categoryName: 'Decorations' },
    { categoryName: 'Music & Entertainment' },
    { categoryName: 'Salon & Beauty' },
    { categoryName: 'Rentals & Supplies' }
  ];

  for (const cat of categories) {
    await prisma.serviceCategory.create({ data: cat });
  }

  console.log('Database clean reset complete! Created Admin accounts: admin@eventnest.com & admin@example.com (Password: password123)');
}

main()
  .catch((e) => {
    console.error('Error resetting database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
