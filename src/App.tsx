import { useState } from 'react';
import Pokeball from './components/Pokeball/Pokeball';
import {
  PokemonState,
  WildPokemonState,
} from './types';
import {
  addToPokedex,
  calculateCatchProbability,
  sleep,
} from './utils/gameLogic';
import Pokemon from './components/Pokemon/Pokemon';
import useGetInitalPokemon from './hooks/useGetInitalPokemon';
import MessageBox from './components/MessageBox/MessageBox';
import Background from './components/Background/Background';
import SlidingMenus from './components/SlidingMenus/SlidingMenus';
import useGameState from './hooks/useGameState';
import { getRandomPokemon } from './utils/getRandomPokemon';

function App() {
  const [gameState, setGameState] = useGameState();
  const [isThrowDisabled, setIsThrowDisabled] = useState(false);
  const [catchMessage, setCatchMessage] = useState<string | null>(null);
  const [currentPokemon, setCurrentPokemon] = useState<WildPokemonState | null>(
    null
  );
  const [pokemonState, setPokemonState] = useState<PokemonState>('idle');

  useGetInitalPokemon({
    setCurrentPokemon,
  });

  const handleThrow = async (throwSpeed: number) => {
    if (isThrowDisabled || !currentPokemon) return;
    if (throwSpeed > 7) return setCatchMessage('Too far!');
    setIsThrowDisabled(true);

    // console.log(throwSpeed)
    if (throwSpeed > 5) setCatchMessage('Excellent!');
    else if (throwSpeed > 3) setCatchMessage('Great!');
    else if (throwSpeed > 1) setCatchMessage('Nice!');

    const catchProbability = calculateCatchProbability(
      throwSpeed,
      gameState.buddyPokemon,
      currentPokemon,
    );

    // Add suspense
    setPokemonState('idle');
    await sleep(1000 + (Math.random() * 5000));

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
        `Caught ${currentPokemon.name}! +${currentPokemon.points} stardust`
      );
      await sleep((Math.random() * 3000)+1000);
    } else {
      if (flees) {
        setPokemonState('fled');
        setCatchMessage(`${currentPokemon.name} fled!`);
        await sleep((Math.random() * 3000)+1000);
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
      const newPokemon = await getRandomPokemon();
      setCurrentPokemon(newPokemon);
      setPokemonState('idle');
      setCatchMessage(`A wild ${newPokemon.name} has appeared!`);
      setTimeout(() => {
        setCatchMessage(null);
      }, 2000);
    }

    setIsThrowDisabled(false);
  };


  const handleFlee = async() => {
    setPokemonState('fled');
    setCatchMessage(`You have fled!`);
    setTimeout(() => {
      setCatchMessage(null);
    }, 2000);
    await sleep((Math.random() * 3000)+1000);

      const newPokemon = await getRandomPokemon();
      setCurrentPokemon(newPokemon);
      setPokemonState('idle');
      setCatchMessage(`A wild ${newPokemon.name} has appeared!`);
      setTimeout(() => {
        setCatchMessage(null);
      }, 2000);
    setIsThrowDisabled(false);
  }

  return (
    <div className={`max-h-screen h-screen overflow-hidden grid grid-rows-[1fr,auto] place-items-center`}>
      <Background currentPokemon={currentPokemon} />
      <Pokemon currentPokemon={currentPokemon} pokemonState={pokemonState} isPokeballDisabled={isThrowDisabled} />
      <MessageBox message={catchMessage} />
      <Pokeball
        onClick={handleThrow}
        type="pokeball"
        disabled={isThrowDisabled}
      />

      <SlidingMenus
      gameState={gameState}
      handleFlee={handleFlee}
      />
    </div>
  );
}

export default App;
