import { Pokemon } from "../types";

export const hasEvolution = async (pokemon: Pokemon): Promise<boolean> => {
  try {
    // Fetch species data for the current Pokémon
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`
    );
    const speciesData = await speciesResponse.json();

    // Get the evolution chain URL
    const evolutionChainUrl = speciesData.evolution_chain.url;

    // Fetch the evolution chain data
    const evolutionChainResponse = await fetch(evolutionChainUrl);
    const evolutionChainData = await evolutionChainResponse.json();

    // Traverse the chain to check if the Pokémon has an evolution
    let currentStage = evolutionChainData.chain;
    while (currentStage) {
      if (currentStage.species.name === pokemon.name.toLowerCase()) {
        // If evolves_to array is not empty, it has an evolution
        return currentStage.evolves_to.length > 0;
      }
      currentStage = currentStage.evolves_to[0];
    }

    return false; // If not found in the chain, assume no evolution
  } catch (error) {
    console.error("Failed to check evolution:", error);
    throw error;
  }
};
