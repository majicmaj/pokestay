import { Pokemon, NamedAPIResource } from "../types";

interface EvolutionStage {
  species: NamedAPIResource;
  evolves_to: EvolutionStage[];
}

export const hasEvolution = async (pokemon: Pokemon): Promise<boolean> => {
  try {
    // Fetch species data for the current Pokémon
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`
    );
    if (!speciesResponse.ok) return false;
    const speciesData = await speciesResponse.json();

    // Get the evolution chain URL
    const evolutionChainUrl = speciesData.evolution_chain.url;

    // Fetch the evolution chain data
    const evolutionChainResponse = await fetch(evolutionChainUrl);
    if (!evolutionChainResponse.ok) return false;
    const evolutionChainData = await evolutionChainResponse.json();

    const findCurrentStage = (stage: EvolutionStage): EvolutionStage | null => {
      if (stage.species.name === pokemon.name.toLowerCase()) {
        return stage;
      }
      for (const nextStage of stage.evolves_to) {
        const found = findCurrentStage(nextStage);
        if (found) return found;
      }
      return null;
    };

    const pokemonStage = findCurrentStage(evolutionChainData.chain);

    return pokemonStage ? pokemonStage.evolves_to.length > 0 : false;
  } catch (error) {
    console.error("Failed to check evolution:", error);
    return false;
  }
};
