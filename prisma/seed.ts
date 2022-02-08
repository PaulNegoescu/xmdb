// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { getAdmin, roles } from './seedData';

const prisma = new PrismaClient();

async function main() {
  console.info('Seeding...');
  await prisma.role.createMany({ data: roles });
  const role = await prisma.role.findFirst({
    where: { name: 'superadmin' },
  });
  const admUser = await getAdmin();
  admUser.role.connect.id = role.id;
  await prisma.user.create({ data: admUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
