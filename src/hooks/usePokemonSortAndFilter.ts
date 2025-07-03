import React, { useState } from "react";
import { Pokemon } from "../types";

export type SortBy = "level" | "recent" | "name" | "cp" | "id";
export type SortDirection = "asc" | "desc";

export const usePokemonSortAndFilter = (inventory: Pokemon[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const sortedPokemon = React.useMemo(() => {
    const sorted = [...inventory].sort((a, b) => {
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
  }, [inventory, sortBy, sortDirection]);

  const filteredPokemon = React.useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return sortedPokemon.filter((pokemon) => {
      const matchesSearch =
        pokemon.name.toLowerCase().includes(lowerSearchTerm) ||
        pokemon.types.some((type: string) =>
          type.toLowerCase().includes(lowerSearchTerm)
        );
      const matchesTypeFilter =
        selectedTypes.length === 0 ||
        pokemon.types.some((type: string) => selectedTypes.includes(type));

      const matchesLocation =
        !selectedLocation ||
        pokemon.caughtLocation?.city === selectedLocation ||
        pokemon.caughtLocation?.state === selectedLocation ||
        pokemon.caughtLocation?.country === selectedLocation;

      return matchesSearch && matchesTypeFilter && matchesLocation;
    });
  }, [sortedPokemon, searchTerm, selectedTypes, selectedLocation]);

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
  };
};
