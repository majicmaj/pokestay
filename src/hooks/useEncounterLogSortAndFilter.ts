import { useMemo, useState } from "react";
import { EncounterLogEntry } from "../types";

export type LogSortBy = "recent" | "stardust" | "name";
export type SortDirection = "asc" | "desc";

export const useEncounterLogSortAndFilter = (log: EncounterLogEntry[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<LogSortBy>("recent");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const filteredAndSortedLog = useMemo(() => {
    let processedLog = [...log];

    // Filter by search term
    if (searchTerm) {
      processedLog = processedLog.filter((entry) =>
        entry.pokemonName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by location
    if (selectedLocation) {
      processedLog = processedLog.filter(
        (entry) => entry.location?.city === selectedLocation
      );
    }

    // Sort
    processedLog.sort((a, b) => {
      let compareA: string | number | Date;
      let compareB: string | number | Date;

      switch (sortBy) {
        case "stardust":
          compareA = a.stardust;
          compareB = b.stardust;
          break;
        case "name":
          compareA = a.pokemonName;
          compareB = b.pokemonName;
          break;
        case "recent":
        default:
          compareA = new Date(a.timestamp);
          compareB = new Date(b.timestamp);
          break;
      }

      if (compareA < compareB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (compareA > compareB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    return processedLog;
  }, [log, searchTerm, sortBy, sortDirection, selectedLocation]);

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
  };
};
