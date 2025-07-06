import {
  ArrowDown,
  ArrowUp,
  X,
  Search,
  ListFilter,
  Map,
  Tags,
  ChevronsUpDown,
} from "lucide-react";
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
  countsPerLocation: Record<string, number>;
  selectedTypes: string[];
  toggleTypeFilter: (type: string) => void;
  setSelectedTypes: (types: string[]) => void;
  allLocations: string[];
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
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

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  allTypes,
  countsPerType,
  countsPerLocation,
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
    <div className="flex flex-col w-full border-b border-divider">
      <div className="p-4">
        <button
          onClick={() => setOpen(!open)}
          className="bg-accent text-accent-content px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-accent/80"
        >
          <ChevronsUpDown className="w-5 h-5" />
          {open ? "Hide Filters" : "Search & Filter"}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="w-full bg-primary/50 p-4 flex flex-col gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
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

            <FilterSection
              title="Sort By"
              icon={<ListFilter className="w-4 h-4" />}
            >
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

            {allLocations
              // Sort by countsPerLocation
              .sort((a, b) => countsPerLocation[b] - countsPerLocation[a])
              .length > 0 && (
              <FilterSection
                title="Location"
                icon={<Map className="w-4 h-4" />}
              >
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

            <FilterSection title="Type" icon={<Tags className="w-4 h-4" />}>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setSelectedTypes([])}
                  className="p-1.5 rounded-full bg-secondary hover:bg-secondary/80"
                >
                  <X size={16} />
                </button>
                <div className="flex w-full p-1 gap-2 overflow-x-auto pt-2">
                  {allTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleTypeFilter(type)}
                      className={cn(
                        `relative pt-8 min-w-max rounded-full p-0.5 transition-all duration-200`,
                        selectedTypes.includes(type)
                          ? "bg-accent scale-105"
                          : "bg-transparent opacity-75 hover:opacity-100"
                      )}
                    >
                      <TypeBadge type={type} />
                      <span className="absolute text-xs -top-1 -right-1 bg-accent text-accent-content px-1.5 py-0.5 font-bold rounded-full">
                        {countsPerType[type] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </FilterSection>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterControls;
