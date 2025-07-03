import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
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
import Transfer from "./SelectedPokemon/Transfer";

const SelectedPokemon = ({
  pokemon,
  pokemonList,
  setCurrentUuid,
}: {
  pokemon: Pokemon;
  pokemonList: Pokemon[];
  setCurrentUuid: Dispatch<SetStateAction<string | null>>;
}) => {
  const [gameState, setGameState] = useGameState();
  const canPokemonEvolve = useCanEvolve(pokemon);
  const [direction, setDirection] = useState(0);

  const variants = {
    enter: (direction: number) => {
      return {
        // zIndex: 0,
        x: direction > 0 ? "50vw" : "-50vw",
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        // zIndex: 0,
        x: direction < 0 ? "50vw" : "-50vw",
        opacity: 0,
      };
    },
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    const currentIndex = pokemonList.findIndex((p) => p.uuid === pokemon.uuid);
    if (currentIndex === -1) return;

    const newIndex = currentIndex + newDirection;

    if (newIndex < 0 || newIndex >= pokemonList.length) {
      return;
    }
    setDirection(newDirection);
    setCurrentUuid(pokemonList[newIndex].uuid as string);
  };

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
      p.uuid === pokemon.uuid ? leveledUpPokemon : p
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
      p.uuid === pokemon.uuid ? evolvedPokemon : p
    );

    setInventory(newInventory);

    setPoints(points - evolutionCost);
    setGameState({
      ...gameState,
      buddyPokemon: evolvedPokemon,
    });

    setCurrentUuid(null);
  };

  const baseTransferStardust = 100;
  const transferStardust = Math.round(
    baseTransferStardust + pokemon.stats.level * 10
  );

  const transferPokemon = () => {
    const newInventory = inventory.filter(
      (p: Pokemon) => p.uuid !== pokemon.uuid
    );

    setInventory(newInventory);
    setPoints(Number(points) + Number(transferStardust));
    setGameState({
      ...gameState,
    });

    setCurrentUuid(null);
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
      p.uuid === pokemon.uuid ? updatedPokemon : p
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
      p.uuid === pokemon.uuid ? updatedPokemon : p
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
    <div className="z-20 bg-black/50 backdrop-blur-sm absolute left-0 right-0 top-0 bottom-0 overflow-y-auto grid place-items-center">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={pokemon.uuid}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 150, damping: 20 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="relative w- min-w-[100vw] max-w-4xl p-2 sm:p-0"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {/* Left Column */}
            <Header
              pokemon={pokemon}
              isBuddyPokemon={isBuddyPokemon}
              handleMakeBuddy={handleMakeBuddy}
              handleRemoveBuddy={handleRemoveBuddy}
              setPokemon={setPokemon}
              onClose={() => setCurrentUuid(null)}
            />

            {/* Right Column */}
            <div className="flex flex-col gap-3 sm:max-h-screen sm:p-4 sm:overflow-y-auto">
              <Stats stats={pokemon.stats} />
              <Actions
                levelUp={levelUp}
                isLevelUpDisabled={isLevelUpDisabled}
                levelUpCost={levelUpCost}
                points={points}
                evolve={evolve}
                canEvolve={canEvolve}
                evolutionCost={evolutionCost}
              />
              <Info pokemon={pokemon} />
              <SpriteSwitcher
                set3dSprite={set3dSprite}
                set2dSprite={set2dSprite}
                currentSprite={pokemon.sprite.includes("gen5") ? "2d" : "3d"}
              />
              <Transfer
                transferPokemon={transferPokemon}
                transferStardust={transferStardust}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* <button
        className="sticky bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-accent p-2 text-accent-content border-2 border-accent-content shadow-lg transition-transform active:scale-95 z-20"
        onClick={() => setCurrentIndex(null)}
      >
        <X className="h-6 w-6" />
      </button> */}
    </div>
  );
};

export default SelectedPokemon;
