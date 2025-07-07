import { v4 as uuidv4 } from "uuid";
import { Move, Pokemon, PokemonType, NamedAPIResource } from "../types";
import { calculateCP } from "./calculateCp";
import { getSprite } from "./getSprite";

interface EvolutionStage {
  species: NamedAPIResource;
  evolves_to: EvolutionStage[];
}

interface PokemonVariety {
  is_default: boolean;
  pokemon: NamedAPIResource;
}

export const getPossibleEvolutions = async (
  pokemon: Pokemon
): Promise<NamedAPIResource[]> => {
  try {
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`
    );
    if (!speciesResponse.ok) return [];
    const speciesData = await speciesResponse.json();

    const evolutionChainUrl = speciesData.evolution_chain.url;
    const evolutionChainResponse = await fetch(evolutionChainUrl);
    if (!evolutionChainResponse.ok) return [];
    const evolutionChainData = await evolutionChainResponse.json();

    const findCurrentStage = (stage: EvolutionStage): EvolutionStage | null => {
      if (stage.species.name === pokemon.name.toLowerCase()) {
        return stage;
      }
      for (const nextStage of stage.evolves_to) {
        const found = findCurrentStage(nextStage);
        if (found) return found;
      }
      return null;
    };

    const pokemonStage = findCurrentStage(evolutionChainData.chain);

    if (pokemonStage && pokemonStage.evolves_to.length > 0) {
      const evolutionDetails = await Promise.all(
        pokemonStage.evolves_to.map(async (evo: EvolutionStage) => {
          try {
            const speciesResponse = await fetch(evo.species.url);
            if (!speciesResponse.ok) return null;
            const speciesData = await speciesResponse.json();
            const defaultVariety = speciesData.varieties.find(
              (v: PokemonVariety) => v.is_default
            )?.pokemon;
            return defaultVariety || speciesData.varieties[0]?.pokemon;
          } catch (error) {
            console.error(
              `Failed to get details for evolution ${evo.species.name}:`,
              error
            );
            return null;
          }
        })
      );
      return evolutionDetails.filter(
        (details): details is NamedAPIResource => details !== null
      );
    }

    return [];
  } catch (error) {
    console.error("Failed to get possible evolutions:", error);
    return [];
  }
};

export const createEvolvedPokemon = async (
  pokemon: Pokemon,
  evolvedSpeciesName: string
): Promise<Pokemon | null> => {
  try {
    // Fetch the evolved Pokémon data
    const evolvedResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${evolvedSpeciesName}`
    );
    const evolvedData = await evolvedResponse.json();

    const ivs = {
      attack: pokemon.ivs?.attack || Math.floor(Math.random() * 16),
      defense: pokemon.ivs?.defense || Math.floor(Math.random() * 16),
      speed: pokemon.ivs?.speed || Math.floor(Math.random() * 16),
      hp: pokemon.ivs?.hp || Math.floor(Math.random() * 16),
    };

    const ivMod = {
      attack: 0.9 + ivs.attack / 15 / 10,
      defense: 0.9 + ivs.defense / 15 / 10,
      speed: 0.9 + ivs.speed / 15 / 10,
      hp: 0.9 + ivs.hp / 15 / 10,
    };

    // Recalculate stats for the evolved Pokémon based on the current level
    const level = pokemon.stats.level;
    const [hp, attack, defense, spAttack, spDefense, speed] = evolvedData.stats;
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

    const evolvedSprite3d = await getSprite({
      name: evolvedData.name,
      isShiny: evolvedData.isShiny ?? false,
      type: "3d",
    });

    const evolvedSprite2d = await getSprite({
      name: evolvedData.name,
      isShiny: evolvedData.isShiny ?? false,
      type: "2d",
    });

    // Create the evolved Pokémon object
    const evolvedPokemon: Pokemon = {
      ...pokemon,
      uuid: uuidv4(),
      id: evolvedData.id,
      name:
        evolvedData.name.charAt(0).toUpperCase() + evolvedData.name.slice(1),
      display_name:
        evolvedData.name.charAt(0).toUpperCase() + evolvedData.name.slice(1),
      sprite: evolvedSprite3d ?? "",
      sprite2d: evolvedSprite2d ?? "",
      height: evolvedData.height,
      stats: {
        ...baseStats,
        level,
        maxHp: baseStats.hp,
      },
      cp,
      types: evolvedData.types.map((t: PokemonType) => t.type.name),
      cry: evolvedData.cries.latest,
      moves: evolvedData.moves.slice(0, 4).map((move: Move) => ({
        id: move.move.url.split("/").slice(-2, -1)[0],
        name: move.move.name.replace("-", " "),
        type: evolvedData.types[0].type.name,
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

    return evolvedPokemon;
  } catch (error) {
    console.error("Failed to evolve Pokémon:", error);
    return null;
  }
};
