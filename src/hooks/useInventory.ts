import { v4 as uuidv4 } from "uuid";
import { Pokemon } from "../types";
import useGameState from "./useGameState";
import useLocalStorageState from "./useLocalStorageState";
import { useEffect } from "react";
import { createPokemonFromApi } from "../utils/createPokemonFromApi";

const useInventory = () => {
  const [gameState, setGameState] = useGameState();
  const [inventory, setInventory] = useLocalStorageState<Pokemon[]>(
    "inventory",
    gameState?.inventory || []
  );

  useEffect(() => {
    const checkMegaEvolutions = async () => {
      if (!gameState.activeMegaEvolutions?.length) return;

      let inventoryChanged = false;
      const updatedInventory = [...inventory];
      const stillActiveMegas = [];

      for (const mega of gameState.activeMegaEvolutions) {
        if (Date.now() >= mega.revertAt) {
          const pokemonToRevert = updatedInventory.find(
            (p) => p.uuid === mega.pokemonUuid
          );
          if (pokemonToRevert) {
            try {
              const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${mega.originalFormName}`
              );
              if (response.ok) {
                const originalFormData = await response.json();
                const originalPokemon = await createPokemonFromApi(
                  originalFormData,
                  {
                    level: pokemonToRevert.stats.level,
                    ivs: pokemonToRevert.ivs,
                    isShiny: pokemonToRevert.isShiny,
                  }
                );
                const index = updatedInventory.findIndex(
                  (p) => p.uuid === mega.pokemonUuid
                );
                updatedInventory[index] = {
                  ...originalPokemon,
                  uuid: mega.pokemonUuid,
                };
                inventoryChanged = true;
              }
            } catch (error) {
              console.error("Failed to revert mega evolution", error);
              stillActiveMegas.push(mega);
            }
          }
        } else {
          stillActiveMegas.push(mega);
        }
      }

      if (inventoryChanged) {
        setInventory(updatedInventory);
        setGameState({ ...gameState, activeMegaEvolutions: stillActiveMegas });
      }
    };

    checkMegaEvolutions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const migratedInventory = inventory.map((pokemon) => {
      if (!pokemon.uuid) {
        pokemon.uuid = uuidv4();
      }
      if (!pokemon.display_name) {
        pokemon.display_name = pokemon.name;
      }
      return pokemon;
    });
    // Check if migration was needed
    if (JSON.stringify(inventory) !== JSON.stringify(migratedInventory)) {
      setInventory(migratedInventory);
    }
  }, [inventory, setInventory]);

  return [inventory, setInventory] as [
    Pokemon[],
    (newInventory: Pokemon[]) => void
  ];
};

export default useInventory;
