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

  // Reset auto-increment sequences so IDs start from 1
  const sequences = [
    'admin_admin_id_seq','customer_customer_id_seq','vendor_vendor_id_seq',
    'service_category_category_id_seq','service_service_id_seq','product_product_id_seq',
    'event_package_package_id_seq','availability_availability_id_seq','booking_booking_id_seq',
    'cart_cart_id_seq','cart_item_cart_item_id_seq','order_order_id_seq',
    'order_item_order_item_id_seq','payment_payment_id_seq','review_review_id_seq',
    'notification_notification_id_seq'
  ];
  for (const seq of sequences) {
    try { await prisma.$executeRawUnsafe(`ALTER SEQUENCE "${seq}" RESTART WITH 1;`); } catch (e) { console.warn(`Could not reset sequence ${seq}: ${e.message}`); }
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

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

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Sarath Fonseka',
      email: 'sarath@example.com',
      password: hashedPassword,
      contactNumber: '077-123-4567',
    },
  });

  const customer4 = await prisma.customer.create({
    data: {
      name: 'Ravee Fernando',
      email: 'ravee@example.com',
      password: hashedPassword,
      contactNumber: '077-234-5678',
    },
  });

  const customer5 = await prisma.customer.create({
    data: {
      name: 'Dinith Lakgama',
      email: 'dinith@example.com',
      password: hashedPassword,
      contactNumber: '077-345-6789',
    },
  });

  const customer6 = await prisma.customer.create({
    data: {
      name: 'Nimal Perera',
      email: 'nimal@example.com',
      password: hashedPassword,
      contactNumber: '077-456-7890',
    },
  });

  const customer7 = await prisma.customer.create({
    data: {
      name: 'Kumari Jayawardena',
      email: 'kumari@example.com',
      password: hashedPassword,
      contactNumber: '077-567-8901',
    },
  });

  // 3. Create Vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      businessName: 'Luxe Dining Catering',
      email: 'vendor1@example.com',
      password: hashedPassword,
      vendorType: 'CATERING',
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
      pricingModel: 'fixed',
      serviceArea: 'New York, NY',
      vendorId: vendor1.vendorId,
      categoryId: catCatering.categoryId,
      imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80',
    },
  });

  const service2 = await prisma.service.create({
    data: {
      serviceName: 'Live DJ Set',
      price: 800.00,
      description: '4 hours of live DJ performance with lighting.',
      pricingModel: 'hourly',
      serviceArea: 'Miami, FL',
      vendorId: vendor3.vendorId,
      categoryId: catMusic.categoryId,
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80',
    },
  });

  // 6. Create Packages
  const package1 = await prisma.eventPackage.create({
    data: {
      packageName: 'Platinum Wedding Package',
      description: 'Complete wedding decoration package including premium floral arrangements, stage setup, lighting, and coordination. Perfect for a grand celebration.',
      price: 5000,
      categoryId: catDecor.categoryId,
      vendorId: vendor2.vendorId,
    }
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
  const today = new Date();

  const futureDate = (days) => { const d = new Date(today); d.setDate(d.getDate() + days); return d; };
  const pastDate = (days) => { const d = new Date(today); d.setDate(d.getDate() - days); return d; };

  // --- Luxe Dining Catering (vendor1, service1 = Premium Buffet) ---
  const booking1 = await prisma.booking.create({
    data: {
      customerId: customer1.customerId,
      serviceId: service1.serviceId,
      eventDate: futureDate(45),
      status: 'ACCEPTED',
      location: 'New York, NY',
    }
  });

  await prisma.booking.create({
    data: {
      customerId: customer6.customerId,
      serviceId: service1.serviceId,
      eventDate: futureDate(60),
      status: 'PENDING',
      location: 'Brooklyn, NY',
    }
  });

  await prisma.booking.create({
    data: {
      customerId: customer7.customerId,
      serviceId: service1.serviceId,
      eventDate: pastDate(30),
      status: 'COMPLETED',
      location: 'Manhattan, NY',
    }
  });

  await prisma.booking.create({
    data: {
      customerId: customer3.customerId,
      serviceId: service1.serviceId,
      eventDate: futureDate(90),
      status: 'REJECTED',
      location: 'Queens, NY',
    }
  });

  // --- Bloom Designs (vendor2, package1 = Platinum Wedding Package) ---
  const booking2 = await prisma.booking.create({
    data: {
      customerId: customer1.customerId,
      packageId: package1.packageId,
      eventDate: futureDate(45),
      status: 'ACCEPTED',
      location: 'Los Angeles, CA',
    }
  });

  await prisma.booking.create({
    data: {
      customerId: customer5.customerId,
      packageId: package1.packageId,
      eventDate: futureDate(80),
      status: 'PENDING',
      location: 'Santa Monica, CA',
    }
  });

  await prisma.booking.create({
    data: {
      customerId: customer4.customerId,
      packageId: package1.packageId,
      eventDate: pastDate(15),
      status: 'COMPLETED',
      location: 'Beverly Hills, CA',
    }
  });

  // --- SoundWave DJ (vendor3, service2 = Live DJ Set) ---
  await prisma.booking.create({
    data: {
      customerId: customer3.customerId,
      serviceId: service2.serviceId,
      eventDate: futureDate(120),
      status: 'PENDING',
      location: 'Miami Beach, FL',
    }
  });

  await prisma.booking.create({
    data: {
      customerId: customer1.customerId,
      serviceId: service2.serviceId,
      eventDate: futureDate(30),
      status: 'ACCEPTED',
      location: 'Orlando, FL',
    }
  });

  await prisma.booking.create({
    data: {
      customerId: customer2.customerId,
      serviceId: service2.serviceId,
      eventDate: futureDate(200),
      status: 'REJECTED',
      location: 'Tampa, FL',
    }
  });

  await prisma.booking.create({
    data: {
      customerId: customer5.customerId,
      serviceId: service2.serviceId,
      eventDate: pastDate(60),
      status: 'COMPLETED',
      location: 'Fort Lauderdale, FL',
    }
  });

  await prisma.booking.create({
    data: {
      customerId: customer7.customerId,
      serviceId: service2.serviceId,
      eventDate: futureDate(10),
      status: 'CANCELLED',
      location: 'Key West, FL',
    }
  });
  
  // 10. Reviews — distributed across different customers
  // Mike Smith on Luxe Dining
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Absolutely phenomenal service! The catering was world-class and our guests were blown away.',
      customerId: customer2.customerId,
      vendorId: vendor1.vendorId,
      serviceId: service1.serviceId,
    }
  });

  // Sarah Customer on Bloom Designs
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Incredible attention to detail! The floral arrangements at our wedding were breathtaking.',
      customerId: customer1.customerId,
      vendorId: vendor2.vendorId,
    }
  });

  // Sarah Customer on SoundWave DJ
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'The DJ kept the energy high all night. Everyone loved the music selection!',
      customerId: customer1.customerId,
      vendorId: vendor3.vendorId,
      serviceId: service2.serviceId,
    }
  });

  // Sarah Customer on Gold Cutlery Set
  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Good quality cutlery set, but shipping took longer than expected.',
      customerId: customer1.customerId,
      productId: product1.productId,
    }
  });

  // Sarath Fonseka on Luxe Dining
  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Excellent spread! The kottu and rice dishes were authentic and delicious. Our guests could not stop complimenting the food.',
      customerId: customer3.customerId,
      vendorId: vendor1.vendorId,
      serviceId: service1.serviceId,
    }
  });

  // Sarath Fonseka on LED Uplights
  await prisma.review.create({
    data: {
      rating: 2,
      comment: 'Two units arrived damaged. Could have been packaged better. The ones that worked were fine though.',
      customerId: customer3.customerId,
      productId: product2.productId,
    }
  });

  // Ravee Fernando on Bloom Designs
  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Beautiful arrangements, exactly what we wanted for the wedding. The team was very responsive to our requests.',
      customerId: customer4.customerId,
      vendorId: vendor2.vendorId,
    }
  });

  // Ravee Fernando on SoundWave DJ
  await prisma.review.create({
    data: {
      rating: 1,
      comment: 'Very disappointed. The service was unprofessional and they showed up late. Would not recommend.',
      customerId: customer4.customerId,
      vendorId: vendor3.vendorId,
    }
  });

  // Dinith Lakgama on Bloom Designs
  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Beautiful design work. The platinum package made our wedding truly special. Highly recommended!',
      customerId: customer5.customerId,
      vendorId: vendor2.vendorId,
    }
  });

  // Nimal Perera on Luxe Dining
  await prisma.review.create({
    data: {
      rating: 3,
      comment: 'Decent food but portion sizes were smaller than advertised. Taste was good though.',
      customerId: customer6.customerId,
      vendorId: vendor1.vendorId,
      serviceId: service1.serviceId,
    }
  });

  // Nimal Perera on SoundWave DJ
  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Great playlist selection, kept the party going all night! Really knew how to read the crowd.',
      customerId: customer6.customerId,
      vendorId: vendor3.vendorId,
      serviceId: service2.serviceId,
    }
  });

  // Kumari Jayawardena on Luxe Dining
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'The buffet was the highlight of our wedding! Everyone raved about the food. Truly authentic Sri Lankan flavours.',
      customerId: customer7.customerId,
      vendorId: vendor1.vendorId,
      serviceId: service1.serviceId,
    }
  });

  // Kumari Jayawardena on SoundWave DJ
  await prisma.review.create({
    data: {
      rating: 3,
      comment: 'Decent but they arrived late for setup. Music was okay but could have been better.',
      customerId: customer7.customerId,
      vendorId: vendor3.vendorId,
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
