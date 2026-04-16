// Dados mock para desenvolvimento local — substituídos por dados reais do scraper em produção

// Armas reais do Warzone × Black Ops 7 — Temporada 3 (fonte: wzhub.gg)
export const MOCK_META = [
  {id:"1",arma:"STRIDER 300",tipo:"Franco-atirador",tier:"S",pickRate:0},
  {id:"2",arma:"MK35 ISR",tipo:"Rifle de Assalto",tier:"S",pickRate:0},
  {id:"3",arma:"VST",tipo:"Submetralhadora",tier:"S",pickRate:0},
  {id:"4",arma:"HAWKER HX",tipo:"Franco-atirador",tier:"S",pickRate:0},
  {id:"5",arma:"VOYAK KT 3",tipo:"Submetralhadora",tier:"S",pickRate:0},
  {id:"6",arma:"RAZOR 9MM",tipo:"Submetralhadora",tier:"A",pickRate:0},
  {id:"7",arma:"DRAVEC 45",tipo:"Rifle de Assalto",tier:"A",pickRate:0},
  {id:"8",arma:"EGRT 17",tipo:"Rifle de Assalto",tier:"A",pickRate:0},
  {id:"9",arma:"DS20 MIRAGE",tipo:"Submetralhadora",tier:"A",pickRate:0},
  {id:"10",arma:"STURMWOLF 45",tipo:"Rifle de Assalto",tier:"A",pickRate:0},
  {id:"11",arma:"KOGOT 7",tipo:"Submetralhadora",tier:"B",pickRate:0},
  {id:"12",arma:"VS RECON",tipo:"Rifle de Precisão",tier:"B",pickRate:0},
  {id:"13",arma:"MK.78",tipo:"Metralhadora",tier:"B",pickRate:0},
  {id:"14",arma:"SG-12",tipo:"Escopeta",tier:"B",pickRate:0},
  {id:"15",arma:"MXR 17",tipo:"Rifle de Assalto",tier:"B",pickRate:0},
];

// Loadouts reais do Warzone × Black Ops 7 — Temporada 3 (fonte: wzhub.gg)
export const MOCK_LOADOUTS = [
  {
    id:"1",arma:"STRIDER 300",tipo:"Franco-atirador",tier:"S",codigo:"R07-2JD6P-9UF4L-IW11",
    attachments:[
      {slot:"Boca",nome:"SILENCIADOR MONOLÍTICO"},
      {slot:"Cano",nome:"25\" BOWEN GROOVED BARREL"},
      {slot:"Acoplamento",nome:"CORNERSTONE-642 GUARD"},
      {slot:"Cabo",nome:"HATCH QUICK GRIP"},
      {slot:"Mods de disparo",nome:".300 WM OVERPRESSURED"},
    ],
    perks:[],alcance:"Longo",fonte:"wzhub.gg"
  },
  {
    id:"2",arma:"MK35 ISR",tipo:"Rifle de Assalto",tier:"S",codigo:"",
    attachments:[
      {slot:"Lente",nome:"FANG HOVERPOINT ELO"},
      {slot:"Boca",nome:"SILENCIADOR MONOLÍTICO"},
      {slot:"Cano",nome:"16.5\" GREAVES BELLUM BARREL"},
      {slot:"Carregador",nome:"BOWEN SIREN DRUM"},
      {slot:"Mods de disparo",nome:"OTAN 5.56 RM"},
    ],
    perks:[],alcance:"Médio/Longo",fonte:"wzhub.gg"
  },
  {
    id:"3",arma:"VST",tipo:"Submetralhadora",tier:"S",codigo:"",
    attachments:[
      {slot:"Boca",nome:"HAWKER SERIES 45"},
      {slot:"Cano",nome:"14\" LTI EXPEDITION BARREL"},
      {slot:"Carregador",nome:"AVARICE EXTENDED MAG II"},
      {slot:"Coronha",nome:"HAWKER CUB-55 PAD"},
      {slot:"Mods de disparo",nome:"BUFFER SPRINGS"},
    ],
    perks:[],alcance:"Curto/Médio",fonte:"wzhub.gg"
  },
  {
    id:"4",arma:"VOYAK KT 3",tipo:"Submetralhadora",tier:"S",codigo:"",
    attachments:[
      {slot:"Lente",nome:"FANG HOVERPOINT ELO"},
      {slot:"Boca",nome:"MONOLITHIC SUPPRESSOR"},
      {slot:"Cano",nome:"17.6\" LTI GRAV-4 BARREL"},
      {slot:"Carregador",nome:"SK-GARRISON DRUM"},
      {slot:"Coronha",nome:"V-LAST CONTROL PAD"},
    ],
    perks:[],alcance:"Curto/Médio",fonte:"wzhub.gg"
  },
  {
    id:"5",arma:"RAZOR 9MM",tipo:"Submetralhadora",tier:"A",codigo:"",
    attachments:[
      {slot:"Lente",nome:"LETHAL TOOLS ELO"},
      {slot:"Boca",nome:"H-9MM PRECISION COMP"},
      {slot:"Cano",nome:"12\" MFS SIDEWINDER BARREL"},
      {slot:"Carregador",nome:"ZEALOT EXTENDED MAG II"},
      {slot:"Mods de disparo",nome:"ACCELERATED RECOIL SYSTEM"},
    ],
    perks:[],alcance:"Curto/Médio",fonte:"wzhub.gg"
  },
  {
    id:"6",arma:"DRAVEC 45",tipo:"Rifle de Assalto",tier:"A",codigo:"",
    attachments:[
      {slot:"Boca",nome:"HAWKER SERIES 45"},
      {slot:"Cano",nome:"19\" EAM HORIZON BARREL"},
      {slot:"Carregador",nome:"GATOR EXTENDED MAG"},
      {slot:"Laser",nome:"MFS AGILE LASER PRO"},
      {slot:"Mods de disparo",nome:"BOLT CARRIER GROUP"},
    ],
    perks:[],alcance:"Médio/Longo",fonte:"wzhub.gg"
  },
];

export const MOCK_NOTICIAS = [
  {
    id:"1",
    titulo:"Temporada 4 traz novo operador e arma lendária para o Warzone",
    resumo:"A atualização da Temporada 4 chega com conteúdo massivo: novo mapa de Gulag, operador exclusivo e a primeira arma lendária da temporada.",
    link:"https://warzoneloadout.games",
    imagem:"",
    publicadoEm:"2026-04-14T10:00:00Z",
    fonte:"warzoneloadout.games"
  },
  {
    id:"2",
    titulo:"Nerf no XM4 na próxima atualização de balanceamento",
    resumo:"A Raven Software anunciou ajustes no XM4 e Jackal PDW para a próxima patch. Confira os detalhes do que vai mudar.",
    link:"https://warzoneloadout.games",
    imagem:"",
    publicadoEm:"2026-04-13T14:30:00Z",
    fonte:"warzoneloadout.games"
  },
  {
    id:"3",
    titulo:"Evento Operação Fantasma: todas as recompensas e como desbloquear",
    resumo:"O evento Operação Fantasma está ativo até 30 de abril. Veja todos os desafios, recompensas e dicas para completar rápido.",
    link:"https://warzoneloadout.games",
    imagem:"",
    publicadoEm:"2026-04-12T09:00:00Z",
    fonte:"charlieintel.com"
  },
  {
    id:"4",
    titulo:"Guia completo: melhores perks para Rebirth Island na Temporada 4",
    resumo:"Com as mudanças da nova temporada, as combinações de perks mudaram. Veja quais são as mais eficientes no mapa Rebirth Island.",
    link:"https://warzoneloadout.games",
    imagem:"",
    publicadoEm:"2026-04-11T16:45:00Z",
    fonte:"warzoneloadout.games"
  },
];

export const MOCK_TEMPORADA = {
  numero:"Temporada 3",
  jogo:"Warzone × Black Ops 7",
  inicio:"2026-04-02",
  fim:"2026-06-04",
  descricao:"A Temporada 3 expande o mapa Avalon com novos caminhos e ilhas, adiciona o modo Endgame cooperativo e introduz duas novas armas na Battle Pass. Prepare seu loadout!",
  novidades:[
    "Mapa Avalon: novas ilhas e caminhos com água drenada",
    "Nova arma: MK35 ISR (Rifle de Assalto) — grátis na Battle Pass",
    "Nova arma: VST (Submetralhadora) — grátis na Battle Pass",
    "Modo Endgame: cooperativo PvE gratuito por tempo limitado",
    "Novos ziplines e barcos no mapa",
    "Balanceamento geral: STRIDER 300, VST e SMGs curto alcance",
  ],
  passeDeBatalha:{
    itens:100,
    preco:"1000 CP",
    destaque:"BlackCell + 2 armas grátis + 1300 CP de volta"
  }
};

export const MOCK_EVENTOS = [
  {
    id:"1",
    nome:"Operação Fantasma",
    descricao:"Complete missões especiais com seu esquadrão e desbloqueie skins exclusivas de operadores e armamento.",
    inicio:"2026-04-10",
    fim:"2026-04-30",
    ativo:true,
    recompensas:[
      {nome:"Skin Operador: Ghost Elite",tipo:"skin"},
      {nome:"Traçante Laranja — XM4",tipo:"arma"},
      {nome:"Emblema Operação Fantasma",tipo:"emblema"},
      {nome:"2000 XP Bônus",tipo:"xp"},
    ],
    cor:"#f97316"
  },
  {
    id:"2",
    nome:"Torneio Semanal — Solo",
    descricao:"Competição semanal no modo Solo. Top 100 jogadores ganham recompensas exclusivas e pontos de temporada.",
    inicio:"2026-04-14",
    fim:"2026-04-20",
    ativo:true,
    recompensas:[
      {nome:"Cartão de Visita Exclusivo",tipo:"cosmético"},
      {nome:"500 Pontos de Temporada",tipo:"ranked"},
    ],
    cor:"#a855f7"
  },
  {
    id:"3",
    nome:"Semana Dupla XP",
    descricao:"XP dobrado em todos os modos durante o fim de semana. Aproveite para upar seu passe de batalha e armamentos.",
    inicio:"2026-04-19",
    fim:"2026-04-21",
    ativo:false,
    recompensas:[
      {nome:"XP 2x em todos os modos",tipo:"xp"},
      {nome:"XP de arma 2x",tipo:"xp"},
    ],
    cor:"#22c55e"
  },
];

export const MOCK_PATCHES = [
  {id:"1",arma:"XM4",tipo:"nerf",data:"2026-04-02",temporada:"Season 3",imagem:"",link:"https://warzoneloadout.games/pt-br/nerf-buff/",fonte:"warzoneloadout.games"},
  {id:"2",arma:"C9",tipo:"nerf",data:"2026-04-02",temporada:"Season 3",imagem:"",link:"https://warzoneloadout.games/pt-br/nerf-buff/",fonte:"warzoneloadout.games"},
  {id:"3",arma:"Jackal PDW",tipo:"nerf",data:"2026-04-02",temporada:"Season 3",imagem:"",link:"https://warzoneloadout.games/pt-br/nerf-buff/",fonte:"warzoneloadout.games"},
  {id:"4",arma:"AMES 85",tipo:"buff",data:"2026-04-02",temporada:"Season 3",imagem:"",link:"https://warzoneloadout.games/pt-br/nerf-buff/",fonte:"warzoneloadout.games"},
  {id:"5",arma:"GPR 91",tipo:"buff",data:"2026-04-02",temporada:"Season 3",imagem:"",link:"https://warzoneloadout.games/pt-br/nerf-buff/",fonte:"warzoneloadout.games"},
  {id:"6",arma:"LR 7.62",tipo:"nerf",data:"2026-03-24",temporada:"Season 2 Reloaded",imagem:"",link:"https://warzoneloadout.games/pt-br/nerf-buff/",fonte:"warzoneloadout.games"},
  {id:"7",arma:"GPMG-7",tipo:"buff",data:"2026-03-24",temporada:"Season 2 Reloaded",imagem:"",link:"https://warzoneloadout.games/pt-br/nerf-buff/",fonte:"warzoneloadout.games"},
  {id:"8",arma:"Krig C",tipo:"buff",data:"2026-03-11",temporada:"Season 2 Reloaded",imagem:"",link:"https://warzoneloadout.games/pt-br/nerf-buff/",fonte:"warzoneloadout.games"},
];

// Templates de sugestão — armas preenchidas dinamicamente pelo meta atual
// tipoPrincipal / tipoSec: categoria de arma buscada no meta
// armaFallback / armaSecFallback: usada se o meta não tiver dados
// dicas: suportam {arma} e {armaSec} como placeholders
export const SUGESTOES_TEMPLATES = [
  {
    id:"1",
    titulo:"Setup Agressivo",
    subtitulo:"Rush e combate próximo",
    categoria:"Agressivo",
    cor:"#ef4444",
    tipoPrincipal:"Submetralhadora",
    tipoSec:"Franco-atirador",
    armaFallback:"VST",
    armaSecFallback:"HAWKER HX",
    dicas:[
      "Prefira engajamentos em menos de 20m com {arma} — recuo mínimo e TTK excelente",
      "Guarde {armaSec} para alvos a distância ou quando precisar de uma kill rápida",
      "Entre em ambientes pela rota menos óbvia — flancos laterais têm menos cobertura defensiva",
      "Sempre reabasteça munição após cada gunfight — não entre no próximo combate no seco",
    ]
  },
  {
    id:"2",
    titulo:"Setup Longo Alcance",
    subtitulo:"Dominância em campo aberto",
    categoria:"Sniper",
    cor:"#3b82f6",
    tipoPrincipal:"Franco-atirador",
    tipoSec:"Submetralhadora",
    armaFallback:"STRIDER 300",
    armaSecFallback:"VST",
    dicas:[
      "Posicione-se com cobertura nas costas antes de abrir {arma} — evita flancos enquanto mira",
      "{armaSec} é essencial para proteção caso o inimigo chegue perto",
      "Marque inimigos no minimapa antes de atirar — saiba para onde eles vão recuar",
      "Mude de posição após cada abate confirmado — inimigos rastreiam o som do tiro",
    ]
  },
  {
    id:"3",
    titulo:"Setup Equilibrado",
    subtitulo:"Versátil para qualquer situação",
    categoria:"Versátil",
    cor:"#f97316",
    tipoPrincipal:"Rifle de Assalto",
    tipoSec:"Submetralhadora",
    armaFallback:"MK35 ISR",
    armaSecFallback:"VST",
    dicas:[
      "{arma} cobre médio e longo alcance — use {armaSec} para close quarters",
      "Alterne entre as armas conforme a distância do alvo — não force o alcance errado",
      "Reposicione-se após cada troca de tiros para não ser previsível",
      "Cubra a reanimação de aliados com {arma} enquanto eles se recompõem",
    ]
  },
  {
    id:"4",
    titulo:"Setup Ranked",
    subtitulo:"Competitivo e consistente",
    categoria:"Ranked",
    cor:"#a855f7",
    tipoPrincipal:"Franco-atirador",
    tipoSec:"Rifle de Assalto",
    armaFallback:"STRIDER 300",
    armaSecFallback:"MK35 ISR",
    dicas:[
      "No ranked, posicionamento vale mais que agressividade — {arma} domina à distância",
      "Jogue pelo círculo cedo: chegue à zona final antes dos 5 minutos finais",
      "Evite combates desnecessários nos estágios iniciais — conserve armadura para o final",
      "Comunique posições de inimigos para o esquadrão antes de engajar",
      "Use {armaSec} para confirmar abates em curta distância sem arriscar com o sniper",
    ]
  },
  {
    id:"5",
    titulo:"Setup para Iniciantes",
    subtitulo:"Fácil de usar, alta eficiência",
    categoria:"Iniciante",
    cor:"#22c55e",
    tipoPrincipal:"Rifle de Assalto",
    tipoSec:"Submetralhadora",
    armaFallback:"MK35 ISR",
    armaSecFallback:"VST",
    dicas:[
      "{arma} tem recuo controlável — ideal para quem está aprendendo",
      "Comece pegando armadura e munição antes de engajar — equipe-se bem",
      "Fique nos bordos do círculo em vez do centro — menos inimigos de múltiplos ângulos",
      "Prefira coberturas sólidas a janelas abertas — reduza os ângulos de exposição",
    ]
  },
  {
    id:"6",
    titulo:"Combo Duplo SMG",
    subtitulo:"Máxima mobilidade e velocidade",
    categoria:"Agressivo",
    cor:"#ef4444",
    tipoPrincipal:"Submetralhadora",
    tipoSec:"Submetralhadora",
    armaFallback:"VST",
    armaSecFallback:"C9",
    dicas:[
      "Dois SMGs cobrem 0–30m com altíssima cadência de fogo",
      "Use {arma} como principal e {armaSec} como backup quando a munição acabar",
      "Funciona melhor em mapas com muita cobertura: Rebirth Island, Verdansk urbano",
      "Movimentação constante é sua defesa — nunca fique parado em duelos de SMG",
    ]
  },
];

