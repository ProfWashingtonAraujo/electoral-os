import { prisma } from './lib/prisma.js';

// Removes the initial placeholder polling place created by older seeds.
// Also re-links any voters pointing to it.

async function main() {
  const placeholder = await prisma.pollingPlace.findFirst({
    where: {
      name: 'Escola Estadual Professor Juarez',
      address: 'Rua Principal, 123',
      electoralZone: '028',
      region: 'Juazeiro do Norte',
    },
  });

  if (!placeholder) {
    console.log('ℹ️ Placeholder polling place not found. Nothing to do.');
    return;
  }

  const replacement = await prisma.pollingPlace.findFirst({
    where: {
      electoralZone: '028',
      region: 'Juazeiro do Norte',
      NOT: { id: placeholder.id },
    },
    select: { id: true, name: true },
  });

  if (!replacement) {
    throw new Error('No replacement polling place found (zone 028 / Juazeiro do Norte).');
  }

  const relink = await prisma.voter.updateMany({
    where: { pollingPlaceId: placeholder.id },
    data: { pollingPlaceId: replacement.id },
  });

  await prisma.pollingPlace.delete({ where: { id: placeholder.id } });

  console.log(
    `✅ Removed placeholder polling place. Re-linked voters: ${relink.count}. Replacement: ${replacement.name}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
