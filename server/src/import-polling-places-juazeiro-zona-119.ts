import { prisma } from './lib/prisma.js';

type PollingPlaceInput = {
  name: string;
  address: string;
  neighborhood: string;
  region: string;
  electoralZone: string;
  sections: string[];
};

// Source: TRE/CE - Sistema Elo (07/05/2026)
// Juazeiro do Norte - 119a Zona Eleitoral
const PLACES: PollingPlaceInput[] = [
  {
    name: 'ESCOLA ODORINA CASTELO BRANCO SAMPAIO',
    address: 'AV. JOSE BEZERRA DE MENEZES, S/N (CEP: 63030090)',
    neighborhood: 'LIMOEIRO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['3', '4', '5', '6', '7', '78', '79'],
  },
  {
    name: 'EMEI IRMA NELY SOBREIRA (CRECHE)',
    address: 'AV. JOSE BEZERRA, 216 (CEP: 63030180)',
    neighborhood: 'LIMOEIRO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['8', '9', '10', '11', '12', '449'],
  },
  {
    name: 'COLEGIO POLIVALENTE',
    address: 'JOSE MARROCOS, S/N (CEP: 63050245)',
    neighborhood: 'SANTA TEREZA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['13', '14', '15', '16', '17', '18', '19', '20', '45', '200', '218', '222', '274', '401', '446'],
  },
  {
    name: 'COLEGIO MILITAR DE JUAZEIRO DO NORTE',
    address: 'CASTELO BRANCO, S/N (CEP: 63050480)',
    neighborhood: 'SANTA TEREZA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['21', '22', '23', '24', '25', '26', '27', '28', '29', '110', '111', '112', '113', '412', '423'],
  },
  {
    name: 'EEMTI DOM DOM ANTONIO CAMPELO DE ARAGAO (CAIC)',
    address: 'RUA VEREADOR RAIMUNDO JOSE RODRIGUES DA SILVA, S/N (CEP: 63041640)',
    neighborhood: 'FREI DAMIAO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['191', '202', '206', '216', '264'],
  },
  {
    name: 'ESCOLA ADAUTO BEZERRA (SEGUNDO GRAU)',
    address: 'CASTELO BRANCO, S/N (CEP: 63050480)',
    neighborhood: 'SANTA TEREZA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['39', '40', '41', '42', '43', '44', '46', '71', '103', '104', '105', '114', '189', '413', '442'],
  },
  {
    name: 'ESCOLA ZILA BELEM',
    address: 'FRANCISCO VICENTE SILVA CAVALCANTE, S/N (CEP: 63041090)',
    neighborhood: 'PREFEITO CARLOS ALBERTO DA CRUZ',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['36', '37', '47', '48', '49', '50', '51', '52', '53', '55', '373', '404', '417', '441', '452', '460'],
  },
  {
    name: 'ESCOLA PROFESSORA MARIA GERMANO',
    address: 'RUA ARNOBIO BACELAR CANECA, S/N (CEP: 63040270)',
    neighborhood: 'LAGOA SECA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['56', '57', '58', '226', '258', '418', '468'],
  },
  {
    name: 'ESCOLA PREFEITO ANTONIO CONSERVA',
    address: 'CONSTRUTOR JOSE SABINO, S/N (CEP: 63041180)',
    neighborhood: 'ANTONIO VIEIRA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['59', '60', '61', '62', '196', '209', '230', '271', '379', '389', '406', '476'],
  },
  {
    name: 'EEF FELIPE NERY DA SILVA',
    address: 'PRIMEIRO DE MAIO, S/N (CEP: 63020325)',
    neighborhood: 'LIMOEIRO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['72', '73', '74', '75', '76', '77'],
  },
  {
    name: 'ESCOLA CLOTILDE SARAIVA COELHO',
    address: 'LIMOEIRO, 2338 (CEP: 63020070)',
    neighborhood: 'PIRAJA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['80', '81', '82', '91', '92', '93', '94', '197', '217', '410', '474'],
  },
  {
    name: 'ESCOLA MARIA AMELIA BEZERRA',
    address: 'AV. CASTELO BRANCO, S/N (CEP: 63020000)',
    neighborhood: 'PIRAJA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['83', '84', '85', '86', '87', '88', '89', '90', '224', '239', '248', '256'],
  },
  {
    name: 'ESCOLA ANTONIO FERREIRA DE MELO',
    address: 'RODOVIA JUAZEIRO/CRATO (CEP: 63041140)',
    neighborhood: 'SAO JOSE',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['95', '96', '97', '179', '210'],
  },
  {
    name: 'ESCOLA LILI NERY',
    address: 'RUA PADRE ALCANTARA, 1000 (CEP: 63010410)',
    neighborhood: 'JOAO CABRAL',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['68', '69', '70', '98', '99', '100', '101', '102', '227', '269', '384'],
  },
  {
    name: 'ESCOLA CAROLINA SOBREIRA',
    address: 'RUA JOSE SABIA, S/N (CEP: 63031010)',
    neighborhood: 'TIRADENTES',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['106', '107', '108', '109', '188', '243', '249', '251', '261', '263', '375', '435', '463'],
  },
  {
    name: 'ESCOLA SESI/SENAI PADRE AZARIAS SOBREIRA',
    address: 'RUA JOSE MARROCOS, 2265 (CEP: 63050240)',
    neighborhood: 'ROMEIRAO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['115', '116', '117', '118', '119', '120', '121', '122'],
  },
  {
    name: 'ESCOLA TARCILA CRUZ ALENCAR',
    address: 'CASTELO BRANCO, 4451 (CEP: 63030200)',
    neighborhood: 'NOVO JUAZEIRO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['123', '138', '139', '140', '190', '199', '229', '272', '377', '415', '444', '462'],
  },
  {
    name: 'ESCOLA DOM VICENTE DE PAULA ARAUJO MATOS',
    address: 'RUA RUI BARBOSA, 1935 (CEP: 63030000)',
    neighborhood: 'TIMBAUBA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['192', '212', '232', '244', '257', '276', '402', '455'],
  },
  {
    name: 'ESCOLA AMALIA XAVIER',
    address: 'RUI BARBOSA, 468 (CEP: 63180000)',
    neighborhood: 'PIRAJA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['126', '127', '128', '129', '130', '131', '132', '214', '381'],
  },
  {
    name: 'ESCOLA TIRADENTES',
    address: 'CASTELO BRANCO, S/N (CEP: 63030200)',
    neighborhood: 'NOVO JUAZEIRO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['133', '134', '135', '136', '137', '223', '238', '245', '252', '416', '445', '473'],
  },
  {
    name: 'ESCOLA JERONIMO FREIRE DOS SANTOS',
    address: 'VIRGINIA MENDONCA, S/N (CEP: 63050680)',
    neighborhood: 'JOAO CABRAL',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['141', '207', '237', '277', '451'],
  },
  {
    name: 'ESCOLA IZABEL DA LUZ',
    address: 'AV. AILTON GOMES, S/N (CEP: 63180000)',
    neighborhood: 'PIRAJA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['142', '143', '144', '145', '146', '147', '148', '470'],
  },
  {
    name: 'ESCOLA IVA EMIDIO GONDIM',
    address: 'PIO NOROES, S/N (CEP: 63050480)',
    neighborhood: 'JOAO CABRAL',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['151', '152', '153', '154', '155', '156', '157', '198', '221', '242', '268', '400'],
  },
  {
    name: 'ESCOLA GOVERNADOR MANOEL DE CASTRO FILHO',
    address: 'RUA IVANIR FEITOSA, S/N (CEP: 63031140)',
    neighborhood: 'TIRADENTES',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['158', '159', '160', '195', '204', '220', '236', '475'],
  },
  {
    name: 'ESCOLA DOUTOR MOZART CARDOSO DE ALENCAR',
    address: 'ARNOBIO BACELAR CANECA (CEP: 63040270)',
    neighborhood: 'LAGOA SECA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['161', '162', '241', '265', '380', '403', '467'],
  },
  {
    name: 'ESCOLA DEMOSTENES RATTS BARBOSA',
    address: 'AILTON GOMES, S/N (CEP: 63020000)',
    neighborhood: 'PIRAJA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['163', '164', '165', '166', '167', '168', '169', '170', '171', '201', '471'],
  },
  {
    name: 'CREDE 19',
    address: 'RUI BARBOSA, S/N (CEP: 63050380)',
    neighborhood: 'SANTA TEREZA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['172', '173', '174', '175', '176', '177'],
  },
  {
    name: 'ESCOLA CICERA GERMANO CORREIA',
    address: 'RUA SEBASTIAO REGIS, S/N (CEP: 63020840)',
    neighborhood: 'AEROPORTO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['178', '194', '203', '211', '225', '235', '240', '247', '253', '259', '443', '465'],
  },
  {
    name: 'ESCOLA ANTONIO BEZERRA MONTEIRO',
    address: 'SEBASTIAO CAVALCANTE, S/N (CEP: 63028290)',
    neighborhood: 'TIMBAUBA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['180', '181', '182', '183', '184', '185', '424'],
  },
  {
    name: 'ESCOLA MARIO DA SILVA BEM',
    address: 'RUA VEREADOR RAIMUNDO JOSE DA SILVA (CEP: 63041620)',
    neighborhood: 'FREI DAMIAO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['30', '31', '32', '33', '34', '35', '262', '278', '378', '383', '391', '396', '420'],
  },
  {
    name: 'URCA - CAMPUS CRAJUBAR (TRIANGULO)',
    address: 'AVENIDA LEAO SAMPAIO, 107 (CEP: 63041145)',
    neighborhood: 'PREFEITO CARLOS ALBERTO DA CRUZ',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['54', '205', '213', '228', '233', '246', '254', '273', '372', '388', '425'],
  },
  {
    name: 'LICEU - EEEP ADERSON BORGES DE CARVALHO',
    address: 'R. VICENTE TEIXEIRA DE MACEDO, 561 (CEP: 63040380)',
    neighborhood: 'PLANALTO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['382', '390', '394'],
  },
  {
    name: 'EMEI ODETE MATOS DE ALENCAR',
    address: 'AVENIDA CASTELO BRANCO, 532 (CEP: 63010010)',
    neighborhood: 'NOVO JUAZEIRO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['392', '421'],
  },
  {
    name: '(CENTRINHO) CENTRO DE INTEGRACAO EDUCACIONAL VICENCIA MARIA DE OLIVEIRA',
    address: 'AVENIDA CASTELO BRANCO, S/N (CEP: 63030200)',
    neighborhood: 'NOVO JUAZEIRO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['393', '405', '411', '419'],
  },
  {
    name: 'ESCOLA MARIA DE LOURDES JEREISSATI',
    address: 'RUA CECILIA SILVA DE SOUSA (CEP: 63024480)',
    neighborhood: 'SAO JOSE',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['234', '250', '260', '270', '395', '422', '432'],
  },
  {
    name: 'CRAS TIMBAUBAS',
    address: 'RUA ASSIS DIAS SOBREIRA, 488 (CEP: 63028170)',
    neighborhood: 'TIMBAUBA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['193', '208', '231', '376'],
  },
  {
    name: 'EMEI MADRE MARIA VILLAC',
    address: 'RUA RUI BARBOSA, S/N (CEP: 63030010)',
    neighborhood: 'TIMBAUBA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['124', '125', '186', '187', '458'],
  },
  {
    name: 'COLEGIO ESTRELA',
    address: 'AVENIDA DEPUTADO DUARTE JUNIOR, 457 (CEP: 63020650)',
    neighborhood: 'AEROPORTO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['266', '374', '385', '399'],
  },
  {
    name: 'SECRETARIA DE CULTURA DE JUAZEIRO DO NORTE',
    address: 'RUA ANTONIO VALTER HONORATO, S/N (CEP: 63033030)',
    neighborhood: 'JOSE GERALDO DA CRUZ',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['219', '255'],
  },
  {
    name: 'ESCOLA PROFESSORA ODETE OLIVEIRA MONTEIRO',
    address: 'AVENIDA MARIA LETICIA LEITE PEREIRA, S/N (CEP: 63049280)',
    neighborhood: 'CAMPO ALEGRE',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['428', '456', '472'],
  },
  {
    name: 'EMEI PROFESSORA ASSUNCAO GONCALVES (CRECHE)',
    address: 'RUA PROFESSORA IVANY FEITOSA, S/N (CEP: 63031140)',
    neighborhood: 'TIRADENTES',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['275', '427', '466'],
  },
  {
    name: 'CRECHE ANA AMELIA BEZERRA DE MENEZES',
    address: 'RUA VEREADOR JOSE RODRIGUES, 270 (CEP: 63034050)',
    neighborhood: 'PIRAJA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['150', '407', '448'],
  },
  {
    name: 'CRECHE PROFESSORA MARIA LUIZA DANTAS',
    address: 'RUA ODILIO FIGUEIREDO, 264 (CEP: 63050740)',
    neighborhood: 'ROMEIRAO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['149', '215'],
  },
  {
    name: 'CEI-CAIC DOM ANTONIO CAMPELO DE ARAGAO (CRECHE)',
    address: 'RUA VEREADOR RAIMUNDO JOSE RODRIGUES DA SILVA, S/N (CEP: 63043250)',
    neighborhood: 'FREI DAMIAO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['430', '450', '461'],
  },
  {
    name: 'EMEI PROFA MARIA DA CONCEICAO RIBEIRO DE SOUSA (CRECHE NOVA)',
    address: 'RUA MANOEL TAVARES LOPES, 2891 (CEP: 63044090)',
    neighborhood: 'FREI DAMIAO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['440', '457'],
  },
  {
    name: 'EEFTI PROFESSORA CICERA MARIA DOS SANTOS',
    address: 'RUA DR OSVALDO JUCA NETO, S/N (CEP: 63044015)',
    neighborhood: 'FREI DAMIAO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['439', '459'],
  },
  {
    name: 'CRECHE DOUTORA ZILDA ARNS',
    address: 'RUA JOSE MARTINS FILHO, S/N (CEP: 63010970)',
    neighborhood: 'CAMPO ALEGRE',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['429'],
  },
  {
    name: 'UNILEAO - UNIVERSIDADE DR LEAO SAMPAIO - CAMPI',
    address: 'AV. MARIA LETICIA LEITE PEREIRA, S/N (CEP: 63040405)',
    neighborhood: 'LAGOA SECA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['434', '469'],
  },
  {
    name: 'CEI VEREADOR GETULIO GRANGEIRO PEREIRA',
    address: 'RUA CICERA PATRICIA DA COSTA, 450 (CEP: 63035100)',
    neighborhood: 'LEANDRO BEZERRA DE MENESES',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['437'],
  },
  {
    name: 'CRECHE JOSE PERBOYRE SAMPAIO SABIA',
    address: 'RUA MOESIO SOUZA SILVA, S/N (CEP: 63024350)',
    neighborhood: 'SAO JOSE',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['433', '464'],
  },
  {
    name: 'EMEI HELENA VIEIRA DOS SANTOS',
    address: 'RUA VICENCIA MARIA DE OLIVEIRA, S/N (CEP: 63024670)',
    neighborhood: 'ANTONIO VIEIRA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['436'],
  },
  {
    name: 'ESCOLA PROFISSIONALIZANTE RAIMUNDO SARAIVA COELHO',
    address: 'AVENIDA PAULO MAIA, S/N (CEP: 63024685)',
    neighborhood: 'SAO JOSE',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['431', '477'],
  },
  {
    name: 'UNILEAO - CAMPUS SAUDE (PROXIMO AABB)',
    address: 'AVENIDA LEAO SAMPAIO, 400 (CEP: 63041082)',
    neighborhood: 'LAGOA SECA',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['1', '2', '38', '438'],
  },
  {
    name: 'ARENA ROMEIRAO',
    address: 'AVENIDA CASTELO BRANCO, S/N (CEP: 63036230)',
    neighborhood: 'ROMEIRAO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['63', '64', '65', '66', '67', '447'],
  },
  {
    name: 'EEIF ISAAC QUIRINO TEIXEIRA',
    address: 'AV. AURELIANO PEREIRA DA SILVA, S/N (CEP: 63038759)',
    neighborhood: 'MONSENHOR FRANCISCO MURILO DE SA BARRETO',
    region: 'Juazeiro do Norte',
    electoralZone: '119',
    sections: ['453', '454'],
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

  console.log(`✅ Polling places imported (zone 119). Created: ${created}, Updated: ${updated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
