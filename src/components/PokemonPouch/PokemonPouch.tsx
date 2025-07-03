import React, { useState } from "react";
import useGameState from "../../hooks/useGameState";
import { usePokemonSortAndFilter } from "../../hooks/usePokemonSortAndFilter";
import useInventory from "../../hooks/useInventory";
import usePoints from "../../hooks/usePoints";
import { Pokemon } from "../../types";
import HeaderSection from "./Header";
import PokemonGrid from "./PokemonGrid";
import SelectedPokemon from "./SelectedPokemon";
import FilterControls from "./FilterControls";

const PokemonPouch: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

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
  } = usePokemonSortAndFilter(inventory);
  const [points] = usePoints();

  const allTypes = Array.from(
    new Set(inventory.flatMap((pokemon: Pokemon) => pokemon.types))
  ).sort() as string[];

  const allLocations = Array.from(
    new Set(
      inventory.map((p) => p.caughtLocation?.city).filter((l) => l) as string[]
    )
  ).sort();

  const toggleTypeFilter = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const buddyIndex = React.useMemo(() => {
    if (!buddyPokemon) return -1;
    return filteredPokemon.findIndex(
      (p) =>
        p.id === buddyPokemon.id && p.stats.level === buddyPokemon.stats.level
    );
  }, [filteredPokemon, buddyPokemon]);

  const selectedPokemon = filteredPokemon[currentIndex || 0];

  return (
    <>
      {selectedPokemon && currentIndex !== null && (
        <SelectedPokemon
          pokemon={selectedPokemon}
          pokemonList={filteredPokemon}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}
      <div className="h-screen overflow-auto flex flex-col items-center bg-secondary">
        {!expanded && (
          <div className="p-4 w-full" id="search-and-sort">
            <button
              onClick={() => setExpanded(true)}
              className="bg-accent text-accent-content px-2 p-1 rounded-full w-full"
            >
              Search Pokemon
            </button>
          </div>
        )}
        {expanded && (
          <div className="w-full">
            <HeaderSection inventoryCount={inventory.length} points={points} />
            <FilterControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              allTypes={allTypes}
              selectedTypes={selectedTypes}
              toggleTypeFilter={toggleTypeFilter}
              setSelectedTypes={setSelectedTypes}
              allLocations={allLocations}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              onClose={() => setExpanded(false)}
            />
          </div>
        )}

        <PokemonGrid
          pokemonList={filteredPokemon}
          buddyIndex={buddyIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
    </>
  );
};

export default PokemonPouch;
