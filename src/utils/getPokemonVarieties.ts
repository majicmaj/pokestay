import { Pokemon, NamedAPIResource } from "../types";

interface PokemonVariety {
  is_default: boolean;
  pokemon: NamedAPIResource;
}

export const getPokemonVarieties = async (
  pokemon: Pokemon
): Promise<NamedAPIResource[]> => {
  try {
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
    );
    if (!pokemonResponse.ok) {
      const byNameResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`
      );
      if (!byNameResponse.ok) return [];
      const pokemonData = await byNameResponse.json();
      const speciesResponse = await fetch(pokemonData.species.url);
      if (!speciesResponse.ok) return [];
      const speciesData = await speciesResponse.json();
      if (speciesData.varieties && speciesData.varieties.length > 1) {
        return speciesData.varieties
          .map((v: PokemonVariety) => v.pokemon)
          .filter(
            (p: NamedAPIResource) => !p.name.toLowerCase().includes("gmax")
          );
      }
    } else {
      const pokemonData = await pokemonResponse.json();
      const speciesResponse = await fetch(pokemonData.species.url);
      if (!speciesResponse.ok) return [];
      const speciesData = await speciesResponse.json();
      if (speciesData.varieties && speciesData.varieties.length > 1) {
        return speciesData.varieties
          .map((v: PokemonVariety) => v.pokemon)
          .filter(
            (p: NamedAPIResource) => !p.name.toLowerCase().includes("gmax")
          );
      }
    }

    return [];
  } catch (error) {
    console.error("Failed to get pokemon varieties:", error);
    return [];
  }
};
