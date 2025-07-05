import { AnimatePresence, motion } from "framer-motion";
import { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim"; // Load all tsparticles plugins
import bg from "../../assets/background/bg.png";
import darkBg from "../../assets/background/dark.png";
import electricBg from "../../assets/background/electric.png";
import fairyBg from "../../assets/background/fairy.png";
import fightingBg from "../../assets/background/fighting.png";
import fireBg from "../../assets/background/fire.png";
import iceBg from "../../assets/background/ice.png";
import poisonBg from "../../assets/background/poison.png";
import rockBg from "../../assets/background/rock.png";
import waterBg from "../../assets/background/water.png";

import { WildPokemonState } from "../../types";
import { getBackgroundColor } from "../../utils/getBackgroundColor";
import getBackgroundParticles from "../../utils/getBackgroundParticles";

// const allPokemonTypes = [
//   "grass",
//   "poison",
//   "fire",
//   "water",
//   "electric",
//   "fighting",
//   "fairy",
//   "psychic",
//   "bug",
//   "rock",
//   "ghost",
//   "dragon",
//   "dark",
//   "steel",
//   "normal",
//   "flying",
//   "ground",
//   "ice",
// ];

const getBg = (pokemonType: string) => {
  if (pokemonType === "dark") return darkBg;
  if (pokemonType === "ghost") return darkBg;
  if (pokemonType === "poison") return poisonBg;
  if (pokemonType === "bug") return poisonBg;

  if (pokemonType === "electric") return electricBg;
  if (pokemonType === "fairy") return fairyBg;
  if (pokemonType === "fighting") return fightingBg;
  if (pokemonType === "fire") return fireBg;
  if (pokemonType === "ice") return iceBg;
  if (pokemonType === "water") return waterBg;

  if (pokemonType === "rock") return rockBg;
  if (pokemonType === "steel") return rockBg;
  if (pokemonType === "ground") return rockBg;

  return bg;
};

const Background = ({
  currentPokemon,
}: {
  currentPokemon: WildPokemonState | null;
}) => {
  const bgColor = getBackgroundColor(currentPokemon);
  const pokemonType = currentPokemon?.types?.[0];
  const bgSrc = getBg(pokemonType ?? "default");

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine); // This ensures all plugins are loaded
  }, []);

  const particleOptions = getBackgroundParticles(pokemonType);

  return (
    <div className="opacity-90 absolute h-screen w-screen overflow-hidden">
      {/* Background gradients */}
      <div className={`${bgColor} h-1/2 top-0 w-full absolute`} />
      <div
        className={`bg-gradient-to-b top-0 absolute from-primary/90 to-secondary/90 h-1/2 w-full`}
      />
      <AnimatePresence>
        <motion.img
          key={bgSrc}
          className="animate-bg-slow-zoom-in-out absolute pixelated w-full h-full object-cover"
          src={bgSrc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>
      <div
        className={`mix-blend-hue transition-colors h-full w-full absolute opacity-10 ${bgColor} `}
      />
      <div
        className={`mix-blend-saturation transition-colors h-full w-full absolute opacity-10 ${bgColor} `}
      />
      <div
        className={`mix-blend-color transition-colors h-full w-full absolute opacity-10 ${bgColor} `}
      />

      {/* Particle Effects */}
      <Particles
        id="tsparticles"
        options={particleOptions}
        init={particlesInit}
      />
    </div>
  );
};

export default Background;
