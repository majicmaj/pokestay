import { useState } from "react";
import PokemonCard from "./PokemonCard";
import { cn } from "../../utils/cn";
import { X } from "lucide-react";
import useInventory from "../../hooks/useInventory";
import usePoints from "../../hooks/usePoints";

interface Pokemon {
  id: number;
  name: string;
  cp: number;
  sprite: string;
  types: string[];
  isShiny: boolean;
  stats: { level: number };
}

interface PokemonGridProps {
  pokemonList: Pokemon[];
  buddyIndex: number;
  setCurrentIndex: (index: number) => void;
}

const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemonList,
  buddyIndex,
  setCurrentIndex,
}) => {
  const [bulkSelectEnabled, setBulkSelectEnabled] = useState(false);
  const [bulkSelectedPokemon, setBulkSelectedPokemon] = useState<Pokemon[]>([]);
  const [inventory, setInventory] = useInventory();
  const [points, setPoints] = usePoints();

  const handleAddToBulkSelect = (index: number) => {
    const selectedPokemon = pokemonList[index];
    if (bulkSelectedPokemon.includes(selectedPokemon)) {
      setBulkSelectedPokemon((prev) =>
        prev.filter((pokemon) => pokemon !== selectedPokemon)
      );
    } else {
      // prevent selecting buddy pokemon in bulk select
      if (buddyIndex === index) return;
      setBulkSelectedPokemon((prev) => [...prev, selectedPokemon]);
    }
  };

  const handleClick = (index: number) => {
    if (bulkSelectEnabled) {
      handleAddToBulkSelect(index);
    } else {
      setCurrentIndex(index);
    }
  };

  const isBulkSelected = (pokemon: Pokemon) => {
    if (!bulkSelectEnabled) return false;
    return bulkSelectedPokemon.includes(pokemon);
  };

  const handleLeftClick = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    setBulkSelectEnabled((prev) => {
      if (!prev) {
        setBulkSelectedPokemon([]);
      }
      handleAddToBulkSelect(i);
      return !prev;
    });
  };

  const bulkSelectTransferStardust = bulkSelectedPokemon.reduce(
    (total, pokemon) => total + 100 + pokemon.stats.level * 10,
    0
  );

  const handleBulkTransfer = () => {
    if (bulkSelectedPokemon.length === 0) return;

    const newInventory = pokemonList.filter(
      (pokemon) => !bulkSelectedPokemon.includes(pokemon)
    );

    setPoints((prevPoints) => prevPoints + bulkSelectTransferStardust);
    setInventory(newInventory);
    setBulkSelectedPokemon([]);
    setBulkSelectEnabled(false);
    alert(
      `Transferred ${bulkSelectedPokemon.length} Pokémon for ${bulkSelectTransferStardust} stardust!`
    );
  };

  return (
    <div className="grid max-w-[900px] px-4 pb-24 pt-4 gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {bulkSelectEnabled && (
        <div className="flex gap-2 justify-center items-center col-span-full text-center text-sm text-gray-500">
          <X
            className="inline cursor-pointer mr-2"
            onClick={() => {
              setBulkSelectEnabled(false);
              setBulkSelectedPokemon([]);
            }}
          />
          {bulkSelectedPokemon.length} Pokémon selected
          <button
            onClick={handleBulkTransfer}
            disabled={bulkSelectedPokemon.length === 0}
            className={cn(
              `rounded-full justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-red-500 to-rose-500 gap-2 flex items-center px-3 py-1`,
              bulkSelectedPokemon.length === 0 &&
                "opacity-50 cursor-not-allowed"
            )}
          >
            TRANSFER ({bulkSelectTransferStardust})
          </button>
        </div>
      )}
      {pokemonList.map((pokemon, i) => (
        <PokemonCard
          key={`${pokemon.id}-${pokemon.stats.level}-${pokemon.cp}-${i}`}
          pokemon={pokemon}
          isBuddy={buddyIndex === i}
          className={cn(isBulkSelected(pokemon) && "bg-red-200/80")}
          onClick={() => handleClick(i)}
          onContextMenu={(e) => handleLeftClick(e, i)}
        />
      ))}
    </div>
  );
};

export default PokemonGrid;
