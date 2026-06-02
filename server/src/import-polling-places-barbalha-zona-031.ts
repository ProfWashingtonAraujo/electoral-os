import { prisma } from './lib/prisma.js';

type PollingPlaceInput = {
  name: string;
  address: string;
  neighborhood: string;
  region: string;
  electoralZone: string;
  sections: string[];
};

// Fonte: Sistema Elo / TRE-CE - atualizado em 30/05/2026 às 11:31:01
// 31ª Zona Eleitoral - Barbalha/CE
// Total: 49 locais | 179 seções | 53.559 eleitores aptos
const PLACES: PollingPlaceInput[] = [
  {
    // 01 - Cód. 1090
    name: 'EEM ADAUTO BEZERRA',
    address: 'RUA MAJOR SAMPAIO, 75 (CEP: 63180000)',
    neighborhood: 'CENTRO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['16', '17', '18', '84', '102', '129'],
  },
  {
    // 02 - Cód. 1104
    name: 'COLÉGIO NOSSA SENHORA DE FÁTIMA',
    address: 'RUA DA MATRIZ, 258 (CEP: 63180000)',
    neighborhood: 'CENTRO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['3', '4', '19', '20', '21', '67'],
  },
  {
    // 03 - Cód. 1112
    name: 'ETI JOSEFA ALVES DE SOUSA',
    address: 'RUA ZUCA SAMPAIO, S/N - EM FRENTE AO HOSPITAL DO CORAÇÃO (CEP: 63180000)',
    neighborhood: 'VILA SANTO ANTONIO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['27', '28', '55', '62', '104', '106', '109'],
  },
  {
    // 04 - Cód. 1155
    name: 'ESCOLA BEM-ME-QUER',
    address: 'RUA PADRE IBIAPINA, 485 (CEP: 63180000)',
    neighborhood: 'CENTRO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['14', '15', '58', '61', '66'],
  },
  {
    // 05 - Cód. 1163
    name: 'ETI DR. LYRIO CALLOU',
    address: 'RUA EDMUNDO DE SA SAMPAIO, 180 (CEP: 63180000)',
    neighborhood: 'CENTRO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['31', '34', '35', '36', '37'],
  },
  {
    // 06 - Cód. 1171
    name: 'EEF ANTONIO COSTA SAMPAIO (VILA DO ARAJARA)',
    address: 'RODOVIA CE-386, S/N, VILA DO ARAJARA (CEP: 63180000)',
    neighborhood: 'VILA ARAJARA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['2', '7', '8', '38', '39'],
  },
  {
    // 07 - Cód. 1180
    name: 'EMEIF BOM JESUS (VILA DO CALDAS)',
    address: 'RUA DANIEL CORDEIRO NEVES, S/N - PRAÇA PE. CARLOS (CEP: 63180000)',
    neighborhood: 'VILA DO CALDAS',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['5', '6', '42', '43', '111'],
  },
  {
    // 08 - Cód. 1198
    name: 'EEF SENADOR MARTINIANO DE ALENCAR',
    address: 'LARGO DO ROSARIO, 20, CENTRO (CEP: 63180000)',
    neighborhood: 'CENTRO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['44', '46', '136', '164', '175'],
  },
  {
    // 09 - Cód. 1210
    name: 'EEMTI VIRGILIO TAVORA',
    address: 'AV PAULO MAURICIO, 326 (CEP: 63180000)',
    neighborhood: 'VILA SANTO ANTONIO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['49', '50', '51', '110', '144'],
  },
  {
    // 10 - Cód. 1252
    name: 'ETI MARIA LINHARES SAMPAIO (SÍTIO BARRO VERMELHO)',
    address: 'SITIO BARRO VERMELHO (CEP: 63180000)',
    neighborhood: 'BARRO VERMELHO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['69', '76', '108', '148', '174'],
  },
  {
    // 11 - Cód. 1325
    name: 'EEF SEBASTIÃO SANTIAGO DA PAZ (ESTRELA)',
    address: 'AV. JOÃO EVANGELISTA SAMPAIO, S/N (CEP: 63180000)',
    neighborhood: 'DISTRITO ESTRELA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['71', '74', '100', '156'],
  },
  {
    // 12 - Cód. 1341
    name: 'EEF RAUL COELHO DE ALENCAR (CIROLÂNDIA)',
    address: 'RUA JOSÉ COELHO CORREIA, 303 (CEP: 63180000)',
    neighborhood: 'VILA SANTO ANTONIO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['72', '87', '99', '112'],
  },
  {
    // 13 - Cód. 1350
    name: 'EEEP OTÍLIA CORREIA SARAIVA (LICEU DE BARBALHA)',
    address: 'RUA PROJETADA I, S/N (CEP: 63180000)',
    neighborhood: 'PARQUE BULANDEIRA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['30', '78', '101', '123', '141'],
  },
  {
    // 14 - Cód. 1368
    name: 'CVTEC/CENTEC/EMBRAPA',
    address: 'AV JOSE BERNARDINO, S/N - KM 04 (CEP: 63180000)',
    neighborhood: 'BURITI',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['68', '75'],
  },
  {
    // 15 - Cód. 1376
    name: 'EMEIF SANTA LUZIA (SÍTIO LAGOA)',
    address: 'SITIO LAGOA, S/N (CEP: 63180000)',
    neighborhood: 'SÍTIO LAGOA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['70', '77', '115', '119'],
  },
  {
    // 16 - Cód. 1392
    name: 'EEF MARIA VALQUIRIA TELES MOREIRA (MALVINAS)',
    address: 'PRAÇA RUA P10 COM AV LUIZ GONZAGA - MALVINAS (CEP: 63180000)',
    neighborhood: 'MALVINAS',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['80', '97', '118', '124'],
  },
  {
    // 17 - Cód. 1414
    name: 'EEF MARIA ALACOQUE BEZERRA DE FIGUEIREDO (ALTO DA ALEGRIA)',
    address: 'RUA JOSE QUENTAL, 25 - ALTO DA ALEGRIA (CEP: 63180000)',
    neighborhood: 'ALTO DA ALEGRIA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['81', '88', '91', '117', '134', '177'],
  },
  {
    // 18 - Cód. 1422
    name: 'CEI MARTINHO TAVARES TELES (ALTO DA ALEGRIA)',
    address: 'RUA ADERSON SABINO, S/N (CEP: 63180000)',
    neighborhood: 'ALTO DA ALEGRIA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['82', '83', '145'],
  },
  {
    // 19 - Cód. 1481
    name: 'ASSOCIAÇÃO PESTALOZZI DE BARBALHA (BURITI)',
    address: 'AV. JOSÉ BERNARDINO, KM 03 - PROX DA ESCOLA EDSON OLEGÁRIO (CEP: 63180000)',
    neighborhood: 'BURITI',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['79', '90', '107'],
  },
  {
    // 20 - Cód. 1490
    name: 'EMEIF SÃO SEBASTIÃO (SÍTIO MACAÚBA)',
    address: 'RODOVIA CE-386, S/N - MACAÚBA (CEP: 63180000)',
    neighborhood: 'SÍTIO MACAÚBA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['93', '128', '155'],
  },
  {
    // 21 - Cód. 1503
    name: 'EEF CORONEL GREGORIO CALLOU',
    address: 'SITIO SANTA CRUZ, S/N (CEP: 63180000)',
    neighborhood: 'SÍTIO SANTA CRUZ (CALDAS)',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['94', '146'],
  },
  {
    // 22 - Cód. 1511
    name: 'EEF ANA RAMALHO DA SILVA (SÍTIO CABECEIRAS)',
    address: 'RODOVIA CE-293, KM 06 (CEP: 63180000)',
    neighborhood: 'SÍTIO CABECEIRAS',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['92', '116'],
  },
  {
    // 23 - Cód. 1520
    name: 'EEMTI ALMIRO DA CRUZ (SITIO SANTANA II)',
    address: 'AV. PROJETADA IV, S/N - SITIO SANTANA II (CEP: 63180000)',
    neighborhood: 'SANTANA II',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['65', '73', '95', '130', '179'],
  },
  {
    // 24 - Cód. 1538
    name: 'EMEIF MARECHAL RONDON (SÍTIO BETÂNIA)',
    address: 'SITIO BETANIA, S/N (CEP: 63180000)',
    neighborhood: 'BETÂNIA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['96', '180'],
  },
  {
    // 25 - Cód. 1546
    name: 'FACULDADE DE MEDICINA DE BARBALHA (UFCA)',
    address: 'RUA DIVINO SALVADOR, 284 (CEP: 63180000)',
    neighborhood: 'ROSÁRIO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['9', '10', '24', '25', '26'],
  },
  {
    // 26 - Cód. 1562
    name: 'EMEIF NAZINHA GARCIA SAMPAIO (SÍTIO MATA DOS DUDAS)',
    address: 'RUA GEANE NÓBREGA DE ARAÚJO SARAIVA, S/N (CEP: 63180000)',
    neighborhood: 'MATA DOS DUDAS',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['103', '114', '131', '162', '178'],
  },
  {
    // 27 - Cód. 1570
    name: 'EMEIF MARIA NOETE FILGUEIRA DUARTE (SÍTIO CORRENTINHO)',
    address: 'RODOVIA CE-293, KM 7 - SITIO CORRENTINHO (CEP: 63180000)',
    neighborhood: 'SÍTIO CORRENTINHO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['105', '154'],
  },
  {
    // 28 - Cód. 1597
    name: 'EEF CESAR CALS DE OLIVEIRA (CIROLÂNDIA)',
    address: 'RUA JOSÉ COELHO CORREIA, S/N (CEP: 63180000)',
    neighborhood: 'CIROLÂNDIA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['11', '12', '13', '151'],
  },
  {
    // 29 - Cód. 1600
    name: 'CEI MARIA CLEONICE PEREIRA (BREJINHO)',
    address: 'AV JOSÉ VALCENIR DA CRUZ, S/N - EM FRENTE AO PQ VAQUEJADA (CEP: 63180000)',
    neighborhood: 'BREJINHO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['98', '120'],
  },
  {
    // 30 - Cód. 1619
    name: 'COLÉGIO SANTO ANTONIO',
    address: 'AV LYRIO CALLOU, 55 (CEP: 63180000)',
    neighborhood: 'CENTRO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['22', '23', '29', '59', '60', '89'],
  },
  {
    // 31 - Cód. 1627
    name: 'COLÉGIO DOM BOSCO OBJETIVO (CENTRO)',
    address: 'RUA ADÃO APOLINÁRIO, S/N (CEP: 63180000)',
    neighborhood: 'CENTRO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['1', '32', '33', '52', '53', '54', '56', '57', '63'],
  },
  {
    // 32 - Cód. 1643
    name: 'EMEIF DIONÍSIO ROSS COELHO UCHOA',
    address: 'RUA P 01, S/N - SÍTIO MATA DOS LIMAS (CEP: 63180000)',
    neighborhood: 'MATA DOS LIMAS',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['150', '157', '170', '176'],
  },
  {
    // 33 - Cód. 1651
    name: 'CEI MARIA DAS GRAÇAS FURTADO CORREIA (CJ NSA SRA FATIMA)',
    address: 'RUA JOSÉ ILÂNIO COUTO GONDIM, 270 (CEP: 63180000)',
    neighborhood: 'NSA SRA FÁTIMA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['64', '86', '121', '133'],
  },
  {
    // 34 - Cód. 1660
    name: 'CEI MONS. MURILO DE SÁ BARRETO (BELA VISTA)',
    address: 'RUA T22, 254 - BELA VISTA (CEP: 63180000)',
    neighborhood: 'BELA VISTA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['135', '139', '172'],
  },
  {
    // 35 - Cód. 1678
    name: 'CEI RAIMUNDA MARIA SAMPAIO (MALVINAS)',
    address: 'RUA P-19, S/N - PROX. ARENINHA (CEP: 63180000)',
    neighborhood: 'MALVINAS',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['137', '140', '152'],
  },
  {
    // 36 - Cód. 1686
    name: 'EMEIF RAIMUNDO SEBASTIÃO SAMPAIO (SÍTIO VENHA VER)',
    address: 'VILA SÃO FRANCISCO, S/N - POR TRÁS DO CONDOMÍNIO TERRA DOS KARIRIS (CEP: 63180000)',
    neighborhood: 'SÍTIO VENHA VER',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['147', '149', '153'],
  },
  {
    // 37 - Cód. 1716
    name: 'ETI ANTONIO GONDIM SAMPAIO (CIROLÂNDIA)',
    address: 'RUA CINOBILINA CALLOU (L3), 463 (CEP: 63180000)',
    neighborhood: 'CIROLÂNDIA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['127', '158', '163'],
  },
  {
    // 38 - Cód. 1724
    name: 'CEI MARIA ALACOQUE SAMPAIO (ROSÁRIO)',
    address: 'RUA PADRE JATAÍ, 05 (CEP: 63180000)',
    neighborhood: 'ROSÁRIO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['45', '159'],
  },
  {
    // 39 - Cód. 1732
    name: 'CEI MARIA NEITE CRUZ (MINHA CASA MINHA VIDA)',
    address: 'RUA PROJETADA 02 - RESID PEDRO RAIMUNDO DA CRUZ (CEP: 63180000)',
    neighborhood: 'BARRO BRANCO (MINHA CASA MINHA VIDA)',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['161'],
  },
  {
    // 40 - Cód. 1740
    name: 'EMEIF MARIA DAS DORES SAMPAIO (ALTO DO ROSÁRIO)',
    address: 'RUA ENG. MARCO AURÉLIO, S/N - ALTO DO ROSÁRIO (CEP: 63180000)',
    neighborhood: 'ALTO DO ROSÁRIO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['47', '113', '168'],
  },
  {
    // 41 - Cód. 1759
    name: 'CRECHE TIA CHICA (ESTRELA)',
    address: 'AV. JOÃO EVANGELISTA SAMPAIO, S/N (CEP: 63180000)',
    neighborhood: 'DISTRITO ESTRELA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['122', '143'],
  },
  {
    // 42 - Cód. 1775
    name: 'CEI ANTÔNIA DOLORES DE SÁ BARRETO (MALVINAS)',
    address: 'RUA P-10, 26 - EM FRENTE A SOAFA MALVINAS (CEP: 63180000)',
    neighborhood: 'MALVINAS',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['132', '165'],
  },
  {
    // 43 - Cód. 1783
    name: 'ETI EDSON OLEGÁRIO DE SANTANA (BURITI)',
    address: 'AV JOSÉ BERNARDINO KM 03, S/N (CEP: 63180000)',
    neighborhood: 'BURITI',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['125', '138', '160'],
  },
  {
    // 44 - Cód. 1813
    name: 'COMPLEXO AMBIENTAL/TELEFÉRICO MIRANTE DO CALDAS',
    address: 'RUA DANIEL CORDEIRO DAS NEVES, S/N (CEP: 63180000)',
    neighborhood: 'VILA DO CALDAS',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['85'],
  },
  {
    // 45 - Cód. 1830
    name: 'EMEIF OLEGÁRIO ANTONIO DE JESUS (SÍTIO SANTA TEREZA)',
    address: 'SÍTIO SANTA TEREZA, S/N (CEP: 63180000)',
    neighborhood: 'SÍTIO SANTA TEREZA',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['169'],
  },
  {
    // 46 - Cód. 1848
    name: 'CEI MARIA RAIMUNDA DO ESPÍRITO SANTO DA COSTA (ARAJARA)',
    address: 'SÍTIO BOA ESPERANÇA, S/N - DISTRITO DE ARAJARA (CEP: 63180000)',
    neighborhood: 'SÍTIO BOA ESPERANÇA (ARAJARA)',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['40', '41', '48', '171'],
  },
  {
    // 47 - Cód. 1856
    name: 'EEF BRASIL (SÍTIO CABECEIRAS)',
    address: 'SÍTIO CABECEIRAS, S/N (CEP: 63180000)',
    neighborhood: 'SÍTIO CABECEIRAS',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['142', '167'],
  },
  {
    // 48 - Cód. 1864
    name: 'ASSOCIAÇÃO DOS PEQUENOS AGRICULTORES (SÍTIO TAQUARI)',
    address: 'SÍTIO TAQUARI I, S/N (CEP: 63180000)',
    neighborhood: 'SÍTIO TAQUARI',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['166'],
  },
  {
    // 49 - Cód. 1880
    name: 'CEI MARIA NILCE CORREIA FILGUEIRA (VILA SANTO ANTONIO)',
    address: 'RUA ANTÔNIO ADRIANO ALMEIDA (ANTÔNIO BIRIMBA) (CEP: 63090720)',
    neighborhood: 'VILA SANTO ANTONIO',
    region: 'Barbalha',
    electoralZone: '031',
    sections: ['173'],
  },
];

async function main() {
  let created = 0;
  let updated = 0;

  for (const p of PLACES) {
    const existing = await prisma.pollingPlace.findFirst({
      where: {
        name: p.name,
        electoralZone: p.electoralZone,
      },
      select: { id: true },
    });

    const data = {
      ...p,
      sections: p.sections.join(','),
    };

    if (existing) {
      await prisma.pollingPlace.update({
        where: { id: existing.id },
        data,
      });
      updated++;
    } else {
      await prisma.pollingPlace.create({ data });
      created++;
    }
  }

  console.log(`✅ Locais de votação importados — 31ª Zona Eleitoral (Barbalha/CE)`);
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
