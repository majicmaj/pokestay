import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Particles } from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import { Pokemon } from "../../../types";
import getBackgroundParticles from "../../../utils/getBackgroundParticles";

interface MegaEvolutionAnimationProps {
  preEvolutionPokemon: Pokemon;
  postEvolutionPokemon: Pokemon;
  onComplete: () => void;
}

const MegaEvolutionAnimation: React.FC<MegaEvolutionAnimationProps> = ({
  preEvolutionPokemon,
  postEvolutionPokemon,
  onComplete,
}) => {
  const [phase, setPhase] = useState<"pre" | "post">("pre");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const sequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setPhase("post");
      await new Promise((resolve) => setTimeout(resolve, 2500));
      onCompleteRef.current();
    };
    sequence();
  }, []);

  const particleOptions = getBackgroundParticles("mega");

  return (
    <div
      className="absolute inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-md"
      onClick={() => onCompleteRef.current()}
    >
      <Particles
        id="tsparticles-mega-evolution"
        options={particleOptions}
        init={particlesInit}
      />
      <AnimatePresence>
        {phase === "pre" && (
          <motion.img
            key="pre-mega"
            src={preEvolutionPokemon.sprite}
            alt={preEvolutionPokemon.name}
            initial={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
            exit={{
              opacity: 0,
              scale: 1.5,
              filter: "brightness(20) invert(1)",
              rotate: 360,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="z-10 h-64 w-64 pixelated object-contain absolute"
          />
        )}
        {phase === "post" && (
          <motion.img
            key="post-mega"
            src={postEvolutionPokemon.sprite}
            alt={postEvolutionPokemon.name}
            initial={{
              opacity: 0,
              scale: 1.5,
              filter: "brightness(20) invert(1)",
              rotate: -360,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "brightness(1)",
              rotate: 0,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="z-10 h-64 w-64 pixelated object-contain absolute"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MegaEvolutionAnimation;
