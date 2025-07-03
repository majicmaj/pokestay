import { Pokemon } from "../types";
import useGameState from "./useGameState";
import useLocalStorageState from "./useLocalStorageState";

const useInventory = () => {
  const [gameState] = useGameState();
  const [inventory, setInventory] = useLocalStorageState<Pokemon[]>(
    "inventory",
    gameState?.inventory || []
  );

  return [inventory, setInventory] as [
    Pokemon[],
    (newInventory: Pokemon[]) => void
  ];
};

export default useInventory;
