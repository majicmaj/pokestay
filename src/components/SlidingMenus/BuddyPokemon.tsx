import useGameState from "../../hooks/useGameState";
import { Menus } from "../../types";
import { calculateTypeAdvantage } from "../../utils/calculateTypeAdvantage";

interface BuddyPokemonProps {
  activeMenu: string;
  toggleMenu: (menu: Menus) => void;
}

const getTypeAdvantageClass = (advantage: number) => {
  if (advantage > 2) return "border-teal-500";
  if (advantage > 1) return "border-lime-500";
  if (advantage === 1) return "border-yellow-500";
  if (advantage < 1) return "border-red-500";
};

const BuddyPokemon = ({ activeMenu, toggleMenu }: BuddyPokemonProps) => {
  const [gameState] = useGameState();

  const buddyPokemon = gameState.buddyPokemon;
  const currentPokemon = gameState.currentPokemon;

  const typeAdvantage = calculateTypeAdvantage(
    buddyPokemon?.types,
    currentPokemon?.types
  );

  const advantageClass = getTypeAdvantageClass(typeAdvantage);

  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-4 items-end z-30">
      <button
        onClick={() => toggleMenu("inventory")}
        className={`relative grid place-items-center h-14 w-14 p-4 rounded-full shadow-lg transition-all border-2 ${
          activeMenu === "inventory"
            ? "bg-blue-500 text-white"
            : "bg-black/20 backdrop-blur-md text-white hover:bg-blak/30"
        }
        ${advantageClass}`}
      >
        <img
          className="pixelated absolute min-w-16 aspect-square"
          src={gameState.buddyPokemon?.sprite}
        />
      </button>
    </div>
  );
};

export default BuddyPokemon;
