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
    <div className="flex items-center gap-2 text-sm font-bold text-foreground/80 mb-2 px-2">
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
          className="bg-primary text-accent-content px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-accent/80"
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
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
              </div>
              <input
                value={searchTerm}
                autoFocus
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card w-full rounded-full border border-border focus:border-accent focus:ring-accent"
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
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-semibold capitalize",
                      sortBy === option
                        ? "bg-accent text-accent-foreground"
                        : "bg-card hover:bg-card/80"
                    )}
                    onClick={() => setSortBy(option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }
                  className="p-2 rounded-full bg-card hover:bg-card/80"
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
                    className="p-1.5 rounded-full bg-card hover:bg-card/80"
                  >
                    <X size={16} />
                  </button>
                  <div className="flex w-full gap-2 overflow-x-auto pb-2">
                    {allLocations.map((location) => (
                      <button
                        key={location}
                        onClick={() => setSelectedLocation(location)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-semibold capitalize",
                          selectedLocation === location
                            ? "bg-accent text-accent-foreground"
                            : "bg-card hover:bg-card/80"
                        )}
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
                  className="p-1.5 rounded-full bg-card hover:bg-card/80"
                >
                  <X size={16} />
                </button>
                <div className="flex w-full gap-2 overflow-x-auto pt-2">
                  {allTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleTypeFilter(type)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold capitalize",
                        selectedTypes.includes(type)
                          ? "bg-accent text-accent-foreground"
                          : "bg-card hover:bg-card/80"
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
