import { useEffect } from 'react';
import { getRandomPokemon } from '../utils/gameLogic';
import { GameState, WildPokemonState } from '../types';

const useGetInitalPokemon = ({
  gameState,
  setCurrentPokemon,
}: {
  gameState: GameState;
  setCurrentPokemon: (pokemon: WildPokemonState) => void;
}) => {
  useEffect(() => {
    // Fetch initial Pokémon data and set up the game
    const fetchInitialData = async () => {
      try {
        const newPokemon = await getRandomPokemon(
          gameState.masterballs
            ? 'masterball'
            : gameState.ultraballs
            ? 'ultraball'
            : gameState.greatballs
            ? 'greatball'
            : 'pokeball'
        );
        setCurrentPokemon(newPokemon);
      } catch (error) {
        console.error('Failed to fetch initial Pokémon:', error);
      }
    };

    fetchInitialData();
  }, []);
};

export default useGetInitalPokemon;
