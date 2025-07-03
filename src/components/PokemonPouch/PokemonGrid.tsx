import { useState } from "react";
import PokemonCard from "./PokemonCard";
import { cn } from "../../utils/cn";
import { X } from "lucide-react";
import useInventory from "../../hooks/useInventory";
import usePoints from "../../hooks/usePoints";
import { Pokemon } from "../../types";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

interface PokemonGridProps {
  pokemonList: Pokemon[];
  buddyIndex: number;
  onPokemonSelect: (uuid: string) => void;
}

const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemonList,
  buddyIndex,
  onPokemonSelect,
}) => {
  const [bulkSelectEnabled, setBulkSelectEnabled] = useState(false);
  const [bulkSelectedPokemonUuids, setBulkSelectedPokemonUuids] = useState<
    string[]
  >([]);
  const [inventory, setInventory] = useInventory();
  const [points, setPoints] = usePoints();

  const bulkSelectedPokemon = pokemonList.filter((p) =>
    bulkSelectedPokemonUuids.includes(p.uuid as string)
  );

  const handleAddToBulkSelect = (pokemon: Pokemon) => {
    if (bulkSelectedPokemonUuids.includes(pokemon.uuid as string)) {
      setBulkSelectedPokemonUuids((prev) =>
        prev.filter((uuid) => uuid !== pokemon.uuid)
      );
    } else {
      // prevent selecting buddy pokemon in bulk select
      if (pokemonList[buddyIndex]?.uuid === pokemon.uuid) return;
      setBulkSelectedPokemonUuids((prev) => [...prev, pokemon.uuid as string]);
    }
  };

  const handleClick = (pokemon: Pokemon) => {
    if (bulkSelectEnabled) {
      handleAddToBulkSelect(pokemon);
    } else {
      onPokemonSelect(pokemon.uuid as string);
    }
  };

  const isBulkSelected = (pokemon: Pokemon) => {
    if (!bulkSelectEnabled) return false;
    return bulkSelectedPokemonUuids.includes(pokemon.uuid as string);
  };

  const handleLeftClick = (e: React.MouseEvent, pokemon: Pokemon) => {
    e.preventDefault();
    setBulkSelectEnabled((prev) => {
      if (!prev) {
        setBulkSelectedPokemonUuids([]);
      }
      handleAddToBulkSelect(pokemon);
      return !prev;
    });
  };

  const bulkSelectTransferStardust = bulkSelectedPokemon.reduce(
    (total, pokemon) => total + 100 + pokemon.stats.level * 10,
    0
  );

  const handleBulkTransfer = () => {
    if (bulkSelectedPokemonUuids.length === 0) return;

    const newInventory = inventory.filter(
      (pokemon: Pokemon) =>
        !bulkSelectedPokemonUuids.includes(pokemon.uuid as string)
    );

    setPoints(points + bulkSelectTransferStardust);
    setInventory(newInventory);
    setBulkSelectedPokemonUuids([]);
    setBulkSelectEnabled(false);
    alert(
      `Transferred ${bulkSelectedPokemonUuids.length} Pokémon for ${bulkSelectTransferStardust} stardust!`
    );
  };

  return (
    <div className="grid max-w-[900px] px-4 pb-24 pt-4 gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      <AnimatePresence>
        {bulkSelectEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex gap-2 justify-center items-center col-span-full text-center text-sm text-content"
          >
            <X
              className="inline cursor-pointer mr-2"
              onClick={() => {
                setBulkSelectEnabled(false);
                setBulkSelectedPokemonUuids([]);
              }}
            />
            {bulkSelectedPokemonUuids.length} Pokémon selected
            <button
              onClick={handleBulkTransfer}
              disabled={bulkSelectedPokemonUuids.length === 0}
              className={cn(
                `rounded-full justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-red-500 to-rose-500 gap-2 flex items-center px-3 py-1`,
                bulkSelectedPokemonUuids.length === 0 &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              TRANSFER{" "}
              <span className="text-xs">({bulkSelectTransferStardust})</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {pokemonList.map((pokemon, i) => (
        <PokemonCard
          key={`${pokemon.uuid}`}
          pokemon={pokemon}
          isBuddy={buddyIndex === i}
          className={cn(isBulkSelected(pokemon) && "bg-danger/80")}
          onClick={() => handleClick(pokemon)}
          onContextMenu={(e) => handleLeftClick(e, pokemon)}
        />
      ))}
    </div>
  );
};

export default PokemonGrid;
