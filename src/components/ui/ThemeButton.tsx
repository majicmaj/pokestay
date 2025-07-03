import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme/useTheme";

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="text-white absolute right-4 top-4 p-2 rounded-full"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
};

export default ThemeButton;
