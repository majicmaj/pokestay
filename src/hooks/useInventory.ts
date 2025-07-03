import { v4 as uuidv4 } from "uuid";
import { Pokemon } from "../types";
import useGameState from "./useGameState";
import useLocalStorageState from "./useLocalStorageState";
import { useEffect } from "react";

const useInventory = () => {
  const [gameState] = useGameState();
  const [inventory, setInventory] = useLocalStorageState<Pokemon[]>(
    "inventory",
    gameState?.inventory || []
  );

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
