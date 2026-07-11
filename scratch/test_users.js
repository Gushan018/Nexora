const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const customers = await prisma.customer.findMany();
  const vendors = await prisma.vendor.findMany();
  console.log('Customers count:', customers.length);
  console.log('Customers:', customers);
  console.log('Vendors count:', vendors.length);
  console.log('Vendors:', vendors);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
