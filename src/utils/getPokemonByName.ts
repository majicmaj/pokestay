import { v4 as uuidv4 } from "uuid";
import { Move, Pokemon, PokemonType } from "../types";
import { calculateCP } from "./calculateCp";

export const getPokemonByName = async (
  name: string
): Promise<Pokemon | null> => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    );
    if (!response.ok) {
      return null;
    }
    const data = await response.json();

    const ivs = {
      attack: Math.floor(Math.random() * 16),
      defense: Math.floor(Math.random() * 16),
      speed: Math.floor(Math.random() * 16),
      hp: Math.floor(Math.random() * 16),
    };

    const level = Math.floor(Math.random() * 20) + 5; // Level 5-25

    const [hp, attack, defense, spAttack, spDefense, speed] = data.stats;
    const baseStats = {
      hp: Math.floor(hp.base_stat * Math.sqrt(level)),
      attack: Math.floor(
        ((attack.base_stat + spAttack.base_stat) / 1.5) * Math.sqrt(level)
      ),
      defense: Math.floor(
        ((defense.base_stat + spDefense.base_stat) / 1.5) * Math.sqrt(level)
      ),
      speed: Math.floor(speed.base_stat * Math.sqrt(level)),
    };

    const cp = calculateCP(baseStats);

    const sprite = `https://play.pokemonshowdown.com/sprites/xyani/${data.name.replace(
      "-",
      ""
    )}.gif`;
    const sprite2d = `https://play.pokemonshowdown.com/sprites/gen5/${data.name.replace(
      "-",
      ""
    )}.png`;

    const newPokemon: Pokemon = {
      uuid: uuidv4(),
      id: data.id,
      name: data.name,
      display_name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      rarity: Math.random() < 0.01 ? "legendary" : "common",
      caught: false,
      sprite: sprite,
      sprite2d: sprite2d,
      isShiny: Math.random() < 1 / 4096,
      stats: {
        ...baseStats,
        level,
        maxHp: baseStats.hp,
      },
      ivs,
      cp,
      types: data.types.map((t: PokemonType) => t.type.name),
      cry: data.cries.latest,
      height: data.height,
      weight: data.weight,
      points: 100, // base points
      moves: data.moves.slice(0, 4).map((move: Move) => ({
        id: move.move.url.split("/").slice(-2, -1)[0],
        name: move.move.name.replace("-", " "),
        type: data.types[0].type.name,
        power:
          Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 20 : null,
        accuracy:
          Math.random() > 0.3 ? Math.floor(Math.random() * 30) + 70 : null,
        pp: Math.floor(Math.random() * 15) + 5,
        effect: {
          type: ["damage", "defense_down", "speed_down", "catch_rate_up"][
            Math.floor(Math.random() * 4)
          ],
          value: Math.floor(Math.random() * 30) + 10,
          chance: Math.floor(Math.random() * 30) + 70,
        },
        description: "A powerful move!",
      })),
    };
    return newPokemon;
  } catch (error) {
    console.error(`Failed to get pokemon by name ${name}:`, error);
    return null;
  }
};
