import { Sparkles } from "lucide-react";
import React, { useState } from "react";
import Pokeball from "../../assets/icons/Pokeball";
import Stardust from "../../assets/icons/Stardust";
import useGameState from "../../hooks/useGameState";
import useInventory from "../../hooks/useInventory";
import { Pokemon } from "../../types";
import SelectedPokemon from "./SelectedPokemon";

type SortBy = "level" | "recent" | "name" | "cp" | "id";
const PokemonPouch: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const [gameState] = useGameState();
  const { buddyPokemon, points } = gameState || {};
  const [inventory] = useInventory();

  const sortedPokemon = [...inventory]?.sort((a, b) => {
    switch (sortBy) {
      case "cp":
        return (b.cp || 0) - (a.cp || 0);
      case "id":
        return a.id - b.id;
      case "level":
        return b.stats.level - a.stats.level;
      case "name":
        return a.name.localeCompare(b.name);
      case "recent":
      default:
        return 0; // Assumes the array is already in chronological order
    }
  });

  const filteredPokemon = sortedPokemon.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.types.some((type: string) =>
        type.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const buddyIndex = buddyPokemon
    ? filteredPokemon.findIndex(
        (p) =>
          p.id === buddyPokemon.id && p.stats.level === buddyPokemon.stats.level
      )
    : -1;

  return (
    <>
      {selectedPokemon && (
        <SelectedPokemon
          pokemon={filteredPokemon[currentIndex]}
          setSelectedPokemon={setSelectedPokemon}
          pokemonList={filteredPokemon}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}
      <div className="h-screen overflow-auto flex flex-col items-center">
        <div className="pt-8 w-full grid grid-cols-3 gap-4 place-items-center">
          <div className="flex items-center gap-1">
            <Pokeball className="w-6 h-6" />
            {inventory.length}
          </div>
          <h1 className="text-md text-center">POKEMON</h1>
          <div className="flex items-center gap-1">
            <Stardust className="w-6 h-6" />
            {points}
          </div>
        </div>
        <div className="w-full p-4 px-8 flex flex-col gap-2">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 bg-lime-200 w-full rounded-full"
          />
          <div className="flex w-full gap-4 text-sm">
            <p className="opacity-60">Sort By</p>
            <button
              className={sortBy === "cp" ? "underline" : ""}
              onClick={() => setSortBy("cp")}
            >
              CP
            </button>
            <button
              className={sortBy === "level" ? "underline" : ""}
              onClick={() => setSortBy("level")}
            >
              Level
            </button>
            <button
              className={sortBy === "name" ? "underline" : ""}
              onClick={() => setSortBy("name")}
            >
              Name
            </button>
            <button
              className={sortBy === "id" ? "underline" : ""}
              onClick={() => setSortBy("id")}
            >
              ID
            </button>
            <button
              className={sortBy === "recent" ? "underline" : ""}
              onClick={() => setSortBy("recent")}
            >
              Recent
            </button>
          </div>
        </div>
        <div className="grid max-w-[900px] px-4 pb-24 pt-4 gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6gap-3">
          {filteredPokemon.map((pokemon, i) => (
            <div
              key={`${pokemon.id}-${pokemon.stats.level}`}
              className={`flex flex-col items-center ${
                buddyIndex === i ? "bg-lime-200/80" : ""
              } rounded-lg p-2 cursor-pointer`}
              onClick={() => setSelectedPokemon(pokemon)}
            >
              <div className="mb-[-12px]">
                <span className="text-sm font-medium opacity-60 pr-1">CP</span>

                <span className="text-xl font-bold">{pokemon.cp}</span>
              </div>
              <div className="h-full w-full aspect-square flex items-center justify-center">
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="pixelated w-full h-full aspect-square object-contain"
                />
              </div>
              <div className="font-semibold mt-[-16px] flex items-center">
                {pokemon.isShiny && <Sparkles className="w-4" />}
                {pokemon.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PokemonPouch;
