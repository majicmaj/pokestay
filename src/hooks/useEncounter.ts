import { useState, useRef } from "react";
import { PokemonState, NamedAPIResource } from "../types";
import { calculateCatchProbability } from "../utils/calculateCatchProbability";
import { calculateTypeAdvantage } from "../utils/calculateTypeAdvantage";
import { getRandomPokemon } from "../utils/getRandomPokemon";
import { sleep } from "../utils/sleep";
import useCurrentPokemon from "./useCurrentPokemon";
import useEncounterLog from "./useEncounterLog";
import useGameState from "./useGameState";
import useInventory from "./useInventory";
import { useLocation } from "./useLocation";
import usePoints from "./usePoints";
import { useSound } from "../context/SoundProvider";
import { useHabitat } from "../hooks/useHabitat";

export default function useEncounter() {
  const [gameState] = useGameState();
  const [inventory, setInventory] = useInventory();
  const [currentPokemon, setCurrentPokemon] = useCurrentPokemon();
  const [points, setPoints] = usePoints();
  const { location } = useLocation();
  const { addEntry: addLogEntry } = useEncounterLog();
  const [throwCount, setThrowCount] = useState(0);
  const { masterSoundEnabled, criesEnabled, effectsEnabled, volume } =
    useSound();
  const { pokemonSpecies } = useHabitat();
  const timingIndicatorStartTimeRef = useRef<number>(0);

  const [isThrowing, setIsThrowing] = useState(false);
  const [isShrinking, setIsShrinking] = useState(false);
  const [catchMessage, setCatchMessage] = useState<string | null>(null);
  const [pokemonState, setPokemonState] = useState<PokemonState>("idle");

  const isThrowDisabled = isThrowing || pokemonState !== "idle";

  const spawnNewPokemon = async (pokemonSpecies: NamedAPIResource[]) => {
    if (pokemonSpecies.length === 0) return;
    setIsShrinking(false);
    setPokemonState("idle");
    const newPokemon = await getRandomPokemon(pokemonSpecies);
    if (!newPokemon) return;
    if (newPokemon.cry && masterSoundEnabled && criesEnabled) {
      const audio = new Audio(newPokemon.cry);
      audio.volume = volume;
      audio.play();
    }
    setCurrentPokemon(newPokemon);
    timingIndicatorStartTimeRef.current = performance.now();
    setThrowCount(0);
    setCatchMessage(`A wild ${newPokemon.name} has appeared!`);
    setTimeout(() => {
      setCatchMessage(null);
    }, 2000);
  };

  const handleThrow = async (throwSpeed: number, duration: number) => {
    if (isThrowDisabled || !currentPokemon) return;
    if (throwSpeed > 7) return setCatchMessage("Too far!");

    setIsThrowing(true);
    setThrowCount(throwCount + 1);

    const timeToImpact = duration * 0.5;
    await sleep(timeToImpact * 1000);
    setIsShrinking(true);

    const elapsedTime = performance.now() - timingIndicatorStartTimeRef.current;
    const timingProgress = (elapsedTime % 3000) / 3000;
    const timingMultiplier = 0.5 + timingProgress;

    let timingQuality = "Poor";
    if (timingMultiplier > 1.25) {
      timingQuality = "Excellent";
    } else if (timingMultiplier > 1) {
      timingQuality = "Great";
    } else if (timingMultiplier > 0.75) {
      timingQuality = "Nice";
    }

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

    const throwQuality =
      throwSpeed > 5
        ? "Excellent"
        : throwSpeed > 3
        ? "Great"
        : throwSpeed > 1
        ? "Nice"
        : "Poor";

    const catchProbability = calculateCatchProbability(
      throwSpeed,
      gameState.buddyPokemon,
      currentPokemon,
      timingMultiplier
    );

    const probabilityMessage = `(${(catchProbability * 100).toFixed(0)}%)`;

    setCatchMessage(
      `${throwQuality} throw, ${timingQuality.toLowerCase()} timing! ${advantageMessage} ${probabilityMessage}`
    );

    if (masterSoundEnabled && effectsEnabled) {
      const audio = new Audio(
        "https://raw.githubusercontent.com/Superviral/Pokemon-GO-App-Assets-and-Images/master/Shared%20Assets/Converted%20AudioClip%20(WAV%20Format)/se_go_ball_take_in%20%23000911_0.wav"
      );
      audio.volume = volume;
      audio.play();
    }

    // Add suspense
    setPokemonState("idle");
    await sleep(1000 + Math.random() * 2000);

    const caught = Math.random() < catchProbability;
    const flees = !caught && Math.random() < 0.25; // 25% chance to flee on failed catch

    if (caught) {
      if (masterSoundEnabled && effectsEnabled) {
        const audio = new Audio(
          "https://raw.githubusercontent.com/Superviral/Pokemon-GO-App-Assets-and-Images/master/Shared%20Assets/Converted%20AudioClip%20(WAV%20Format)/se_go_ball_target%20%23000956_0.wav"
        );
        audio.volume = volume;
        audio.play();
      }
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

      addLogEntry({
        pokemonName: currentPokemon.name,
        pokemonSprite: currentPokemon.sprite,
        throws: throwCount,
        status: "caught",
        stardust: extraPoints,
        timestamp: new Date(),
        location: location || undefined,
        pokemonUuid: caughtPokemon.uuid,
        pokemonId: caughtPokemon.id,
        isShiny: caughtPokemon.isShiny,
        cp: caughtPokemon.cp,
      });
      setCatchMessage(
        `${currentPokemon.name} caught! +${extraPoints} stardust`
      );
      setCurrentPokemon(null);
      await sleep(Math.random() * 2000 + 1000);
    } else {
      if (flees) {
        setPokemonState("fled");
        addLogEntry({
          pokemonName: currentPokemon.name,
          pokemonSprite: currentPokemon.sprite,
          throws: throwCount,
          status: "fled",
          stardust: 0,
          timestamp: new Date(),
          location: location || undefined,
          pokemonId: currentPokemon.id,
          isShiny: currentPokemon.isShiny,
        });
        setCatchMessage(`${currentPokemon.name} fled!`);
        setCurrentPokemon(null);
        await sleep(Math.random() * 2000 + 1000);
      } else {
        if (masterSoundEnabled && effectsEnabled) {
          const audio = new Audio(
            "https://raw.githubusercontent.com/Superviral/Pokemon-GO-App-Assets-and-Images/master/Shared%20Assets/Converted%20AudioClip%20(WAV%20Format)/se_go_ball_out%20%23000960_0.wav"
          );
          audio.volume = volume;
          audio.play();
        }
        setCatchMessage(`${currentPokemon.name} broke free!`);
      }
    }

    // If Pokémon fled or was caught, spawn a new one, otherwise clear message after 2 seconds
    if (caught || flees) {
      await spawnNewPokemon(pokemonSpecies);
    } else {
      setTimeout(() => {
        setCatchMessage(null);
        setIsShrinking(false);
      }, 2000);
    }

    setIsThrowing(false);
  };

  const handleFlee = async () => {
    if (!currentPokemon) return;
    setPokemonState("fled");
    setCatchMessage(`You have fled!`);
    addLogEntry({
      pokemonName: currentPokemon.name,
      pokemonSprite: currentPokemon.sprite,
      throws: throwCount,
      status: "fled",
      stardust: 0,
      timestamp: new Date(),
      location: location || undefined,
      pokemonId: currentPokemon.id,
      isShiny: currentPokemon.isShiny,
    });
    setCurrentPokemon(null);
    setTimeout(() => {
      setCatchMessage(null);
    }, 2000);

    await sleep(Math.random() * 3000 + 1000);

    await spawnNewPokemon(pokemonSpecies);
    setIsThrowing(false);
  };

  return {
    isThrowDisabled: isThrowDisabled,
    isShrinking,
    catchMessage,
    pokemonState,
    handleThrow,
    handleFlee,
    setPokemonState,
  };
}
