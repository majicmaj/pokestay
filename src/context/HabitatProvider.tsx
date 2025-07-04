import React, { useState, useEffect, ReactNode } from "react";
import { NamedAPIResource } from "../types";
import { capitalize } from "../utils/capitalize";
import { HabitatContext } from "./HabitatContext";
import { ETHER_POKEMON } from "../constants/etherPokemon";

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
    fetchHabitats();
  }, []);

  const fetchNewHabitat = async () => {
    if (habitats.length === 0) return;
    const randomHabitat = habitats[Math.floor(Math.random() * habitats.length)];

    if (randomHabitat.url.startsWith("custom-ether")) {
      const [, , gen, type] = randomHabitat.url.split("-");
      setHabitat(randomHabitat);
      setPokemonSpecies(ETHER_POKEMON[gen][type]);
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

  const skipHabitat = () => {
    fetchNewHabitat();
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
    skipHabitat,
  };

  return (
    <HabitatContext.Provider value={value}>{children}</HabitatContext.Provider>
  );
};

export default HabitatProvider;
