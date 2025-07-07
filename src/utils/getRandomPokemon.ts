import { v4 as uuidv4 } from "uuid";
import { NamedAPIResource, WildPokemonState } from "../types";
import { createPokemonFromApi } from "./createPokemonFromApi";

const POINTS_RARITY_MAP = {
  common: 100,
  uncommon: 150,
  rare: 300,
  mythical: 500,
  legendary: 1000,
};

const LEVEL_RANGES = {
  common: { min: 1, max: 12 },
  uncommon: { min: 13, max: 21 },
  rare: { min: 21, max: 30 },
  mythical: { min: 30, max: 31 },
  legendary: { min: 30, max: 31 },
};

export const getRandomPokemon = async (
  pokemonSpecies: NamedAPIResource[]
): Promise<WildPokemonState | null> => {
  if (pokemonSpecies.length === 0) return null;

  const randomSpecies =
    pokemonSpecies[Math.floor(Math.random() * pokemonSpecies.length)];

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomSpecies.name}`
    );
    const data = await response.json();

    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();
    const { capture_rate, is_mythical, is_legendary } = speciesData || {};

    let rarity: "common" | "uncommon" | "rare" | "legendary" | "mythical" =
      "common";

    const captureRate = capture_rate / 255;

    if (is_legendary) rarity = "legendary";
    else if (is_mythical) rarity = "mythical";
    else if (captureRate < 0.1) rarity = "rare";
    else if (captureRate < 0.5) rarity = "uncommon";

    const range = LEVEL_RANGES[rarity];
    const level =
      Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

    const isShiny = Math.random() * 128 < (is_legendary ? 10 : 1);

    const pokemon = await createPokemonFromApi(data, { level, isShiny });

    const wildPokemon: WildPokemonState = {
      ...(pokemon as WildPokemonState),
      uuid: uuidv4(),
      rarity,
      points: POINTS_RARITY_MAP[rarity] || 100,
      caught: false,
      catchModifier: isShiny ? captureRate * 10 : captureRate,
    };

    return wildPokemon;
  } catch (error) {
    console.error("Failed to fetch Pokémon:", error);
    throw error;
  }
};
