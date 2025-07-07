import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useGameState from "../../hooks/useGameState";
import useInventory from "../../hooks/useInventory";
import usePoints from "../../hooks/usePoints";
import { usePokemonSortAndFilter } from "../../hooks/usePokemonSortAndFilter";
import { Pokemon } from "../../types";
import FilterControls from "./FilterControls";
import HeaderSection from "./Header";
import PokemonGrid from "./PokemonGrid";
import SelectedPokemon from "./SelectedPokemon";
import { AnimatePresence, motion, DragControls } from "framer-motion";

const PokemonPouch: React.FC<{ dragControls: DragControls }> = ({
  dragControls,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedPokemonUuid = location.pathname.split("/")[2] || null;

  const [gameState] = useGameState();
  const { buddyPokemon } = gameState || {};
  const [inventory] = useInventory();
  const {
    filteredPokemon,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    selectedTypes,
    setSelectedTypes,
    selectedLocation,
    setSelectedLocation,
    filterShiny,
    setFilterShiny,
    filterLegendary,
    setFilterLegendary,
  } = usePokemonSortAndFilter(inventory);
  const [points] = usePoints();

  const allTypes = Array.from(
    new Set(inventory.flatMap((pokemon: Pokemon) => pokemon.types))
  ).sort() as string[];

  const countsPerType = React.useMemo(() => {
    return allTypes.reduce((acc, type) => {
      acc[type] = inventory.filter((p) => p?.types?.includes(type))?.length;
      return acc;
    }, {} as Record<string, number>);
  }, [inventory, allTypes]);

  const allLocations = Array.from(
    new Set(
      inventory.map((p) => p.caughtLocation?.city).filter((l) => l) as string[]
    )
  ).sort();

  const countsPerLocation = React.useMemo(() => {
    return allLocations.reduce((acc, location) => {
      acc[location] = inventory.filter(
        (p) => p.caughtLocation?.city === location
      ).length;
      return acc;
    }, {} as Record<string, number>);
  }, [inventory, allLocations]);

  const toggleTypeFilter = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const buddyIndex = React.useMemo(() => {
    if (!buddyPokemon) return -1;
    return filteredPokemon.findIndex((p) => p.uuid === buddyPokemon.uuid);
  }, [filteredPokemon, buddyPokemon]);

  const selectedPokemon = filteredPokemon.find(
    (p) => p.uuid === selectedPokemonUuid
  );

  return (
    <>
      <AnimatePresence>
        {selectedPokemon && (
          <motion.div
            className="absolute inset-0 z-50"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          >
            <SelectedPokemon
              pokemon={selectedPokemon}
              pokemonList={filteredPokemon}
              onClose={() => navigate("/pouch")}
              onNavigate={(uuid) =>
                navigate(`/pouch/${uuid}`, { replace: true })
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-screen overflow-auto flex flex-col items-center bg-secondary">
        <HeaderSection
          inventoryCount={inventory.length}
          points={points}
          dragControls={dragControls}
        />
        <FilterControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          allTypes={allTypes}
          countsPerType={countsPerType}
          countsPerLocation={countsPerLocation}
          selectedTypes={selectedTypes}
          toggleTypeFilter={toggleTypeFilter}
          setSelectedTypes={setSelectedTypes}
          allLocations={allLocations}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          filterShiny={filterShiny}
          setFilterShiny={setFilterShiny}
          filterLegendary={filterLegendary}
          setFilterLegendary={setFilterLegendary}
        />

        <PokemonGrid
          pokemonList={filteredPokemon}
          buddyIndex={buddyIndex}
          onPokemonSelect={(uuid) => navigate(`/pouch/${uuid}`)}
        />
      </div>
    </>
  );
};

export default PokemonPouch;
