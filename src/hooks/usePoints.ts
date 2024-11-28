import useGameState from "./useGameState";
import useLocalStorageState from "./useLocalStorageState";

const usePoints = () => {
  const [gameState] = useGameState();
  const [points, setPoints] = useLocalStorageState(
    "points",
    Number(gameState?.points) || []
  );

  return [points, setPoints];
};

export default usePoints;
