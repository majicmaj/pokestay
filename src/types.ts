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
  weight?: number; // in hectograms
  rarity: "common" | "uncommon" | "rare" | "legendary" | "mythical";
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
  cry?: string;
}

export type IVs = Pokemon["ivs"];

export interface WildPokemonState extends Pokemon {
  rarity: "common" | "uncommon" | "rare" | "legendary" | "mythical";
  points: number;
  caught: boolean;
  catchModifier: number;
}

export type StoredPokemon = Omit<Pokemon, "moves" | "ivs" | "ivModifiers">;

export interface GameState {
  inventory: Pokemon[];
  pokedex: Pokemon[];
  uniquePokemonCaught: number;
  buddyPokemon: Pokemon | null;
  selectedMove: PokemonMove | null;
  points: number;
  currentPokemon: WildPokemonState | null;
  activeMegaEvolutions: {
    pokemonUuid: string;
    revertAt: number;
    originalFormName: string;
  }[];
}

export type Menus = "none" | "buddy" | "pouch" | "log";
export type PokemonState = "idle" | "caught" | "fled";
export type Pokeball = "pokeball" | "greatball" | "ultraball" | "masterball";

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface Move {
  move: {
    name: string;
    url: string;
  };
}

export type EncounterLogEntry = {
  pokemonName: string;
  pokemonSprite: string;
  throws: number;
  status: "caught" | "fled";
  stardust: number;
  timestamp: Date;
  location?: LocationData;
  pokemonUuid?: string;
  pokemonId?: number;
  isShiny?: boolean;
  cp?: number;
};

export type LocationData = {
  city?: string;
  state?: string;
  country?: string;
};
