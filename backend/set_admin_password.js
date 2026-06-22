const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const newPassword = 'admin123';
  const hashed = await bcrypt.hash(newPassword, 10);
  const updated = await prisma.admin.updateMany({
    where: { email: 'admin@example.com' },
    data: { password: hashed }
  });
  console.log('Updated admin count:', updated.count);
}

main()
  .catch((e) => {
    console.error('ERROR', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });