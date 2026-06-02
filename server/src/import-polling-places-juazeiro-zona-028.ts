import { prisma } from './lib/prisma.js';

type PollingPlaceInput = {
  name: string;
  address: string;
  neighborhood: string;
  region: string;
  electoralZone: string;
  sections: string[];
};

// Source: Sistema Elo / TRE-CE (07/05/2026)
// 28a Zona Eleitoral - Juazeiro do Norte/CE
const PLACES: PollingPlaceInput[] = [
  {
    name: 'ESCOLA DE SABERES DANIEL WALKER ALMEIDA MARQUES',
    address: 'AV. PADRE CICERO, 376 (CEP: 63010215)',
    neighborhood: 'CENTRO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['1', '292'],
  },
  {
    name: 'BIBLIOTECA PUBLICA MUNICIPAL DR. POSSIDONIO DA SILVA BEM',
    address: 'RUA SANTO AGOSTINHO, 300 (CEP: 63010360)',
    neighborhood: 'CENTRO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['2', '3', '4'],
  },
  {
    name: 'CAGECE - LOJA DE ATENDIMENTO CENTRO',
    address: 'RUA SAO DOMINGOS (CEP: 63010165)',
    neighborhood: 'CENTRO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['5', '6'],
  },
  {
    name: 'EMEI DAYSE SAMPAIO',
    address: 'RUA BOM JESUS DO HORTO, S/N (CEP: 63012020)',
    neighborhood: 'HORTO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['375', '476'],
  },
  {
    name: 'EEEP PROFESSOR MOREIRA DE SOUSA',
    address: 'DO CRUZEIRO, 497 (CEP: 63010070)',
    neighborhood: 'CENTRO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['16', '17', '18', '58', '59', '268', '320', '339', '344'],
  },
  {
    name: 'CIRCULO OPERARIO SAO JOSE',
    address: 'PADRE CICERO, 133 (CEP: 63010020)',
    neighborhood: 'CENTRO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['30', '207'],
  },
  {
    name: 'EEMTI ALAIDE SILVA SANTOS',
    address: 'RUA JOSE CAETANO DO SALGADINHO (CEP: 63011125)',
    neighborhood: 'SALGADINHO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['31', '32', '33'],
  },
  {
    name: 'COLEGIO SALESIANO SAO JOAO BOSCO',
    address: 'PADRE CICERO, 1492 (CEP: 63010020)',
    neighborhood: 'SALESIANOS',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['42', '43', '44', '45', '46', '47', '48', '49', '310', '323', '340', '354', '386', '450', '458', '462'],
  },
  {
    name: 'EEF LAURENTINO ALVES DE MACENA (SITIO NOVO)',
    address: 'SITIO NOVO (CEP: 63079899)',
    neighborhood: 'AREA RURAL DE JUAZEIRO DO NORTE',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['63'],
  },
  {
    name: 'EMEFTI VEREADOR FRANCISCO BARBOSA DA SILVA',
    address: 'RUA BOM JESUS DO HORTO (CEP: 63000000)',
    neighborhood: 'HORTO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['10', '11', '69', '70', '291', '300', '452', '453', '454', '457'],
  },
  {
    name: 'ECIM DOUTOR EDVAR TEIXEIRA FERRER',
    address: 'DOM PEDRO II, 1643 (CEP: 63020030)',
    neighborhood: 'FRANCISCANOS',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['21', '22', '23', '24', '29', '88', '89', '90', '91', '92', '93', '275', '277', '412', '435', '459', '467'],
  },
  {
    name: 'EMTI FIGUEIREDO CORREIA',
    address: 'PRACA DA CONCEICAO, S/N (CEP: 63020721)',
    neighborhood: 'PIO XII',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['96', '97', '98', '99', '100', '101', '102'],
  },
  {
    name: 'EEF HELOISA SOBREIRA DIAS CAMILO',
    address: 'RUA MIGUEL PEDRO DE BRITO, 46 (CEP: 63020280)',
    neighborhood: 'PIO XII',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['104', '105', '106', '107', '271'],
  },
  {
    name: 'EEF IRMA IVA',
    address: 'CARUARU, S/N (CEP: 63020270)',
    neighborhood: 'SANTO ANTONIO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['464', '468'],
  },
  {
    name: 'EEIF JOAO ROMAO DE SA BARRETO',
    address: 'SITIO BREJO SECO (CEP: 63079899)',
    neighborhood: 'PROFESSORA MARIA GELI SA BARRETO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['130', '131', '479'],
  },
  {
    name: 'EEF JOSE DE ARAUJO',
    address: 'VILA SAO GONCALO (CEP: 63079899)',
    neighborhood: 'MARROCOS',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['132', '133', '134', '303', '446'],
  },
  {
    name: 'EEM JOSE BEZERRA',
    address: 'SAO JORGE, 440 (CEP: 63010470)',
    neighborhood: 'SAO MIGUEL',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['135', '136', '137', '138', '231', '232', '233', '234', '305'],
  },
  {
    name: 'CENTRO CEARENSE DE IDIOMAS - CCI',
    address: 'RUA QUINZE DE NOVEMBRO, S/N (CEP: 63010480)',
    neighborhood: 'SAO MIGUEL',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['139', '140', '287', '333', '343', '414'],
  },
  {
    name: 'EMEIF JOSE SABIA',
    address: 'SITIO SABIA (CEP: 63079899)',
    neighborhood: 'AREA RURAL DE JUAZEIRO DO NORTE',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['142', '143', '483'],
  },
  {
    name: 'EMEI AFRO ALVES DE MACENA (SITIO LEITE)',
    address: 'SITIO LEITE (CEP: 63079899)',
    neighborhood: 'AREA RURAL DE JUAZEIRO DO NORTE',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['144'],
  },
  {
    name: 'EMEF PROFA MARIA DE LOURDES LOPES DE SOUSA',
    address: 'AV. DO AGRICULTOR (CEP: 63079899)',
    neighborhood: 'TRES MARIAS',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['145', '187', '306', '451', '466', '477'],
  },
  {
    name: 'EMEIF MARIA BERNARDINO MACHADO',
    address: 'SITIO ESPINHO (CEP: 63079899)',
    neighborhood: 'AREA RURAL DE JUAZEIRO DO NORTE',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['153', '362', '495'],
  },
  {
    name: 'EMEIF MARIA PEDRINA',
    address: 'SITIO POPO (CEP: 63079899)',
    neighborhood: 'AREA RURAL DE JUAZEIRO DO NORTE',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['156', '472'],
  },
  {
    name: 'EEF MONSENHOR JOVINIANO BARRETO',
    address: 'DO CRUZEIRO, 657 (CEP: 63010070)',
    neighborhood: 'CENTRO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['158', '260'],
  },
  {
    name: 'EMEIF NOSSA SENHORA DE FATIMA',
    address: 'SITIO UMARI (CEP: 63079899)',
    neighborhood: 'AREA RURAL DE JUAZEIRO DO NORTE',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['159', '353', '460', '478'],
  },
  {
    name: 'EMEIF MARIA DO SOCORRO CARDOSO',
    address: 'DIST. PADRE CICERO. PALMEIRINHA (CEP: 63079899)',
    neighborhood: 'AREA RURAL DE JUAZEIRO DO NORTE',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['141', '157', '160', '161', '304'],
  },
  {
    name: 'EEIF PADRE CICERO',
    address: 'MONSENHOR JOVINIANO BARRETO, 116 (CEP: 63010080)',
    neighborhood: 'CENTRO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['50', '51', '162', '163', '164', '165', '166', '273', '381', '436'],
  },
  {
    name: 'EMEIF MANOEL BALBINO DA SILVA',
    address: 'RUA PEDRO CRUZ SAMPAIO (CEP: 63079899)',
    neighborhood: 'JUVENCIO SANTANA',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['167', '308'],
  },
  {
    name: 'EMEIF RAIMUNDO DOMINGOS',
    address: 'SITIO TAQUARI (CEP: 63079899)',
    neighborhood: 'AREA RURAL DE JUAZEIRO DO NORTE',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['168', '403'],
  },
  {
    name: 'EMEF RAIMUNDO PESSOA',
    address: 'SITIO GAVIAO (CEP: 63079899)',
    neighborhood: 'AREA RURAL DE JUAZEIRO DO NORTE',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['169', '433', '475'],
  },
  {
    name: 'EMEF PROFA DORALICE DE FIGUEIREDO ROCHA',
    address: 'RUA JOAQUIM LEANDRO DE SOUSA (CEP: 63079899)',
    neighborhood: 'PEDRINHAS',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['170', '448', '469', '481', '485', '488', '494', '496'],
  },
  {
    name: 'CEJA PROFA CICERA G. CORREIA',
    address: 'DO CRUZEIRO, 1440 (CEP: 63010070)',
    neighborhood: 'SAO MIGUEL',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['172', '173', '174', '175', '278', '397'],
  },
  {
    name: 'EEF TABELIAO VICENTE PEREIRA DA SILVA',
    address: 'DOUTOR FLORO BARTOLOMEU, 1203 (CEP: 63010492)',
    neighborhood: 'SAO MIGUEL',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['176', '177', '178', '179', '296', '418'],
  },
  {
    name: 'EEF 03 DE JUNHO',
    address: 'RUA PEDRO FURTADO MENEZES (CEP: 63012300)',
    neighborhood: 'SALGADINHO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['183', '318', '471'],
  },
  {
    name: 'EMEIF VEREADOR ANTONIO FERNANDES COIMBRA',
    address: 'FISCAL JOSE ISIDORO, S/N (CEP: 63050110)',
    neighborhood: 'SALESIANOS',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['126', '127', '186', '401'],
  },
  {
    name: 'UNINASSAU CAMPUS SAO MIGUEL',
    address: 'RUA SAO FRANCISCO, 1224 (CEP: 63010475)',
    neighborhood: 'SAO MIGUEL',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['12', '13', '25', '26', '27', '28', '188', '189'],
  },
  {
    name: 'COLEGIO BATISTA DO CARIRI',
    address: 'RUA SAO PAULO, 797 (CEP: 63010000)',
    neighborhood: 'CENTRO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['7', '184', '201', '203', '205', '299'],
  },
  {
    name: 'COLEGIO OBJETIVO',
    address: 'RUA DOUTOR FLORO, 776 (CEP: 63010050)',
    neighborhood: 'SAO MIGUEL',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['57', '208', '209', '210', '211', '212', '213', '214', '269', '316', '317', '325', '365'],
  },
  {
    name: 'COLEGIO SAO FRANCISCO DE ASSIS',
    address: 'NOSSA SENHORA DO CARMO, S/N (CEP: 63020180)',
    neighborhood: 'FRANCISCANOS',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230', '294', '384'],
  },
  {
    name: 'SENAC SAO MIGUEL',
    address: 'RUA SAO LUIZ, 701 (CEP: 63010462)',
    neighborhood: 'SAO MIGUEL',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['235', '236', '237', '270', '274'],
  },
  {
    name: 'EMEI PROFESSORA CHIQUITA CALLOU',
    address: 'SITIO AMARO COELHO (CEP: 63079899)',
    neighborhood: 'AREA RURAL DE JUAZEIRO DO NORTE',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['319', '455'],
  },
  {
    name: 'EEF JOSE FERREIRA MENEZES',
    address: 'PEDRO GUILHERME DA SILVA, S/N (CEP: 63079899)',
    neighborhood: 'FATIMA',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['242', '243', '244', '245', '246'],
  },
  {
    name: 'EEF JOSE GERALDO DA CRUZ',
    address: 'DO ROSARIO, 622 (CEP: 63050200)',
    neighborhood: 'SALESIANOS',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['331', '345', '350', '367', '372', '490'],
  },
  {
    name: 'EEF PREFEITO JOSE MONTEIRO DE MACEDO',
    address: 'RUA SAO SALVADOR, 104 (CEP: 63010550)',
    neighborhood: 'JUVENCIO SANTANA',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['330', '440', '463', '474', '489'],
  },
  {
    name: 'EEF ANTONIO BENJAMIM MOURA',
    address: 'SITIO POCOES (CEP: 63079899)',
    neighborhood: 'AREA RURAL DE JUAZEIRO DO NORTE',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['337', '371', '461', '470'],
  },
  {
    name: 'EEFTI DR. LEAO SAMPAIO',
    address: 'DOUTOR FLORO BARTOLOMEU, 517 (CEP: 63010055)',
    neighborhood: 'CENTRO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['8', '9', '19', '34', '60', '61', '62', '265'],
  },
  {
    name: 'COLEGIO SOSSEGO',
    address: 'RUA SAO DOMINGOS, 59 (CEP: 63020081)',
    neighborhood: 'CENTRO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['249', '250', '251'],
  },
  {
    name: 'EEF PELUSIO CORREIA DE MACEDO',
    address: 'RUA MARIETA FRANCA DE MENEZES, 360 (CEP: 63050145)',
    neighborhood: 'SANTO ANTONIO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['15', '108', '109', '110', '297', '447', '449', '456', '473', '480'],
  },
  {
    name: 'EMEI SENADORA ALACOQUE BEZERRA',
    address: 'RUA BOM JESUS DO HORTO, S/N (CEP: 63012020)',
    neighborhood: 'HORTO',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['486'],
  },
  {
    name: 'EEF JOSE MARROCOS',
    address: 'AV. JOSE BEZERRA, S/N (CEP: 63020294)',
    neighborhood: 'PIO XII',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['103', '272', '360', '377', '404', '491', '497'],
  },
  {
    name: 'EMEI MARIA QUIRINO DA SILVA',
    address: 'RUA PEDRO GUILHERME DA SILVA, S/N (CEP: 63013110)',
    neighborhood: 'FATIMA',
    region: 'Juazeiro do Norte',
    electoralZone: '028',
    sections: ['286', '326', '492', '493'],
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

  console.log(`✅ Polling places imported. Created: ${created}, Updated: ${updated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
