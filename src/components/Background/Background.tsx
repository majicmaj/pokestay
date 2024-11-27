import { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim"; // Load all tsparticles plugins
import bg from "../../assets/background/bg.png";
import { WildPokemonState } from "../../types";
import { getBackgroundColor } from "../../utils/getBackgroundColor";
import getBackgroundParticles from "../../utils/getBackgroundParticles";

const Background = ({
  currentPokemon,
}: {
  currentPokemon: WildPokemonState | null;
}) => {
  const bgColor = getBackgroundColor(currentPokemon);
  const pokemonType = currentPokemon?.types?.[0];

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine); // This ensures all plugins are loaded
  }, []);

  const particleOptions = getBackgroundParticles(pokemonType);

  return (
    <div className="absolute h-screen w-screen overflow-hidden">
      {/* Background gradients */}
      <div className={`${bgColor} h-1/2 top-0 w-full absolute`} />
      <div
        className={`bg-gradient-to-b top-0 absolute from-sky-200/90 to-blue-300/90 dark:from-sky-800/90 dark:to-blue-900/90 h-1/2 w-full`}
      />
      <img className="absolute pixelated w-full h-full object-cover" src={bg} />
      <div
        className={`mix-blend-hue transition-colors top-[47%] h-full w-full absolute opacity-10 ${bgColor} `}
      />
      <div
        className={`mix-blend-color transition-colors top-[47%] h-full w-full absolute opacity-30 ${bgColor} `}
      />
      <div
        className={`mix-blend-saturation transition-colors top-[47%] h-full w-full absolute opacity-20 ${bgColor} `}
      />
      <div
        className={`mix-blend-color transition-colors bottom-[53%] h-full w-full absolute opacity-30 ${bgColor} `}
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
