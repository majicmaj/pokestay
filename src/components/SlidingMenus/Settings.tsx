import { motion, DragControls } from "framer-motion";
import React from "react";
import {
  ExternalLink,
  LifeBuoy,
  MessageSquare,
  Moon,
  Music,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useSound } from "../../context/SoundProvider";
import { useTheme } from "../../hooks/useTheme/useTheme";

const Switch: React.FC<{
  enabled: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ enabled, onClick, disabled }) => (
  <div
    onClick={() => !disabled && onClick()}
    className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
      enabled ? "bg-green-500" : "bg-gray-600"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <motion.div
      className="w-5 h-5 bg-white rounded-full shadow-md"
      layout
      transition={{ type: "spring", stiffness: 700, damping: 30 }}
      animate={{ x: enabled ? "1.25rem" : "0rem" }}
    />
  </div>
);

const SettingsSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div>
    <h3 className="px-3 pb-2 text-lg font-bold text-content/80 pixelated-font tracking-wider">
      {title}
    </h3>
    <div className="space-y-2 bg-black/10 dark:bg-white/5 rounded-xl p-2">
      {children}
    </div>
  </div>
);

const SettingsItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ icon, label, children, disabled }) => (
  <div
    className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-200 ${
      disabled ? "opacity-50" : "hover:bg-black/10 dark:hover:bg-white/10"
    }`}
  >
    <div className="flex items-center gap-4">
      <div className="text-accent">{icon}</div>
      <span className="font-semibold text-content">{label}</span>
    </div>
    <div>{children}</div>
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
    <div className="h-full flex flex-col bg-secondary text-content">
      <motion.div
        onPointerDown={(e) => dragControls.start(e)}
        className="w-full flex flex-col items-center pt-3 pb-2 cursor-grab touch-none"
      >
        <div className="w-12 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full mb-2" />
        <h2 className="text-3xl font-bold pixelated-font text-center tracking-wide">
          Settings
        </h2>
      </motion.div>
      <div className="p-4 flex-grow space-y-6 overflow-y-auto">
        <SettingsSection title="Display">
          <SettingsItem
            icon={theme === "light" ? <Sun /> : <Moon />}
            label="Theme"
          >
            <Switch enabled={theme === "dark"} onClick={toggleTheme} />
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Sound">
          <SettingsItem
            icon={masterSoundEnabled ? <Volume2 /> : <VolumeX />}
            label="Master Sound"
          >
            <Switch enabled={masterSoundEnabled} onClick={toggleMasterSound} />
          </SettingsItem>
          <SettingsItem
            icon={<Music />}
            label="Music"
            disabled={!masterSoundEnabled}
          >
            <Switch
              enabled={musicEnabled}
              onClick={toggleMusic}
              disabled={!masterSoundEnabled}
            />
          </SettingsItem>
          <SettingsItem
            icon={<Sparkles />}
            label="Effects"
            disabled={!masterSoundEnabled}
          >
            <Switch
              enabled={effectsEnabled}
              onClick={toggleEffects}
              disabled={!masterSoundEnabled}
            />
          </SettingsItem>
          <SettingsItem
            icon={<MessageSquare />}
            label="Cries"
            disabled={!masterSoundEnabled}
          >
            <Switch
              enabled={criesEnabled}
              onClick={toggleCries}
              disabled={!masterSoundEnabled}
            />
          </SettingsItem>
          <div
            className={`p-3 rounded-lg ${
              !masterSoundEnabled ? "opacity-50" : ""
            }`}
          >
            <label
              htmlFor="volume"
              className="font-semibold text-content pb-2 block"
            >
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
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-green-500"
              disabled={!masterSoundEnabled}
            />
          </div>
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem icon={<LifeBuoy />} label="Report an Issue">
            <a
              href="https://github.com/majicmaj/pokestay/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-content transition-colors duration-200 hover:bg-accent/80"
            >
              Open <ExternalLink className="w-4 h-4" />
            </a>
          </SettingsItem>
        </SettingsSection>
      </div>
    </div>
  );
};

export default Settings;
