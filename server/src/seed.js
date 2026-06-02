import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma.js';
async function main() {
    console.log('🌱 Seeding database...');
    // 1. Admin user
    const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@electoralos.com.br' } });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('Admin@2025', 10);
        await prisma.user.create({
            data: {
                name: 'Administrador do Sistema',
                email: 'admin@electoralos.com.br',
                password: hashedPassword,
                role: 'admin',
            }
        });
        console.log('✅ Admin user created: admin@electoralos.com.br / Admin@2025');
    }
    else {
        console.log('ℹ️ Admin user already exists, skipping.');
    }
    // 2. Polling Place
    // Prefer any real place already imported for the city/zone.
    let place = await prisma.pollingPlace.findFirst({
        where: { region: 'Juazeiro do Norte', electoralZone: '028' },
    });
    // Fallback (dev): ensure at least one exists.
    if (!place) {
        place = await prisma.pollingPlace.create({
            data: {
                name: 'Escola Estadual Professor Juarez',
                address: 'Rua Principal, 123',
                neighborhood: 'Centro',
                region: 'Juazeiro do Norte',
                electoralZone: '028',
                sections: '10,11,12',
            },
        });
        console.log('✅ Polling place created (fallback).');
    }
    // 3. Coordinator
    const existingCoord = await prisma.coordinator.findFirst({ where: { name: 'Carlos Coordenador' } });
    let coord = existingCoord;
    if (!existingCoord) {
        coord = await prisma.coordinator.create({
            data: {
                name: 'Carlos Coordenador',
                phone: '(88) 99999-1111',
                whatsapp: '(88) 99999-1111',
                region: 'Juazeiro do Norte',
                neighborhood: 'Centro',
                status: 'active'
            }
        });
        console.log('✅ Coordinator created.');
    }
    // 4. Voter
    const existingVoter = await prisma.voter.findFirst({ where: { name: 'Maria Eleitora' } });
    if (!existingVoter && place && coord) {
        await prisma.voter.create({
            data: {
                name: 'Maria Eleitora',
                phone: '(88) 98888-2222',
                whatsapp: '(88) 98888-2222',
                address: 'Rua das Flores, 45',
                neighborhood: 'Centro',
                city: 'Juazeiro do Norte',
                region: 'Juazeiro do Norte',
                voterRegistration: '123456789012',
                electoralZone: '028',
                electoralSection: '10',
                supportStatus: 'gold',
                registrationSource: 'manual',
                status: 'active',
                coordinatorId: coord.id,
                pollingPlaceId: place.id
            }
        });
        console.log('✅ Voter created.');
    }
    console.log('🎉 Seed finished!');
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map