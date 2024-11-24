import { TYPE_CHART } from "../constants/typeChart";
import { GameState, Pokemon, WildPokemonState } from "../types";

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

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const addToPokedex = (
  pokemon: Pokemon,
  gameState: GameState
): GameState => {
  const existingEntry = gameState.pokedex.find((p) => p.id === pokemon.id);

  const caughtAt = new Date();

  const caughtPokemon = { ...pokemon, caughtAt };
  if (!existingEntry) {
    // Add new entry to Pokédex
    return {
      ...gameState,
      pokedex: [...gameState.pokedex, { ...caughtPokemon, caught: true }],
      inventory: [...gameState.inventory, caughtPokemon],
      uniquePokemonCaught: gameState.uniquePokemonCaught + 1,
    };
  } else if (!existingEntry.caught) {
    // Update existing entry to mark as caught
    return {
      ...gameState,
      pokedex: gameState.pokedex.map((p) =>
        p.id === pokemon.id ? { ...p, caught: true } : p
      ),
      inventory: [...gameState.inventory, caughtPokemon],
      uniquePokemonCaught: gameState.uniquePokemonCaught + 1,
    };
  }

  // If already caught, just add to inventory
  return {
    ...gameState,
    inventory: [...gameState.inventory, pokemon],
  };
};

export const calculateTypeAdvantage = (
  attackerTypes: string[],
  defenderTypes: string[]
): number => {
  let multiplier = 1;

  if (!attackerTypes?.length || !defenderTypes?.length) {
    return multiplier;
  }

  attackerTypes.forEach((attackerType) => {
    // Ensure the type exists in our chart
    if (!attackerType || !(attackerType in TYPE_CHART)) return;

    const chart = TYPE_CHART[attackerType as keyof typeof TYPE_CHART];
    if (!chart) return;

    defenderTypes.forEach((defenderType) => {
      if (!defenderType) return;
      if (chart.weakTo?.includes(defenderType)) multiplier *= 1.5;
      // if (attackerType !== 'normal' && chart.resistantTo?.includes(defenderType as never)) multiplier *= 0.75;
      // if ('immuneTo' in chart && chart?.immuneTo?.includes(defenderType)) multiplier *= 0.5;
    });
  });

  return multiplier;
};

// Rest of the file remains the same...
