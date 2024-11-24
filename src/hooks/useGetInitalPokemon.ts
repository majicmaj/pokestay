import { useEffect } from 'react';
import { WildPokemonState } from '../types';
import { getRandomPokemon } from '../utils/getRandomPokemon';

const useGetInitalPokemon = ({
  setCurrentPokemon,
}: {
  setCurrentPokemon: (pokemon: WildPokemonState) => void;
}) => {
  useEffect(() => {
    // Fetch initial Pokémon data and set up the game
    const fetchInitialData = async () => {
      try {
        const newPokemon = await getRandomPokemon();
        setCurrentPokemon(newPokemon);
      } catch (error) {
        console.error('Failed to fetch initial Pokémon:', error);
      }
    };

    fetchInitialData();
  }, []);
};

export default useGetInitalPokemon;
