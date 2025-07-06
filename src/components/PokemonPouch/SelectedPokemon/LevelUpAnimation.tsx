import { motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { Particles } from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import { Pokemon } from "../../../types";
import getBackgroundParticles from "../../../utils/getBackgroundParticles";

interface LevelUpAnimationProps {
  pokemon: Pokemon;
  onComplete: () => void;
}

const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({
  pokemon,
  onComplete,
}) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const particleOptions = getBackgroundParticles("levelup");

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm">
      <Particles
        id="tsparticles-levelup"
        options={particleOptions}
        init={particlesInit}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        className="z-10 text-center flex flex-col items-center"
      >
        <motion.img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="z-10 h-64 w-64 pixelated object-contain"
          animate={{
            y: [0, -20, 0],
            filter: ["brightness(1)", "brightness(2.5)", "brightness(1)"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <h2 className="text-4xl font-bold text-white pixelated-font mt-4">
          Level Up!
        </h2>
      </motion.div>
    </div>
  );
};

export default LevelUpAnimation;
