import React from "react";
import { Route, Routes } from "react-router-dom";
import Background from "./components/Background/Background";
import MessageBox from "./components/MessageBox/MessageBox";
import Pokeball from "./components/Pokeball/Pokeball";
import Pokemon from "./components/Pokemon/Pokemon";
import SlidingMenus from "./components/SlidingMenus/SlidingMenus";
import { SoundProvider } from "./context/SoundProvider";
import LocationProvider from "./context/LocationProvider";
import useCurrentPokemon from "./hooks/useCurrentPokemon";
import useEncounter from "./hooks/useEncounter";
import useGetInitalPokemon from "./hooks/useGetInitalPokemon";
import { ThemeProvider } from "./hooks/useTheme/ThemeProvider";
import { useEffect, useRef } from "react";
import { useSound } from "./context/SoundProvider";
import HabitatProvider from "./context/HabitatProvider";
import { useHabitat } from "./hooks/useHabitat";
import { ArrowRight } from "lucide-react";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SoundProvider>
        <LocationProvider>
          <HabitatProvider>
            <Routes>
              <Route path="/*" element={<Main />} />
            </Routes>
          </HabitatProvider>
        </LocationProvider>
      </SoundProvider>
    </ThemeProvider>
  );
};

const Main: React.FC = () => {
  const [currentPokemon] = useCurrentPokemon();
  const { soundEnabled, volume } = useSound();
  const audioRef = useRef<HTMLAudioElement>();
  const { habitat, remainingTime, skipHabitat } = useHabitat();

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  useEffect(() => {
    const audio =
      audioRef.current ??
      new Audio(
        "https://raw.githubusercontent.com/Superviral/Pokemon-GO-App-Assets-and-Images/master/Shared%20Assets/Converted%20AudioClip%20(WAV%20Format)/walk%20%23000951_0.wav"
      );

    if (!audioRef.current) {
      audio.loop = true;
      audioRef.current = audio;
    }

    audio.volume = volume;

    const playAudio = () => {
      if (soundEnabled && !document.hidden) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    };

    const handleVisibilityChange = () => playAudio();
    const handleInteraction = () => playAudio();

    playAudio();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("click", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("click", handleInteraction);
    };
  }, [soundEnabled, volume]);

  const {
    isThrowDisabled,
    isShrinking,
    catchMessage,
    pokemonState,
    handleThrow,
    handleFlee,
  } = useEncounter();

  useGetInitalPokemon();

  return (
    <div className="max-h-screen h-screen overflow-hidden grid grid-rows-[1fr,auto] place-items-center select-none bg-background text-content">
      <Background currentPokemon={currentPokemon} />
      <Pokemon
        pokemonState={pokemonState}
        isShrinking={isShrinking}
        isPokeballDisabled={isThrowDisabled}
      />
      <MessageBox message={catchMessage} />
      <div className="absolute top-4 text-center pixelated-font text-white rounded-full">
        <p className="font-bold text-xl">{habitat?.name}</p>
        <p className="text-sm">{formatTime(remainingTime)}</p>
      </div>
      <Pokeball
        onClick={handleThrow}
        type="pokeball"
        disabled={isThrowDisabled}
      />

      {import.meta.env.DEV && (
        <button
          onClick={skipHabitat}
          className="absolute top-16 left-2 bg-red-500/50 text-white p-2 rounded-full pixelated-font text-sm"
        >
          <ArrowRight className="size-6" />
        </button>
      )}

      <SlidingMenus handleFlee={handleFlee} />
    </div>
  );
};

export default App;
