import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import useEncounterLog from "../../hooks/useEncounterLog";
import { useEncounterLogSortAndFilter } from "../../hooks/useEncounterLogSortAndFilter";
import EncounterLogFilterControls from "./EncounterLogFilterControls";

const EncounterLog = () => {
  const { log } = useEncounterLog();
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const {
    filteredAndSortedLog,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    selectedLocation,
    setSelectedLocation,
  } = useEncounterLogSortAndFilter(log);

  const allLocations = Array.from(
    new Set(
      log.map((entry) => entry.location?.city).filter(Boolean) as string[]
    )
  ).sort();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-center">Encounters</h2>
        <button
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          className="bg-accent text-accent-content px-2 p-1 rounded-full w-full mt-2"
        >
          {filtersExpanded ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
      <AnimatePresence>
        {filtersExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EncounterLogFilterControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              allLocations={allLocations}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="p-4 overflow-y-auto flex-grow">
        {filteredAndSortedLog.length === 0 ? (
          <p className="text-center text-gray-500">No matching encounters.</p>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedLog.map((entry, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-2 rounded-lg bg-primary"
              >
                <img
                  src={entry.pokemonSprite}
                  alt={entry.pokemonName}
                  className="w-16 h-16 object-contain"
                />
                <div className="flex-grow">
                  <p className="font-bold">{entry.pokemonName}</p>
                  <p className="text-sm">Throws: {entry.throws}</p>
                  <p className="text-sm">Status: {entry.status}</p>
                  {entry.status === "caught" && (
                    <p className="text-sm">Stardust: +{entry.stardust}</p>
                  )}
                  {entry.location?.city && (
                    <p className="text-sm">Location: {entry.location.city}</p>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EncounterLog;
