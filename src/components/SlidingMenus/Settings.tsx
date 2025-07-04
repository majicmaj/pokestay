import { motion, DragControls } from "framer-motion";
import { useSound } from "../../context/SoundProvider";
import { useTheme } from "../../hooks/useTheme/useTheme";

const Settings: React.FC<{ dragControls: DragControls }> = ({
  dragControls,
}) => {
  const { soundEnabled, toggleSound, volume, setVolume } = useSound();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-full flex flex-col">
      <motion.div
        onPointerDown={(e) => dragControls.start(e)}
        className="w-full flex flex-col items-center pt-2 cursor-grab touch-none"
      >
        <div className="w-12 h-1.5 bg-gray-400 rounded-full mb-2" />
        <h2 className="text-2xl font-bold text-center">Settings</h2>
      </motion.div>
      <div className="p-4 flex-grow space-y-4">
        <div className="flex justify-between items-center bg-primary p-3 rounded-lg">
          <span className="font-semibold">Theme</span>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-accent text-accent-content"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
        <div className="flex justify-between items-center bg-primary p-3 rounded-lg">
          <span className="font-semibold">Sound</span>
          <button
            onClick={toggleSound}
            className="px-4 py-2 rounded-lg bg-accent text-accent-content"
          >
            {soundEnabled ? "On" : "Off"}
          </button>
        </div>
        <div className="flex flex-col gap-2 bg-primary p-3 rounded-lg">
          <label htmlFor="volume" className="font-semibold">
            Volume
          </label>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
