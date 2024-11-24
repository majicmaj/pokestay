import { useState } from "react";
import Background from "./components/Background/Background";
import MessageBox from "./components/MessageBox/MessageBox";
import Pokeball from "./components/Pokeball/Pokeball";
import Pokemon from "./components/Pokemon/Pokemon";
import SlidingMenus from "./components/SlidingMenus/SlidingMenus";
import useGameState from "./hooks/useGameState";
import useGetInitalPokemon from "./hooks/useGetInitalPokemon";
import { PokemonState, WildPokemonState } from "./types";
import { addToPokedex } from "./utils/addToPokedex";
import { calculateCatchProbability } from "./utils/calculateCatchProbability";
import { calculateTypeAdvantage } from "./utils/calculateTypeAdvantage";
import { getRandomPokemon } from "./utils/getRandomPokemon";
import { sleep } from "./utils/sleep";

function App() {
  const [gameState, setGameState] = useGameState();

  const [isThrowDisabled, setIsThrowDisabled] = useState(false);
  const [catchMessage, setCatchMessage] = useState<string | null>(null);
  const [currentPokemon, setCurrentPokemon] = useState<WildPokemonState | null>(
    null
  );
  const [pokemonState, setPokemonState] = useState<PokemonState>("idle");

  useGetInitalPokemon({
    setCurrentPokemon,
  });

  const handleThrow = async (throwSpeed: number) => {
    if (isThrowDisabled || !currentPokemon) return;
    if (throwSpeed > 7) return setCatchMessage("Too far!");
    setIsThrowDisabled(true);

    // console.log(throwSpeed)
    if (throwSpeed > 5) setCatchMessage("Excellent!");
    else if (throwSpeed > 3) setCatchMessage("Great!");
    else if (throwSpeed > 1) setCatchMessage("Nice!");

    const catchProbability = calculateCatchProbability(
      throwSpeed,
      gameState.buddyPokemon,
      currentPokemon
    );

    // Add suspense
    setPokemonState("idle");
    await sleep(1000 + Math.random() * 5000);

    const caught = Math.random() < catchProbability;
    const flees = !caught && Math.random() < 0.4; // 40% chance to flee on failed catch

    const advantage = calculateTypeAdvantage(
      gameState.buddyPokemon,
      currentPokemon.types
    );

    if (caught) {
      setPokemonState("caught");
      const updatedState = addToPokedex(currentPokemon, gameState);

      const extraPoints = Math.round(advantage * currentPokemon.points);

      setGameState({
        ...updatedState,
        points: updatedState.points + extraPoints,
      });

      setCatchMessage(
        `${currentPokemon.name} caught! +${extraPoints} stardust`
      );
      await sleep(Math.random() * 3000 + 1000);
    } else {
      if (flees) {
        setPokemonState("fled");
        setCatchMessage(`${currentPokemon.name} fled!`);
        await sleep(Math.random() * 3000 + 1000);
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
      setPokemonState("idle");
      setCatchMessage(`A wild ${newPokemon.name} has appeared!`);
      setTimeout(() => {
        setCatchMessage(null);
      }, 2000);
    }

    setIsThrowDisabled(false);
  };

  const handleFlee = async () => {
    setPokemonState("fled");
    setCatchMessage(`You have fled!`);
    setTimeout(() => {
      setCatchMessage(null);
    }, 2000);
    await sleep(Math.random() * 3000 + 1000);

    const newPokemon = await getRandomPokemon();
    setCurrentPokemon(newPokemon);
    setPokemonState("idle");
    setCatchMessage(`A wild ${newPokemon.name} has appeared!`);
    setTimeout(() => {
      setCatchMessage(null);
    }, 2000);
    setIsThrowDisabled(false);
  };

  return (
    <div
      className={`max-h-screen h-screen overflow-hidden grid grid-rows-[1fr,auto] place-items-center`}
    >
      <Background currentPokemon={currentPokemon} />
      <Pokemon
        currentPokemon={currentPokemon}
        pokemonState={pokemonState}
        isPokeballDisabled={isThrowDisabled}
      />
      <MessageBox message={catchMessage} />
      <Pokeball
        onClick={handleThrow}
        type="pokeball"
        disabled={isThrowDisabled}
      />

      <SlidingMenus gameState={gameState} handleFlee={handleFlee} />
    </div>
  );
}

export default App;
