import { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim"; // Load all tsparticles plugins
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
      <div
        className={`transition-colors duration-1000 h-[500vw] w-[1000vw] absolute top-1/3 rounded-t-full -translate-x-1/2 left-1/2 ${bgColor} `}
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
