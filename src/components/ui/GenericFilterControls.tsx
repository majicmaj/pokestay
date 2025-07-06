import {
  ArrowDown,
  ArrowUp,
  ListFilter,
  Map,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import React from "react";
import FilterSection from "./FilterSection";

interface GenericFilterControlsProps<T extends string> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: T;
  setSortBy: (sortBy: T) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  sortOptions: T[];
  locationFilter?: {
    allLocations: string[];
    countsPerLocation: Record<string, number>;
    selectedLocation: string | null;
    setSelectedLocation: (location: string | null) => void;
  };
  specialFilter?: {
    filterShiny: boolean;
    setFilterShiny: (value: boolean) => void;
    filterLegendary: boolean;
    setFilterLegendary: (value: boolean) => void;
  };
  children?: React.ReactNode;
}

const GenericFilterControls = <T extends string>({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  sortOptions,
  locationFilter,
  specialFilter,
  children,
}: GenericFilterControlsProps<T>) => {
  return (
    <div className="w-full p-4 flex flex-col gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content/50" />
        <input
          value={searchTerm}
          autoFocus
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 bg-secondary w-full rounded-full border border-divider focus:border-accent focus:ring-accent"
          placeholder="Search by name..."
        />
      </div>

      <div className="flex w-full gap-2 text-sm items-center overflow-x-auto pb-2">
        <button
          onClick={() =>
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
          }
          className="p-2 rounded-full bg-secondary hover:bg-secondary/80"
        >
          {sortDirection === "asc" ? (
            <ArrowUp size={16} />
          ) : (
            <ArrowDown size={16} />
          )}
        </button>
        {sortOptions.map((option) => (
          <button
            key={option}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              sortBy === option
                ? "bg-accent text-accent-content font-bold"
                : "bg-secondary hover:bg-secondary/80"
            }`}
            onClick={() => setSortBy(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {locationFilter &&
        locationFilter.allLocations.sort(
          (a, b) =>
            locationFilter.countsPerLocation[b] -
            locationFilter.countsPerLocation[a]
        ).length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => locationFilter.setSelectedLocation(null)}
              className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80"
            >
              <X size={16} />
            </button>
            <div className="flex w-full gap-2 items-center overflow-x-auto">
              {locationFilter.allLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => locationFilter.setSelectedLocation(location)}
                  className={`min-w-max p-1 pr-3 flex items-center gap-2 rounded-full text-sm ${
                    locationFilter.selectedLocation === location
                      ? "bg-accent text-accent-content font-bold"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  <span className="text-xs bg-black/20 text-white font-bold w-6 h-6 flex items-center justify-center aspect-square rounded-full">
                    {locationFilter.countsPerLocation[location] || 0}
                  </span>
                  {location}
                </button>
              ))}
            </div>
          </div>
        )}

      {specialFilter && (
        <div className="flex gap-2">
          <button
            onClick={() =>
              specialFilter.setFilterShiny(!specialFilter.filterShiny)
            }
            className={`min-w-max p-1 px-3 flex items-center gap-2 rounded-full text-sm ${
              specialFilter.filterShiny
                ? "bg-yellow-400 text-yellow-900 font-bold"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            Shiny
          </button>
          <button
            onClick={() =>
              specialFilter.setFilterLegendary(!specialFilter.filterLegendary)
            }
            className={`min-w-max p-1 px-3 flex items-center gap-2 rounded-full text-sm ${
              specialFilter.filterLegendary
                ? "bg-purple-500 text-white font-bold"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            Legendary
          </button>
        </div>
      )}

      {children}
    </div>
  );
};

export default GenericFilterControls;
