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
  const [selectedPokemonUuid, setSelectedPokemonUuid] = useState<string | null>(
    null
  );

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

  const selectedPokemon = filteredPokemon.find(
    (p) => p.uuid === selectedPokemonUuid
  );

  return (
    <>
      {selectedPokemon && (
        <SelectedPokemon
          pokemon={selectedPokemon}
          pokemonList={filteredPokemon}
          setCurrentUuid={setSelectedPokemonUuid}
        />
      )}
      <div className="h-screen overflow-auto flex flex-col items-center bg-secondary">
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
        />

        <PokemonGrid
          pokemonList={filteredPokemon}
          buddyIndex={buddyIndex}
          onPokemonSelect={setSelectedPokemonUuid}
        />
      </div>
    </>
  );
};

export default PokemonPouch;
