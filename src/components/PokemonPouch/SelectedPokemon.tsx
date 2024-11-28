import { Sparkles, UserCheck, UserPlus, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import Stardust from "../../assets/icons/Stardust";
import useCanEvolve from "../../hooks/useCanEvolve";
import useGameState from "../../hooks/useGameState";
import useInventory from "../../hooks/useInventory";
import { Pokemon } from "../../types";
import { formatNumber } from "../../utils/formatNumber";
import { evolvePokemon } from "../../utils/getEvolution";
import { levelUpPokemon } from "../../utils/levelUpPokemon";
import TypeBadge from "../TypeBadge/TypeBadge";

const SelectedPokemon = ({
  pokemon,
  setSelectedPokemon,
  pokemonList,
  currentIndex,
  setCurrentIndex,
}: {
  pokemon: Pokemon;
  setSelectedPokemon: (pokemon: Pokemon | null) => void;
  pokemonList: Pokemon[];
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
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

  const { points, buddyPokemon } = gameState || {};
  const [inventory, setInventory] = useInventory();
  const { stats } = pokemon || {};
  const { level } = stats || {};

  const isBuddyPokemon =
    JSON.stringify(buddyPokemon) === JSON.stringify(pokemon);

  const levelUpCost = Math.round(10 * pokemon.stats.level ** 1.6);

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

    setInventory(newInventory);

    setGameState({
      ...gameState,
      buddyPokemon: leveledUpPokemon,
      points: points - levelUpCost,
    });

    setSelectedPokemon(leveledUpPokemon);
  };

  const evolutionCost = 10000;

  const canEvolve = canPokemonEvolve && points >= evolutionCost;

  const evolve = async () => {
    if (!canEvolve || points < evolutionCost) return;

    const evolvedPokemon = await evolvePokemon(pokemon);

    if (!evolvedPokemon) return;

    const newInventory = [...inventory].map((p) =>
      JSON.stringify(p) === JSON.stringify(pokemon) ? evolvedPokemon : p
    );

    setInventory(newInventory);

    setGameState({
      ...gameState,
      buddyPokemon: evolvedPokemon,
      points: points - evolutionCost,
    });

    setSelectedPokemon(evolvedPokemon);
  };

  const transferStardust = 100;
  const transferPokemon = () => {
    const newInventory = inventory.filter(
      (p: Pokemon) => JSON.stringify(p) !== JSON.stringify(pokemon)
    );

    setInventory(newInventory);

    setGameState({
      ...gameState,
      points: points + transferStardust,
    });

    setSelectedPokemon(null);
  };

  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );

  const [{ x }, set] = useSpring(() => ({ x: 0 }));

  const bind = useDrag(
    ({ down, movement: [mx], canceled }) => {
      if (!down && !canceled) {
        if (mx > 100 && currentIndex > 0) {
          setSwipeDirection("right");
          setCurrentIndex((i) => i - 1);
        } else if (mx < -100 && currentIndex < pokemonList.length - 1) {
          setSwipeDirection("left");
          setCurrentIndex((i) => i + 1);
        }
      }
      set({ x: down ? mx : 0 });
    },
    { filterTaps: true, bounds: { left: -200, right: 200 } }
  );

  const handleTransitionEnd = () => {
    set({ x: 0 });
    setSwipeDirection(null);
  };

  const slideIn = swipeDirection ? (swipeDirection === "left" ? 100 : -100) : 0;

  return (
    <div className="absolute w-full h-full border bg-black/10 backdrop-blur-md z-10 left-0">
      <animated.div
        {...bind()}
        style={{
          transform: x.to((val) => `translateX(${val}px)`),
        }}
        onTransitionEnd={handleTransitionEnd}
        className="h-full w-full"
      >
        <div
          className="flex justify-center items-center"
          style={{
            transform: `translateX(${slideIn}%)`,
            transition: "transform 0.3s ease",
          }}
        >
          <div className="h-screen w-screen overflow-auto top-0 flex px-2 flex-col gap-4 items-center">
            <div className="relative top-[200px] bottom-0 grid h-full min-h-max rounded-t-xl w-full bg-white drop-shadow-xl">
              <div className="relative top-[-200px] bottom-0 h-full w-full flex flex-col min-h-max items-center gap-4 overflow-x-auto px-2">
                <div className="relative max-w-96 w-full flex py-8 mb-[-32px] max-h-96 aspect-square flex-col justify-between items-center">
                  <div className="text-white">
                    <span className="text-sm font-medium opacity-60 pr-1">
                      CP
                    </span>
                    <span className="text-4xl">{pokemon.cp}</span>
                  </div>
                  <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    className="animate-bounce-slow pixelated absolute p-12 bottom-0 w-96 h-96 object-contain"
                  />
                  <div className="relative flex items-center flex-col">
                    <div className="font-semibold text-3xl mt-[-16px] flex items-center">
                      {pokemon.isShiny && <Sparkles className="w-8" />}
                      {pokemon.name}
                    </div>
                    <p className="text-sm">
                      {pokemon.stats.hp} HP / Lv.{pokemon.stats.level}
                    </p>
                  </div>
                </div>

                <div className="flex rounded-full border-2">
                  {pokemon.types.map((type) => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </div>

                <div className="border-b-2 border-zinc-300 w-full" />

                <button
                  onClick={isBuddyPokemon ? handleRemoveBuddy : handleMakeBuddy}
                  className={`w-64 justify-center rounded-full text-xl border-2 gap-2 flex items-center px-6 py-3 transition-colors ${
                    isBuddyPokemon
                      ? "bg-lime-200 border-lime-300 bg-gradient-to-r from-lime-200 to-teal-200 drop-shadow-lg"
                      : "border-teal-800 bg-white drop-shadow-none"
                  }`}
                >
                  {isBuddyPokemon ? (
                    <UserCheck className="h-6 w-6" />
                  ) : (
                    <UserPlus className="h-6 w-6" />
                  )}
                  {isBuddyPokemon ? "Current Buddy" : "Select as Buddy"}
                </button>

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
                {/* ADd 1000 points */}
                {/* <div>
              <button
                onClick={() =>
                  setGameState({
                    ...gameState,
                    points: points + 1000,
                  })
                }
                className={`rounded-full w-40 justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-lime-500 to-teal-500 gap-2 flex items-center px-8 py-3`}
              >
                +1000
              </button>
            </div> */}

                {/* Evolution */}
                {canPokemonEvolve && (
                  <div className="rounded-full pr-4 items-center justify-between flex gap-4 bg-lime-100/80 w-full">
                    {/* Pink magenta button */}
                    <button
                      onClick={evolve}
                      disabled={!canEvolve}
                      className={`rounded-full w-40 justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-pink-500 to-purple-500 gap-2 flex items-center px-8 py-3 ${
                        !canEvolve &&
                        "opacity-50 cursor-not-allowed border-3 bored-red-500"
                      }`}
                    >
                      EVOLVE
                    </button>
                    <div className="flex flex-1 items-center gap-1">
                      <Stardust className="w-6 h-6" />
                      <span className={`${!canEvolve && "text-red-500"}`}>
                        {formatNumber(evolutionCost)}
                      </span>
                      <span className="opacity-70">
                        / {formatNumber(points)}
                      </span>
                    </div>
                  </div>
                )}

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
              </div>
            </div>
          </div>

          <button
            className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 p-2 text-lime-200 border border-lime-200"
            onClick={() => setSelectedPokemon(null)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </animated.div>
    </div>
  );
};

export default SelectedPokemon;
