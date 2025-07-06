import React from "react";
import {
  LogSortBy,
  SortDirection,
} from "../../hooks/useEncounterLogSortAndFilter";
import GenericFilterControls from "../ui/GenericFilterControls";

interface EncounterLogFilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: LogSortBy;
  setSortBy: (sortBy: LogSortBy) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  allLocations: string[];
  countsPerLocation: Record<string, number>;
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
  filterShiny: boolean;
  setFilterShiny: (value: boolean) => void;
  filterLegendary: boolean;
  setFilterLegendary: (value: boolean) => void;
}

const EncounterLogFilterControls: React.FC<EncounterLogFilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  allLocations,
  countsPerLocation,
  selectedLocation,
  setSelectedLocation,
  filterShiny,
  setFilterShiny,
  filterLegendary,
  setFilterLegendary,
}) => {
  const sortOptions: LogSortBy[] = ["recent", "stardust", "name"];

  return (
    <GenericFilterControls
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      sortBy={sortBy}
      setSortBy={setSortBy}
      sortDirection={sortDirection}
      setSortDirection={setSortDirection}
      sortOptions={sortOptions}
      locationFilter={{
        allLocations,
        countsPerLocation,
        selectedLocation,
        setSelectedLocation,
      }}
      specialFilter={{
        filterShiny,
        setFilterShiny,
        filterLegendary,
        setFilterLegendary,
      }}
    />
  );
};

export default EncounterLogFilterControls;
