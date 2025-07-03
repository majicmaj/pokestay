import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Background from "./components/Background/Background";
import MessageBox from "./components/MessageBox/MessageBox";
import Pokeball from "./components/Pokeball/Pokeball";
import Pokemon from "./components/Pokemon/Pokemon";
import SlidingMenus from "./components/SlidingMenus/SlidingMenus";
import { LocationProvider } from "./context/LocationProvider";
import useCurrentPokemon from "./hooks/useCurrentPokemon";
import useEncounter from "./hooks/useEncounter";
import useGetInitalPokemon from "./hooks/useGetInitalPokemon";
import { ThemeProvider } from "./hooks/useTheme/ThemeProvider";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LocationProvider>
          <Main />
        </LocationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const Main: React.FC = () => {
  const [currentPokemon] = useCurrentPokemon();

  const {
    isThrowDisabled,
    catchMessage,
    pokemonState,
    handleThrow,
    handleFlee,
  } = useEncounter();

  useGetInitalPokemon();

  return (
    <div className="text-content max-h-screen h-screen overflow-hidden grid grid-rows-[1fr,auto] place-items-center select-none bg-background text-content">
      <Background currentPokemon={currentPokemon} />
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
