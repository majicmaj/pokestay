import { useState } from 'react';
import Pokeball from './components/Pokeball/Pokeball';
import { INITIAL_STATE } from './constants';
import {
  PokemonState,
  WildPokemonState,
} from './types';
import {
  addToPokedex,
  calculateCatchProbability,
  getRandomPokemon,
  sleep,
} from './utils/gameLogic';
import Pokemon from './components/Pokemon/Pokemon';
import useGetInitalPokemon from './hooks/useGetInitalPokemon';
import MessageBox from './components/MessageBox/MessageBox';
import Background from './components/Background/Background';
import SlidingMenus from './components/SlidingMenus/SlidingMenus';
import useLocalStorageState from './hooks/useLocalStorageState';

function App() {
  const [gameState, setGameState] = useLocalStorageState('gamestate', INITIAL_STATE);
  // const [upgrades, setUpgrades] = useState<Upgrade[]>(UPGRADES);
  const [isThrowDisabled, setIsThrowDisabled] = useState(false);
  const [catchMessage, setCatchMessage] = useState<string | null>(null);
  const [currentPokemon, setCurrentPokemon] = useState<WildPokemonState | null>(
    null
  );
  const [pokemonState, setPokemonState] = useState<PokemonState>('idle');

  useGetInitalPokemon({
    gameState,
    setCurrentPokemon,
  });
  const getBallType = () => {
    if (gameState.masterballs) return 'masterball';
    if (gameState.ultraballs) return 'ultraball';
    if (gameState.greatballs) return 'greatball';
    return 'pokeball';
  };

  const handleThrow = async (throwSpeed: number) => {
    if (isThrowDisabled || !currentPokemon) return;
    setIsThrowDisabled(true);

    if (throwSpeed > 5) setCatchMessage('Excellent!');
    else if (throwSpeed > 3) setCatchMessage('Great!');
    else if (throwSpeed > 1) setCatchMessage('Nice!');

    const ballType = getBallType();
    const catchProbability = calculateCatchProbability(
      throwSpeed,
      ballType,
      gameState.buddyPokemon,
      currentPokemon
    );

    // Add suspense
    setPokemonState('idle');
    await sleep(1000 + (Math.random() * 10000)/4);

    const caught = Math.random() < catchProbability;
    const flees = !caught && Math.random() < 0.4; // 40% chance to flee on failed catch

    if (caught) {
      setPokemonState('caught');
      const updatedState = addToPokedex(currentPokemon, gameState);
      setGameState({
          ...updatedState,
          points: updatedState.points + currentPokemon.points,
        });

      setCatchMessage(
        `Caught ${currentPokemon.name}! +${currentPokemon.points} points`
      );
      await sleep(2000);
    } else {
      if (flees) {
        setPokemonState('fled');
        setCatchMessage(`${currentPokemon.name} fled!`);
        await sleep(2000);
      } else {
        setCatchMessage(`${currentPokemon.name} broke free!`);
      }
    }

    // Clear message after 2 seconds
    setTimeout(() => {
      setCatchMessage(null);
    }, 2000);

    // If Pokémon fled or was caught, spawn a new one
    if (caught || flees) {
      const newPokemon = await getRandomPokemon(ballType);
      setCurrentPokemon(newPokemon);
      setPokemonState('idle');
      setCatchMessage(`A wild ${newPokemon.name} has appeared!`);
    }

    setIsThrowDisabled(false);
  };

  return (
    <div className={`max-h-screen h-screen overflow-hidden grid grid-rows-[1fr,auto] place-items-center`}>
      <Background currentPokemon={currentPokemon} />
      <Pokemon currentPokemon={currentPokemon} pokemonState={pokemonState} />
      <MessageBox message={catchMessage} />
      <Pokeball
        onClick={handleThrow}
        type="pokeball"
        disabled={isThrowDisabled}
      />

      <SlidingMenus
      gameState={gameState}
      />
    </div>
  );
}

export default App;
