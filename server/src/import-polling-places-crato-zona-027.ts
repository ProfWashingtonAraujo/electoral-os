import { prisma } from './lib/prisma.js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type PollingPlaceInput = {
  name: string;
  address: string;
  neighborhood: string;
  region: string;
  electoralZone: string;
  sections: string[];
};

// Fonte: Sistema Elo / TRE-CE - atualizado em 30/05/2026
// 27ª Zona Eleitoral - Crato/CE
// Total: 91 locais | 380 seções | 96.324 eleitores aptos

const rawPath = path.resolve(__dirname, 'crato-raw.txt');
const rawContent = readFileSync(rawPath, 'utf-8');

function parseRaw(raw: string): PollingPlaceInput[] {
  const entries = raw.split(/={30,}/).map(e => e.trim()).filter(Boolean);
  const places: PollingPlaceInput[] = [];

  for (const entry of entries) {
    const lines = entry.split(/\n/).map(l => l.trim()).filter(Boolean);
    let name = '';
    let address = '';
    let neighborhood = '';
    let cep = '';
    let sectionsLine = '';
    for (const line of lines) {
      if (line.startsWith('LOCAL:')) {
        name = line.replace('LOCAL:', '').trim();
      } else if (line.startsWith('ENDEREÇO:')) {
        address = line.replace('ENDEREÇO:', '').trim();
      } else if (line.startsWith('BAIRRO:')) {
        neighborhood = line.replace('BAIRRO:', '').trim();
      } else if (line.startsWith('CEP:')) {
        cep = line.replace('CEP:', '').trim();
      } else if (line.startsWith('SEÇÕES:')) {
        sectionsLine = line.replace('SEÇÕES:', '').trim();
      }
    }
    // Combine address and cep
    const fullAddress = `${address} (CEP: ${cep})`;
    const sections = sectionsLine.split(',').map(s => s.trim());
    places.push({
      name,
      address: fullAddress,
      neighborhood,
      region: 'Crato',
      electoralZone: '027',
      sections,
    });
  }
  return places;
}

const PLACES: PollingPlaceInput[] = parseRaw(rawContent);

async function main() {
  let created = 0;
  let updated = 0;

  for (const p of PLACES) {
    const existing = await prisma.pollingPlace.findFirst({
      where: { name: p.name, electoralZone: p.electoralZone },
      select: { id: true },
    });

    const data = { ...p, sections: p.sections.join(',') };

    if (existing) {
      await prisma.pollingPlace.update({ where: { id: existing.id }, data });
      updated++;
    } else {
      await prisma.pollingPlace.create({ data });
      created++;
    }
  }

  console.log(`✅ Locais de votação importados — 27ª Zona Eleitoral (Crato/CE)`);
  console.log(`   Criados: ${created} | Atualizados: ${updated} | Total: ${PLACES.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
