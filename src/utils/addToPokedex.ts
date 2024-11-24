import { GameState, Pokemon } from "../types";

export const addToPokedex = (
  pokemon: Pokemon,
  gameState: GameState
): GameState => {
  const existingEntry = gameState.pokedex.find((p) => p.id === pokemon.id);

  const caughtAt = new Date();

  const caughtPokemon = { ...pokemon, caughtAt };
  if (!existingEntry) {
    // Add new entry to Pokédex
    return {
      ...gameState,
      pokedex: [...gameState.pokedex, { ...caughtPokemon, caught: true }],
      inventory: [...gameState.inventory, caughtPokemon],
      uniquePokemonCaught: gameState.uniquePokemonCaught + 1,
    };
  } else if (!existingEntry.caught) {
    // Update existing entry to mark as caught
    return {
      ...gameState,
      pokedex: gameState.pokedex.map((p) =>
        p.id === pokemon.id ? { ...p, caught: true } : p
      ),
      inventory: [...gameState.inventory, caughtPokemon],
      uniquePokemonCaught: gameState.uniquePokemonCaught + 1,
    };
  }

  // If already caught, just add to inventory
  return {
    ...gameState,
    inventory: [...gameState.inventory, pokemon],
  };
};
