import { motion, DragControls } from "framer-motion";
import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { twMerge } from "tailwind-merge";
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

const PokeBallSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={twMerge(
      "relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 data-[state=checked]:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={twMerge(
        "pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0"
      )}
    >
      <div className="absolute inset-0 rounded-full border-2 border-zinc-800">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-danger rounded-t-full" />
        <div className="absolute inset-y-0 my-auto h-0.5 w-full bg-zinc-800" />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-800 bg-white" />
      </div>
    </SwitchPrimitive.Thumb>
  </SwitchPrimitive.Root>
));
PokeBallSwitch.displayName = "PokeBallSwitch";

const PokemonSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={twMerge(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-600">
      <SliderPrimitive.Range className="absolute h-full bg-green-500" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-zinc-800 bg-white shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
      <div className="relative h-full w-full">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-danger rounded-t-full" />
        <div className="absolute inset-y-0 my-auto h-0.5 w-full bg-zinc-800" />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-800 bg-white" />
      </div>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
PokemonSlider.displayName = "PokemonSlider";

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
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-black/20 dark:hover:bg-white/15"
    }`}
  >
    <div className="flex items-center gap-4">
      <div className="text-link">{icon}</div>
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
            <PokeBallSwitch checked={theme === "dark"} onClick={toggleTheme} />
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Sound">
          <SettingsItem
            icon={masterSoundEnabled ? <Volume2 /> : <VolumeX />}
            label="Master Sound"
          >
            <PokeBallSwitch
              checked={masterSoundEnabled}
              onClick={toggleMasterSound}
            />
          </SettingsItem>
          <SettingsItem
            icon={<Music />}
            label="Music"
            disabled={!masterSoundEnabled}
          >
            <PokeBallSwitch
              checked={musicEnabled}
              onClick={toggleMusic}
              disabled={!masterSoundEnabled}
            />
          </SettingsItem>
          <SettingsItem
            icon={<Sparkles />}
            label="Effects"
            disabled={!masterSoundEnabled}
          >
            <PokeBallSwitch
              checked={effectsEnabled}
              onClick={toggleEffects}
              disabled={!masterSoundEnabled}
            />
          </SettingsItem>
          <SettingsItem
            icon={<MessageSquare />}
            label="Cries"
            disabled={!masterSoundEnabled}
          >
            <PokeBallSwitch
              checked={criesEnabled}
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
            <PokemonSlider
              id="volume"
              min={0}
              max={1}
              step={0.01}
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
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
