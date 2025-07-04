import React, { useState, useEffect, ReactNode } from "react";
import { NamedAPIResource } from "../types";
import { capitalize } from "../utils/capitalize";
import { HabitatContext } from "./HabitatContext";
import * as nullHabitats from "../constants/nullHabitatPokemonByGen";

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
        // Fetch the list of regular habitats
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon-habitat/"
        );
        const data = await response.json();

        // Check each habitat to ensure it's not empty
        const habitatPromises = data.results.map(
          async (habitat: NamedAPIResource) => {
            const res = await fetch(habitat.url);
            const details = await res.json();
            return details.pokemon_species.length > 0 ? habitat : null;
          }
        );

        const checkedHabitats = await Promise.all(habitatPromises);
        const validHabitats = checkedHabitats.filter(
          (h) => h !== null
        ) as NamedAPIResource[];

        // Filter unknown habitats that are empty
        const unknownHabitats = Object.keys(nullHabitats)
          .filter(
            (key) =>
              (
                nullHabitats[
                  key as keyof typeof nullHabitats
                ] as NamedAPIResource[]
              ).length > 0
          )
          .map((key) => {
            const gen = key.split("_").pop();
            return {
              name: `Unknown ${gen}`,
              url: `custom-unknown-${gen}`,
            };
          });

        setHabitats([...validHabitats, ...unknownHabitats]);
      } catch (error) {
        console.error("Failed to fetch habitats:", error);
      }
    };
    fetchHabitats();
  }, []);

  const fetchNewHabitat = async () => {
    if (habitats.length === 0) return;
    const randomHabitat = habitats[Math.floor(Math.random() * habitats.length)];

    if (randomHabitat.url.startsWith("custom-unknown")) {
      const gen = randomHabitat.url.split("-").pop();
      const key =
        `NULL_HABITAT_POKEMON_GEN_${gen}` as keyof typeof nullHabitats;
      setHabitat(randomHabitat);
      setPokemonSpecies(nullHabitats[key]);
      setRemainingTime(HABITAT_CHANGE_INTERVAL);
      return;
    }

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
