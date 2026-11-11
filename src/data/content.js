// Conteúdo-base da Estação de Memória — Paranapiacaba.
// Definições e curiosidades: Lista Indicativa da UNESCO, Turismo Santo André e
// estudos acadêmicos sobre oralidade ferroviária (ver FONTES).
// ATENÇÃO: todos os relatos, comentários e famílias marcados com `ficticio: true`
// são dados de DEMONSTRAÇÃO e não devem ser apresentados como depoimentos reais.

export const CENTRO_VILA = [-23.778, -46.2995]

export const FONTES = [
  {
    id: 1,
    titulo: 'Cultural Landscape of Paranapiacaba — UNESCO World Heritage Centre (Lista Indicativa)',
    url: 'https://whc.unesco.org/en/tentativelists/5878/',
  },
  { id: 2, titulo: 'Pátio Ferroviário — Turismo Santo André', url: 'https://www3.santoandre.sp.gov.br/turismosantoandre/mercado-6/' },
  { id: 3, titulo: 'Museu Castelo — Turismo Santo André', url: 'https://www3.santoandre.sp.gov.br/turismosantoandre/museu-castelo/' },
  {
    id: 4,
    titulo: 'Vila de Paranapiacaba — Turismo Santo André',
    url: 'https://www3.santoandre.sp.gov.br/turismosantoandre/vila-ferroviaria-paranapiacaba/',
  },
  {
    id: 5,
    titulo: 'Oralidades em foco: estudos de uma vila ferroviária — ANPUH',
    url: 'https://www.snh2015.anpuh.org/resources/anais/39/1428342827_ARQUIVO_Oralidadesemfoco.pdf',
  },
  {
    id: 6,
    titulo: 'Patrimônio Ferroviário: vilas ferroviárias e o mundo do trabalho — IPHAN',
    url: 'https://www.gov.br/iphan/pt-br/patrimonio-cultural/patrimonio-material/patrimonio-ferroviario/tematica-06-patrimonio-ferroviario-vilas-ferroviarias-e-o-mundo-de-trabalho-recuperacao-e-conservacao',
  },
]

/* ------------------------------------------------------------------ */
/* 1. Vocabulário e ofícios                                            */
/* ------------------------------------------------------------------ */
export const VOCABULARIO = [
  {
    id: 'termo-001',
    titulo: 'Locobreque',
    definicao: 'Máquina a vapor especial que ajudava a controlar a subida e a descida dos vagões na Serra.',
    curiosidade:
      'O nome vem do inglês “loco-brake”. No sistema funicular, ela podia empurrar a composição na subida e segurá-la na descida; o foguista alimentava a fornalha com carvão ou madeira.',
    gatilho: 'Você se lembra de ter visto o locobreque no pátio? Alguém da sua família trabalhou perto dele?',
    fontes: [1, 2],
  },
  {
    id: 'termo-002',
    titulo: 'Sistema funicular',
    definicao: 'Sistema ferroviário que usava cabos, máquinas fixas e planos inclinados para vencer a subida íngreme da Serra do Mar.',
    curiosidade:
      'O primeiro sistema foi inaugurado com a SPR em 1867. A duplicação da ferrovia entre 1896 e 1901 criou o chamado sistema “Serra Nova”.',
    gatilho: 'Que histórias sua família contava sobre a viagem pela Serra ou sobre os cabos que puxavam os trens?',
    fontes: [1],
  },
  {
    id: 'termo-003',
    titulo: 'Patamar',
    definicao: 'Área de parada entre dois trechos inclinados da ferrovia, onde ficavam máquinas e equipes de operação.',
    curiosidade:
      'A descida da Serra era organizada em níveis. A ficha da UNESCO descreve quatro planos inclinados e seus patamares, com máquinas fixas instaladas nesses pontos.',
    gatilho: 'Alguém da sua família trabalhou ou passou por algum dos patamares? Como chegava até lá?',
    fontes: [1],
  },
  {
    id: 'termo-004',
    titulo: 'Plano inclinado',
    definicao: 'Trecho de ferrovia em forte declive ou aclive, vencido com ajuda de cabos e contrapesos.',
    curiosidade:
      'Foi uma solução de engenharia para superar uma parede rochosa de centenas de metros, em área de muita chuva e Mata Atlântica.',
    gatilho: 'Você ouviu algum apelido para os planos inclinados ou alguma história de viagem, pane ou manutenção na serra?',
    fontes: [1],
  },
  {
    id: 'termo-005',
    titulo: 'Cabineiro',
    definicao: 'Profissional que trabalhava na cabine ou no posto de controle, acompanhando sinais, comandos e movimentos dos trens.',
    curiosidade:
      'A operação dependia de comunicação rigorosa entre pátio, estação, patamares e oficinas. O termo e suas tarefas podem variar conforme a época e a companhia — vale confirmar com ex-ferroviários.',
    gatilho: 'Você conheceu algum cabineiro? Como ele avisava que o trem podia partir ou parar?',
    fontes: [1, 5],
  },
  {
    id: 'termo-006',
    titulo: 'Maquinista',
    definicao: 'Profissional responsável por conduzir e operar a locomotiva.',
    curiosidade:
      'No locobreque, o maquinista trabalhava ao lado do foguista. A operação exigia atenção especial porque a máquina mudava de função conforme subia ou descia a serra.',
    gatilho: 'Quem era o maquinista mais lembrado na sua família ou na sua rua? Como era a rotina dele?',
    fontes: [1],
  },
  {
    id: 'termo-007',
    titulo: 'Guarda-freios',
    definicao: 'Trabalhador encarregado de vigiar e acionar os freios dos vagões ou da composição.',
    curiosidade:
      'Antes dos sistemas modernos de frenagem, o trabalho exigia coordenação entre os homens espalhados pela composição e os sinais do maquinista.',
    gatilho: 'Alguém da sua família trabalhou nos vagões, nos freios ou nas manobras? Que histórias de coragem eram contadas?',
    fontes: [5],
  },
  {
    id: 'termo-008',
    titulo: 'Foguista',
    definicao: 'Trabalhador que alimentava a fornalha da locomotiva com carvão ou lenha e ajudava o maquinista.',
    curiosidade:
      'No locobreque, o foguista mantinha o fogo que produzia o vapor. O trabalho juntava força física, atenção e conhecimento prático da máquina.',
    gatilho: 'Você se lembra do cheiro de carvão, da fuligem nas roupas ou de algum parente que começou como foguista?',
    fontes: [1],
  },
  {
    id: 'termo-009',
    titulo: 'Casa de máquinas fixa',
    definicao: 'Edificação onde uma grande máquina puxava ou controlava os cabos do sistema funicular.',
    curiosidade:
      'Havia máquinas fixas nos patamares. Uma grande roda volante recebia o cabo que ligava as composições e ajudava a equilibrar os movimentos.',
    gatilho: 'Alguém da sua família fazia manutenção de cabos, rodas, motores ou ferramentas nas casas de máquinas?',
    fontes: [1],
  },
  {
    id: 'termo-010',
    titulo: 'Viradouro',
    definicao: 'Sistema usado para inverter o sentido da locomotiva quando ela precisava voltar ou mudar de direção.',
    curiosidade:
      'A Prefeitura explica que o trem não tinha marcha a ré; por isso, os funcionários usavam o viradouro para inverter o sentido da máquina.',
    gatilho: 'Você já viu uma locomotiva sendo virada? Quem contava como essa manobra era feita?',
    fontes: [2],
  },
  {
    id: 'termo-011',
    titulo: 'Castelinho',
    definicao: 'Casa elevada onde morava o engenheiro-chefe da ferrovia e de onde se avistava o pátio e a vila.',
    curiosidade:
      'Concluído em 1897, tem dois pavimentos, 33 janelas, seis lareiras, paredes duplas e piso de pinho de Riga. Sua posição dava uma visão ampla da operação ferroviária.',
    gatilho: 'Como as crianças da vila chamavam o Castelinho? Você se lembra de subir até lá ou de ouvir histórias sobre o engenheiro-chefe?',
    fontes: [3],
  },
  {
    id: 'termo-012',
    titulo: 'Relógio da Estação',
    definicao: 'Torre com relógio que organizava os horários de trens, turnos e a entrada e saída dos trabalhadores.',
    curiosidade:
      'A torre foi erguida no fim do século XIX e recebeu um relógio londrino. A Prefeitura aponta que é o único monumento que restou após o incêndio da estação.',
    gatilho: 'Que momento do dia era marcado pelas badaladas? Você se lembra do relógio coberto pela neblina?',
    fontes: [2, 4],
  },
]

/* ------------------------------------------------------------------ */
/* Relatos fictícios (seed data)                                        */
/* ------------------------------------------------------------------ */
export const RELATOS = [
  {
    id: 'relato-001',
    ficticio: true,
    personagem: 'Helena Thompson',
    idade: 78,
    relacao_com_a_vila: 'Moradora antiga',
    decada_referida: 'Anos 50',
    cargo_ou_oficio: 'Filha de maquinista',
    texto:
      'Meu pai, Arthur Thompson, era maquinista da SPR e depois continuou na Santos-Jundiaí. Nasci em 1947, numa casa de madeira da Martin Smith. Quando ele saía cedo, minha mãe já deixava o café passado e dizia para a gente não perder a hora do relógio. Eu não entendia de ferrovia, mas sabia reconhecer o apito dele no meio dos outros. Aos domingos, a gente atravessava a passarela para ouvir música no Lyra-Serrano. Hoje, quando a neblina baixa, parece que ele ainda vai aparecer com a lanterna na mão.',
  },
  {
    id: 'relato-002',
    ficticio: true,
    personagem: 'Antônio Bianchi',
    idade: 69,
    relacao_com_a_vila: 'Filho de ferroviário',
    decada_referida: 'Anos 60',
    cargo_ou_oficio: 'Foguista (pai)',
    texto:
      'Meu pai, Giuseppe Bianchi, começou como foguista e passou muitos anos nas máquinas do funicular. Ele chegava com a roupa cheirando a carvão e graxa, e minha mãe reclamava da fuligem no tanque. Eu achava bonito quando ele explicava que o locobreque não era um trem comum: na subida empurrava, na descida segurava. Na década de 1960, eu acompanhava meu pai até perto das oficinas e ficava ouvindo o ferro bater. Foi ali que aprendi que uma vila também tem memória pelo ouvido.',
  },
  {
    id: 'relato-003',
    ficticio: true,
    personagem: 'Conceição da Silva',
    idade: 84,
    relacao_com_a_vila: 'Ex-moradora',
    decada_referida: 'Anos 60',
    cargo_ou_oficio: 'Auxiliar de limpeza escolar',
    texto:
      'Trabalhei como auxiliar de limpeza em uma escola da Parte Baixa entre 1958 e 1972. Meu marido, Joaquim da Silva, era guarda-freios. Ele falava pouco do perigo, mas eu sabia que o serviço era pesado porque voltava com as mãos marcadas. A gente morava numa casa pequena, e os vizinhos ajudavam quando alguém adoecia. As crianças brincavam na rua até a neblina engrossar. Quando penso em Paranapiacaba, lembro primeiro das vozes chamando para o jantar, antes mesmo de lembrar dos trilhos.',
  },
  {
    id: 'relato-004',
    ficticio: true,
    personagem: 'Manuel Correia',
    idade: 73,
    relacao_com_a_vila: 'Neto de ferroviário',
    decada_referida: 'Anos 70',
    cargo_ou_oficio: 'Cabineiro (avô)',
    texto:
      'Meu avô António Correia trabalhou como cabineiro na RFFSA durante os anos 1970. Ele anotava tudo num caderno: horários, manobras, nomes de colegas e mudanças no tempo. Dizia que o relógio da estação era quase um colega de trabalho. Quando o trem atrasava, a vila toda percebia. Eu era menino e gostava de subir ao Castelinho com ele, embora ele dissesse que eu precisava respeitar o lugar. O que ficou para mim foi a ideia de que cuidar do patrimônio é cuidar dos nomes das pessoas que fizeram a ferrovia funcionar.',
  },
  {
    id: 'relato-005',
    ficticio: true,
    personagem: 'Carmen García',
    idade: 66,
    relacao_com_a_vila: 'Filha de trabalhadora da vila',
    decada_referida: 'Anos 80',
    cargo_ou_oficio: 'Costureira (mãe)',
    texto:
      'Minha mãe, Dolores García, costurava para as famílias ferroviárias e fazia pequenos consertos para o pessoal das oficinas. Ela não tinha cargo na companhia, mas conhecia a rotina de todos: quem entrava no turno da manhã, quem precisava de uniforme e quem tinha filho doente. Na década de 1980, eu ainda ia ao mercado com ela e depois passava pelo campo do Serrano. A ferrovia estava mudando, mas as relações continuavam. Para mim, a história de Paranapiacaba também é feita por quem lavou, cozinhou, costurou e criou filhos enquanto os homens trabalhavam nos trilhos.',
  },
  {
    id: 'relato-006',
    ficticio: true,
    personagem: 'João Oliveira',
    idade: 59,
    relacao_com_a_vila: 'Ex-ferroviário',
    decada_referida: 'Anos 80',
    cargo_ou_oficio: 'Ajudante de manutenção',
    texto:
      'Entrei na RFFSA em 1986 como ajudante de manutenção. Meu pai, Sebastião Oliveira, tinha sido trabalhador de pátio, e eu cresci ouvindo que não se atravessava a linha sem olhar duas vezes. Naqueles anos, muita coisa já estava diferente: o funicular tinha perdido espaço, o movimento de passageiros diminuía e algumas oficinas já não tinham o mesmo ritmo. Mesmo assim, o cheiro de óleo e madeira molhada continuava igual. A maior lembrança é o companheirismo: quando uma peça dava problema, ninguém perguntava de onde você vinha; todo mundo juntava ferramenta e conhecimento.',
  },
]

const autor = (relatoId) => {
  const r = RELATOS.find((x) => x.id === relatoId)
  return { autor: r.personagem, idade: r.idade, relacao: r.relacao_com_a_vila }
}

const seed = (id, relatoId, texto, ts) => ({
  id,
  ...autor(relatoId),
  texto,
  ts,
  origem: 'seed',
  ficticio: true,
})

/* ------------------------------------------------------------------ */
/* 2. Mural da Vila — locais de memória                                 */
/* ------------------------------------------------------------------ */
export const REACOES = [
  { key: 'trabalhou', emoji: '🚂', label: 'Meu parente trabalhou aqui' },
  { key: 'morei', emoji: '🏠', label: 'Morei perto' },
  { key: 'saudade', emoji: '❤️', label: 'Que saudade' },
]

export const POSTS = [
  {
    id: 'relogio',
    titulo: 'Relógio da Estação — o “Big Ben da Serra”',
    local: 'Pátio Ferroviário',
    ilustracao: 'relogio',
    legenda:
      'Quando o relógio batia, a vila inteira parecia se alinhar: trem, turno, escola e café tinham hora certa.',
    curiosidade: VOCABULARIO[11].curiosidade,
    respostasRapidas: ['Eu acertava a hora por essas badaladas.', 'Meu avô passava aqui todo dia.', 'Lembro dele sumindo no meio da neblina.'],
    reacoesSeed: { trabalhou: 41, morei: 27, saudade: 88 },
    comentariosSeed: [
      seed('c-relogio-1', 'relato-001', 'Minha mãe deixava o café passado e dizia para a gente não perder a hora do relógio. Eu sabia reconhecer o apito do meu pai no meio dos outros.', '2026-10-02T09:14:00-03:00'),
      seed('c-relogio-2', 'relato-004', 'Meu avô dizia que o relógio da estação era quase um colega de trabalho. Quando o trem atrasava, a vila toda percebia.', '2026-10-05T17:40:00-03:00'),
    ],
  },
  {
    id: 'locobreque',
    titulo: 'Locobreque — a máquina que segurava a Serra',
    local: 'Pátio Ferroviário',
    ilustracao: 'locobreque',
    legenda:
      'Na subida, empurrava. Na descida, segurava. O locobreque não era um trem comum: era a força que dava confiança para vencer a Serra.',
    curiosidade: VOCABULARIO[0].curiosidade,
    respostasRapidas: ['Vi o locobreque funcionando.', 'Meu pai trabalhou nele.', 'Lembro do cheiro de carvão.'],
    reacoesSeed: { trabalhou: 52, morei: 19, saudade: 64 },
    comentariosSeed: [
      seed('c-loco-1', 'relato-002', 'Meu pai explicava que o locobreque não era um trem comum: na subida empurrava, na descida segurava. Ele chegava com a roupa cheirando a carvão e graxa.', '2026-10-03T11:02:00-03:00'),
    ],
  },
  {
    id: 'casas',
    titulo: 'Casas de madeira — tipologias A, B, C e D',
    local: 'Vila Martin Smith',
    ilustracao: 'casas',
    legenda:
      'As casas pareciam repetir a mesma rua, mas cada uma guardava uma família, uma receita, uma briga e muitas histórias de varanda.',
    curiosidade:
      'A Vila Martin Smith reúne casas de madeira de tipologias padronizadas, conhecidas como A, B, C e D. Ajude a gente a lembrar quem morava em cada uma!',
    respostasRapidas: ['Nasci em uma dessas casas.', 'A casa da minha família ainda está na minha memória.', 'Brinquei muito nessa rua.'],
    reacoesSeed: { trabalhou: 23, morei: 76, saudade: 92 },
    comentariosSeed: [
      seed('c-casas-1', 'relato-001', 'Nasci em 1947, numa casa de madeira da Martin Smith. Até hoje sei o barulho que a porta fazia em dia de chuva.', '2026-10-01T08:20:00-03:00'),
      seed('c-casas-2', 'relato-003', 'A gente morava numa casa pequena, e os vizinhos ajudavam quando alguém adoecia. As crianças brincavam na rua até a neblina engrossar.', '2026-10-06T19:05:00-03:00'),
    ],
  },
  {
    id: 'lyra',
    titulo: 'Clube União Lyra-Serrano',
    local: 'Parte Baixa',
    ilustracao: 'lyra',
    legenda:
      'Depois do apito e da jornada, era aqui que a vila se encontrava: baile, música, filme e conversa até a neblina apertar.',
    curiosidade: 'Clubes, igreja e festas ajudavam a construir pertencimento para além da jornada ferroviária.',
    respostasRapidas: ['Dancei nos bailes daqui.', 'Meu pai tocou música neste salão.', 'Foi aqui que conheci meu companheiro/minha companheira.'],
    reacoesSeed: { trabalhou: 12, morei: 31, saudade: 70 },
    comentariosSeed: [
      seed('c-lyra-1', 'relato-001', 'Aos domingos, a gente atravessava a passarela para ouvir música no Lyra-Serrano. Era nossa festa da semana.', '2026-10-04T15:30:00-03:00'),
      seed('c-lyra-2', 'relato-005', 'Depois do mercado eu passava pelo campo do Serrano com minha mãe. A ferrovia mudava, mas as amizades continuavam.', '2026-10-08T10:12:00-03:00'),
    ],
  },
  {
    id: 'passarela',
    titulo: 'Passarela Metálica',
    local: 'Ligação entre Parte Alta e Parte Baixa',
    ilustracao: 'passarela',
    legenda:
      'A passarela era atalho, mirante e caminho de todos os dias; lá de cima, os trilhos pareciam desenhar a vida da vila.',
    curiosidade: 'A passarela liga as duas partes da vila por cima do pátio ferroviário.',
    respostasRapidas: ['Passei por aqui para ir trabalhar.', 'Dava medo quando a neblina fechava.', 'Foi meu lugar preferido para ver os trens.'],
    reacoesSeed: { trabalhou: 18, morei: 44, saudade: 59 },
    comentariosSeed: [
      seed('c-pass-1', 'relato-001', 'Hoje, quando a neblina baixa, parece que meu pai ainda vai aparecer do outro lado da passarela com a lanterna na mão.', '2026-10-02T18:45:00-03:00'),
    ],
  },
  {
    id: 'funicular',
    titulo: 'Museu do Funicular, oficinas e forjaria',
    local: 'Pátio Ferroviário',
    ilustracao: 'funicular',
    legenda:
      'Ferro, madeira, carvão e graxa: nas oficinas, o patrimônio não era só visto — era consertado, fabricado e colocado para trabalhar.',
    curiosidade: VOCABULARIO[1].curiosidade,
    respostasRapidas: ['Meu familiar trabalhava na oficina.', 'Reconheço o barulho das ferramentas.', 'Eu passava aqui para ver as locomotivas.'],
    reacoesSeed: { trabalhou: 67, morei: 22, saudade: 58 },
    comentariosSeed: [
      seed('c-fun-1', 'relato-002', 'Na década de 1960 eu acompanhava meu pai até perto das oficinas e ficava ouvindo o ferro bater. Uma vila também tem memória pelo ouvido.', '2026-10-03T14:10:00-03:00'),
      seed('c-fun-2', 'relato-006', 'Quando uma peça dava problema, ninguém perguntava de onde você vinha; todo mundo juntava ferramenta e conhecimento.', '2026-10-07T16:55:00-03:00'),
      seed('c-fun-3', 'relato-005', 'Minha mãe fazia pequenos consertos de uniforme para o pessoal das oficinas. Ela sabia quem entrava em cada turno.', '2026-10-09T09:30:00-03:00'),
    ],
  },
  {
    id: 'castelinho',
    titulo: 'Castelinho — a casa do engenheiro-chefe',
    local: 'Parte Alta',
    ilustracao: 'castelinho',
    legenda:
      'Lá do alto, a vila, o pátio e a serra cabiam no mesmo olhar. Era a casa do chefe, mas virou cenário das lembranças de todo mundo.',
    curiosidade: VOCABULARIO[10].curiosidade,
    respostasRapidas: ['Subi aqui em passeio de escola.', 'Meu avô falava do engenheiro-chefe.', 'A vista da neblina é inesquecível.'],
    reacoesSeed: { trabalhou: 9, morei: 25, saudade: 47 },
    comentariosSeed: [
      seed('c-cast-1', 'relato-004', 'Eu era menino e gostava de subir ao Castelinho com meu avô, embora ele dissesse que eu precisava respeitar o lugar.', '2026-10-05T10:00:00-03:00'),
    ],
  },
  {
    id: 'mercado',
    titulo: 'Antigo Mercado',
    local: 'Vila Martin Smith / Parte Baixa',
    ilustracao: 'mercado',
    legenda:
      'Mercado era lugar de comprar o necessário, saber das novidades e encontrar alguém conhecido antes de voltar para casa.',
    curiosidade: 'O comércio da vila também era espaço de notícia, de conversa e de encontro da vizinhança.',
    respostasRapidas: ['Minha mãe fazia compras aqui.', 'Eu conhecia cada balcão e cada cheiro.', 'Era o ponto de encontro da vizinhança.'],
    reacoesSeed: { trabalhou: 8, morei: 38, saudade: 51 },
    comentariosSeed: [
      seed('c-merc-1', 'relato-005', 'Na década de 1980 eu ainda ia ao mercado com minha mãe. Ela conhecia a rotina de todas as famílias.', '2026-10-08T09:40:00-03:00'),
    ],
  },
  {
    id: 'escola',
    titulo: 'Grupo Escolar Senador Lacerda Franco',
    local: 'Parte Baixa',
    ilustracao: 'escola',
    legenda:
      'Antes do trabalho e depois do apito, havia caderno, merenda, chamada e o caminho de volta pelas ruas molhadas.',
    curiosidade: 'A escola também faz parte da memória operária: caderno, merenda e chamada dividiam o dia com o apito e o relógio.',
    respostasRapidas: ['Foi aqui que aprendi a ler.', 'Minha professora morava na vila.', 'Eu ia para a escola com meus irmãos.'],
    reacoesSeed: { trabalhou: 6, morei: 33, saudade: 62 },
    comentariosSeed: [
      seed('c-esc-1', 'relato-003', 'Trabalhei na limpeza de uma escola da Parte Baixa entre 1958 e 1972. Lembro das vozes chamando para o jantar, antes mesmo de lembrar dos trilhos.', '2026-10-06T12:15:00-03:00'),
    ],
  },
]

/* ------------------------------------------------------------------ */
/* 3. Sons e cheiros da Serra (memórias imateriais)                     */
/* ------------------------------------------------------------------ */
export const SENTIDOS = [
  {
    id: 'apito',
    emoji: '📣',
    titulo: 'O apito de troca de turno',
    texto: 'Não era só um som de trabalho: podia marcar o almoço, a saída do pai ou a hora em que a casa começava a esperar alguém voltar.',
    pergunta: 'O que o apito queria dizer na sua casa?',
  },
  {
    id: 'neblina',
    emoji: '🌫️',
    titulo: 'A neblina no meio da tarde',
    texto: 'A paisagem mudava rápido, as distâncias diminuíam e todo mundo reconhecia o tempo pela umidade, pelo frio e pelos trilhos sumindo.',
    pergunta: 'Do que você se lembra quando a neblina fechava?',
  },
  {
    id: 'cabos',
    emoji: '⚙️',
    titulo: 'O ruído dos cabos de aço',
    texto: 'O som dos cabos e das rodas nos roletes do funicular fazia parte do dia. Dava medo? Dava segurança?',
    pergunta: 'Que barulho da ferrovia ainda mora no seu ouvido?',
  },
  {
    id: 'cheiros',
    emoji: '🪵',
    titulo: 'Carvão, graxa e madeira molhada',
    texto: 'A fumaça, a graxa e a mata úmida se misturavam nas roupas, nas ferramentas e na cozinha em dia de chuva.',
    pergunta: 'Que cheiro te leva de volta para a vila?',
  },
  {
    id: 'festas',
    emoji: '⛪',
    titulo: 'A festa do Bom Jesus',
    texto: 'A igreja, os clubes, a música e as festas do padroeiro juntavam a vila para além da jornada ferroviária.',
    pergunta: 'Conte uma lembrança de festa na vila.',
  },
]

/* ------------------------------------------------------------------ */
/* 4. Quiz “Engenhocas e Ofícios da Serra”                              */
/* ------------------------------------------------------------------ */
export const QUIZ = [
  {
    id: 'q-locobreque',
    termo: 'Locobreque',
    ilustracao: 'locobreque',
    pergunta: 'Para que servia o Locobreque?',
    opcoes: [
      'Levar as famílias até o Castelinho',
      'Empurrar os vagões na subida e segurá-los na descida da Serra',
      'Tocar o apito da troca de turno',
      'Varrer as folhas dos trilhos',
    ],
    correta: 1,
    vocab: 'termo-001',
  },
  {
    id: 'q-cabine',
    termo: 'Cabine de controle',
    ilustracao: 'cabine',
    pergunta: 'O que fazia o cabineiro dentro desta cabine?',
    opcoes: [
      'Vendia bilhetes aos passageiros',
      'Cozinhava para as equipes do pátio',
      'Acompanhava sinais, comandos e movimentos dos trens',
      'Guardava as malas dos viajantes',
    ],
    correta: 2,
    vocab: 'termo-005',
  },
  {
    id: 'q-apito',
    termo: 'Apito da oficina',
    ilustracao: 'apito',
    pergunta: 'Para que servia o apito da oficina?',
    opcoes: [
      'Marcar a troca de turno, o almoço e a saída dos trabalhadores',
      'Chamar as pessoas para o baile',
      'Espantar os pássaros da mata',
      'Avisar que o mercado ia fechar',
    ],
    correta: 0,
    vocab: null,
    curiosidade:
      'O apito não era só um som de trabalho: marcava o almoço, a saída do pai e a hora em que a casa começava a esperar alguém voltar.',
    gatilho: 'O que o apito da oficina queria dizer na sua casa?',
  },
  {
    id: 'q-viradouro',
    termo: 'Viradouro',
    ilustracao: 'viradouro',
    pergunta: 'Para que servia o viradouro?',
    opcoes: [
      'Para lavar as locomotivas',
      'Para guardar o carvão',
      'Para medir a velocidade do trem',
      'Para inverter o sentido da locomotiva, que não tinha marcha a ré',
    ],
    correta: 3,
    vocab: 'termo-010',
  },
  {
    id: 'q-relogio',
    termo: 'Relógio da Estação',
    ilustracao: 'relogio',
    pergunta: 'Qual era o papel do Relógio da Estação na vila?',
    opcoes: [
      'Só enfeitar a praça',
      'Organizar horários de trens, turnos e a entrada e saída dos trabalhadores',
      'Avisar quando ia chover',
      'Marcar o fim dos bailes',
    ],
    correta: 1,
    vocab: 'termo-012',
  },
  {
    id: 'q-maquinas',
    termo: 'Casa de máquinas fixa',
    ilustracao: 'casaMaquinas',
    pergunta: 'O que funcionava dentro da casa de máquinas fixa?',
    opcoes: [
      'Uma padaria para os ferroviários',
      'A escola dos filhos dos operários',
      'Uma grande máquina com roda volante que puxava e controlava os cabos',
      'O depósito de uniformes',
    ],
    correta: 2,
    vocab: 'termo-009',
  },
  {
    id: 'q-foguista',
    termo: 'Foguista',
    ilustracao: 'foguista',
    pergunta: 'Qual era o trabalho do foguista?',
    opcoes: [
      'Alimentar a fornalha com carvão ou lenha para fazer o vapor',
      'Soltar fogos nas festas do padroeiro',
      'Apagar incêndios na mata',
      'Acender os lampiões da rua',
    ],
    correta: 0,
    vocab: 'termo-008',
  },
  {
    id: 'q-patamar',
    termo: 'Patamar',
    ilustracao: 'patamar',
    pergunta: 'O que era um patamar na ferrovia da Serra?',
    opcoes: [
      'Um tipo de vagão de luxo',
      'A área de parada entre dois planos inclinados, com máquinas e equipes',
      'O degrau de entrada da estação',
      'O nome da praça da igreja',
    ],
    correta: 1,
    vocab: 'termo-003',
  },
]

/* ------------------------------------------------------------------ */
/* 5. Caça-palavras                                                     */
/* ------------------------------------------------------------------ */
export const PALAVRAS = [
  { palavra: 'LOCOBREQUE', rotulo: 'Locobreque', curiosidade: VOCABULARIO[0].curiosidade },
  { palavra: 'CASTELINHO', rotulo: 'Castelinho', curiosidade: VOCABULARIO[10].curiosidade },
  { palavra: 'FUNICULAR', rotulo: 'Funicular', curiosidade: VOCABULARIO[1].curiosidade },
  { palavra: 'NEBLINA', rotulo: 'Neblina', curiosidade: 'A neblina chega no meio da tarde e muda a paisagem: os moradores reconheciam o tempo pela umidade, pelo frio e pela visibilidade dos trilhos.' },
  { palavra: 'ESTACAO', rotulo: 'Estação', curiosidade: 'Da antiga estação, a torre do relógio é apontada pela Prefeitura como o único monumento que restou após o incêndio.' },
  { palavra: 'TRILHOS', rotulo: 'Trilhos', curiosidade: 'Para vencer a parede rochosa da Serra, os trilhos foram organizados em planos inclinados, com cabos, contrapesos e máquinas fixas.' },
  { palavra: 'APITO', rotulo: 'Apito', curiosidade: 'O apito de troca de turno marcava o almoço, a saída do trabalho e a hora em que a casa esperava alguém voltar.' },
  { palavra: 'VAPOR', rotulo: 'Vapor', curiosidade: 'O vapor que movia o locobreque vinha da fornalha alimentada pelo foguista com carvão ou lenha.' },
]

export const SENTIMENTOS = [
  { key: 'saudade', emoji: '🥹', label: 'Saudade' },
  { key: 'orgulho', emoji: '🏅', label: 'Orgulho' },
  { key: 'pertencimento', emoji: '🤝', label: 'Pertencimento' },
  { key: 'curiosidade', emoji: '🤔', label: 'Curiosidade' },
  { key: 'preocupacao', emoji: '😟', label: 'Preocupação' },
]

/* ------------------------------------------------------------------ */
/* 6. Bilhete / onboarding                                              */
/* ------------------------------------------------------------------ */
export const LIGACOES = [
  { key: 'ex-ferroviario', emoji: '👷', label: 'Ex-ferroviário(a)', descricao: 'Trabalhei na ferrovia' },
  { key: 'descendente', emoji: '👨‍👧', label: 'Filho(a) ou neto(a) de ferroviário', descricao: 'A ferrovia está na minha família' },
  { key: 'morador', emoji: '🏡', label: 'Morador(a) da vila', descricao: 'Moro ou morei em Paranapiacaba' },
  { key: 'apaixonado', emoji: '⛰️', label: 'Apaixonado(a) pela Serra', descricao: 'Visito e guardo carinho pela vila' },
]

export const DECADAS = ['Anos 40', 'Anos 50', 'Anos 60', 'Anos 70', 'Anos 80', 'Anos 90', 'Anos 2000+']

export const OFICIOS = [
  'Maquinista',
  'Foguista',
  'Cabineiro',
  'Guarda-freios',
  'Oficina',
  'Estação',
  'Pátio e manobras',
  'Casa de máquinas',
  'Vida na vila',
]

/* ------------------------------------------------------------------ */
/* 7. Mapa de sobrenomes (seed fictício, posições aproximadas)          */
/* ------------------------------------------------------------------ */
export const PINS_SEED = [
  {
    id: 'pin-ferreira',
    sobrenome: 'Ferreira',
    parente: 'Seu Joaquim',
    oficio: 'Maquinista do Plano Inclinado',
    periodo: '1958–1982',
    lembranca: 'Saía antes do sol e voltava contando quantas vezes tinha descido a Serra no dia.',
    lat: -23.7772,
    lng: -46.2989,
  },
  {
    id: 'pin-thompson',
    sobrenome: 'Thompson',
    parente: 'Arthur Thompson',
    oficio: 'Maquinista (SPR e Santos-Jundiaí)',
    periodo: 'Anos 40–60',
    lembranca: 'A filha reconhecia o apito dele no meio de todos os outros.',
    lat: -23.7789,
    lng: -46.3004,
  },
  {
    id: 'pin-bianchi',
    sobrenome: 'Bianchi',
    parente: 'Giuseppe Bianchi',
    oficio: 'Foguista e máquinas do funicular',
    periodo: 'Anos 50–70',
    lembranca: 'Chegava em casa com a roupa cheirando a carvão e graxa.',
    lat: -23.7779,
    lng: -46.2978,
  },
  {
    id: 'pin-silva',
    sobrenome: 'da Silva',
    parente: 'Joaquim da Silva',
    oficio: 'Guarda-freios',
    periodo: '1958–1972',
    lembranca: 'Voltava com as mãos marcadas, mas falava pouco do perigo.',
    lat: -23.7795,
    lng: -46.2991,
  },
  {
    id: 'pin-correia',
    sobrenome: 'Correia',
    parente: 'António Correia',
    oficio: 'Cabineiro (RFFSA)',
    periodo: 'Anos 70',
    lembranca: 'Anotava tudo num caderno: horários, manobras e o nome dos colegas.',
    lat: -23.7766,
    lng: -46.3008,
  },
  {
    id: 'pin-garcia',
    sobrenome: 'García',
    parente: 'Dona Dolores García',
    oficio: 'Costureira da vila',
    periodo: 'Anos 70–80',
    lembranca: 'Costurava uniformes e sabia de cor quem entrava em cada turno.',
    lat: -23.7786,
    lng: -46.3017,
  },
  {
    id: 'pin-oliveira',
    sobrenome: 'Oliveira',
    parente: 'Sebastião Oliveira',
    oficio: 'Trabalhador de pátio',
    periodo: 'Anos 60–80',
    lembranca: '“Não se atravessa a linha sem olhar duas vezes”, ensinava aos filhos.',
    lat: -23.7801,
    lng: -46.2976,
  },
].map((p) => ({ ...p, origem: 'seed', ficticio: true, ts: '2026-10-01T12:00:00-03:00' }))
