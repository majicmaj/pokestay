import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import useCanEvolve from "../../hooks/useCanEvolve";
import useGameState from "../../hooks/useGameState";
import useInventory from "../../hooks/useInventory";
import usePoints from "../../hooks/usePoints";
import { Pokemon } from "../../types";
import { evolvePokemon } from "../../utils/getEvolution";
import { isValidImageUrl } from "../../utils/isValidImageUrl";
import { levelUpPokemon } from "../../utils/levelUpPokemon";
import Actions from "./SelectedPokemon/Actions";
import Header from "./SelectedPokemon/Header";
import Info from "./SelectedPokemon/Info";
import SpriteSwitcher from "./SelectedPokemon/SpriteSwitcher";
import Stats from "./SelectedPokemon/Stats";

const SelectedPokemon = ({
  pokemon,
  setCurrentIndex,
}: {
  pokemon: Pokemon;
  pokemonList: Pokemon[];
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number | null>>;
}) => {
  const [gameState, setGameState] = useGameState();
  const canPokemonEvolve = useCanEvolve(pokemon);

  const setPokemon = (updatedPokemon: Pokemon) => {
    const newInventory = inventory.map((p) =>
      p.uuid === updatedPokemon.uuid ? updatedPokemon : p
    );
    setInventory(newInventory);
    if (isBuddyPokemon) {
      setGameState({
        ...gameState,
        buddyPokemon: updatedPokemon,
      });
    }
  };

  const handleMakeBuddy = () =>
    setGameState({
      ...gameState,
      buddyPokemon: pokemon,
    });

  const handleRemoveBuddy = () =>
    setGameState({
      ...gameState,
      buddyPokemon: null,
    });

  const { buddyPokemon } = gameState || {};
  const [points, setPoints] = usePoints();
  const [inventory, setInventory] = useInventory();
  const { stats } = pokemon || {};
  const { level } = stats || {};

  const isBuddyPokemon =
    JSON.stringify(buddyPokemon) === JSON.stringify(pokemon);

  const levelUpCost = Math.round(3 * pokemon.stats.level ** 1.6);

  const isMaxLevel = level >= 50;

  const isLevelUpDisabled = isMaxLevel || points < levelUpCost;

  const levelUp = () => {
    if (points < levelUpCost || isMaxLevel) {
      return;
    }
    const leveledUpPokemon = levelUpPokemon(pokemon);

    const newInventory = [...inventory].map((p) =>
      p.id === pokemon.id ? leveledUpPokemon : p
    );

    if (isBuddyPokemon) {
      setGameState({
        ...gameState,
        buddyPokemon: leveledUpPokemon,
      });
    }
    setInventory(newInventory);
    setPoints(points - levelUpCost);
  };

  const evolutionCost = 2500;

  const canEvolve = canPokemonEvolve && points >= evolutionCost;

  const evolve = async () => {
    if (!canEvolve || points < evolutionCost) return;

    const evolvedPokemon = await evolvePokemon(pokemon);

    if (!evolvedPokemon) return;

    const newInventory = [...inventory].map((p) =>
      JSON.stringify(p) === JSON.stringify(pokemon) ? evolvedPokemon : p
    );

    setInventory(newInventory);

    setPoints(points - evolutionCost);
    setGameState({
      ...gameState,
      buddyPokemon: evolvedPokemon,
    });

    setCurrentIndex(null);
  };

  const baseTransferStardust = 100;
  const transferStardust = Math.round(
    baseTransferStardust + pokemon.stats.level * 10
  );

  const transferPokemon = () => {
    const newInventory = inventory.filter(
      (p: Pokemon) => JSON.stringify(p) !== JSON.stringify(pokemon)
    );

    setInventory(newInventory);
    setPoints(Number(points) + Number(transferStardust));
    setGameState({
      ...gameState,
    });

    setCurrentIndex(null);
  };

  const set3dSprite = async () => {
    const sprite3dBase = `https://play.pokemonshowdown.com/sprites/xyani${
      pokemon.isShiny ? "-shiny/" : "/"
    }${pokemon.name.toLowerCase().replace("-", "")}.gif`;

    const hasDashInName = pokemon.name.includes("-");
    const is3dValid = await isValidImageUrl(sprite3dBase);

    const sprite =
      hasDashInName && !is3dValid
        ? `https://play.pokemonshowdown.com/sprites/xyani${
            pokemon.isShiny ? "-shiny/" : "/"
          }${pokemon.name.toLowerCase().split("-")[0]}.gif`
        : sprite3dBase;

    const updatedPokemon = {
      ...pokemon,
      sprite: sprite,
    };

    const newInventory = inventory.map((p: Pokemon) =>
      p.id === pokemon.id ? updatedPokemon : p
    );

    setInventory(newInventory);
    if (isBuddyPokemon) {
      setGameState({
        ...gameState,
        buddyPokemon: updatedPokemon,
      });
    }
  };

  const set2dSprite = async () => {
    const sprite2dBase = `https://play.pokemonshowdown.com/sprites/gen5/${pokemon.name
      .toLowerCase()
      .replace("-", "")}.png`;

    const hasDashInName = pokemon.name.includes("-");
    const is2dValid = await isValidImageUrl(sprite2dBase);

    const sprite2d =
      hasDashInName && !is2dValid
        ? `https://play.pokemonshowdown.com/sprites/gen5/${
            pokemon.name.toLowerCase().split("-")[0]
          }.png`
        : sprite2dBase;

    const updatedPokemon = {
      ...pokemon,
      sprite: sprite2d,
    };

    const newInventory = inventory.map((p: Pokemon) =>
      p.id === pokemon.id ? updatedPokemon : p
    );

    setInventory(newInventory);
    if (isBuddyPokemon) {
      setGameState({
        ...gameState,
        buddyPokemon: updatedPokemon,
      });
    }
  };

  return (
    <div className="absolute w-full h-full border bg-black/10 backdrop-blur-md z-20 left-0">
      <div className="flex justify-center items-center">
        <div className="h-screen w-screen overflow-auto top-0 flex px-2 flex-col gap-4 items-center">
          <div className="relative top-[200px] bottom-0 grid h-full min-h-max rounded-t-xl w-full bg-primary drop-shadow-xl">
            <div className="relative top-[-200px] bottom-0 h-full w-full flex flex-col min-h-max items-center gap-4 overflow-x-auto px-2">
              <Header
                pokemon={pokemon}
                isBuddyPokemon={isBuddyPokemon}
                handleMakeBuddy={handleMakeBuddy}
                handleRemoveBuddy={handleRemoveBuddy}
                setPokemon={setPokemon}
              />
              <div className="border-b-2 border-divider w-full" />
              <Stats stats={pokemon.stats} />
              <Actions
                levelUp={levelUp}
                isLevelUpDisabled={isLevelUpDisabled}
                levelUpCost={levelUpCost}
                points={points}
                evolve={evolve}
                canEvolve={canEvolve}
                evolutionCost={evolutionCost}
                transferPokemon={transferPokemon}
                transferStardust={transferStardust}
              />
              <Info pokemon={pokemon} />
              <div className="border-b-2 border-divider w-full" />
              <SpriteSwitcher
                set3dSprite={set3dSprite}
                set2dSprite={set2dSprite}
              />
            </div>
          </div>
        </div>
        <button
          className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-accent-content p-2 text-accent border border-accent"
          onClick={() => setCurrentIndex(null)}
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default SelectedPokemon;
