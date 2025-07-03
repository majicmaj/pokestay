import { ArrowDown, ArrowUp, X } from "lucide-react";
import React from "react";
import {
  LogSortBy,
  SortDirection,
} from "../../hooks/useEncounterLogSortAndFilter";

interface EncounterLogFilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: LogSortBy;
  setSortBy: (sortBy: LogSortBy) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  allLocations: string[];
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
}

const EncounterLogFilterControls: React.FC<EncounterLogFilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  allLocations,
  selectedLocation,
  setSelectedLocation,
}) => {
  const sortOptions: LogSortBy[] = ["recent", "stardust", "name"];

  return (
    <div className="w-full p-4 flex flex-col gap-4 bg-primary rounded-b-xl">
      <input
        value={searchTerm}
        autoFocus
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-2 bg-secondary w-full rounded-full border border-border"
        placeholder="Search Pokemon by name"
      />
      <div className="flex w-full gap-2 text-sm items-center overflow-x-auto">
        {sortOptions.map((option) => (
          <button
            key={option}
            className={`px-2 py-1 rounded-full ${
              sortBy === option
                ? "bg-accent text-accent-content"
                : "bg-secondary"
            }`}
            onClick={() => setSortBy(option)}
          >
            {option.toUpperCase()}
          </button>
        ))}
        <button
          onClick={() =>
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
          }
          className="p-1 rounded-full bg-secondary"
        >
          {sortDirection === "asc" ? (
            <ArrowUp size={16} />
          ) : (
            <ArrowDown size={16} />
          )}
        </button>
      </div>

      {allLocations.length > 0 && (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setSelectedLocation(null)}
            className="min-w-max border rounded-full border-transparent"
          >
            <X size={16} />
          </button>
          <div className="flex w-full gap-2 overflow-x-auto">
            {allLocations.map((location) => (
              <button
                key={location}
                onClick={() => setSelectedLocation(location)}
                className={`min-w-max px-2 py-1 rounded-full text-xs ${
                  selectedLocation === location
                    ? "bg-blue-300 text-blue-800"
                    : "bg-secondary"
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EncounterLogFilterControls;
