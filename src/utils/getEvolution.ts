import { v4 as uuidv4 } from "uuid";
import { Move, Pokemon, PokemonType } from "../types";
import { calculateCP } from "./calculateCp";

export const evolvePokemon = async (
  pokemon: Pokemon
): Promise<Pokemon | null> => {
  try {
    // Fetch species data for the current Pokémon
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`
    );
    const speciesData = await speciesResponse.json();

    // Get the evolution chain URL
    const evolutionChainUrl = speciesData.evolution_chain.url;

    // Fetch the evolution chain data
    const evolutionChainResponse = await fetch(evolutionChainUrl);
    const evolutionChainData = await evolutionChainResponse.json();

    // Traverse the chain to find the next evolution
    let currentStage = evolutionChainData.chain;
    while (currentStage) {
      if (currentStage.species.name === pokemon.name.toLowerCase()) {
        if (currentStage.evolves_to.length > 0) {
          // Get the first evolution
          const evolvedSpeciesName = currentStage.evolves_to[0].species.name;

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
          const [hp, attack, defense, spAttack, spDefense, speed] =
            evolvedData.stats;
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

          const sprite = `https://play.pokemonshowdown.com/sprites/xyani${
            pokemon.isShiny ? "-shiny/" : "/"
          }${evolvedData.name.replace("-", "")}.gif`;

          const sprite2d = `https://play.pokemonshowdown.com/sprites/gen5/${evolvedData.name.replace(
            "-",
            ""
          )}.png`;

          // Create the evolved Pokémon object
          const evolvedPokemon: Pokemon = {
            ...pokemon,
            uuid: uuidv4(),
            id: evolvedData.id,
            name:
              evolvedData.name.charAt(0).toUpperCase() +
              evolvedData.name.slice(1),
            display_name:
              evolvedData.name.charAt(0).toUpperCase() +
              evolvedData.name.slice(1),
            sprite,
            sprite2d,
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
                Math.random() > 0.5
                  ? Math.floor(Math.random() * 100) + 20
                  : null,
              accuracy:
                Math.random() > 0.3
                  ? Math.floor(Math.random() * 30) + 70
                  : null,
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
        }
        break;
      }
      currentStage = currentStage.evolves_to[0];
    }

    // If no evolution is found, return null
    return null;
  } catch (error) {
    console.error("Failed to evolve Pokémon:", error);
    throw error;
  }
};
