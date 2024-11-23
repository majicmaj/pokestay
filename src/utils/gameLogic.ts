import { POKEDEX_LAST_POKEMON } from '../constants';
import { Pokemon, GameState, PokemonMove, WildPokemonState, Pokeball } from '../types';

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

const POINTS_RARITY_MAP = {
  'common': 100,
  'uncommon': 150,
  'rare': 300,
  'legendary': 1000,
}
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
  ballType: Pokeball,
  buddyPokemon: Pokemon | null,
  targetPokemon: WildPokemonState
): number => {
  if (ballType === 'masterball') return 1;

  // Base catch rate 10-20%
  let catchRate = 1;

  // Speed modifier (1.0-2.0x based on throw speed)
  const speedModifier = Math.min(Math.max(throwSpeed / 3, 1), 3);

  // Ball type modifiers
  const ballModifiers = {
    pokeball: 1,
    greatball: 1.5,
    ultraball: 2,
    masterball: 100,
  };

  // Calculate buddy bonus if applicable
  let buddyModifier = 1;

  if (buddyPokemon) {
    buddyModifier = calculateTypeAdvantage(
      buddyPokemon.types,
      targetPokemon.types
    );
  }

  // Apply HP modifier (lower HP = easier to catch)
  // const hpModifier =
  //   1 +
  //   (targetPokemon.stats.maxHp - targetPokemon.currentHp) /
  //   targetPokemon.stats.maxHp;

  // Apply defense modifier
  // const defenseModifier =
  //   1 +
  //   (targetPokemon.stats.defense - targetPokemon.currentDefense) /
  //   targetPokemon.stats.defense;

  // Apply speed modifier (slower = easier to catch)
  // const speedDebuffModifier =
  //   1 +
  //   (targetPokemon.stats.speed - targetPokemon.currentSpeed) /
  //   targetPokemon.stats.speed;

  // Apply catch modifier from moves
  const catchModifier = targetPokemon.catchModifier;

  const levelModifier = (((50 - targetPokemon.stats.level) / 50) * 0.9) + 0.1

  const cpModifier = Math.min(Math.max(1, ((buddyPokemon?.cp || 1) / (targetPokemon?.cp || 1))), 2)
  const finalCatchRate =
    catchRate *
    speedModifier *
    ballModifiers[ballType] *
    levelModifier *
    cpModifier *
    // hpModifier *
    // defenseModifier *
    // speedDebuffModifier *
    buddyModifier *
    catchModifier;

    // console.log({
    //   catchRate,
    //   speedModifier,
    //   levelModifier,
    //   bm: ballModifiers[ballType],
    //   buddyModifier,
    //   catchModifier,
    //   cpModifier,
    //   finalCatchRate
    // })

  return Math.min(finalCatchRate, 0.8);
};

type Stats = Record<string, any>

function calculateCP(stats: Stats) {
  const { hp, attack, defense, speed } = stats || {};
  // const hp = 277
  // const defense = 161
  // const attack = 205
  // const speed = 200

  // Final CP formula

  const cp = Math.floor(
    (Math.max(10, 0.84 * Math.sqrt((hp * attack * defense * speed)) / 100)
    ))
  return cp;
}

export const getRandomPokemon = async (
  ballType: 'pokeball' | 'greatball' | 'ultraball' | 'masterball'
): Promise<WildPokemonState> => {
  // Determine rarity based on ball type
  const rarityChances = {
    pokeball: { common: 0.7, uncommon: 0.25, rare: 0.04, legendary: 0.01 },
    greatball: { common: 0.4, uncommon: 0.4, rare: 0.15, legendary: 0.05 },
    ultraball: { common: 0.2, uncommon: 0.3, rare: 0.35, legendary: 0.15 },
    masterball: { common: 0, uncommon: 0, rare: 0.8, legendary: 0.2 },
  };



  // Get random Pokémon ID based on rarity
  const pokemonId = Math.floor(Math.random() * POKEDEX_LAST_POKEMON) + 1;

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    const data = await response.json();

    const speciesRes = await fetch (
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
    )
    const speciesData = await speciesRes.json();
    const { 
      capture_rate, 
      // is_baby,
      // is_legendary,
      // is_mythical,
     } = speciesData || {}

    // Generate random level based on rarity
    const levelRanges = {
      common: { min: 1, max: 20 },
      uncommon: { min: 15, max: 35 },
      rare: { min: 30, max: 50 },
      legendary: { min: 45, max: 70 },
    };

    let rarity: 'common' | 'uncommon' | 'rare' | 'legendary' = 'common'
  
    const captureRate = (capture_rate / 255)

    if (captureRate < 0.02 ) rarity = 'legendary';
    else if (captureRate < 0.1) rarity = 'rare';
    else if (captureRate < 0.5)
      rarity = 'uncommon';

    // console.log({rarity, captureRate})

    const range = levelRanges[rarity];

    const level =
      Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

    // Calculate base stats scaled by level
    // const attack = data.baseStats[1]
    // const defense = data.baseStats[2]
    // const specialAttack = data.baseStats[3]
    // const specialDefense = data.baseStats[4]
    const [hp, attack, defense, spAttack, spDefense, speed] = data?.stats || []
    const baseAttack = (attack.base_stat + spAttack.base_stat) / 1.5
    const baseDefense = (defense.base_stat + spDefense.base_stat) / 1.5

    const baseStats = {
      hp: Math.floor(hp.base_stat * Math.sqrt(level)),
      attack: Math.floor((baseAttack * Math.sqrt(level))),
      defense: Math.floor((baseDefense * Math.sqrt(level))),
      speed: Math.floor((speed.base_stat * Math.sqrt(level))),
    };

    const cp = calculateCP(baseStats)


    // Get moves from API
    const moves: PokemonMove[] = data.moves.slice(0, 4).map((move: any) => ({
      id: move.move.url.split('/').slice(-2, -1)[0],
      name: move.move.name.replace('-', ' '),
      type: data.types[0].type.name,
      power: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 20 : null,
      accuracy:
        Math.random() > 0.3 ? Math.floor(Math.random() * 30) + 70 : null,
      pp: Math.floor(Math.random() * 15) + 5,
      effect: {
        type: ['damage', 'defense_down', 'speed_down', 'catch_rate_up'][
          Math.floor(Math.random() * 4)
        ] as any,
        value: Math.floor(Math.random() * 30) + 10,
        chance: Math.floor(Math.random() * 30) + 70,
      },
      description: 'A powerful move!',
    }));

    const isShiny = (Math.random() * 512) < 1
    const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isShiny ? "shiny/" : "" }${pokemonId}.png`
    
    const pokemon: WildPokemonState = {
      id: pokemonId,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      rarity,
      points: POINTS_RARITY_MAP[rarity] || 100,
      caught: false,
      cp,
      sprite,
      types: data.types.map((t: any) => t.type.name),
      stats: {
        ...baseStats,
        level,
        maxHp: baseStats.hp,
      },
      moves,
      catchModifier: captureRate,
      isShiny,
    };

    return pokemon;
  } catch (error) {
    console.error('Failed to fetch Pokémon:', error);
    throw error;
  }
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
