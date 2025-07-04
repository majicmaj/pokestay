import React, { createContext, useContext } from "react";
import useLocalStorageState from "../hooks/useLocalStorageState";

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [soundEnabled, setSoundEnabled] = useLocalStorageState(
    "soundEnabled",
    true
  );
  const [volume, setVolume] = useLocalStorageState("volume", 0.5);

  const toggleSound = () => {
    setSoundEnabled((prev: boolean) => !prev);
  };

  return (
    <SoundContext.Provider
      value={{ soundEnabled, toggleSound, volume, setVolume }}
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
