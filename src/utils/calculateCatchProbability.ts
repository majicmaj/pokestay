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
  const speedModifier =
    throwSpeed > 7 ? 1 : throwSpeed > 5 ? 3 : throwSpeed > 3 ? 2 : 1;

  // Calculate buddy bonus if applicable
  const buddyModifier = buddyPokemon
    ? calculateTypeAdvantage(buddyPokemon.types, targetPokemon.types)
    : 1;

  // Calculate CP modifier (1x for equal CP, 2x for double CP, 0.5x for half CP)
  const cpModifier = Math.min(
    Math.max(1, (buddyPokemon?.cp || 1) / (targetPokemon?.cp || 1)),
    3
  );

  const catchModifier = targetPokemon.catchModifier;

  const levelModifier = ((50 - targetPokemon.stats.level) / 50) * 0.8 + 0.2;

  const finalCatchRate =
    catchRate *
    speedModifier *
    levelModifier *
    cpModifier *
    buddyModifier *
    catchModifier *
    timingMultiplier;

  return Math.min(finalCatchRate, 1);
};
