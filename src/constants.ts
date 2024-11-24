import { GameState, Upgrade } from './types';
export const POINTS_TO_WIN = 10000;

export const UPGRADES: Upgrade[] = [
  {
    id: 'great-ball',
    name: 'Great Ball',
    description: 'Better catch rate and higher chance for rare Pokémon',
    cost: 500,
    purchased: false,
    type: 'ball',
  },
  {
    id: 'ultra-ball',
    name: 'Ultra Ball',
    description:
      'Much better catch rate and even higher chance for rare Pokémon',
    cost: 2000,
    purchased: false,
    type: 'ball',
  },
  {
    id: 'master-ball',
    name: 'Master Ball',
    description: 'Never fails to catch and guarantees legendary Pokémon',
    cost: 10000,
    purchased: false,
    type: 'ball',
  },
  {
    id: 'quick-throw',
    name: 'Quick Throw Training',
    description: 'Increases base throw speed by 20%',
    cost: 300,
    purchased: false,
    type: 'skill',
  },
  {
    id: 'strong-throw',
    name: 'Strong Throw Training',
    description: 'Increases catch rate of all throws by 10%',
    cost: 800,
    purchased: false,
    type: 'skill',
  },
  {
    id: 'type-expert',
    name: 'Type Expert',
    description: 'Increases type advantage bonus by 50%',
    cost: 1500,
    purchased: false,
    type: 'skill',
  },
];

export const INITIAL_STATE: GameState = {
  points: 0,
  pokedex: [],
  inventory: [],
  catchesPerClick: 1,
  autoClicksPerSecond: 0,
  pokeballs: 1,
  greatballs: false,
  ultraballs: false,
  masterballs: false,
  uniquePokemonCaught: 0,
  buddyPokemon: null,
  selectedMove: null,
};

export const POKEDEX_LAST_POKEMON = 251

// Array of all legendary Pokémon IDs
export const LEGENDARY_POKEMON_IDS = [
  144, // Articuno
  145, // Zapdos
  146, // Moltres

  150, // Mewtwo
  151, // Mew
  243, // Raikou

  244, // Entei
  245, // Suicune
  249, // Lugia

  250, // Ho-oh
  251, // Celebi

  377, // Regirock
  378, // Regice
  379, // Registeel
  380, // Latias
  381, // Latios
  382, // Kyogre
  383, // Groudon
  384, // Rayquaza
  385, // Jirachi
  386, // Deoxys
  480, // Uxie
  481, // Mesprit
  482, // Azelf
  483, // Dialga
  484, // Palkia
  485, // Heatran
  486, // Regigigas
  487, // Giratina
  488, // Cresselia
  489, // Phione
  490, // Manaphy
  491, // Darkrai
  492, // Shaymin
  493, // Arceus
  638, // Cobalion
  639, // Terrakion
  640, // Virizion
  641, // Tornadus
  642, // Thundurus
  643, // Reshiram
  644, // Zekrom
  645, // Landorus
  646, // Kyurem
  647, // Keldeo
  648, // Meloetta
  649, // Genesect
  716, // Xerneas
  717, // Yveltal
  718, // Zygarde
  719, // Diancie
  720, // Hoopa
  721, // Volcanion
  785, // Tapu Koko
  786, // Tapu Lele
  787, // Tapu Bulu
  788, // Tapu Fini
  789, // Cosmog
  790, // Cosmoem
  791, // Solgaleo
  792, // Lunala
  800, // Necrozma
  801, // Magearna
  802, // Marshadow
  807, // Zeraora
  888, // Zacian
  889, // Zamazenta
  890, // Eternatus
  891, // Kubfu
  892, // Urshifu
  894, // Regieleki
  895, // Regidrago
  896, // Glastrier
  897, // Spectrier
  898  // Calyrex
];

export const TYPE_CHART = {
  normal: { weakTo: ['fighting'], resistantTo: [], immuneTo: ['ghost'] },
  fire: {
    weakTo: ['water', 'ground', 'rock'],
    resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
  },
  water: {
    weakTo: ['electric', 'grass'],
    resistantTo: ['fire', 'water', 'ice', 'steel'],
  },
  electric: {
    weakTo: ['ground'],
    resistantTo: ['electric', 'flying', 'steel'],
  },
  grass: {
    weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'],
    resistantTo: ['water', 'electric', 'grass', 'ground'],
  },
  ice: { weakTo: ['fire', 'fighting', 'rock', 'steel'], resistantTo: ['ice'] },
  fighting: {
    weakTo: ['flying', 'psychic', 'fairy'],
    resistantTo: ['bug', 'rock', 'dark'],
  },
  poison: {
    weakTo: ['ground', 'psychic'],
    resistantTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
  },
  ground: {
    weakTo: ['water', 'grass', 'ice'],
    resistantTo: ['poison', 'rock'],
    immuneTo: ['electric'],
  },
  flying: {
    weakTo: ['electric', 'ice', 'rock'],
    resistantTo: ['grass', 'fighting', 'bug'],
    immuneTo: ['ground'],
  },
  psychic: {
    weakTo: ['bug', 'ghost', 'dark'],
    resistantTo: ['fighting', 'psychic'],
  },
  bug: {
    weakTo: ['fire', 'flying', 'rock'],
    resistantTo: ['grass', 'fighting', 'ground'],
  },
  rock: {
    weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'],
    resistantTo: ['normal', 'fire', 'poison', 'flying'],
  },
  ghost: {
    weakTo: ['ghost', 'dark'],
    resistantTo: ['poison', 'bug'],
    immuneTo: ['normal', 'fighting'],
  },
  dragon: {
    weakTo: ['ice', 'dragon', 'fairy'],
    resistantTo: ['fire', 'water', 'electric', 'grass'],
  },
  dark: {
    weakTo: ['fighting', 'bug', 'fairy'],
    resistantTo: ['ghost', 'dark'],
    immuneTo: ['psychic'],
  },
  steel: {
    weakTo: ['fire', 'fighting', 'ground'],
    resistantTo: [
      'normal',
      'grass',
      'ice',
      'flying',
      'psychic',
      'bug',
      'rock',
      'dragon',
      'steel',
      'fairy',
    ],
    immuneTo: ['poison'],
  },
  fairy: {
    weakTo: ['poison', 'steel'],
    resistantTo: ['fighting', 'bug', 'dark'],
    immuneTo: ['dragon'],
  },
};