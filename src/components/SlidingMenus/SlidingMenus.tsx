import { LogOut, X } from "lucide-react";
import { useState } from "react";
import { Menus } from "../../types";
import PokemonPouch from "../PokemonPouch/PokemonPouch";
import BuddyPokemon from "./BuddyPokemon";

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

      <BuddyPokemon activeMenu={activeMenu} toggleMenu={toggleMenu} />

      {/* Menus */}
      <div
        className={`fixed inset-y-0 right-0 w-full bg-lime-200 bg-gradient-to-br px-2 from-lime-200 to-teal-500 backdrop-blur-md shadow-lg transform transition-all duration-300 z-40 ${
          activeMenu !== "none"
            ? "translate-x-0 opacity-100"
            : "translate-y-full opacity-0"
        }`}
      >
        <div className="bg-white h-full w-full text-teal-800">
          <button
            className="z-20 absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 p-2 text-lime-200 border border-lime-200"
            onClick={() => setActiveMenu("none")}
          >
            <X className="h-6 w-6" />
          </button>
          <PokemonPouch />
        </div>
      </div>
    </div>
  );
};

export default SlidingMenus;
