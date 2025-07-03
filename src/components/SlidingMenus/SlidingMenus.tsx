import { LogOut, ScrollText, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";
import BuddyPokemon from "./BuddyPokemon";
import EncounterLog from "./EncounterLog";
import PokemonPouch from "../PokemonPouch/PokemonPouch";

const SlidingMenus = ({ handleFlee }: { handleFlee: () => void }) => {
  const location = useLocation();
  const activeMenu = location.pathname.split("/")[1] || "none";

  return (
    <div>
      {/* FABs */}
      <div className="fixed top-4 left-4">
        <button
          className="p-2 text-white drop-shadow-md rotate-180"
          onClick={handleFlee}
        >
          <LogOut className="h-6 w-6" />
        </button>
      </div>

      <div className="fixed bottom-4 left-4 z-10">
        <Link to="/log" className="p-2 text-white drop-shadow-md">
          <ScrollText className="h-6 w-6" />
        </Link>
      </div>

      <BuddyPokemon />

      {/* Pouch Menu */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-full bg-lime-200 bg-gradient-to-br from-lime-200 to-teal-500 px-2 shadow-lg backdrop-blur-md transition-all duration-300 transform z-40",
          activeMenu === "pouch"
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        )}
      >
        <div className="mt-2 h-full w-full overflow-hidden rounded-t-xl bg-background text-accent-content dark:bg-dark-primary dark:text-dark-text">
          <Link
            to="/"
            className="z-20 absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 p-2 text-lime-200 border border-lime-200"
          >
            <X className="h-6 w-6" />
          </Link>
          <PokemonPouch />
        </div>
      </div>

      {/* Log Menu */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-full bg-lime-200 bg-gradient-to-br from-lime-200 to-teal-500 px-2 shadow-lg backdrop-blur-md transition-all duration-300 transform z-40",
          activeMenu === "log"
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        )}
      >
        <div className="mt-2 h-full w-full overflow-hidden rounded-t-xl bg-secondary text-accent-content dark:bg-dark-primary dark:text-dark-text">
          <Link
            to="/"
            className="z-20 absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 p-2 text-lime-200 border border-lime-200"
          >
            <X className="h-6 w-6" />
          </Link>
          <EncounterLog />
        </div>
      </div>
    </div>
  );
};

export default SlidingMenus;
