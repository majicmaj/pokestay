import useGameState from "./useGameState";
import useLocalStorageState from "./useLocalStorageState";

const useCurrentPokemon = () => {
  const [gameState] = useGameState();
  const [pokemon, setPokemon] = useLocalStorageState(
    "current_pokemon",
    gameState?.currentPokemon || null
  );

  return [pokemon, setPokemon];
};

export default useCurrentPokemon;
