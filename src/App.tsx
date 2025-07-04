import { Route, Routes } from "react-router-dom";
import Background from "./components/Background/Background";
import MessageBox from "./components/MessageBox/MessageBox";
import Pokeball from "./components/Pokeball/Pokeball";
import Pokemon from "./components/Pokemon/Pokemon";
import SlidingMenus from "./components/SlidingMenus/SlidingMenus";
import LocationProvider from "./context/LocationProvider";
import useCurrentPokemon from "./hooks/useCurrentPokemon";
import useEncounter from "./hooks/useEncounter";
import useGetInitalPokemon from "./hooks/useGetInitalPokemon";
import { ThemeProvider } from "./hooks/useTheme/ThemeProvider";
import ThemeButton from "./components/ui/ThemeButton";
import { useEffect } from "react";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LocationProvider>
        <Routes>
          <Route path="/*" element={<Main />} />
        </Routes>
      </LocationProvider>
    </ThemeProvider>
  );
};

const Main: React.FC = () => {
  const [currentPokemon] = useCurrentPokemon();

  useEffect(() => {
    const audio = new Audio(
      "https://raw.githubusercontent.com/Superviral/Pokemon-GO-App-Assets-and-Images/master/Shared%20Assets/Converted%20AudioClip%20(WAV%20Format)/walk%20%23000951_0.wav"
    );
    audio.loop = true;
    audio.play().catch(() => {
      // Autoplay was prevented.
      // A user interaction is needed to start audio.
      const playAudioOnInteraction = () => {
        audio.play();
        document.removeEventListener("click", playAudioOnInteraction);
      };
      document.addEventListener("click", playAudioOnInteraction);
    });

    return () => {
      audio.pause();
    };
  }, []);

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
