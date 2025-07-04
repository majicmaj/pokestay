import { ArrowDown, ArrowUp, X } from "lucide-react";
import React, { useState } from "react";
import { SortBy, SortDirection } from "../../hooks/usePokemonSortAndFilter";
import TypeBadge from "../TypeBadge/TypeBadge";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  allTypes: string[];
  countsPerType: Record<string, number>;

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
  countsPerType,
  selectedTypes,
  toggleTypeFilter,
  setSelectedTypes,
  allLocations,
  selectedLocation,
  setSelectedLocation,
}) => {
  const [open, setOpen] = useState(false);
  const sortOptions: SortBy[] = ["cp", "level", "name", "id", "recent"];

  return (
    <div className="flex flex-col w-full">
      <div className="p-4">
        <button
          onClick={() => setOpen(!open)}
          className="bg-accent text-accent-content px-2 p-1 rounded-full w-full"
        >
          {open ? "Hide Search" : "Search Pokemon"}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="w-full bg-primary rounded-b-xl p-4 flex flex-col gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <input
              value={searchTerm}
              autoFocus
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 bg-secondary w-full rounded-full border border-border"
              placeholder="Search Pokemon by name or type"
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

            <div className="flex flex-col gap-2">
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
                            ? "bg-accent text-accent-content"
                            : "bg-secondary"
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 items-center">
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
                      className={cn(
                        `relative min-w-max border rounded-full`,
                        selectedTypes.includes(type)
                          ? "border-accent"
                          : "border-transparent opacity-70"
                      )}
                    >
                      <TypeBadge type={type} />
                      <span className="absolute text-xs top-8 left-1/2 transform -translate-x-1/2 bg-accent text-accent-content px-1 rounded-full">
                        {countsPerType[type] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterControls;
