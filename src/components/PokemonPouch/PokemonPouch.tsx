import React, { useState } from "react";
import useGameState from "../../hooks/useGameState";
import useInventory from "../../hooks/useInventory";
import usePoints from "../../hooks/usePoints";
import { Pokemon } from "../../types";
import HeaderSection from "./Header";
import PokemonGrid from "./PokemonGrid";
import SearchAndSort from "./SearchAndSort";
import SelectedPokemon from "./SelectedPokemon";
import TypeFilter from "./TypeFilter";

type SortBy = "level" | "recent" | "name" | "cp" | "id";

const PokemonPouch: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [gameState] = useGameState();
  const { buddyPokemon } = gameState || {};
  const [inventory] = useInventory();
  const [points] = usePoints();

  const allTypes = Array.from(
    new Set(inventory.flatMap((pokemon: Pokemon) => pokemon.types))
  ).sort() as string[];

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes([type]);
  };

  const sortedPokemon = React.useMemo(() => {
    return [...inventory].sort((a, b) => {
      switch (sortBy) {
        case "cp":
          return (b.cp || 0) - (a.cp || 0);
        case "id":
          return a.id - b.id;
        case "level":
          return b.stats.level - a.stats.level;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [inventory, sortBy]);

  const filteredPokemon = React.useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return sortedPokemon.filter((pokemon) => {
      const matchesSearch =
        pokemon.name.toLowerCase().includes(lowerSearchTerm) ||
        pokemon.types.some((type: string) =>
          type.toLowerCase().includes(lowerSearchTerm)
        );
      const matchesTypeFilter =
        selectedTypes.length === 0 ||
        pokemon.types.some((type: string) => selectedTypes.includes(type));
      return matchesSearch && matchesTypeFilter;
    });
  }, [sortedPokemon, searchTerm, selectedTypes]);

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
      <div className="h-screen overflow-auto flex flex-col items-center">
        <HeaderSection inventoryCount={inventory.length} points={points} />
        <SearchAndSort
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <TypeFilter
          allTypes={allTypes}
          selectedTypes={selectedTypes}
          toggleTypeFilter={toggleTypeFilter}
          setSelectedTypes={setSelectedTypes}
        />
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
