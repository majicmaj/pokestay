import { Gem, Sparkles, UserRoundCheck, UserRoundPlus, X } from "lucide-react";

import { Dispatch, SetStateAction, useState } from "react";
import Stardust from "../../assets/icons/Stardust";
import useCanEvolve from "../../hooks/useCanEvolve";
import useGameState from "../../hooks/useGameState";
import useInventory from "../../hooks/useInventory";
import usePoints from "../../hooks/usePoints";
import { Pokemon } from "../../types";
import { formatNumber } from "../../utils/formatNumber";
import { evolvePokemon } from "../../utils/getEvolution";
import { levelUpPokemon } from "../../utils/levelUpPokemon";
import TypeBadge from "../TypeBadge/TypeBadge";
import { capitalize } from "../../utils/capitalize";
import { isValidImageUrl } from "../../utils/isValidImageUrl";
import { LEGENDARY_POKEMON_IDS } from "../../constants/legendaryPokemonIds";
import { cn } from "../../utils/cn";

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
  const [confirmTransfer, setConfirmTransfer] = useState(false);
  const canPokemonEvolve = useCanEvolve(pokemon);

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

    // setSelectedPokemon(leveledUpPokemon);
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

    // setSelectedPokemon(evolvedPokemon);
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

    // setSelectedPokemon(null);
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

    console.log(sprite);

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

  const isLegendary = LEGENDARY_POKEMON_IDS.includes(pokemon.id);

  return (
    <div className="absolute w-full h-full border bg-black/10 backdrop-blur-md z-20 left-0 dark:bg-black/50">
      <div className="flex justify-center items-center">
        <div className="h-screen w-screen overflow-auto top-0 flex px-2 flex-col gap-4 items-center">
          <div className="relative top-[200px] bottom-0 grid h-full min-h-max rounded-t-xl w-full bg-white dark:bg-gray-800 drop-shadow-xl dark:bg-dark-primary">
            <div className="relative top-[-200px] bottom-0 h-full w-full flex flex-col min-h-max items-center gap-4 overflow-x-auto px-2">
              <div className="relative max-w-96 w-full flex py-8 mb-[-32px] max-h-96 aspect-square flex-col justify-between items-center">
                <div className="relative z-10 text-teal-800 bg-white/80 dark:bg-gray-800/80px-2 rounded-full dark:bg-dark-secondary dark:text-lime-200">
                  <span className="text-sm font-medium opacity-60 pr-1">
                    CP
                  </span>
                  <span className="text-4xl">{pokemon.cp}</span>
                </div>
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="animate-bounce-slow pixelated absolute p-24 bottom-0 aspect-square size-96 min-w-96 object-contain"
                />
                <div className="relative flex items-center flex-col">
                  <div className="font-semibold text-3xl mt-[-16px] flex items-center bg-white/80 dark:bg-gray-800/80 px-2 rounded-full dark:bg-dark-secondary">
                    {pokemon.isShiny && <Sparkles className="w-8" />}
                    {isLegendary && <Gem />}

                    {pokemon.name}
                    <button
                      onClick={
                        isBuddyPokemon ? handleRemoveBuddy : handleMakeBuddy
                      }
                      className={`ml-2 justify-center rounded-full text-xl border gap-2 flex items-center p-1 transition-colors active:scale-110 ${
                        isBuddyPokemon
                          ? "bg-lime-200 border-lime-300 bg-gradient-to-r from-lime-200 to-teal-200 drop-shadow-lg"
                          : "border-teal-800 bg-lime-100/50 drop-shadow-none"
                      }`}
                    >
                      {isBuddyPokemon ? <UserRoundCheck /> : <UserRoundPlus />}
                    </button>
                  </div>
                  <p className="text-sm">
                    {pokemon.stats.hp} HP / Lv.{pokemon.stats.level}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 rounded-full">
                {pokemon.types.map((type) => (
                  <div key={type} className="flex flex-col items-center w-24">
                    <TypeBadge key={type} type={type} />
                    <p>{type.slice(0, 1).toUpperCase() + type.slice(1)}</p>
                  </div>
                ))}
              </div>
              <div className="border-b-2 border-zinc-300 w-full dark:border-zinc-600" />
              <div className="grid grid-cols-3 place-items-center gap-4 px-2 pb-4 w-full">
                <div className="grid place-items-center">
                  <p className="font-bold text-md">{pokemon.stats.attack}</p>
                  <p className="opacity-80 text-sm">Attack</p>
                </div>
                <div className="grid place-items-center">
                  <p className="font-bold text-md">{pokemon.stats.defense}</p>
                  <p className="opacity-80 text-sm">Defense</p>
                </div>
                <div className="grid place-items-center">
                  <p className="font-bold text-md">{pokemon.stats.speed}</p>
                  <p className="opacity-80 text-sm">Speed</p>
                </div>
              </div>
              {/* Level Up */}
              <div className="rounded-full pr-4 items-center justify-between flex gap-4 bg-lime-100/80 w-full">
                <button
                  onClick={levelUp}
                  disabled={isLevelUpDisabled}
                  className={`rounded-full w-40 justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-lime-500 to-teal-500 gap-2 flex items-center px-8 py-3 ${
                    isLevelUpDisabled && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  LEVEL UP
                </button>
                {/* <button
            onClick={add1000Points}
            className={`rounded-full text-xl text-white bg-teal-500 bg-gradient-to-r from-lime-500 to-teal-500 gap-2 flex items-center px-8 py-3`}
          >
            +1000
          </button> */}
                <div className="flex flex-1 items-center gap-1">
                  <Stardust className="w-6 h-6" />
                  <span className={`${isLevelUpDisabled && "text-red-500"}`}>
                    {formatNumber(levelUpCost)}
                  </span>
                  <span className="opacity-70">/ {formatNumber(points)}</span>
                </div>
              </div>
              {/* <div>
                  <button
                    onClick={() => setPoints(points + 1000)}
                    className={`rounded-full w-40 justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-lime-500 to-teal-500 gap-2 flex items-center px-8 py-3`}
                  >
                    +1000
                  </button>
                </div> */}
              {/* Evolution */}
              <div className="rounded-full pr-4 items-center justify-between flex gap-4 bg-lime-100/80 w-full">
                {/* Pink magenta button */}
                <button
                  onClick={evolve}
                  disabled={!canPokemonEvolve || !canEvolve}
                  className={cn(
                    `rounded-full w-40 justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-pink-500 to-purple-500 gap-2 flex items-center px-8 py-3`,
                    (!canEvolve || !canPokemonEvolve) &&
                      "opacity-50 cursor-not-allowed border-3 bored-red-500"
                  )}
                >
                  EVOLVE
                </button>
                <div className="flex flex-1 items-center gap-1">
                  <Stardust className="w-6 h-6" />
                  <span className={`${!canEvolve && "text-red-500"}`}>
                    {formatNumber(evolutionCost)}
                  </span>
                  <span className="opacity-70">/ {formatNumber(points)}</span>
                </div>
              </div>
              {/* Transfer */}
              <div className="rounded-full pr-4 items-center justify-between flex gap-4 bg-lime-100/80 w-full">
                {!confirmTransfer && (
                  <button
                    onClick={() => setConfirmTransfer(true)}
                    className={`rounded-full w-40 justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-red-500 to-rose-500 gap-2 flex items-center px-8 py-3`}
                  >
                    TRANSFER
                  </button>
                )}
                {confirmTransfer && (
                  <button
                    onClick={transferPokemon}
                    className={`rounded-full w-40 justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-red-500 to-rose-500 gap-2 flex items-center px-8 py-3`}
                  >
                    Yes
                  </button>
                )}
                {confirmTransfer && (
                  <button
                    onClick={() => setConfirmTransfer(false)}
                    className={`rounded-full w-40 justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-lime-500 to-teal-500 gap-2 flex items-center px-8 py-3`}
                  >
                    CANCEL
                  </button>
                )}
                <div className="flex flex-1 items-center gap-1">
                  <Stardust className="w-6 h-6" />
                  <span>+ {formatNumber(transferStardust)}</span>
                </div>
              </div>

              {/* Information (caught at, rarity, etc) */}
              <div className="flex flex-col gap-2 w-full bg-lime-100 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm opacity-70">Caught at:</p>
                  <p className="text-sm">
                    {pokemon?.caughtAt
                      ? new Date(
                          pokemon?.caughtAt || ""
                        ).toLocaleDateString() || "_"
                      : "_"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm opacity-70">Location:</p>
                  <p className="text-sm">
                    {pokemon?.caughtLocation?.city || "_"},{" "}
                    {pokemon?.caughtLocation?.country || "_"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm opacity-70">Rarity:</p>
                  <p className="text-sm">{capitalize(pokemon.rarity)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm opacity-70">ID:</p>
                  <p className="text-sm">#{pokemon.id}</p>
                </div>
              </div>
              <div className="border-b-2 border-zinc-300 w-full" />
              <p>Update Sprite</p>
              <div className="flex items-center justify-between gap-1">
                <button
                  onClick={set3dSprite}
                  className="text-sm text-teal-500 hover:underline"
                >
                  3D
                </button>
                /
                <button
                  onClick={set2dSprite}
                  className={"text-sm text-teal-500 hover:underline"}
                >
                  2D
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 p-2 text-lime-200 border border-lime-200"
          onClick={() => setCurrentIndex(null)}
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default SelectedPokemon;
