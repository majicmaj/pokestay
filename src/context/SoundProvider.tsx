import React, { createContext, useContext, useCallback } from "react";
import useLocalStorageState from "../hooks/useLocalStorageState";

interface SoundContextType {
  masterSoundEnabled: boolean;
  toggleMasterSound: () => void;
  musicEnabled: boolean;
  toggleMusic: () => void;
  effectsEnabled: boolean;
  toggleEffects: () => void;
  criesEnabled: boolean;
  toggleCries: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [masterSoundEnabled, setMasterSoundEnabled] = useLocalStorageState(
    "soundEnabled",
    true
  );
  const [musicEnabled, setMusicEnabled] = useLocalStorageState(
    "musicEnabled",
    true
  );
  const [effectsEnabled, setEffectsEnabled] = useLocalStorageState(
    "effectsEnabled",
    true
  );
  const [criesEnabled, setCriesEnabled] = useLocalStorageState(
    "criesEnabled",
    true
  );
  const [volume, setVolume] = useLocalStorageState("volume", 0.5);

  const toggleMasterSound = useCallback(() => {
    setMasterSoundEnabled((prev: boolean) => !prev);
  }, [setMasterSoundEnabled]);

  const toggleMusic = useCallback(() => {
    setMusicEnabled((prev: boolean) => !prev);
  }, [setMusicEnabled]);

  const toggleEffects = useCallback(() => {
    setEffectsEnabled((prev: boolean) => !prev);
  }, [setEffectsEnabled]);

  const toggleCries = useCallback(() => {
    setCriesEnabled((prev: boolean) => !prev);
  }, [setCriesEnabled]);

  return (
    <SoundContext.Provider
      value={{
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
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
