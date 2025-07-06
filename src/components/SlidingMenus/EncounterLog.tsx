import { AnimatePresence, motion, DragControls } from "framer-motion";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useEncounterLog from "../../hooks/useEncounterLog";
import { useEncounterLogSortAndFilter } from "../../hooks/useEncounterLogSortAndFilter";
import useInventory from "../../hooks/useInventory";
import EncounterLogFilterControls from "./EncounterLogFilterControls";
import { ChevronsUpDown, ExternalLink, HelpCircle, MapPin } from "lucide-react";
import PokeballIcon from "../../assets/icons/Pokeball";
import Stardust from "../../assets/icons/Stardust";

const EncounterLog: React.FC<{ dragControls: DragControls }> = ({
  dragControls,
}) => {
  const { log } = useEncounterLog();
  const [inventory] = useInventory();
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
    filterShiny,
    setFilterShiny,
    filterLegendary,
    setFilterLegendary,
  } = useEncounterLogSortAndFilter(log);

  const allLocations = useMemo(
    () =>
      Array.from(
        new Set(
          log.map((entry) => entry.location?.city).filter(Boolean) as string[]
        )
      ).sort(),
    [log]
  );

  const countsPerLocation = useMemo(() => {
    return allLocations.reduce((acc, location) => {
      acc[location] = log.filter(
        (entry) => entry.location?.city === location
      ).length;
      return acc;
    }, {} as Record<string, number>);
  }, [log, allLocations]);

  return (
    <div className="h-full  overflow-y-auto flex flex-col bg-secondary text-content">
      <motion.div
        onPointerDown={(e) => dragControls.start(e)}
        className="w-full flex flex-col items-center pt-3 pb-2 cursor-grab touch-none"
      >
        <div className="w-12 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full mb-2" />
        <h2 className="text-2xl font-bold pixelated-font text-center tracking-wide">
          Encounters
        </h2>
      </motion.div>
      <div className="px-4 border-b border-divider">
        <button
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          className="bg-accent text-accent-content px-4 py-2 rounded-lg w-full mt-2 flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-accent/80"
        >
          <ChevronsUpDown className="w-5 h-5" />
          {filtersExpanded ? "Hide Filters" : "Search & Filter"}
        </button>
      </div>
      <AnimatePresence>
        {filtersExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-primary/50"
          >
            <EncounterLogFilterControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              allLocations={allLocations}
              countsPerLocation={countsPerLocation}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              filterShiny={filterShiny}
              setFilterShiny={setFilterShiny}
              filterLegendary={filterLegendary}
              setFilterLegendary={setFilterLegendary}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="p-4 flex-grow">
        {filteredAndSortedLog.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <HelpCircle className="w-16 h-16 mb-4" />
            <p className="text-xl font-semibold">No Encounters Found</p>
            <p>Try adjusting your filters or go catch some Pokémon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedLog.map((entry, index) => {
              const pokemonInInventory = inventory.find(
                (p) => p.uuid === entry.pokemonUuid
              );
              const statusColor =
                entry.status === "caught"
                  ? "text-green-500"
                  : "text-yellow-500";
              const statusText =
                entry.status.charAt(0).toUpperCase() + entry.status.slice(1);

              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-lg bg-primary shadow-sm"
                >
                  <img
                    src={entry.pokemonSprite}
                    alt={entry.pokemonName}
                    className="size-28 object-contain bg-black/10 rounded-lg p-1"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg">{entry.pokemonName}</p>
                        <p className={`text-sm font-semibold ${statusColor}`}>
                          {statusText}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>

                    <div className="text-sm flex gap-2 flex-wrap mt-2 text-content/80">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">CP</span> {entry.cp}
                      </div>
                      <div className="flex items-center gap-2">
                        <PokeballIcon className="w-3.5 h-3.5 scale-150" />
                        {entry.throws}
                      </div>
                      {entry.status === "caught" && (
                        <div className="flex items-center gap-2 text-yellow-500">
                          <Stardust />+{entry.stardust}
                        </div>
                      )}
                      {entry.location?.city && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" />
                          {entry.location.city}
                        </div>
                      )}
                    </div>

                    {entry.pokemonUuid &&
                      (pokemonInInventory ? (
                        <Link
                          to={`/pouch/${entry.pokemonUuid}`}
                          className="text-blue-500 hover:underline text-sm mt-2 inline-flex items-center gap-1"
                        >
                          View in Pouch <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <p className="text-sm text-gray-500 italic mt-2">
                          Transferred
                        </p>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EncounterLog;
