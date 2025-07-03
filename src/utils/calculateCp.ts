import { PokemonStats } from "../types";

export function calculateCP(stats: Partial<PokemonStats>) {
  const { hp = 1, attack = 1, defense = 1, speed = 1 } = stats || {};

  const cp = Math.floor(
    Math.max(10, (0.84 * Math.sqrt(hp * attack * defense * speed)) / 100)
  );
  return cp;
}
