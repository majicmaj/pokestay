import { Pokemon, WildPokemonState } from "../types";
import { calculateTypeAdvantage } from "./calculateTypeAdvantage";

export const calculateCatchProbability = (
  throwSpeed: number,
  buddyPokemon: Pokemon | null,
  targetPokemon: WildPokemonState
): number => {
  // Base catch rate 100%
  const catchRate = 1;

  // Speed modifier (1.0-2.0x based on throw speed)
  const speedModifier =
    throwSpeed > 7 ? 1 : throwSpeed > 5 ? 3 : throwSpeed > 3 ? 2 : 1;

  // Calculate buddy bonus if applicable
  const buddyModifier = buddyPokemon
    ? calculateTypeAdvantage(buddyPokemon.types, targetPokemon.types)
    : 1;

  const cpModifier = Math.min(
    Math.max(1, (buddyPokemon?.cp || 1) / (targetPokemon?.cp || 1)),
    2
  );

  const catchModifier = targetPokemon.catchModifier;

  const levelModifier = ((50 - targetPokemon.stats.level) / 50) * 0.8 + 0.2;

  const finalCatchRate =
    catchRate *
    speedModifier *
    levelModifier *
    cpModifier *
    buddyModifier *
    catchModifier;

  // console.log({
  //   catchRate,
  //   speedModifier,
  //   levelModifier,
  //   buddyModifier,
  //   catchModifier,
  //   cpModifier,
  //   finalCatchRate
  // })

  return Math.min(finalCatchRate, 0.8);
};
