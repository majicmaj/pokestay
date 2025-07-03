import useGameState from "./useGameState";
import useLocalStorageState from "./useLocalStorageState";

const usePoints = () => {
  const [gameState] = useGameState();
  const [points, setPoints] = useLocalStorageState<number>(
    "points",
    Number(gameState?.points) || 0
  );

  return [points, setPoints] as [number, (newPoints: number) => void];
};

export default usePoints;
