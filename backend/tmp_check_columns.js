const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const cols = await prisma.$queryRawUnsafe("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'system_setting' ORDER BY ordinal_position");
    console.log(JSON.stringify(cols, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
