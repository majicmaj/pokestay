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
