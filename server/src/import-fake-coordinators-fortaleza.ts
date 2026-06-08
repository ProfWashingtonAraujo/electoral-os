import { prisma } from './lib/prisma.js';

type CoordinatorInput = {
  name: string;
  phone: string;
  whatsapp: string;
  region: string;
  neighborhood: string;
  pollingPlaceName: string;
  electoralZone: string;
  electoralSection: string;
  notes: string;
  status: string;
};

const COORDINATORS: CoordinatorInput[] = [
  {
    name: 'Ana Clara Menezes',
    phone: '(85) 99100-1001',
    whatsapp: '(85) 99100-1001',
    region: 'Fortaleza',
    neighborhood: 'CIDADE 2000',
    pollingPlaceName: 'ESCOLA ESTADUAL ARQUITETO ROGERIO FROES',
    electoralZone: '001',
    electoralSection: '136',
    notes: 'Coordenadora fictícia criada para testes em Fortaleza.',
    status: 'active',
  },
  {
    name: 'Bruno Tavares Lima',
    phone: '(85) 99100-1002',
    whatsapp: '(85) 99100-1002',
    region: 'Fortaleza',
    neighborhood: 'MUCURIPE',
    pollingPlaceName: 'ESCOLA ESTADUAL MATIAS BECK',
    electoralZone: '001',
    electoralSection: '343',
    notes: 'Coordenador fictício criado para testes em Fortaleza.',
    status: 'active',
  },
  {
    name: 'Carla Beatriz Farias',
    phone: '(85) 99100-1003',
    whatsapp: '(85) 99100-1003',
    region: 'Fortaleza',
    neighborhood: 'MUCURIPE',
    pollingPlaceName: 'ESCOLA MUNICIPAL JOSE RAMOS TORRES DE MELO',
    electoralZone: '001',
    electoralSection: '347',
    notes: 'Coordenadora fictícia criada para testes em Fortaleza.',
    status: 'active',
  },
  {
    name: 'Diego Rocha Vasconcelos',
    phone: '(85) 99100-1004',
    whatsapp: '(85) 99100-1004',
    region: 'Fortaleza',
    neighborhood: 'VICENTE PINZON',
    pollingPlaceName: 'ESCOLA ESTADUAL DEPUTADO MANOEL RODRIGUES',
    electoralZone: '001',
    electoralSection: '386',
    notes: 'Coordenador fictício criado para testes em Fortaleza.',
    status: 'active',
  },
  {
    name: 'Elisa Monteiro Braga',
    phone: '(85) 99100-1005',
    whatsapp: '(85) 99100-1005',
    region: 'Fortaleza',
    neighborhood: 'CAIS DO PORTO',
    pollingPlaceName: 'ESCOLA MUNICIPAL SAO VICENTE DE PAULO',
    electoralZone: '001',
    electoralSection: '396',
    notes: 'Coordenadora fictícia criada para testes em Fortaleza.',
    status: 'active',
  },
  {
    name: 'Felipe Aragao Queiroz',
    phone: '(85) 99100-1006',
    whatsapp: '(85) 99100-1006',
    region: 'Fortaleza',
    neighborhood: 'VARJOTA',
    pollingPlaceName: 'ESCOLA ESTADUAL BARBARA DE ALENCAR',
    electoralZone: '001',
    electoralSection: '50',
    notes: 'Coordenador fictício criado para testes em Fortaleza.',
    status: 'active',
  },
  {
    name: 'Gabriela Nogueira Paiva',
    phone: '(85) 99100-1007',
    whatsapp: '(85) 99100-1007',
    region: 'Fortaleza',
    neighborhood: 'PAPICU',
    pollingPlaceName: 'ESCOLA ESTADUAL MARIA JOSE MEDEIROS',
    electoralZone: '001',
    electoralSection: '459',
    notes: 'Coordenadora fictícia criada para testes em Fortaleza.',
    status: 'active',
  },
  {
    name: 'Hugo Martins Feitosa',
    phone: '(85) 99100-1008',
    whatsapp: '(85) 99100-1008',
    region: 'Fortaleza',
    neighborhood: 'ALDEOTA',
    pollingPlaceName: 'COLEGIO ANTARES - SANTOS DUMONT',
    electoralZone: '001',
    electoralSection: '40',
    notes: 'Coordenador fictício criado para testes em Fortaleza.',
    status: 'active',
  },
  {
    name: 'Isabela Cardoso Ponte',
    phone: '(85) 99100-1009',
    whatsapp: '(85) 99100-1009',
    region: 'Fortaleza',
    neighborhood: 'PRAIA DO FUTURO II',
    pollingPlaceName: 'ESCOLA MUNICIPAL DOM ALOISIO LORSCHEIDER',
    electoralZone: '001',
    electoralSection: '390',
    notes: 'Coordenadora fictícia criada para testes em Fortaleza.',
    status: 'active',
  },
  {
    name: 'Joao Pedro Holanda',
    phone: '(85) 99100-1010',
    whatsapp: '(85) 99100-1010',
    region: 'Fortaleza',
    neighborhood: 'MEIRELES',
    pollingPlaceName: 'LABOMAR - UFC',
    electoralZone: '001',
    electoralSection: '364',
    notes: 'Coordenador fictício criado para testes em Fortaleza.',
    status: 'active',
  },
  {
    name: 'Livia Sales Freire',
    phone: '(85) 99100-1011',
    whatsapp: '(85) 99100-1011',
    region: 'Fortaleza',
    neighborhood: 'COCÓ',
    pollingPlaceName: 'UNINTA - FACULDADE UNINTA FORTALEZA',
    electoralZone: '001',
    electoralSection: '33',
    notes: 'Coordenadora fictícia criada para testes em Fortaleza.',
    status: 'active',
  },
  {
    name: 'Mateus Cavalcante Rios',
    phone: '(85) 99100-1012',
    whatsapp: '(85) 99100-1012',
    region: 'Fortaleza',
    neighborhood: 'MANUEL DIAS BRANCO',
    pollingPlaceName: 'COLÉGIO CÍVICO MILITAR BATALHA DO RIACHUELO',
    electoralZone: '001',
    electoralSection: '665',
    notes: 'Coordenador fictício criado para testes em Fortaleza.',
    status: 'active',
  },
];

async function main() {
  let created = 0;
  let updated = 0;

  for (const coordinator of COORDINATORS) {
    const pollingPlace = await prisma.pollingPlace.findFirst({
      where: {
        name: coordinator.pollingPlaceName,
        region: coordinator.region,
        electoralZone: coordinator.electoralZone,
      },
      select: { id: true },
    });

    if (!pollingPlace) {
      throw new Error(`Local de votação não encontrado: ${coordinator.pollingPlaceName}`);
    }

    const existing = await prisma.coordinator.findFirst({
      where: { name: coordinator.name, region: coordinator.region },
      select: { id: true },
    });

    const data = {
      name: coordinator.name,
      phone: coordinator.phone,
      whatsapp: coordinator.whatsapp,
      region: coordinator.region,
      neighborhood: coordinator.neighborhood,
      pollingPlaceId: pollingPlace.id,
      electoralZone: coordinator.electoralZone,
      electoralSection: coordinator.electoralSection,
      notes: coordinator.notes,
      status: coordinator.status,
    };

    if (existing) {
      await prisma.coordinator.update({ where: { id: existing.id }, data });
      updated++;
    } else {
      await prisma.coordinator.create({ data });
      created++;
    }
  }

  console.log('✅ Coordenadores fictícios importados — Fortaleza/CE');
  console.log(`   Criados: ${created} | Atualizados: ${updated} | Total: ${COORDINATORS.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
