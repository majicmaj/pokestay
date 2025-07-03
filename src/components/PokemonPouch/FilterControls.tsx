import { ArrowDown, ArrowUp, X } from "lucide-react";
import React from "react";
import { SortBy, SortDirection } from "../../hooks/usePokemonSortAndFilter";
import TypeBadge from "../TypeBadge/TypeBadge";

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  allTypes: string[];
  selectedTypes: string[];
  toggleTypeFilter: (type: string) => void;
  setSelectedTypes: (types: string[]) => void;
  allLocations: string[];
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  allTypes,
  selectedTypes,
  toggleTypeFilter,
  setSelectedTypes,
  allLocations,
  selectedLocation,
  setSelectedLocation,
}) => {
  const sortOptions: SortBy[] = ["cp", "level", "name", "id", "recent"];

  return (
    <div className="w-full p-4 flex flex-col gap-4 bg-gray-100 rounded-b-xl dark:bg-dark-primary">
      <input
        value={searchTerm}
        autoFocus
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-2 bg-white dark:bg-gray-800 w-full rounded-full border border-gray-300 dark:bg-dark-secondary dark:border-gray-600 dark:text-white"
        placeholder="Search Pokemon by name or type"
      />
      <div className="flex w-full gap-2 text-sm items-center">
        <span className="font-semibold">Sort by:</span>
        {sortOptions.map((option) => (
          <button
            key={option}
            className={`px-2 py-1 rounded-full ${
              sortBy === option
                ? "bg-lime-300 text-lime-800"
                : "bg-gray-200 dark:bg-dark-secondary"
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
          className="p-1 rounded-full bg-gray-200 dark:bg-dark-secondary"
        >
          {sortDirection === "asc" ? (
            <ArrowUp size={16} />
          ) : (
            <ArrowDown size={16} />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <span className="font-semibold text-sm">Type:</span>
          <button
            onClick={() => setSelectedTypes([])}
            className="min-w-max border rounded-full border-transparent"
          >
            <X size={16} />
          </button>
          <div className="flex w-full gap-1 overflow-x-auto pb-2">
            {allTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleTypeFilter(type)}
                className={`border rounded-full ${
                  selectedTypes.includes(type)
                    ? "border-lime-500 opacity-100"
                    : "border-transparent opacity-70 dark:opacity-50"
                }`}
              >
                <TypeBadge type={type} />
              </button>
            ))}
          </div>
        </div>

        {allLocations.length > 0 && (
          <div className="flex gap-2 items-center">
            <span className="font-semibold text-sm">Location:</span>
            <button
              onClick={() => setSelectedLocation(null)}
              className="min-w-max border rounded-full border-transparent"
            >
              <X size={16} />
            </button>
            <div className="flex w-full gap-2 overflow-x-auto pb-2">
              {allLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`px-2 py-1 rounded-full text-xs ${
                    selectedLocation === location
                      ? "bg-blue-300 text-blue-800"
                      : "bg-gray-200 dark:bg-dark-secondary"
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterControls;
