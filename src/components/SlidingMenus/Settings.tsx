import { motion, DragControls } from "framer-motion";
import { useSound } from "../../context/SoundProvider";
import { useTheme } from "../../hooks/useTheme/useTheme";

const SettingsToggle: React.FC<{
  label: string;
  enabled: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ label, enabled, onClick, disabled }) => (
  <div
    className={`flex justify-between items-center bg-primary p-3 rounded-lg ${
      disabled ? "opacity-50" : ""
    }`}
  >
    <span className="font-semibold">{label}</span>
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-lg bg-accent text-accent-content disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {enabled ? "On" : "Off"}
    </button>
  </div>
);

const Settings: React.FC<{ dragControls: DragControls }> = ({
  dragControls,
}) => {
  const {
    masterSoundEnabled,
    toggleMasterSound,
    musicEnabled,
    toggleMusic,
    effectsEnabled,
    toggleEffects,
    criesEnabled,
    toggleCries,
    volume,
    setVolume,
  } = useSound();
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
        <SettingsToggle
          label="Master Sound"
          enabled={masterSoundEnabled}
          onClick={toggleMasterSound}
        />
        <SettingsToggle
          label="Music"
          enabled={musicEnabled}
          onClick={toggleMusic}
          disabled={!masterSoundEnabled}
        />
        <SettingsToggle
          label="Effects"
          enabled={effectsEnabled}
          onClick={toggleEffects}
          disabled={!masterSoundEnabled}
        />
        <SettingsToggle
          label="Cries"
          enabled={criesEnabled}
          onClick={toggleCries}
          disabled={!masterSoundEnabled}
        />
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
            disabled={!masterSoundEnabled}
          />
        </div>
        <div className="flex justify-between items-center bg-primary p-3 rounded-lg">
          <span className="font-semibold">Support</span>
          <a
            href="https://github.com/majicmaj/pokestay/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-accent text-accent-content"
          >
            Report an Issue
          </a>
        </div>
      </div>
    </div>
  );
};

export default Settings;
