const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // ============ ADMIN ============
  console.log('Creating admin...');
  await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      contactNumber: '011-234-5678',
      role: 'admin',
    },
  });

  // ============ CUSTOMERS ============
  console.log('Creating customers...');

  await prisma.customer.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      name: 'Sarah new Customer',
      email: 'sarah@example.com',
      password: hashedPassword,
      contactNumber: '123-456-7890',
    },
  });

  await prisma.customer.upsert({
    where: { email: 'mike@example.com' },
    update: {},
    create: {
      name: 'Mike Smith',
      email: 'mike@example.com',
      password: hashedPassword,
      contactNumber: '098-765-4321',
    },
  });

  await prisma.customer.upsert({
    where: { email: 'sarath@example.com' },
    update: {},
    create: {
      name: 'Sarath Fonseka',
      email: 'sarath@example.com',
      password: hashedPassword,
      contactNumber: '077-123-4567',
    },
  });

  await prisma.customer.upsert({
    where: { email: 'ravee@example.com' },
    update: {},
    create: {
      name: 'Ravee Fernando',
      email: 'ravee@example.com',
      password: hashedPassword,
      contactNumber: '077-234-5678',
    },
  });

  await prisma.customer.upsert({
    where: { email: 'dinith@example.com' },
    update: {},
    create: {
      name: 'Dinith Lakgama',
      email: 'dinith@example.com',
      password: hashedPassword,
      contactNumber: '077-345-6789',
    },
  });

  await prisma.customer.upsert({
    where: { email: 'nimal@example.com' },
    update: {},
    create: {
      name: 'Nimal Perera',
      email: 'nimal@example.com',
      password: hashedPassword,
      contactNumber: '077-456-7890',
    },
  });

  await prisma.customer.upsert({
    where: { email: 'kumari@example.com' },
    update: {},
    create: {
      name: 'Kumari Jayawardena',
      email: 'kumari@example.com',
      password: hashedPassword,
      contactNumber: '077-567-8901',
    },
  });

  // ============ VENDORS ============
  console.log('Creating vendors...');

  const vendor1 = await prisma.vendor.upsert({
    where: { email: 'vendor1@example.com' },
    update: {},
    create: {
      businessName: 'Luxe Dining Catering',
      email: 'vendor1@example.com',
      password: hashedPassword,
      vendorType: 'CATERING',
      description: 'Premium catering for luxury events.',
      location: 'New York, NY',
      contactNumber: '011-111-1111',
      isApproved: true,
      booking_lead_time: '48h',
      cancellation_policy: 'Moderate',
      currency: 'LKR',
      instant_book: false,
      require_deposits: false,
      timezone: 'UTC',
    },
  });

  const vendor2 = await prisma.vendor.upsert({
    where: { email: 'vendor2@example.com' },
    update: {},
    create: {
      businessName: 'Bloom Designs',
      email: 'vendor2@example.com',
      password: hashedPassword,
      vendorType: 'OTHER',
      description: 'Beautiful floral arrangements for weddings.',
      location: 'Los Angeles, CA',
      contactNumber: '011-222-2222',
      isApproved: true,
      booking_lead_time: '48h',
      cancellation_policy: 'Moderate',
      currency: 'LKR',
      instant_book: false,
      require_deposits: false,
      timezone: 'UTC',
    },
  });

  const vendor3 = await prisma.vendor.upsert({
    where: { email: 'dj@example.com' },
    update: {},
    create: {
      businessName: 'SoundWave DJ',
      email: 'dj@example.com',
      password: hashedPassword,
      vendorType: 'DJ',
      description: 'The best party DJs in town.',
      location: 'Miami, FL',
      contactNumber: '011-333-3333',
      isApproved: true,
      booking_lead_time: '48h',
      cancellation_policy: 'Moderate',
      currency: 'LKR',
      instant_book: false,
      require_deposits: false,
      timezone: 'UTC',
    },
  });

  // ============ SERVICE CATEGORIES ============
  console.log('Creating service categories...');

  const catCatering = await prisma.serviceCategory.upsert({
    where: { categoryId: 1 },
    update: {},
    create: { categoryName: 'Food & Catering' },
  });
  const catDecor = await prisma.serviceCategory.upsert({
    where: { categoryId: 2 },
    update: {},
    create: { categoryName: 'Decorations' },
  });
  const catMusic = await prisma.serviceCategory.upsert({
    where: { categoryId: 3 },
    update: {},
    create: { categoryName: 'Music & Entertainment' },
  });

  // Get actual vendor IDs after upsert
  const v1 = await prisma.vendor.findUnique({ where: { email: 'vendor1@example.com' } });
  const v2 = await prisma.vendor.findUnique({ where: { email: 'vendor2@example.com' } });
  const v3 = await prisma.vendor.findUnique({ where: { email: 'dj@example.com' } });

  const c1 = await prisma.customer.findUnique({ where: { email: 'sarah@example.com' } });
  const c2 = await prisma.customer.findUnique({ where: { email: 'mike@example.com' } });
  const c3 = await prisma.customer.findUnique({ where: { email: 'sarath@example.com' } });
  const c4 = await prisma.customer.findUnique({ where: { email: 'ravee@example.com' } });
  const c5 = await prisma.customer.findUnique({ where: { email: 'dinith@example.com' } });
  const c6 = await prisma.customer.findUnique({ where: { email: 'nimal@example.com' } });
  const c7 = await prisma.customer.findUnique({ where: { email: 'kumari@example.com' } });

  const cat1 = await prisma.serviceCategory.findUnique({ where: { categoryId: 1 } });
  const cat2 = await prisma.serviceCategory.findUnique({ where: { categoryId: 2 } });
  const cat3 = await prisma.serviceCategory.findUnique({ where: { categoryId: 3 } });

  // ============ SERVICES ============
  console.log('Creating services...');

  const service1 = await prisma.service.upsert({
    where: { serviceId: 1 },
    update: {},
    create: {
      serviceName: 'Premium Buffet',
      price: 2500.00,
      description: 'A 5-course buffet for up to 100 guests.',
      vendorId: v1.vendorId,
      categoryId: cat1.categoryId,
      isApproved: true,
      imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80',
      pricing_model: 'fixed',
      service_area: 'New York, NY',
    },
  });

  const service2 = await prisma.service.upsert({
    where: { serviceId: 2 },
    update: {},
    create: {
      serviceName: 'Live DJ Set',
      price: 800.00,
      description: '4 hours of live DJ performance with lighting.',
      vendorId: v3.vendorId,
      categoryId: cat3.categoryId,
      isApproved: true,
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80',
      pricing_model: 'hourly',
      service_area: 'Miami, FL',
    },
  });

  // ============ EVENT PACKAGES ============
  console.log('Creating event packages...');

  const package1 = await prisma.eventPackage.upsert({
    where: { packageId: 1 },
    update: {},
    create: {
      packageName: 'Platinum Wedding Package',
      price: 5000.00,
      description: 'Complete wedding decoration package including premium floral arrangements, stage setup, lighting, and coordination.',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80',
      vendorId: v2.vendorId,
      category_id: cat2.categoryId,
      isApproved: true,
    },
  });

  // ============ PRODUCTS ============
  console.log('Creating products...');

  const product1 = await prisma.product.upsert({
    where: { productId: 1 },
    update: {},
    create: {
      productName: 'Gold Cutlery Set',
      price: 120.00,
      quantity: 50,
      description: 'Set of 100 premium gold-plated cutlery.',
      vendorId: v1.vendorId,
      categoryId: cat1.categoryId,
      isApproved: true,
      imageUrl: 'https://images.unsplash.com/photo-1582283082596-f9f2d1e2e987?w=500&q=80',
    },
  });

  const product2 = await prisma.product.upsert({
    where: { productId: 2 },
    update: {},
    create: {
      productName: 'LED Uplights',
      price: 45.00,
      quantity: 100,
      description: 'Bright LED lights for ambient room lighting.',
      vendorId: v3.vendorId,
      categoryId: cat2.categoryId,
      isApproved: true,
      imageUrl: 'https://images.unsplash.com/photo-1505236858219-8359eb29e325?w=500&q=80',
    },
  });

  // ============ ORDERS ============
  console.log('Creating orders...');

  const existingOrder = await prisma.order.findUnique({ where: { orderId: 1 } });
  if (!existingOrder) {
    await prisma.order.create({
      data: {
        order_id: 1,
        customerId: c1.customerId,
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
  }

  // ============ BOOKINGS ============
  console.log('Creating bookings...');
  const upcomingDate = new Date();
  upcomingDate.setDate(upcomingDate.getDate() + 45);

  const bookDates = {
    aug7: new Date('2026-08-07'),
    aug22: new Date('2026-08-22'),
    may24: new Date('2026-05-24'),
    sep21: new Date('2026-09-21'),
    sep11: new Date('2026-09-11'),
    jun8: new Date('2026-06-08'),
    oct21: new Date('2026-10-21'),
    jul23: new Date('2026-07-23'),
    jan9: new Date('2027-01-09'),
    apr24: new Date('2026-04-24'),
    jul3: new Date('2026-07-03'),
  };

  const existingBooking = await prisma.booking.findFirst();
  if (!existingBooking) {
    const bookingsData = [
      { customerId: c1.customerId, serviceId: service1.serviceId, eventDate: bookDates.aug7, status: 'ACCEPTED', location: 'New York, NY' },
      { customerId: c6.customerId, serviceId: service1.serviceId, eventDate: bookDates.aug22, status: 'PENDING', location: 'Brooklyn, NY' },
      { customerId: c7.customerId, serviceId: service1.serviceId, eventDate: bookDates.may24, status: 'COMPLETED', location: 'Manhattan, NY' },
      { customerId: c3.customerId, serviceId: service1.serviceId, eventDate: bookDates.sep21, status: 'REJECTED', location: 'Queens, NY' },
      { customerId: c1.customerId, packageId: package1.packageId, eventDate: bookDates.aug7, status: 'ACCEPTED', location: 'Los Angeles, CA' },
      { customerId: c5.customerId, packageId: package1.packageId, eventDate: bookDates.sep11, status: 'PENDING', location: 'Santa Monica, CA' },
      { customerId: c4.customerId, packageId: package1.packageId, eventDate: bookDates.jun8, status: 'COMPLETED', location: 'Beverly Hills, CA' },
      { customerId: c3.customerId, serviceId: service2.serviceId, eventDate: bookDates.oct21, status: 'PENDING', location: 'Miami Beach, FL' },
      { customerId: c1.customerId, serviceId: service2.serviceId, eventDate: bookDates.jul23, status: 'ACCEPTED', location: 'Orlando, FL' },
      { customerId: c2.customerId, serviceId: service2.serviceId, eventDate: bookDates.jan9, status: 'REJECTED', location: 'Tampa, FL' },
      { customerId: c5.customerId, serviceId: service2.serviceId, eventDate: bookDates.apr24, status: 'COMPLETED', location: 'Fort Lauderdale, FL' },
      { customerId: c7.customerId, serviceId: service2.serviceId, eventDate: bookDates.jul3, status: 'CANCELLED', location: 'Key West, FL' },
    ];

    for (const b of bookingsData) {
      await prisma.booking.create({ data: b });
    }
  }

  // ============ REVIEWS ============
  console.log('Creating reviews...');

  const existingReview = await prisma.review.findFirst();
  if (!existingReview) {
    const reviewsData = [
      { rating: 5, comment: 'Absolutely phenomenal service! The catering was world-class and our guests were blown away.', customerId: c2.customerId, vendorId: v1.vendorId, serviceId: service1.serviceId },
      { rating: 5, comment: 'Incredible attention to detail! The floral arrangements at our wedding were breathtaking.', customerId: c1.customerId, vendorId: v2.vendorId },
      { rating: 5, comment: 'The DJ kept the energy high all night. Everyone loved the music selection!', customerId: c1.customerId, vendorId: v3.vendorId, serviceId: service2.serviceId },
      { rating: 4, comment: 'Good quality cutlery set, but shipping took longer than expected.', customerId: c1.customerId, productId: product1.productId },
      { rating: 4, comment: 'Excellent spread! The kottu and rice dishes were authentic and delicious.', customerId: c3.customerId, vendorId: v1.vendorId, serviceId: service1.serviceId },
      { rating: 2, comment: 'Two units arrived damaged. Could have been packaged better. The ones that worked were fine though.', customerId: c3.customerId, productId: product2.productId },
      { rating: 4, comment: 'Beautiful arrangements, exactly what we wanted for the wedding. The team was very responsive.', customerId: c4.customerId, vendorId: v2.vendorId },
      { rating: 1, comment: 'Very disappointed. The service was unprofessional and they showed up late. Would not recommend.', customerId: c4.customerId, vendorId: v3.vendorId },
      { rating: 4, comment: 'Beautiful design work. The platinum package made our wedding truly special!', customerId: c5.customerId, vendorId: v2.vendorId },
      { rating: 3, comment: 'Decent food but portion sizes were smaller than advertised. Taste was good though.', customerId: c6.customerId, vendorId: v1.vendorId, serviceId: service1.serviceId },
      { rating: 4, comment: 'Great playlist selection, kept the party going all night! Really knew how to read the crowd.', customerId: c6.customerId, vendorId: v3.vendorId, serviceId: service2.serviceId },
      { rating: 5, comment: 'The buffet was the highlight of our wedding! Everyone raved about the food. Truly authentic Sri Lankan flavours.', customerId: c7.customerId, vendorId: v1.vendorId, serviceId: service1.serviceId },
      { rating: 3, comment: 'Decent but they arrived late for setup. Music was okay but could have been better.', customerId: c7.customerId, vendorId: v3.vendorId },
    ];

    for (const r of reviewsData) {
      await prisma.review.create({ data: r });
    }
  }

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
