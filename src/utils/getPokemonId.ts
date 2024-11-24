import { LEGENDARY_POKEMON_IDS, POKEDEX_LAST_POKEMON } from "../constants";

export const getNonLegendaryPokemonId = () => {
  let pokemonId;
  do {
    pokemonId = Math.floor(Math.random() * POKEDEX_LAST_POKEMON) + 1;
  } while (LEGENDARY_POKEMON_IDS.includes(pokemonId));
  return pokemonId;
};

export const getLegendaryPokemonId = () => {
  const index = Math.floor(Math.random() * 12)
  const pokemonId = LEGENDARY_POKEMON_IDS[index]

  return pokemonId
}

export const getPokemonId = (isLegendary: boolean) => isLegendary ? getLegendaryPokemonId() : getNonLegendaryPokemonId()
