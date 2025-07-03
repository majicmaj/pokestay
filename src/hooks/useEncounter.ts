import { useState } from "react";
import { PokemonState } from "../types";
import { calculateCatchProbability } from "../utils/calculateCatchProbability";
import { calculateTypeAdvantage } from "../utils/calculateTypeAdvantage";
import { getRandomPokemon } from "../utils/getRandomPokemon";
import { sleep } from "../utils/sleep";
import useCurrentPokemon from "./useCurrentPokemon";
import useGameState from "./useGameState";
import useInventory from "./useInventory";
import { useLocation } from "./useLocation";
import usePoints from "./usePoints";

export default function useEncounter() {
  const [gameState] = useGameState();
  const [inventory, setInventory] = useInventory();
  const [currentPokemon, setCurrentPokemon] = useCurrentPokemon();
  const [points, setPoints] = usePoints();
  const { location } = useLocation();

  const [isThrowDisabled, setIsThrowDisabled] = useState(false);
  const [catchMessage, setCatchMessage] = useState<string | null>(null);
  const [pokemonState, setPokemonState] = useState<PokemonState>("idle");

  const spawnNewPokemon = async () => {
    const newPokemon = await getRandomPokemon();
    setCurrentPokemon(newPokemon);
    setPokemonState("idle");
    setCatchMessage(`A wild ${newPokemon.name} has appeared!`);
    setTimeout(() => {
      setCatchMessage(null);
    }, 2000);
  };

  const handleThrow = async (throwSpeed: number) => {
    if (isThrowDisabled || !currentPokemon) return;
    if (throwSpeed > 7) return setCatchMessage("Too far!");
    setIsThrowDisabled(true);

    const advantage = calculateTypeAdvantage(
      gameState?.buddyPokemon?.types || [],
      currentPokemon?.types || []
    );

    const advantageMessage =
      advantage >= 2
        ? "Super effective!"
        : advantage > 1
        ? "Effective!"
        : advantage < 1
        ? "Not very effective!"
        : "";

    const speedMessage =
      throwSpeed > 5
        ? "Excellent!"
        : throwSpeed > 3
        ? "Great!"
        : throwSpeed > 1
        ? "Nice!"
        : "Poor!";

    setCatchMessage(`${speedMessage} ${advantageMessage} `);

    const catchProbability = calculateCatchProbability(
      throwSpeed,
      gameState.buddyPokemon,
      currentPokemon
    );

    // Add suspense
    setPokemonState("idle");
    await sleep(1000 + Math.random() * 2000);

    const caught = Math.random() < catchProbability;
    const flees = !caught && Math.random() < 0.25; // 25% chance to flee on failed catch

    if (caught) {
      setPokemonState("caught");
      const extraPoints = Math.round(advantage * currentPokemon.points);

      // Get location when Pokemon is caught
      const caughtPokemon = {
        ...currentPokemon,
        caughtAt: new Date(),
        caughtLocation: location || undefined,
      };

      setPoints(Number(points) + Number(extraPoints));
      setInventory([...inventory, caughtPokemon]);

      setCatchMessage(
        `${currentPokemon.name} caught! +${extraPoints} stardust`
      );
      await sleep(Math.random() * 2000 + 1000);
    } else {
      if (flees) {
        setPokemonState("fled");
        setCatchMessage(`${currentPokemon.name} fled!`);
        await sleep(Math.random() * 2000 + 1000);
      } else {
        setCatchMessage(`${currentPokemon.name} broke free!`);
      }
    }

    // If Pokémon fled or was caught, spawn a new one, otherwise clear message after 2 seconds
    if (caught || flees) {
      await spawnNewPokemon();
    } else {
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

    await spawnNewPokemon();
    setIsThrowDisabled(false);
  };

  return {
    isThrowDisabled,
    catchMessage,
    pokemonState,
    handleThrow,
    handleFlee,
    setPokemonState,
  };
}
