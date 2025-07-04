import { useEffect } from "react";
import { useHabitat } from "../hooks/useHabitat";
import { getRandomPokemon } from "../utils/getRandomPokemon";
import useCurrentPokemon from "./useCurrentPokemon";

const useGetInitalPokemon = () => {
  const [currentPokemon, setCurrentPokemon] = useCurrentPokemon();
  const { pokemonSpecies } = useHabitat();

  useEffect(() => {
    if (currentPokemon || pokemonSpecies.length === 0) return;
    // Fetch initial Pokémon data and set up the game
    const fetchInitialData = async () => {
      try {
        const newPokemon = await getRandomPokemon(pokemonSpecies);
        setCurrentPokemon(newPokemon);
      } catch (error) {
        console.error("Failed to fetch initial Pokémon:", error);
      }
    };

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonSpecies]);
};

export default useGetInitalPokemon;
