import { useEffect } from "react";
import { getRandomPokemon } from "../utils/getRandomPokemon";
import useCurrentPokemon from "./useCurrentPokemon";

const useGetInitalPokemon = () => {
  const [currentPokemon, setCurrentPokemon] = useCurrentPokemon();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useGetInitalPokemon;
