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
import ThemeButton from "./components/ui/ThemeButton";
import { useEffect, useRef } from "react";
import { useSound } from "./context/SoundProvider";
import SoundButton from "./components/ui/SoundButton";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SoundProvider>
        <LocationProvider>
          <Routes>
            <Route path="/*" element={<Main />} />
          </Routes>
        </LocationProvider>
      </SoundProvider>
    </ThemeProvider>
  );
};

const Main: React.FC = () => {
  const [currentPokemon] = useCurrentPokemon();
  const { soundEnabled } = useSound();
  const audioRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    const audio = new Audio(
      "https://raw.githubusercontent.com/Superviral/Pokemon-GO-App-Assets-and-Images/master/Shared%20Assets/Converted%20AudioClip%20(WAV%20Format)/walk%20%23000951_0.wav"
    );
    audio.loop = true;
    audioRef.current = audio;

    const playAudioOnInteraction = () => {
      if (soundEnabled) {
        audioRef.current?.play();
      }
      document.removeEventListener("click", playAudioOnInteraction);
    };
    document.addEventListener("click", playAudioOnInteraction);

    return () => {
      audioRef.current?.pause();
      document.removeEventListener("click", playAudioOnInteraction);
    };
  }, []);

  useEffect(() => {
    if (soundEnabled) {
      audioRef.current?.play().catch(() => {}); // catch if not interacted yet
    } else {
      audioRef.current?.pause();
    }
  }, [soundEnabled]);

  const {
    isThrowDisabled,
    catchMessage,
    pokemonState,
    handleThrow,
    handleFlee,
  } = useEncounter();

  useGetInitalPokemon();

  return (
    <div className="max-h-screen h-screen overflow-hidden grid grid-rows-[1fr,auto] place-items-center select-none bg-background text-content">
      <Background currentPokemon={currentPokemon} />
      <ThemeButton />
      <SoundButton />
      <Pokemon
        pokemonState={pokemonState}
        isPokeballDisabled={isThrowDisabled}
      />
      <MessageBox message={catchMessage} />
      <Pokeball
        onClick={handleThrow}
        type="pokeball"
        disabled={isThrowDisabled}
      />

      <SlidingMenus handleFlee={handleFlee} />
    </div>
  );
};

export default App;
