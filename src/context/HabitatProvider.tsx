import React, { useState, useEffect, ReactNode, useCallback } from "react";
import { NamedAPIResource } from "../types";
import { capitalize } from "../utils/capitalize";
import { HabitatContext } from "./HabitatContext";
import { ETHER_POKEMON } from "../constants/etherPokemon";
import useLocalStorageState from "../hooks/useLocalStorageState";

const HABITAT_CHANGE_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface HabitatProviderProps {
  children: ReactNode;
}

const HabitatProvider: React.FC<HabitatProviderProps> = ({ children }) => {
  const [habitat, setHabitat] = useLocalStorageState<NamedAPIResource | null>(
    "habitat",
    null
  );
  const [pokemonSpecies, setPokemonSpecies] = useLocalStorageState<
    NamedAPIResource[]
  >("pokemonSpecies", []);
  const [habitatStartTime, setHabitatStartTime] = useLocalStorageState<
    number | null
  >("habitatStartTime", null);

  const [habitats, setHabitats] = useState<NamedAPIResource[]>([]);
  const [remainingTime, setRemainingTime] = useState(HABITAT_CHANGE_INTERVAL);

  const fetchNewHabitat = useCallback(async () => {
    if (habitats.length === 0) return;
    const randomHabitat = habitats[Math.floor(Math.random() * habitats.length)];

    let species: NamedAPIResource[] = [];
    let habitatName = randomHabitat.name;

    if (randomHabitat.url.startsWith("custom-ether")) {
      const [, , gen, type] = randomHabitat.url.split("-");
      species = ETHER_POKEMON[gen]?.[type] || [];
    } else {
      try {
        const response = await fetch(randomHabitat.url);
        const data = await response.json();
        species = data.pokemon_species;
        habitatName = capitalize(randomHabitat.name.replace("-", " "));
      } catch (error) {
        console.error("Failed to fetch habitat details:", error);
        return; // Don't set a new habitat if the fetch fails
      }
    }

    setHabitat({ ...randomHabitat, name: habitatName });
    setPokemonSpecies(species);
    setHabitatStartTime(Date.now());
  }, [habitats, setHabitat, setPokemonSpecies, setHabitatStartTime]);

  useEffect(() => {
    const fetchAllHabitats = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon-habitat/"
        );
        const data = await response.json();

        const habitatPromises = data.results.map(
          async (h: NamedAPIResource) => {
            const res = await fetch(h.url);
            const details = await res.json();
            return details.pokemon_species.length > 0 ? h : null;
          }
        );

        const checkedHabitats = await Promise.all(habitatPromises);
        const validHabitats = checkedHabitats.filter(
          Boolean
        ) as NamedAPIResource[];

        const etherHabitats: NamedAPIResource[] = [];
        for (const gen in ETHER_POKEMON) {
          for (const type in ETHER_POKEMON[gen]) {
            if (ETHER_POKEMON[gen][type].length > 0) {
              etherHabitats.push({
                name: `${capitalize(type)} Ether ${gen}`,
                url: `custom-ether-${gen}-${type}`,
              });
            }
          }
        }
        setHabitats([...validHabitats, ...etherHabitats]);
      } catch (error) {
        console.error("Failed to fetch habitats:", error);
      }
    };
    fetchAllHabitats();
  }, []);

  useEffect(() => {
    if (habitats.length === 0) return;

    if (habitat && habitatStartTime) {
      const elapsedTime = Date.now() - habitatStartTime;
      if (elapsedTime >= HABITAT_CHANGE_INTERVAL) {
        fetchNewHabitat();
      }
    } else {
      fetchNewHabitat();
    }
  }, [habitats, habitat, habitatStartTime, fetchNewHabitat]);

  useEffect(() => {
    if (!habitatStartTime) return;

    const intervalId = setInterval(() => {
      const elapsedTime = Date.now() - habitatStartTime;
      const newRemainingTime = HABITAT_CHANGE_INTERVAL - elapsedTime;

      if (newRemainingTime <= 0) {
        setRemainingTime(0);
      } else {
        setRemainingTime(newRemainingTime);
      }
    }, 1000);

    const initialElapsedTime = Date.now() - habitatStartTime;
    setRemainingTime(HABITAT_CHANGE_INTERVAL - initialElapsedTime);

    return () => clearInterval(intervalId);
  }, [habitatStartTime]);

  const skipHabitat = () => {
    fetchNewHabitat();
  };

  const value = {
    habitat,
    pokemonSpecies,
    remainingTime,
    skipHabitat,
  };

  return (
    <HabitatContext.Provider value={value}>{children}</HabitatContext.Provider>
  );
};

export default HabitatProvider;
