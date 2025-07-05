import { Pokemon, WildPokemonState } from "../types";
import { calculateTypeAdvantage } from "./calculateTypeAdvantage";

export const calculateCatchProbability = (
  throwSpeed: number,
  buddyPokemon: Pokemon | null,
  targetPokemon: WildPokemonState,
  timingMultiplier: number
): number => {
  // Base catch rate 100%
  const catchRate = 1;

  // Speed modifier (1x for slow throws, 3x for fast throws)
  const speedModifier = throwSpeed / 3;

  // Calculate buddy bonus if applicable
  const buddyModifier = buddyPokemon
    ? 3 * calculateTypeAdvantage(buddyPokemon.types, targetPokemon.types)
    : 1;

  // Calculate CP modifier (1x for equal CP, 2x for double CP, 3x for triple CP (max))
  const cpModifier = Math.min(
    (buddyPokemon?.cp || 1) / (targetPokemon?.cp || 1),
    3
  );

  const catchModifier = targetPokemon.catchModifier;

  // Calculate level modifier (1x for level 1, 0.5x for level 50)
  const levelModifier = 0.5 + (targetPokemon.stats.level / 50) * 0.5;

  // Ensure no zeroes
  const mods = [
    catchRate,
    speedModifier,
    levelModifier,
    cpModifier,
    buddyModifier,
    timingMultiplier,
    catchModifier,
  ].filter((mod) => mod > 0);

  const finalCatchRate = mods.reduce((acc, mod) => acc * mod, 1);

  return Math.max(0.01, Math.min(finalCatchRate, 0.99));
};
