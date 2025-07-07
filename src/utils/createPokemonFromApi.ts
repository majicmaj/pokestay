import { v4 as uuidv4 } from "uuid";
import { Pokemon, Move, PokemonMove, NamedAPIResource, IVs } from "../types";
import { calculateCP } from "./calculateCp";
import { getSprite } from "./getSprite";

const MOVE_EFFECT_TYPES = [
  "damage",
  "defense_down",
  "speed_down",
  "catch_rate_up",
] as const;

interface ApiPokemonData {
  id: number;
  name: string;
  stats: { base_stat: number }[];
  moves: Move[];
  types: { type: NamedAPIResource }[];
  sprites: {
    front_default: string;
    other: { "official-artwork": { front_default: string } };
  };
  height: number;
  weight: number;
  cries: { latest: string };
}

export const createPokemonFromApi = async (
  apiData: ApiPokemonData,
  overrides: {
    level?: number;
    ivs?: IVs;
    isShiny?: boolean;
  }
): Promise<Pokemon> => {
  const level = overrides.level || 1;
  const ivs = overrides.ivs || {
    attack: Math.floor(Math.random() * 16),
    defense: Math.floor(Math.random() * 16),
    speed: Math.floor(Math.random() * 16),
    hp: Math.floor(Math.random() * 16),
  };
  const isShiny = overrides.isShiny || Math.random() * 128 < 1;

  const ivMod = {
    attack: 0.9 + ivs.attack / 15 / 10,
    defense: 0.9 + ivs.defense / 15 / 10,
    speed: 0.9 + ivs.speed / 15 / 10,
    hp: 0.9 + ivs.hp / 15 / 10,
  };

  const [hp, attack, defense, spAttack, spDefense, speed] = apiData.stats;
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

  const moves: PokemonMove[] = apiData.moves.slice(0, 4).map((move: Move) => ({
    id: parseInt(move.move.url.split("/").slice(-2, -1)[0]),
    name: move.move.name.replace("-", " "),
    type: apiData.types[0].type.name,
    power: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 20 : null,
    accuracy: Math.random() > 0.3 ? Math.floor(Math.random() * 30) + 70 : null,
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

  const sprite2d =
    apiData.sprites.front_default ||
    apiData.sprites.other["official-artwork"].front_default;

  const sprite3d = await getSprite({
    name: apiData.name,
    isShiny,
    type: "3d",
  });

  const sprite = sprite3d ?? sprite2d;

  const pokemon: Pokemon = {
    uuid: uuidv4(),
    id: apiData.id,
    name: apiData.name.charAt(0).toUpperCase() + apiData.name.slice(1),
    display_name: apiData.name.charAt(0).toUpperCase() + apiData.name.slice(1),
    cp,
    height: apiData.height,
    sprite,
    sprite2d: sprite2d,
    types: apiData.types.map((t: { type: NamedAPIResource }) => t.type.name),
    stats: {
      ...baseStats,
      level,
      maxHp: baseStats.hp,
    },
    ivs,
    ivModifiers: ivMod,
    moves,
    isShiny,
    cry: apiData.cries.latest,
    weight: apiData.weight,
    rarity: "common",
    points: 0,
    caught: true,
  };

  return pokemon;
};
