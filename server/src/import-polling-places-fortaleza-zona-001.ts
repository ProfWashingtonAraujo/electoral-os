import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from './lib/prisma.js';

type PollingPlaceInput = {
  name: string;
  address: string;
  neighborhood: string;
  region: string;
  electoralZone: string;
  sections: string[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonte: Sistema Elo / TRE-CE - atualizado em 04/06/2026 às 11:31:01
// 1ª Zona Eleitoral - Fortaleza/CE
// Total: 41 locais | 354 seções | 126.917 eleitores aptos
const rawPath = path.resolve(__dirname, 'fortaleza-zona-001-raw.txt');
const rawContent = readFileSync(rawPath, 'utf-8');

function parseRaw(raw: string): PollingPlaceInput[] {
  return raw
    .split(/={30,}/)
    .map((entry) => entry.trim())
    .filter((entry) => /^\d+\.\s*CÓD\. LOCAL:/m.test(entry))
    .map((entry) => {
      const lines = entry.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      let name = '';
      let address = '';
      let neighborhood = '';
      let cep = '';
      let sectionsLine = '';

      for (const line of lines) {
        if (line.startsWith('LOCAL:')) name = line.replace('LOCAL:', '').trim();
        else if (line.startsWith('ENDEREÇO:')) address = line.replace('ENDEREÇO:', '').trim();
        else if (line.startsWith('BAIRRO:')) neighborhood = line.replace('BAIRRO:', '').trim();
        else if (line.startsWith('CEP:')) cep = line.replace('CEP:', '').trim();
        else if (line.startsWith('SEÇÕES:')) sectionsLine = line.replace('SEÇÕES:', '').trim();
      }

      if (!name || !address || !neighborhood || !sectionsLine) {
        throw new Error(`Entrada inválida para local: ${entry.slice(0, 120)}`);
      }

      return {
        name,
        address: `${address} (CEP: ${cep})`,
        neighborhood,
        region: 'Fortaleza',
        electoralZone: '001',
        sections: sectionsLine.split(',').map((section) => section.trim()).filter(Boolean),
      };
    });
}

const PLACES = parseRaw(rawContent);

async function main() {
  let created = 0;
  let updated = 0;

  for (const place of PLACES) {
    const existing = await prisma.pollingPlace.findFirst({
      where: { name: place.name, electoralZone: place.electoralZone },
      select: { id: true },
    });

    const data = { ...place, sections: place.sections.join(',') };

    if (existing) {
      await prisma.pollingPlace.update({ where: { id: existing.id }, data });
      updated++;
    } else {
      await prisma.pollingPlace.create({ data });
      created++;
    }
  }

  console.log('✅ Locais de votação importados — 1ª Zona Eleitoral (Fortaleza/CE)');
  console.log(`   Criados: ${created} | Atualizados: ${updated} | Total: ${PLACES.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
