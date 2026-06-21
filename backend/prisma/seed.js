const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clear existing data
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.eventPackage.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.admin.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1.5. Create Admin User
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // 2. Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Sarah Customer',
      email: 'sarah@example.com',
      password: hashedPassword,
      contactNumber: '123-456-7890',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Mike Smith',
      email: 'mike@example.com',
      password: hashedPassword,
      contactNumber: '098-765-4321',
    },
  });

  // 3. Create Vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      businessName: 'Luxe Dining Catering',
      email: 'vendor1@example.com',
      password: hashedPassword,
      vendorType: 'CATERING',
      isApproved: true,
      description: 'Premium catering for luxury events.',
      location: 'New York, NY',
    },
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      businessName: 'Bloom Designs',
      email: 'vendor2@example.com',
      password: hashedPassword,
      vendorType: 'OTHER',
      isApproved: true,
      description: 'Beautiful floral arrangements for weddings.',
      location: 'Los Angeles, CA',
    },
  });

  const vendor3 = await prisma.vendor.create({
    data: {
      businessName: 'SoundWave DJ',
      email: 'dj@example.com',
      password: hashedPassword,
      vendorType: 'DJ',
      isApproved: true,
      description: 'The best party DJs in town.',
      location: 'Miami, FL',
    },
  });

  // 4. Create Categories
  const catCatering = await prisma.serviceCategory.create({ data: { categoryName: 'Food & Catering' } });
  const catDecor = await prisma.serviceCategory.create({ data: { categoryName: 'Decorations' } });
  const catMusic = await prisma.serviceCategory.create({ data: { categoryName: 'Music & Entertainment' } });

  // 5. Create Services
  const service1 = await prisma.service.create({
    data: {
      serviceName: 'Premium Buffet',
      price: 2500.00,
      description: 'A 5-course buffet for up to 100 guests.',
      vendorId: vendor1.vendorId,
      categoryId: catCatering.categoryId,
      isApproved: true,
      imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80',
    },
  });

  const service2 = await prisma.service.create({
    data: {
      serviceName: 'Live DJ Set',
      price: 800.00,
      description: '4 hours of live DJ performance with lighting.',
      vendorId: vendor3.vendorId,
      categoryId: catMusic.categoryId,
      isApproved: true,
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80',
    },
  });

  // 6. Create Packages
  const package1 = await prisma.eventPackage.create({
    data: {
      packageName: 'Platinum Wedding Package',
      price: 5000.00,
      description: 'Everything you need for a premium wedding setup.',
      vendorId: vendor2.vendorId,
      isApproved: true,
    },
  });

  // 7. Create Products
  const product1 = await prisma.product.create({
    data: {
      productName: 'Gold Cutlery Set',
      price: 120.00,
      quantity: 50,
      description: 'Set of 100 premium gold-plated cutlery.',
      vendorId: vendor1.vendorId,
      categoryId: catCatering.categoryId,
      isApproved: true,
      imageUrl: 'https://images.unsplash.com/photo-1582283082596-f9f2d1e2e987?w=500&q=80',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      productName: 'LED Uplights',
      price: 45.00,
      quantity: 100,
      description: 'Bright LED lights for ambient room lighting.',
      vendorId: vendor3.vendorId,
      categoryId: catDecor.categoryId,
      isApproved: true,
      imageUrl: 'https://images.unsplash.com/photo-1505236858219-8359eb29e325?w=500&q=80',
    },
  });

  // 8. Create Orders
  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.customerId,
      totalAmount: 120.00,
      status: 'SHIPPED',
      shippingAddress: '123 Main St, NY',
      orderItems: {
        create: [
          {
            productId: product1.productId,
            quantity: 1,
            unitPrice: 120.00,
          }
        ]
      }
    }
  });

  // 9. Create Bookings
  const upcomingDate = new Date();
  upcomingDate.setDate(upcomingDate.getDate() + 45); // 45 days in future

  const booking1 = await prisma.booking.create({
    data: {
      customerId: customer1.customerId,
      serviceId: service1.serviceId,
      eventDate: upcomingDate,
      status: 'ACCEPTED',
      location: 'New York, NY',
    }
  });

  const booking2 = await prisma.booking.create({
    data: {
      customerId: customer1.customerId,
      packageId: package1.packageId,
      eventDate: upcomingDate,
      status: 'ACCEPTED',
      location: 'Los Angeles, CA',
    }
  });
  
  // 10. Reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Absolutely phenomenal service!',
      customerId: customer2.customerId,
      vendorId: vendor1.vendorId,
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
