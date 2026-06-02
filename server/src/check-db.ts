import { prisma } from './lib/prisma.js';


async function main() {
  try {
    const coordinators = await prisma.coordinator.count();
    const voters = await prisma.voter.count();
    const pollingPlaces = await prisma.pollingPlace.count();

    console.log({
      coordinators,
      voters,
      pollingPlaces
    });
  } catch (error) {
    console.error('Database check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
