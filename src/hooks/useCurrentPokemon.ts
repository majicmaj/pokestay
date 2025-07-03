import { WildPokemonState } from "../types";
import useGameState from "./useGameState";
import useLocalStorageState from "./useLocalStorageState";

const useCurrentPokemon = () => {
  const [gameState] = useGameState();
  const [pokemon, setPokemon] = useLocalStorageState<WildPokemonState | null>(
    "current_pokemon",
    gameState?.currentPokemon || null
  );

  return [pokemon, setPokemon] as [
    WildPokemonState | null,
    (newPokemon: WildPokemonState | null) => void
  ];
};

export default useCurrentPokemon;
