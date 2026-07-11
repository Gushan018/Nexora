const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const customers = await prisma.customer.findMany();
  const vendors = await prisma.vendor.findMany();
  console.log('--- CUSTOMERS (Count: ' + customers.length + ') ---');
  console.log(customers);
  console.log('--- VENDORS (Count: ' + vendors.length + ') ---');
  console.log(vendors.map(v => ({ id: v.vendorId, name: v.businessName, email: v.email })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
