import { createContext } from "react";
import { NamedAPIResource } from "../types";

export interface HabitatContextType {
  habitat: NamedAPIResource | null;
  pokemonSpecies: NamedAPIResource[];
  remainingTime: number;
  skipHabitat: () => void;
}

export const HabitatContext = createContext<HabitatContextType | undefined>(
  undefined
);
