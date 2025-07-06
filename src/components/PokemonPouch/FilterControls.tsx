import { ChevronsUpDown, X } from "lucide-react";
import React, { useState } from "react";
import { SortBy, SortDirection } from "../../hooks/usePokemonSortAndFilter";
import TypeBadge from "../TypeBadge/TypeBadge";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import GenericFilterControls from "../ui/GenericFilterControls";

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
  filterShiny: boolean;
  setFilterShiny: (value: boolean) => void;
  filterLegendary: boolean;
  setFilterLegendary: (value: boolean) => void;
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
  countsPerLocation,
  selectedTypes,
  toggleTypeFilter,
  setSelectedTypes,
  allLocations,
  selectedLocation,
  setSelectedLocation,
  filterShiny,
  setFilterShiny,
  filterLegendary,
  setFilterLegendary,
}) => {
  const [open, setOpen] = useState(false);
  const sortOptions: SortBy[] = ["cp", "level", "name", "id", "recent"];

  return (
    <div className="flex flex-col w-full border-b border-divider">
      <div className="px-4 pb-2">
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
            className="w-full bg-primary/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
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
            >
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
            </GenericFilterControls>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterControls;
