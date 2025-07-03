export interface PokemonMove {
  id: number;
  name: string;
  type: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  effect: {
    type: "damage" | "defense_down" | "speed_down" | "catch_rate_up";
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
  uuid?: string;
  display_name?: string;
  id: number;
  name: string;
  height?: number; // in decimetres
  rarity: "common" | "uncommon" | "rare" | "legendary";
  points: number;
  caught: boolean;
  caughtAt?: Date;
  sprite: string;
  sprite2d?: string;
  types: string[];
  stats: PokemonStats;
  moves: PokemonMove[];
  currentHp?: number;
  currentDefense?: number;
  currentSpeed?: number;
  cp?: number;
  isShiny?: boolean;
  ivs?: {
    attack: number;
    defense: number;
    speed: number;
    hp: number;
  };
  ivModifiers?: {
    attack: number;
    defense: number;
    speed: number;
    hp: number;
  };
  caughtLocation?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

export interface WildPokemonState extends Pokemon {
  // currentHp: number;
  // currentDefense: number;
  // currentSpeed: number;
  catchModifier: number;
}

export interface GameState {
  inventory: Pokemon[];
  pokedex: Pokemon[];
  uniquePokemonCaught: number;
  buddyPokemon: Pokemon | null;
  selectedMove: PokemonMove | null;
  points: number;
  currentPokemon: WildPokemonState | null;
}

export type Menus = "none" | "pokedex" | "inventory" | "shop";
export type PokemonState = "idle" | "caught" | "fled";
export type Pokeball = "pokeball" | "greatball" | "ultraball" | "masterball";

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface Move {
  move: {
    name: string;
    url: string;
  };
}
