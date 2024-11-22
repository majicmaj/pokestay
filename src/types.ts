export interface PokemonMove {
  id: number;
  name: string;
  type: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  effect: {
    type: 'damage' | 'defense_down' | 'speed_down' | 'catch_rate_up';
    value: number;
    chance: number;
  };
  description: string;
}

export interface PokemonStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
}

export interface Pokemon {
  id: number;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  points: number;
  caught: boolean;
  sprite: string;
  types: string[];
  stats: PokemonStats;
  moves: PokemonMove[];
  currentHp?: number;
  currentDefense?: number;
  currentSpeed?: number;
}

export interface WildPokemonState extends Pokemon {
  currentHp: number;
  currentDefense: number;
  currentSpeed: number;
  catchModifier: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  type: 'ball' | 'skill';
}

export interface GameState {
  points: number;
  pokedex: Pokemon[];
  catchesPerClick: number;
  autoClicksPerSecond: number;
  pokeballs: number;
  greatballs: boolean;
  ultraballs: boolean;
  masterballs: boolean;
  uniquePokemonCaught: number;
  buddyPokemon: Pokemon | null;
  selectedMove: PokemonMove | null;
  inventory: Pokemon[];
}

export type Menus = 'none' | 'pokedex' | 'inventory' | 'shop';
export type PokemonState = 'idle' | 'caught' | 'fled';
