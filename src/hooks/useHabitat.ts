import { useContext } from "react";
import { HabitatContext } from "../context/HabitatContext";

export const useHabitat = () => {
  const context = useContext(HabitatContext);
  if (!context) {
    throw new Error("useHabitat must be used within a HabitatProvider");
  }
  return context;
};
