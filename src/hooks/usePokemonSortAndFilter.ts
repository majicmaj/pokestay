import React, { useState, useMemo } from "react";
import { Pokemon } from "../types";
import { LEGENDARY_POKEMON_IDS } from "../constants/legendaryPokemonIds";

export type SortBy = "level" | "recent" | "name" | "cp" | "id";
export type SortDirection = "asc" | "desc";

export const usePokemonSortAndFilter = (pokemonList: Pokemon[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [filterShiny, setFilterShiny] = useState(false);
  const [filterLegendary, setFilterLegendary] = useState(false);

  const sortedPokemon = React.useMemo(() => {
    const sorted = [...pokemonList].sort((a, b) => {
      switch (sortBy) {
        case "cp":
          return (b.cp || 0) - (a.cp || 0);
        case "id":
          return a.id - b.id;
        case "level":
          return b.stats.level - a.stats.level;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return -1;
      }
    });

    if (sortDirection === "asc") {
      return sorted.reverse();
    }
    return sorted;
  }, [pokemonList, sortBy, sortDirection]);

  const filteredPokemon = useMemo(() => {
    let filtered = sortedPokemon;

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTypes.every((t) => p.types.includes(t))
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(
        (p) => p.caughtLocation?.city === selectedLocation
      );
    }

    if (filterShiny) {
      filtered = filtered.filter((p) => p.isShiny);
    }

    if (filterLegendary) {
      filtered = filtered.filter((p) => LEGENDARY_POKEMON_IDS.includes(p.id));
    }

    return filtered;
  }, [
    sortedPokemon,
    searchTerm,
    selectedTypes,
    selectedLocation,
    filterShiny,
    filterLegendary,
  ]);

  return {
    filteredPokemon,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    selectedTypes,
    setSelectedTypes,
    selectedLocation,
    setSelectedLocation,
    filterShiny,
    setFilterShiny,
    filterLegendary,
    setFilterLegendary,
  };
};
