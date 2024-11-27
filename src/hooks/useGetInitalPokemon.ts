import { useEffect } from "react";
import { WildPokemonState } from "../types";
import { getRandomPokemon } from "../utils/getRandomPokemon";
import useGameState from "./useGameState";

const useGetInitalPokemon = () => {
  const [gameState, setGameState] = useGameState();

  const { currentPokemon } = gameState;
  const setCurrentPokemon = (pokemon: WildPokemonState) =>
    setGameState({ ...gameState, currentPokemon: pokemon });

  useEffect(() => {
    if (currentPokemon) return;
    // Fetch initial Pokémon data and set up the game
    const fetchInitialData = async () => {
      try {
        const newPokemon = await getRandomPokemon();
        setCurrentPokemon(newPokemon);
      } catch (error) {
        console.error("Failed to fetch initial Pokémon:", error);
      }
    };

    fetchInitialData();
  }, []);
};

export default useGetInitalPokemon;
