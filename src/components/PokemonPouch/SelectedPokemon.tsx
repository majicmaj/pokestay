import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Particles } from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import { useSound } from "../../context/SoundProvider";
import usePoints from "../../hooks/usePoints";
import { Pokemon } from "../../types";
import getBackgroundParticles from "../../utils/getBackgroundParticles";
import Actions from "./SelectedPokemon/Actions";
import Header from "./SelectedPokemon/Header";
import Info from "./SelectedPokemon/Info";
import SpriteSwitcher from "./SelectedPokemon/SpriteSwitcher";
import Stats from "./SelectedPokemon/Stats";
import Transfer from "./SelectedPokemon/Transfer";
import { usePokemonActions } from "../../hooks/usePokemonActions";
import EvolutionModal from "./SelectedPokemon/EvolutionModal";
import EvolutionAnimation from "./SelectedPokemon/EvolutionAnimation";
import LevelUpModal from "./SelectedPokemon/LevelUpModal";
import LevelUpAnimation from "./SelectedPokemon/LevelUpAnimation";
import FormSwitchModal from "./SelectedPokemon/FormSwitchModal";
import MegaEvolutionModal from "./SelectedPokemon/MegaEvolutionModal";
import MegaEvolutionAnimation from "./SelectedPokemon/MegaEvolutionAnimation";
import { createPokemonFromApi } from "../../utils/createPokemonFromApi";

const SelectedPokemon = ({
  pokemon,
  pokemonList,
  onClose,
  onNavigate,
}: {
  pokemon: Pokemon;
  pokemonList: Pokemon[];
  onClose: () => void;
  onNavigate: (uuid: string) => void;
}) => {
  const { masterSoundEnabled, criesEnabled, volume } = useSound();
  const [direction, setDirection] = useState(0);
  const [points] = usePoints();
  const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isFormSwitchModalOpen, setIsFormSwitchModalOpen] = useState(false);
  const [isMegaEvolutionModalOpen, setIsMegaEvolutionModalOpen] =
    useState(false);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState<Pokemon | null>(null);
  const [evolutionData, setEvolutionData] = useState<{
    pre: Pokemon;
    post: Pokemon;
  } | null>(null);
  const [megaEvolutionData, setMegaEvolutionData] = useState<{
    pre: Pokemon;
    post: Pokemon;
  } | null>(null);

  const {
    isBuddyPokemon,
    handleMakeBuddy,
    handleRemoveBuddy,
    setPokemon,
    levelUp,
    isLevelUpDisabled,
    levelUpCost,
    evolve,
    canEvolve,
    evolutionCost,
    transferPokemon,
    transferStardust,
    set2dSprite,
    set3dSprite,
    possibleEvolutions,
    switchForm,
    varieties,
    FORM_SWITCH_COST,
    canMegaEvolve,
    megaEvolve,
    MEGA_EVOLUTION_COST,
    activeMega,
  } = usePokemonActions(pokemon);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const pokemonType = pokemon?.types?.[0];
  const particleOptions = getBackgroundParticles(pokemonType);

  const variants = {
    enter: (direction: number) => {
      return {
        y: 0,
        x: direction > 0 ? "100vw" : "-100vw",
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      y: 0,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        y: 0,
        x: direction < 0 ? "100vw" : "-100vw",
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
    onNavigate(pokemonList[newIndex].uuid as string);
  };

  useEffect(() => {
    if (masterSoundEnabled && criesEnabled && pokemon.cry) {
      const audio = new Audio(pokemon.cry);
      audio.volume = volume;
      audio.play();
    }
  }, [pokemon.uuid, masterSoundEnabled, criesEnabled, pokemon.cry, volume]);

  const handleStartLevelUp = () => {
    setLevelUpData(pokemon);
    setIsLevelingUp(true);
  };

  const handleFinishLevelUp = () => {
    levelUp();
    setIsLevelingUp(false);
    setLevelUpData(null);
  };

  const handleStartEvolution = (evolutionPreview: Pokemon) => {
    setIsEvolutionModalOpen(false);
    setEvolutionData({ pre: pokemon, post: evolutionPreview });
  };

  const handleFinishEvolution = () => {
    if (!evolutionData) return;
    evolve(evolutionData.post.name.toLowerCase());
    setEvolutionData(null);
  };

  const handleStartMegaEvolution = async (megaFormName: string) => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${megaFormName}`
    );
    const megaFormData = await response.json();
    const megaPokemon = await createPokemonFromApi(megaFormData, {
      level: pokemon.stats.level,
      ivs: pokemon.ivs,
      isShiny: pokemon.isShiny,
    });

    setMegaEvolutionData({ pre: pokemon, post: megaPokemon as Pokemon });
    setIsMegaEvolutionModalOpen(false);
  };

  const handleFinishMegaEvolution = () => {
    if (!megaEvolutionData) return;
    megaEvolve(megaEvolutionData.post.name);
    setMegaEvolutionData(null);
  };

  return (
    <div className="z-20 bg-black/50 backdrop-blur-sm absolute left-0 right-0 top-0 bottom-0 overflow-y-auto grid place-items-center">
      <Particles
        id="tsparticles-selected"
        options={particleOptions}
        init={particlesInit}
      />
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
          className="absolute w- min-w-[100vw] h-screen overflow-y-auto max-w-4xl p-2 sm:p-0"
        >
          <div className="grid pt-6 grid-cols-1 sm:grid-cols-2 gap-0">
            {/* Left Column */}
            <Header
              pokemon={pokemon}
              isBuddyPokemon={isBuddyPokemon}
              handleMakeBuddy={() => {
                if (masterSoundEnabled && criesEnabled && pokemon.cry) {
                  const audio = new Audio(pokemon.cry);
                  audio.volume = volume;
                  audio.play();
                }
                handleMakeBuddy();
              }}
              handleRemoveBuddy={handleRemoveBuddy}
              setPokemon={setPokemon}
              onClose={onClose}
            />

            {/* Right Column */}
            <div className="z-10 flex flex-col gap-3 sm:max-h-screen sm:p-4 sm:overflow-y-auto">
              <Stats stats={pokemon.stats} />
              <Actions
                pokemon={pokemon}
                onOpenLevelUpModal={() => setIsLevelUpModalOpen(true)}
                isLevelUpDisabled={isLevelUpDisabled}
                levelUpCost={levelUpCost}
                points={points}
                onOpenEvolutionModal={() => setIsEvolutionModalOpen(true)}
                canEvolve={canEvolve}
                evolutionCost={evolutionCost}
                onOpenFormSwitchModal={() => setIsFormSwitchModalOpen(true)}
                canMegaEvolve={canMegaEvolve && !activeMega}
                onOpenMegaEvolutionModal={() =>
                  setIsMegaEvolutionModalOpen(true)
                }
                megaEvolutionCost={MEGA_EVOLUTION_COST}
                activeMega={activeMega}
              />
              <Info pokemon={pokemon} />
              <SpriteSwitcher
                set3dSprite={set3dSprite}
                set2dSprite={set2dSprite}
                currentSprite={pokemon.sprite?.includes("gen5") ? "2d" : "3d"}
              />
              <Transfer
                transferPokemon={() => transferPokemon(onClose)}
                transferStardust={transferStardust}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {isLevelingUp && levelUpData && (
        <LevelUpAnimation
          pokemon={levelUpData}
          onComplete={handleFinishLevelUp}
        />
      )}
      {evolutionData && (
        <EvolutionAnimation
          preEvolutionPokemon={evolutionData.pre}
          postEvolutionPokemon={evolutionData.post}
          onComplete={handleFinishEvolution}
        />
      )}
      {megaEvolutionData && (
        <MegaEvolutionAnimation
          preEvolutionPokemon={megaEvolutionData.pre}
          postEvolutionPokemon={megaEvolutionData.post}
          onComplete={handleFinishMegaEvolution}
        />
      )}
      <LevelUpModal
        open={isLevelUpModalOpen}
        onOpenChange={setIsLevelUpModalOpen}
        pokemon={pokemon}
        onConfirm={handleStartLevelUp}
        cost={levelUpCost}
        points={points}
      />
      <EvolutionModal
        open={isEvolutionModalOpen}
        onOpenChange={setIsEvolutionModalOpen}
        pokemon={pokemon}
        possibleEvolutions={possibleEvolutions}
        onEvolve={handleStartEvolution}
        evolutionCost={evolutionCost}
        points={points}
      />
      <FormSwitchModal
        open={isFormSwitchModalOpen}
        onOpenChange={setIsFormSwitchModalOpen}
        pokemon={pokemon}
        varieties={varieties}
        onSwitch={(formName) => {
          switchForm(formName);
          setIsFormSwitchModalOpen(false);
        }}
        switchCost={FORM_SWITCH_COST}
        points={points}
      />
      <MegaEvolutionModal
        open={isMegaEvolutionModalOpen}
        onOpenChange={setIsMegaEvolutionModalOpen}
        pokemon={pokemon}
        onMegaEvolve={handleStartMegaEvolution}
        cost={MEGA_EVOLUTION_COST}
        points={points}
      />
    </div>
  );
};

export default SelectedPokemon;
