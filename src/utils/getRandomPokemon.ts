import { v4 as uuidv4 } from "uuid";
import {
  Move,
  NamedAPIResource,
  PokemonMove,
  PokemonType,
  WildPokemonState,
} from "../types";
import { calculateCP } from "./calculateCp";
import { getSprite } from "./getSprite";

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

const MOVE_EFFECT_TYPES = [
  "damage",
  "defense_down",
  "speed_down",
  "catch_rate_up",
];

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

    // Generate random level based on rarity
    let rarity: "common" | "uncommon" | "rare" | "legendary" | "mythical" =
      "common";

    const captureRate = capture_rate / 255;

    if (is_legendary) rarity = "legendary";
    else if (is_mythical) rarity = "mythical";
    else if (captureRate < 0.1) rarity = "rare";
    else if (captureRate < 0.5) rarity = "uncommon";

    const range = LEVEL_RANGES[rarity];
    // const range = { min: 49, max: 50 }

    const ivs = {
      attack: Math.floor(Math.random() * 16),
      defense: Math.floor(Math.random() * 16),
      speed: Math.floor(Math.random() * 16),
      hp: Math.floor(Math.random() * 16),
    };

    const ivMod = {
      attack: 0.9 + ivs.attack / 15 / 10,
      defense: 0.9 + ivs.defense / 15 / 10,
      speed: 0.9 + ivs.speed / 15 / 10,
      hp: 0.9 + ivs.hp / 15 / 10,
    };

    // console.log({ ivs, ivMod });

    const level =
      Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

    const [hp, attack, defense, spAttack, spDefense, speed] = data?.stats || [];
    const baseHp = hp.base_stat * ivMod.hp;
    const baseSpeed = speed.base_stat * ivMod.speed;
    const baseAttack =
      ((attack.base_stat + spAttack.base_stat) / 1.5) * ivMod.attack;
    const baseDefense =
      ((defense.base_stat + spDefense.base_stat) / 1.5) * ivMod.defense;

    const baseStats = {
      hp: Math.floor(baseHp * Math.sqrt(level)),
      attack: Math.floor(baseAttack * Math.sqrt(level)),
      defense: Math.floor(baseDefense * Math.sqrt(level)),
      speed: Math.floor(baseSpeed * Math.sqrt(level)),
    };

    const cp = calculateCP(baseStats);

    const moves: PokemonMove[] = data.moves.slice(0, 4).map((move: Move) => ({
      id: move.move.url.split("/").slice(-2, -1)[0],
      name: move.move.name.replace("-", " "),
      type: data.types[0].type.name,
      power: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 20 : null,
      accuracy:
        Math.random() > 0.3 ? Math.floor(Math.random() * 30) + 70 : null,
      pp: Math.floor(Math.random() * 15) + 5,
      effect: {
        type: MOVE_EFFECT_TYPES[
          Math.floor(Math.random() * MOVE_EFFECT_TYPES.length)
        ],
        value: Math.floor(Math.random() * 30) + 10,
        chance: Math.floor(Math.random() * 30) + 70,
      },
      description: "A powerful move!",
    }));

    const isShiny = Math.random() * 128 < (is_legendary ? 10 : 1);

    const sprite2d =
      data.sprites.front_default ||
      data.sprites.other["official-artwork"].front_default;

    const sprite3d = await getSprite({
      name: data.name,
      isShiny,
      type: "3d",
    });

    const sprite = sprite3d ?? sprite2d;

    const pokemon: WildPokemonState = {
      uuid: uuidv4(),
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      display_name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      rarity,
      points: POINTS_RARITY_MAP[rarity] || 100,
      caught: false,
      cp,
      height: data.height,
      sprite,
      sprite2d: sprite2d,
      types: data.types.map((t: PokemonType) => t.type.name),
      stats: {
        ...baseStats,
        level,
        maxHp: baseStats.hp,
      },
      ivs: {
        attack: ivs.attack,
        defense: ivs.defense,
        speed: ivs.speed,
        hp: ivs.hp,
      },
      ivModifiers: ivMod,
      moves,
      catchModifier: isShiny ? captureRate * 10 : captureRate,
      isShiny,
      cry: data.cries.latest,
    };

    return pokemon;
  } catch (error) {
    console.error("Failed to fetch Pokémon:", error);
    throw error;
  }
};
