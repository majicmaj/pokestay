import { Link, useLocation } from "react-router-dom";
import useGameState from "../../hooks/useGameState";
import { Cat } from "lucide-react";
import useCurrentPokemon from "../../hooks/useCurrentPokemon";
import { calculateTypeAdvantage } from "../../utils/calculateTypeAdvantage";

const getTypeAdvantageClass = (advantage: number) => {
  if (advantage > 2) return "border-teal-500";
  if (advantage > 1) return "border-lime-500";
  if (advantage === 1) return "border-yellow-500";
  if (advantage < 1) return "border-red-500";
};

const BuddyPokemon = () => {
  const [gameState] = useGameState();
  const [currentPokemon] = useCurrentPokemon();

  const buddyPokemon = gameState.buddyPokemon;

  const typeAdvantage = calculateTypeAdvantage(
    buddyPokemon?.types || [],
    currentPokemon?.types || []
  );

  const hasBuddyPokemon = Boolean(buddyPokemon?.name);
  const advantageClass = hasBuddyPokemon
    ? getTypeAdvantageClass(typeAdvantage)
    : "";

  const location = useLocation();
  const activeMenu = location.pathname.split("/")[1] || "none";

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 items-end z-10">
      <Link to="/pouch">
        <button
          className={`relative grid place-items-center h-14 w-14 p-4 rounded-full shadow-lg transition-all border-2 ${
            activeMenu === "inventory"
              ? "bg-blue-500 text-white"
              : "bg-black/20 backdrop-blur-md text-white hover:bg-blak/30"
          }
        ${advantageClass}`}
        >
          {hasBuddyPokemon ? (
            <img
              className="pixelated object-contain absolute"
              src={gameState.buddyPokemon?.sprite}
            />
          ) : (
            <Cat className="w-full h-full" />
          )}
        </button>
      </Link>
      <p className="pixelated-font absolute bottom-1 left-1/2 -translate-x-1/2 text-white shadow-md text-xs">
        {(typeAdvantage * 100).toFixed(0)}%
      </p>
    </div>
  );
};

export default BuddyPokemon;
