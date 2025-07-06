import {
  ArrowDown,
  ArrowUp,
  ListFilter,
  Map,
  Search,
  X,
  Sparkles,
} from "lucide-react";
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
  countsPerLocation: Record<string, number>;
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
  filterShiny: boolean;
  setFilterShiny: (value: boolean) => void;
  filterLegendary: boolean;
  setFilterLegendary: (value: boolean) => void;
}

const FilterSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="py-2">
    <div className="flex items-center gap-2 text-sm font-bold text-content/80 mb-2 px-2">
      {icon}
      <span>{title}</span>
    </div>
    {children}
  </div>
);

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

      <FilterSection title="Sort By" icon={<ListFilter className="w-4 h-4" />}>
        <div className="flex w-full gap-2 text-sm items-center overflow-x-auto pb-2">
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
        </div>
      </FilterSection>

      {allLocations.sort((a, b) => countsPerLocation[b] - countsPerLocation[a])
        .length > 0 && (
        <FilterSection title="Location" icon={<Map className="w-4 h-4" />}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedLocation(null)}
              className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80"
            >
              <X size={16} />
            </button>
            <div className="flex w-full gap-2 items-center overflow-x-auto">
              {allLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`min-w-max p-1 pr-3 flex items-center gap-2 rounded-full text-sm ${
                    selectedLocation === location
                      ? "bg-accent text-accent-content font-bold"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  <span className="text-xs bg-black/20 text-white font-bold w-6 h-6 flex items-center justify-center aspect-square rounded-full">
                    {countsPerLocation[location] || 0}
                  </span>
                  {location}
                </button>
              ))}
            </div>
          </div>
        </FilterSection>
      )}

      <FilterSection title="Special" icon={<Sparkles className="w-4 h-4" />}>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterShiny(!filterShiny)}
            className={`min-w-max p-1 pr-3 flex items-center gap-2 rounded-full text-sm ${
              filterShiny
                ? "bg-yellow-400 text-yellow-900 font-bold"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            Shiny
          </button>
          <button
            onClick={() => setFilterLegendary(!filterLegendary)}
            className={`min-w-max p-1 pr-3 flex items-center gap-2 rounded-full text-sm ${
              filterLegendary
                ? "bg-purple-500 text-white font-bold"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            Legendary
          </button>
        </div>
      </FilterSection>
    </div>
  );
};

export default EncounterLogFilterControls;
