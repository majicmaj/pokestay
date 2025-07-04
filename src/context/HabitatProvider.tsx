import React, { useState, useEffect, ReactNode } from "react";
import { NamedAPIResource } from "../types";
import { capitalize } from "../utils/capitalize";
import { HabitatContext } from "./HabitatContext";

const HABITAT_CHANGE_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface HabitatProviderProps {
  children: ReactNode;
}

const HabitatProvider: React.FC<HabitatProviderProps> = ({ children }) => {
  const [habitat, setHabitat] = useState<NamedAPIResource | null>(null);
  const [pokemonSpecies, setPokemonSpecies] = useState<NamedAPIResource[]>([]);
  const [habitats, setHabitats] = useState<NamedAPIResource[]>([]);
  const [remainingTime, setRemainingTime] = useState(HABITAT_CHANGE_INTERVAL);

  useEffect(() => {
    const fetchHabitats = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon-habitat/"
        );
        const data = await response.json();
        setHabitats(data.results);
      } catch (error) {
        console.error("Failed to fetch habitats:", error);
      }
    };
    fetchHabitats();
  }, []);

  const fetchNewHabitat = async () => {
    if (habitats.length === 0) return;
    const randomHabitat = habitats[Math.floor(Math.random() * habitats.length)];
    try {
      const response = await fetch(randomHabitat.url);
      const data = await response.json();
      setHabitat({
        ...randomHabitat,
        name: capitalize(randomHabitat.name.replace("-", " ")),
      });
      setPokemonSpecies(data.pokemon_species);
      setRemainingTime(HABITAT_CHANGE_INTERVAL);
    } catch (error) {
      console.error("Failed to fetch habitat details:", error);
    }
  };

  useEffect(() => {
    if (habitats.length > 0) {
      fetchNewHabitat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitats]);

  useEffect(() => {
    const habitatTimer = setInterval(() => {
      fetchNewHabitat();
    }, HABITAT_CHANGE_INTERVAL);

    const countdownTimer = setInterval(() => {
      setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1000 : 0));
    }, 1000);

    return () => {
      clearInterval(habitatTimer);
      clearInterval(countdownTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitat]);

  const value = {
    habitat,
    pokemonSpecies,
    remainingTime,
  };

  return (
    <HabitatContext.Provider value={value}>{children}</HabitatContext.Provider>
  );
};

export default HabitatProvider;
