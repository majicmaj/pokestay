import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Particles } from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import { Pokemon } from "../../../types";
import getBackgroundParticles from "../../../utils/getBackgroundParticles";

interface EvolutionAnimationProps {
  preEvolutionPokemon: Pokemon;
  postEvolutionPokemon: Pokemon;
  onComplete: () => void;
}

const EvolutionAnimation: React.FC<EvolutionAnimationProps> = ({
  preEvolutionPokemon,
  postEvolutionPokemon,
  onComplete,
}) => {
  const [phase, setPhase] = useState<"pre" | "post" | "finished">("pre");

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const sequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setPhase("post");
      await new Promise((resolve) => setTimeout(resolve, 2500));
      onComplete();
    };
    sequence();
  }, [onComplete]);

  const particleOptions = getBackgroundParticles("evolution");

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-md">
      <div className="absolute top-0 left-0">
        {JSON.stringify({
          phase,
        })}
      </div>
      <Particles
        id="tsparticles-evolution"
        options={particleOptions}
        init={particlesInit}
      />
      <AnimatePresence>
        {phase === "pre" && (
          <motion.img
            key={phase}
            src={preEvolutionPokemon.sprite}
            alt={preEvolutionPokemon.name}
            initial={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
            exit={{
              opacity: 0,
              scale: 1.5,
              filter: "brightness(20) invert(1)",
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="z-10 h-64 w-64 pixelated object-contain"
          />
        )}
        {/* {phase === "post" && (
          <motion.img
            key={phase}
            src={postEvolutionPokemon.sprite}
            alt={postEvolutionPokemon.name}
            initial={{
              opacity: 0,
              scale: 1.5,
              filter: "brightness(20) invert(1)",
            }}
            animate={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="z-10 h-64 w-64 pixelated object-contain"
          />
        )} */}
      </AnimatePresence>
    </div>
  );
};

export default EvolutionAnimation;
