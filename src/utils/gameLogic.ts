import { Pokemon, GameState, WildPokemonState } from '../types';

const TYPE_CHART = {
  normal: { weakTo: ['fighting'], resistantTo: [], immuneTo: ['ghost'] },
  fire: {
    weakTo: ['water', 'ground', 'rock'],
    resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
  },
  water: {
    weakTo: ['electric', 'grass'],
    resistantTo: ['fire', 'water', 'ice', 'steel'],
  },
  electric: {
    weakTo: ['ground'],
    resistantTo: ['electric', 'flying', 'steel'],
  },
  grass: {
    weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'],
    resistantTo: ['water', 'electric', 'grass', 'ground'],
  },
  ice: { weakTo: ['fire', 'fighting', 'rock', 'steel'], resistantTo: ['ice'] },
  fighting: {
    weakTo: ['flying', 'psychic', 'fairy'],
    resistantTo: ['bug', 'rock', 'dark'],
  },
  poison: {
    weakTo: ['ground', 'psychic'],
    resistantTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
  },
  ground: {
    weakTo: ['water', 'grass', 'ice'],
    resistantTo: ['poison', 'rock'],
    immuneTo: ['electric'],
  },
  flying: {
    weakTo: ['electric', 'ice', 'rock'],
    resistantTo: ['grass', 'fighting', 'bug'],
    immuneTo: ['ground'],
  },
  psychic: {
    weakTo: ['bug', 'ghost', 'dark'],
    resistantTo: ['fighting', 'psychic'],
  },
  bug: {
    weakTo: ['fire', 'flying', 'rock'],
    resistantTo: ['grass', 'fighting', 'ground'],
  },
  rock: {
    weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'],
    resistantTo: ['normal', 'fire', 'poison', 'flying'],
  },
  ghost: {
    weakTo: ['ghost', 'dark'],
    resistantTo: ['poison', 'bug'],
    immuneTo: ['normal', 'fighting'],
  },
  dragon: {
    weakTo: ['ice', 'dragon', 'fairy'],
    resistantTo: ['fire', 'water', 'electric', 'grass'],
  },
  dark: {
    weakTo: ['fighting', 'bug', 'fairy'],
    resistantTo: ['ghost', 'dark'],
    immuneTo: ['psychic'],
  },
  steel: {
    weakTo: ['fire', 'fighting', 'ground'],
    resistantTo: [
      'normal',
      'grass',
      'ice',
      'flying',
      'psychic',
      'bug',
      'rock',
      'dragon',
      'steel',
      'fairy',
    ],
    immuneTo: ['poison'],
  },
  fairy: {
    weakTo: ['poison', 'steel'],
    resistantTo: ['fighting', 'bug', 'dark'],
    immuneTo: ['dragon'],
  },
};

// const POINTS_RARITY_MAP = {
//   'common': 100,
//   'uncommon': 150,
//   'rare': 300,
//   'legendary': 1000,
// }

// export const calculateTypeAdvantage = (attackerTypes: string[], defenderTypes: string[]): number => {
//   let multiplier = 1;

//   attackerTypes.forEach(attackerType => {
//     const chart = TYPE_CHART[attackerType as keyof typeof TYPE_CHART];
//     if (!chart) return;

//     defenderTypes.forEach(defenderType => {
//       if (chart.weakTo.includes(defenderType)) multiplier *= 1.5;
//       if (chart.resistantTo.includes(defenderType)) multiplier *= 0.75;
//       if (chart.immuneTo.includes(defenderType)) multiplier *= 0.5;
//     });
//   });

//   return multiplier;
// };

export const calculateCatchProbability = (
  throwSpeed: number,
  buddyPokemon: Pokemon | null,
  targetPokemon: WildPokemonState
): number => {
  // Base catch rate 100%
  let catchRate = 1;

  // Speed modifier (1.0-2.0x based on throw speed)
  const speedModifier = 
  throwSpeed > 7 ? 1 :
  throwSpeed > 5 ? 3 :
  throwSpeed > 3 ? 2 :
  1

  // Calculate buddy bonus if applicable
  let buddyModifier = 1;

  if (buddyPokemon) {
    buddyModifier = calculateTypeAdvantage(
      buddyPokemon.types,
      targetPokemon.types
    );
  }

  const cpModifier = Math.min(Math.max(1, ((buddyPokemon?.cp || 1) / (targetPokemon?.cp || 1))), 2)

  const catchModifier = targetPokemon.catchModifier;

  const levelModifier = (((50 - targetPokemon.stats.level) / 50) * 0.5) + 0.5

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

  const caughtAt = new Date

  const caughtPokemon = {...pokemon, caughtAt}
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
