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
import { Switch } from "../ui/Switch";

const SettingsSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div>
    <h3 className="px-3 pb-2 text-lg font-bold text-foreground/80 pixelated-font tracking-wider">
      {title}
    </h3>
    <div className="space-y-2 bg-card/50 rounded-xl p-2">{children}</div>
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
      disabled ? "opacity-50" : "hover:bg-card/50"
    }`}
  >
    <div className="flex items-center gap-4">
      <div className="text-accent">{icon}</div>
      <span className="font-semibold text-foreground">{label}</span>
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
    <div className="h-full flex flex-col bg-card text-foreground">
      <motion.div
        onPointerDown={(e) => dragControls.start(e)}
        className="w-full flex flex-col items-center pt-3 pb-2 cursor-grab touch-none"
      >
        <div className="w-12 h-1.5 bg-foreground/20 rounded-full mb-2" />
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
            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
              className="ml-auto"
            />
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Sound">
          <SettingsItem
            icon={masterSoundEnabled ? <Volume2 /> : <VolumeX />}
            label="Master Sound"
          >
            <Switch
              checked={masterSoundEnabled}
              onCheckedChange={toggleMasterSound}
              className="ml-auto"
            />
          </SettingsItem>
          <SettingsItem
            icon={<Music />}
            label="Music"
            disabled={!masterSoundEnabled}
          >
            <Switch
              checked={musicEnabled}
              onCheckedChange={toggleMusic}
              disabled={!masterSoundEnabled}
              className="ml-auto"
            />
          </SettingsItem>
          <SettingsItem
            icon={<Sparkles />}
            label="Effects"
            disabled={!masterSoundEnabled}
          >
            <Switch
              checked={effectsEnabled}
              onCheckedChange={toggleEffects}
              disabled={!masterSoundEnabled}
              className="ml-auto"
            />
          </SettingsItem>
          <SettingsItem
            icon={<MessageSquare />}
            label="Cries"
            disabled={!masterSoundEnabled}
          >
            <Switch
              checked={criesEnabled}
              onCheckedChange={toggleCries}
              disabled={!masterSoundEnabled}
              className="ml-auto"
            />
          </SettingsItem>
          <div
            className={`p-3 rounded-lg ${
              !masterSoundEnabled ? "opacity-50" : ""
            }`}
          >
            <label
              htmlFor="volume"
              className="font-semibold text-foreground pb-2 block"
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
