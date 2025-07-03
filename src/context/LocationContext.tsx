import { createContext } from "react";
import { LocationData } from "../types";

export type LocationContextType = {
  location: LocationData | null;
  loading: boolean;
};

export const LocationContext = createContext<LocationContextType>({
  location: null,
  loading: true,
});
