import useGameState from "./useGameState";
import useLocalStorageState from "./useLocalStorageState";

const useInventory = () => {
  const [gameState] = useGameState();
  const [inventory, setInventory] = useLocalStorageState(
    "inventory",
    gameState?.inventory || []
  );

  return [inventory, setInventory];
};

export default useInventory;
