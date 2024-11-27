import { GameState } from "./types";
export const POINTS_TO_WIN = 10000;

export const INITIAL_STATE: GameState = {
  buddyPokemon: null,
  inventory: [],
  points: 0,
  pokedex: [],
  selectedMove: null,
  uniquePokemonCaught: 0,
  currentPokemon: null,
};

export const POKEDEX_LAST_POKEMON = 251;
