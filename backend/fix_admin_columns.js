const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Adding missing admin columns...');
  await prisma.$executeRaw`ALTER TABLE "admin" ADD COLUMN IF NOT EXISTS "name" TEXT`;
  await prisma.$executeRaw`ALTER TABLE "admin" ADD COLUMN IF NOT EXISTS "contact_number" TEXT`;
  await prisma.$executeRaw`ALTER TABLE "admin" ADD COLUMN IF NOT EXISTS "profile_image" TEXT`;
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error('ERROR', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });