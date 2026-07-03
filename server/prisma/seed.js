const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.packageImage.deleteMany();
  await prisma.packageService.deleteMany();
  await prisma.eventPackage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.admin.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  // ===== ADMIN =====
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@eventnest.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('Admin created:', admin.email);

  // ===== SERVICE CATEGORIES =====
  const categories = await Promise.all([
    prisma.serviceCategory.create({ data: { categoryName: 'Photography' } }),
    prisma.serviceCategory.create({ data: { categoryName: 'Catering' } }),
    prisma.serviceCategory.create({ data: { categoryName: 'Venue & Rentals' } }),
    prisma.serviceCategory.create({ data: { categoryName: 'Salon & Beauty' } }),
    prisma.serviceCategory.create({ data: { categoryName: 'DJ & Music' } }),
    prisma.serviceCategory.create({ data: { categoryName: 'Event Planning' } }),
  ]);
  console.log('Categories created:', categories.length);

  // ===== VENDORS =====
  const vendor1 = await prisma.vendor.create({
    data: {
      businessName: 'Elegant Frames Photography',
      email: 'vendor1@eventnest.com',
      password: hashedPassword,
      description: 'Professional photography for weddings, corporate events, and private parties. Capturing your special moments with creativity and passion.',
      contactNumber: '011-234-5678',
      location: 'Colombo 03',
      address: '42 Galle Road, Colombo 03',
      registrationNumber: 'BRN-2024-001',
      establishedYear: 2015,
      vendorType: 'PHOTOGRAPHER',
      isApproved: true,
    },
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      businessName: 'Royal Catering Services',
      email: 'vendor2@eventnest.com',
      password: hashedPassword,
      description: 'Premium catering solutions for all types of events. From intimate gatherings to grand celebrations.',
      contactNumber: '011-345-6789',
      location: 'Colombo 07',
      address: '123 Dharmapala Mawatha, Colombo 07',
      registrationNumber: 'BRN-2024-002',
      establishedYear: 2012,
      vendorType: 'CATERING',
      isApproved: true,
    },
  });

  console.log('Vendors created:', vendor1.businessName, vendor2.businessName);

  // ===== SERVICES =====
  const services1 = await Promise.all([
    prisma.service.create({
      data: {
        serviceName: 'Wedding Photography',
        price: 150000.00,
        description: 'Full-day wedding coverage with 2 photographers, edited photos, and photobook.',
        vendorId: vendor1.vendorId,
        categoryId: categories[0].categoryId,
        isApproved: true,
      },
    }),
    prisma.service.create({
      data: {
        serviceName: 'Event Photography',
        price: 75000.00,
        description: 'Corporate event coverage with 1 photographer, 4 hours coverage.',
        vendorId: vendor1.vendorId,
        categoryId: categories[0].categoryId,
        isApproved: true,
      },
    }),
    prisma.service.create({
      data: {
        serviceName: 'Pre-Wedding Shoot',
        price: 50000.00,
        description: 'Location-based pre-wedding photo session with 20 edited photos.',
        vendorId: vendor1.vendorId,
        categoryId: categories[0].categoryId,
        isApproved: true,
      },
    }),
  ]);

  const services2 = await Promise.all([
    prisma.service.create({
      data: {
        serviceName: 'Buffet Catering',
        price: 1200.00,
        description: 'Per-person buffet catering with 8 main dishes, 4 sides, and desserts.',
        vendorId: vendor2.vendorId,
        categoryId: categories[1].categoryId,
        isApproved: true,
      },
    }),
    prisma.service.create({
      data: {
        serviceName: 'Plated Dinner',
        price: 2500.00,
        description: '4-course plated dinner service with premium ingredients and presentation.',
        vendorId: vendor2.vendorId,
        categoryId: categories[1].categoryId,
        isApproved: true,
      },
    }),
  ]);

  console.log('Services created:', services1.length + services2.length);

  // ===== PRODUCTS =====
  const products = await Promise.all([
    prisma.product.create({
      data: {
        productName: 'Photo Album - Premium',
        price: 8500.00,
        quantity: 50,
        description: 'Leather-bound 12x18 premium photo album, 60 pages.',
        vendorId: vendor1.vendorId,
        categoryId: categories[0].categoryId,
        isApproved: true,
      },
    }),
    prisma.product.create({
      data: {
        productName: 'Digital Photo Frame',
        price: 15000.00,
        quantity: 25,
        description: '15-inch digital photo frame with 4K display.',
        vendorId: vendor1.vendorId,
        categoryId: categories[0].categoryId,
        isApproved: true,
      },
    }),
    prisma.product.create({
      data: {
        productName: 'Event Decoration Pack',
        price: 35000.00,
        quantity: 10,
        description: 'Complete event decoration set including table centerpieces, drapes, and lighting.',
        vendorId: vendor2.vendorId,
        categoryId: categories[1].categoryId,
        isApproved: true,
      },
    }),
  ]);

  console.log('Products created:', products.length);

  // ===== EVENT PACKAGES =====
  const pkg1 = await prisma.eventPackage.create({
    data: {
      packageName: 'Wedding Package',
      description: 'Complete wedding photography package with pre-wedding shoot, full-day coverage, and premium album.',
      price: 250000.00,
      category: 'Wedding',
      duration: 'Full Day',
      maxGuests: null,
      vendorId: vendor1.vendorId,
      isApproved: true,
      services: {
        create: [
          { name: 'Pre-wedding consultation' },
          { name: 'Full-day wedding coverage' },
          { name: '2 Photographers' },
          { name: '600+ edited photos' },
          { name: 'Premium photo album' },
        ],
      },
    },
  });

  const pkg2 = await prisma.eventPackage.create({
    data: {
      packageName: 'Corporate Event Package',
      description: 'Complete corporate event catering package for up to 100 guests.',
      price: 180000.00,
      category: 'Corporate',
      duration: '4 Hours',
      maxGuests: 100,
      vendorId: vendor2.vendorId,
      isApproved: true,
      services: {
        create: [
          { name: 'Welcome drinks' },
          { name: 'Buffet setup' },
          { name: '2 Main courses' },
          { name: 'Dessert station' },
          { name: 'Service staff' },
        ],
      },
    },
  });

  console.log('Packages created');

  // ===== CUSTOMER =====
  const customer = await prisma.customer.create({
    data: {
      name: 'Dinesh Perera',
      email: 'customer@eventnest.com',
      password: hashedPassword,
      contactNumber: '077-123-4567',
    },
  });

  // Create cart for customer
  const cart = await prisma.cart.create({
    data: { customerId: customer.customerId },
  });

  console.log('Customer created:', customer.email);

  // ===== CART ITEMS =====
  await prisma.cartItem.create({
    data: {
      cartId: cart.cartId,
      productId: products[0].productId,
      quantity: 2,
    },
  });

  // ===== BOOKINGS =====
  const booking = await prisma.booking.create({
    data: {
      customerId: customer.customerId,
      serviceId: services1[0].serviceId,
      eventDate: new Date('2026-08-15'),
      location: 'Taj Samudra, Colombo',
      status: 'ACCEPTED',
      vendorResponseDate: new Date(),
    },
  });

  console.log('Booking created');

  // ===== ORDER =====
  const order = await prisma.order.create({
    data: {
      customerId: customer.customerId,
      totalAmount: 17000.00,
      status: 'DELIVERED',
      shippingAddress: '42, Galle Road, Colombo 03',
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.orderId,
      productId: products[0].productId,
      quantity: 2,
      unitPrice: 8500.00,
    },
  });

  console.log('Order created');

  // ===== PAYMENT =====
  await prisma.payment.create({
    data: {
      amount: 250000.00,
      paymentMethod: 'ONLINE',
      status: 'HELD_IN_ESCROW',
      transactionId: 'TXN-2024-001',
      paidAt: new Date(),
      bookingId: booking.bookingId,
    },
  });

  await prisma.payment.create({
    data: {
      amount: 17000.00,
      paymentMethod: 'ONLINE',
      status: 'RELEASED',
      transactionId: 'TXN-2024-002',
      paidAt: new Date(),
      orderId: order.orderId,
    },
  });

  console.log('Payments created');

  // ===== REVIEWS =====
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Amazing photography! The team was professional and captured every moment beautifully.',
      customerId: customer.customerId,
      vendorId: vendor1.vendorId,
      serviceId: services1[0].serviceId,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Great catering service. Food was delicious and presentation was excellent.',
      customerId: customer.customerId,
      vendorId: vendor2.vendorId,
      productId: products[2].productId,
    },
  });

  console.log('Reviews created');

  // ===== AVAILABILITY =====
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (date.getDay() !== 0) {
      await prisma.availability.create({
        data: {
          vendorId: vendor1.vendorId,
          date,
          startTime: '09:00',
          endTime: '18:00',
          isAvailable: true,
        },
      });
    }
  }

  console.log('Availability created (30 days)');
  console.log('\n=== Seed Complete ===');
  console.log('Admin:      admin@eventnest.com / password123');
  console.log('Vendor 1:   vendor1@eventnest.com / password123');
  console.log('Vendor 2:   vendor2@eventnest.com / password123');
  console.log('Customer:   customer@eventnest.com / password123');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
