export const REGIONS = [
  'Fortaleza',
  'Sobral',
  'Juazeiro do Norte',
  'Crato',
  'Barbalha',
  'Jati',
  'Cascavel',
  'Várzea Alegre',
  'Farias Brito',
  'Sertão Central',
  'Litoral Leste',
  'Ibiapaba',
  'Maciço de Baturité',
  'Sertão dos Inhamuns',
]

export const CEARA_MUNICIPALITIES = [
  'Abaiara', 'Acarape', 'Acaraú', 'Acopiara', 'Aiuaba', 'Alcântaras', 'Altaneira', 'Alto Santo', 'Amontada', 'Antonina do Norte', 'Apuiarés', 'Aquiraz', 'Aracati', 'Aracoiaba', 'Ararendá', 'Araripe', 'Aratuba', 'Arneiroz', 'Assaré', 'Aurora', 'Baixio', 'Banabuiú', 'Barbalha', 'Barreira', 'Barro', 'Barroquinha', 'Baturité', 'Beberibe', 'Bela Cruz', 'Boa Viagem', 'Brejo Santo', 'Camocim', 'Campos Sales', 'Canindé', 'Capistrano', 'Caridade', 'Cariré', 'Caririaçu', 'Cariús', 'Carnaubal', 'Cascavel', 'Catarina', 'Catunda', 'Caucaia', 'Cedro', 'Chaval', 'Choró', 'Chorozinho', 'Coreaú', 'Crateús', 'Crato', 'Croatá', 'Cruz', 'Deputado Irapuan Pinheiro', 'Ererê', 'Eusébio', 'Farias Brito', 'Forquilha', 'Fortaleza', 'Fortim', 'Frecheirinha', 'General Sampaio', 'Graça', 'Granja', 'Granjeiro', 'Groaíras', 'Guaiúba', 'Guaraciaba do Norte', 'Guaramiranga', 'Hidrolândia', 'Horizonte', 'Ibaretama', 'Ibiapina', 'Ibicuitinga', 'Icapuí', 'Icó', 'Iguatu', 'Independência', 'Ipaporanga', 'Ipaumirim', 'Ipu', 'Ipueiras', 'Iracema', 'Irauçuba', 'Itaiçaba', 'Itaitinga', 'Itapagé', 'Itapipoca', 'Itapiúna', 'Itarema', 'Itatira', 'Jaguaretama', 'Jaguaribara', 'Jaguaribe', 'Jaguaruana', 'Jardim', 'Jati', 'Jijoca de Jericoacoara', 'Juazeiro do Norte', 'Jucás', 'Lavras da Mangabeira', 'Limoeiro do Norte', 'Madalena', 'Maracanaú', 'Maranguape', 'Marco', 'Martinópole', 'Massapê', 'Mauriti', 'Meruoca', 'Milagres', 'Milhã', 'Miraíma', 'Missão Velha', 'Mombaça', 'Monsenhor Tabosa', 'Morada Nova', 'Moraújo', 'Morrinhos', 'Mucambo', 'Mulungu', 'Nova Olinda', 'Nova Russas', 'Novo Oriente', 'Ocara', 'Orós', 'Pacajus', 'Pacatuba', 'Pacoti', 'Pacujá', 'Palhano', 'Palmácia', 'Paracuru', 'Paraipaba', 'Parambu', 'Paramoti', 'Pedra Branca', 'Penaforte', 'Pentecoste', 'Pereiro', 'Pindoretama', 'Piquet Carneiro', 'Pires Ferreira', 'Poranga', 'Porteiras', 'Potengi', 'Potiretama', 'Quiterianópolis', 'Quixadá', 'Quixelô', 'Quixeramobim', 'Quixeré', 'Redenção', 'Reriutaba', 'Russas', 'Saboeiro', 'Salitre', 'Santa Quitéria', 'Santana do Acaraú', 'Santana do Cariri', 'São Benedito', 'São Gonçalo do Amarante', 'São João do Jaguaribe', 'São Luís do Curu', 'Senador Pompeu', 'Senador Sá', 'Sobral', 'Solonópole', 'Tabuleiro do Norte', 'Tamboril', 'Tarrafas', 'Tauá', 'Tejuçuoca', 'Tianguá', 'Trairi', 'Tururu', 'Ubajara', 'Umari', 'Umirim', 'Uruburetama', 'Uruoca', 'Varjota', 'Várzea Alegre', 'Viçosa do Ceará'
]

export const NEIGHBORHOODS: Record<string, string[]> = {
  'Fortaleza': ['Fortaleza', 'Caucaia', 'Maracanaú', 'Eusébio', 'Aquiraz'],
  'Sobral': ['Sobral', 'Forquilha', 'Massapê', 'Santana do Acaraú'],
  'Juazeiro do Norte': [
    'Centro', 'Horto', 'Salgadinho', 'Salesianos', 'Área Rural', 
    'Pio XII', 'Santo Antônio', 'Prof. Maria Geli Sá Barreto', 'Marrocos', 
    'São Miguel', 'Três Marias', 'Juvêncio Santana', 'Pedrinhas', 'Fátima', 
    'Franciscanos', 'Limoeiro', 'Santa Tereza', 'Frei Damião', 
    'Prefeito Carlos Alberto da Cruz', 'Lagoa Seca', 'Antônio Vieira', 
    'Pirajá', 'São José', 'João Cabral', 'Tiradentes', 'Romeirão', 
    'Novo Juazeiro', 'Timbaúba', 'Aeroporto', 'Planalto', 'José Geraldo da Cruz', 
    'Campo Alegre', 'Leandro Bezerra de Meneses', 'Monsenhor Francisco Murilo de Sá Barreto'
  ],
  'Crato': ['Pimenta', 'Centro', 'São Miguel', 'Lameiro'],
  'Barbalha': ['Centro', 'Alto da Alegria', 'Buriti'],
  'Jati': ['Centro', 'Sítio Pereiro'],
  'Cascavel': ['Centro', 'Caponga', 'Águas Belas'],
  'Várzea Alegre': ['Centro', 'Sanharol', 'Praça'],
  'Farias Brito': ['Centro', 'Barreiras'],
  'Sertão Central': ['Quixadá', 'Quixeramobim', 'Senador Pompeu', 'Banabuiú'],
  'Litoral Leste': ['Aracati', 'Beberibe', 'Fortim', 'Russas', 'Limoeiro do Norte'],
  'Ibiapaba': ['Tianguá', 'Ubajara', 'São Benedito', 'Viçosa do Ceará'],
  'Maciço de Baturité': ['Baturité', 'Guaramiranga', 'Pacoti', 'Redenção'],
  'Sertão dos Inhamuns': ['Tauá', 'Crateús', 'Parambu', 'Arneiroz'],
}

export const ALL_NEIGHBORHOODS = Object.values(NEIGHBORHOODS).flat()

export const SUPPORT_STATUS_OPTIONS = [
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
  { value: 'premium', label: 'Premium' },
]

export const COORDINATOR_STATUS_OPTIONS = [
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
  { value: 'premium', label: 'Premium' },
]

export const REGISTRATION_SOURCE_OPTIONS = [
  { value: 'manual', label: 'Manual' },
  { value: 'event', label: 'Evento' },
  { value: 'referral', label: 'Indicação' },
  { value: 'digital', label: 'Digital' },
]
