import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme/useTheme";
import Pokeball from "../../assets/icons/Pokeball";
import Stardust from "../../assets/icons/Stardust";

interface HeaderSectionProps {
  inventoryCount: number;
  points: number;
}

const Header: React.FC<HeaderSectionProps> = ({ inventoryCount, points }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="pt-8 w-full grid grid-cols-3 gap-4 place-items-center bg-primary p-4 rounded-b-xl">
      <div className="flex items-center gap-1">
        <Pokeball className="w-6 h-6" />
        {inventoryCount}
      </div>
      <h1 className="text-md text-center font-bold">POKEMON</h1>
      <div className="flex items-center gap-1">
        <Stardust className="w-6 h-6" />
        {points}
        <button
          onClick={toggleTheme}
          className="absolute right-4 top-2 ml-4 p-1 rounded-full"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Header;
