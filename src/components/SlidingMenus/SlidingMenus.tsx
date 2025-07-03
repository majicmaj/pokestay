import { LogOut, ScrollText, X } from "lucide-react";
import { useState } from "react";
import { Menus } from "../../types";
import PokemonPouch from "../PokemonPouch/PokemonPouch";
import BuddyPokemon from "./BuddyPokemon";
import EncounterLog from "./EncounterLog";
import { cn } from "../../utils/cn";

const SlidingMenus = ({ handleFlee }: { handleFlee: () => void }) => {
  const [activeMenu, setActiveMenu] = useState<Menus>("none");

  const toggleMenu = (menu: Menus) => {
    setActiveMenu((prev) => (prev === menu ? "none" : menu));
  };

  return (
    <div className="absolute">
      {/* FABs */}
      <div className="fixed top-4 left-4">
        <button
          className="p-2 text-white drop-shadow-md rotate-180"
          onClick={handleFlee}
        >
          <LogOut className="h-6 w-6" />
        </button>
      </div>

      <div className="fixed bottom-4 left-4 z-50">
        <button
          className="p-2 text-white drop-shadow-md"
          onClick={() => toggleMenu("log")}
        >
          <ScrollText className="h-6 w-6" />
        </button>
      </div>

      <BuddyPokemon activeMenu={activeMenu} toggleMenu={toggleMenu} />

      {/* Pouch Menu */}
      <div
        className={cn(
          `fixed inset-y-0 right-0 w-full bg-lime-200 bg-gradient-to-br px-2 from-lime-200 to-teal-500 backdrop-blur-md shadow-lg transform transition-all duration-300 z-40`,
          activeMenu === "pouch"
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        )}
      >
        <div className="mt-2 rounded-t-xl overflow-hidden bg-background h-full w-full text-accent-content dark:bg-dark-primary dark:text-dark-text">
          <button
            className="z-20 absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 p-2 text-lime-200 border border-lime-200"
            onClick={() => setActiveMenu("none")}
          >
            <X className="h-6 w-6" />
          </button>
          <PokemonPouch />
        </div>
      </div>

      {/* Log Menu */}
      <div
        className={cn(
          `fixed inset-y-0 right-0 w-full bg-lime-200 bg-gradient-to-br px-2 from-lime-200 to-teal-500 backdrop-blur-md shadow-lg transform transition-all duration-300 z-40`,
          activeMenu === "log"
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        )}
      >
        <div className="mt-2 rounded-t-xl overflow-hidden bg-secondary h-full w-full text-accent-content dark:bg-dark-primary dark:text-dark-text">
          <button
            className="z-20 absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 p-2 text-lime-200 border border-lime-200"
            onClick={() => setActiveMenu("none")}
          >
            <X className="h-6 w-6" />
          </button>
          <EncounterLog />
        </div>
      </div>
    </div>
  );
};

export default SlidingMenus;
