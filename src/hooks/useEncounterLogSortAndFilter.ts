import { useMemo, useState } from "react";
import { EncounterLogEntry } from "../types";
import { LEGENDARY_POKEMON_IDS } from "../constants/legendaryPokemonIds";

export type LogSortBy = "recent" | "stardust" | "name";
export type SortDirection = "asc" | "desc";

export const useEncounterLogSortAndFilter = (log: EncounterLogEntry[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<LogSortBy>("recent");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [filterShiny, setFilterShiny] = useState(false);
  const [filterLegendary, setFilterLegendary] = useState(false);

  const filteredAndSortedLog = useMemo(() => {
    let filtered = log;

    if (searchTerm) {
      filtered = filtered.filter((entry) =>
        entry.pokemonName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(
        (entry) => entry.location?.city === selectedLocation
      );
    }

    if (filterShiny) {
      filtered = filtered.filter((entry) => entry.isShiny);
    }

    if (filterLegendary) {
      filtered = filtered.filter(
        (entry) =>
          entry.pokemonId && LEGENDARY_POKEMON_IDS.includes(entry.pokemonId)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "stardust":
          return b.stardust - a.stardust;
        case "name":
          return a.pokemonName.localeCompare(b.pokemonName);
        case "recent":
        default:
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
      }
    });

    return sortDirection === "asc" ? sorted.reverse() : sorted;
  }, [
    log,
    searchTerm,
    sortBy,
    sortDirection,
    selectedLocation,
    filterShiny,
    filterLegendary,
  ]);

  return {
    filteredAndSortedLog,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    selectedLocation,
    setSelectedLocation,
    filterShiny,
    setFilterShiny,
    filterLegendary,
    setFilterLegendary,
  };
};
