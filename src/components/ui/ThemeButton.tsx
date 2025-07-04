import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme/useTheme";

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="text-white absolute right-2 top-2 p-2 bg-black/20 rounded-full z-10"
    >
      {theme !== "light" ? <Moon /> : <Sun />}
    </button>
  );
};

export default ThemeButton;
