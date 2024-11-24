import { Pokemon } from "../types";
import { calculateCP } from "./calculateCp";

export const levelUpPokemon = (pokemon: Pokemon): Pokemon => {
  const { level, hp, attack, defense, speed } = pokemon.stats;

  // Increment level by 1
  const newLevel = level + 1;

  // Recalculate stats based on the new level
  const newStats = {
    hp: Math.floor((hp / Math.sqrt(level)) * Math.sqrt(newLevel)),
    attack: Math.floor((attack / Math.sqrt(level)) * Math.sqrt(newLevel)),
    defense: Math.floor((defense / Math.sqrt(level)) * Math.sqrt(newLevel)),
    speed: Math.floor((speed / Math.sqrt(level)) * Math.sqrt(newLevel)),
  };

  // Calculate new CP
  const newCp = calculateCP({
    ...newStats,
    level: newLevel,
  });

  return {
    ...pokemon,
    stats: {
      ...pokemon.stats,
      ...newStats,
      level: newLevel,
      maxHp: newStats.hp,
    },
    cp: newCp,
  };
};
