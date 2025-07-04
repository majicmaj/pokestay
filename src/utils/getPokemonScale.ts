import { Pokemon } from "../types";

export const getPokemonScale = (pokemon: Pokemon) => {
  const height = pokemon?.height || 10; // Default to 1m (10dm) if no height
  const minHeight = 1; // Joltik
  const maxHeight = 200; // Eternatus

  const minScale = 0.125;
  const maxScale = 1.25;

  // Use a logarithmic scale to better handle the wide range of Pokémon heights
  const logHeight = Math.log10(Math.max(minHeight, height));
  const logMinHeight = Math.log10(minHeight);
  const logMaxHeight = Math.log10(maxHeight);

  const scale =
    minScale +
    ((logHeight - logMinHeight) / (logMaxHeight - logMinHeight)) *
      (maxScale - minScale);

  return Math.min(maxScale, Math.max(minScale, scale)); // Clamp the value
};
