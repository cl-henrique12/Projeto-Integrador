const { PrismaClient } = require('@prisma/client');

console.log('Instantiating PrismaClient...');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Querying store.findMany()...');
  try {
    const lojas = await prisma.store.findMany({
      take: 2,
    });
    console.log('Success! Found lojas count:', lojas.length);
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
