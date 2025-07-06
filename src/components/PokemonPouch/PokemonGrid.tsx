import { useState } from "react";
import PokemonCard from "./PokemonCard";
import { cn } from "../../utils/cn";
import { X } from "lucide-react";
import useInventory from "../../hooks/useInventory";
import usePoints from "../../hooks/usePoints";
import { Pokemon } from "../../types";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import PokeBallSwitch from "../ui/PokeBallSwitch";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleToggleBulkSelect = (enabled: boolean) => {
    setBulkSelectEnabled(enabled);
    if (!enabled) {
      setBulkSelectedPokemonUuids([]);
    }
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
    setIsModalOpen(false);
    toast.success(
      `Transferred ${bulkSelectedPokemonUuids.length} Pokémon for ${bulkSelectTransferStardust} stardust!`
    );
  };

  return (
    <div className="grid max-w-[900px] px-4 pb-24 pt-4 gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      <div className="col-span-full flex items-center justify-end gap-2 text-content">
        <label htmlFor="bulk-select-toggle" className="font-semibold">
          Bulk Select
        </label>
        <PokeBallSwitch
          id="bulk-select-toggle"
          checked={bulkSelectEnabled}
          onCheckedChange={handleToggleBulkSelect}
        />
      </div>
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
              onClick={() => handleToggleBulkSelect(false)}
            />
            {bulkSelectedPokemonUuids.length} Pokémon selected
            <button
              onClick={() => setIsModalOpen(true)}
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
        />
      ))}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="z-50 fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
          <Dialog.Content className="z-50 fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-primary p-6 text-content shadow-lg data-[state=open]:animate-contentShow">
            <Dialog.Title className="text-lg font-bold">
              Confirm Transfer
            </Dialog.Title>
            <Dialog.Description className="mb-4 mt-2 text-sm">
              Are you sure you want to transfer{" "}
              {bulkSelectedPokemonUuids.length} Pokémon for{" "}
              {bulkSelectTransferStardust} stardust? This action cannot be
              undone.
            </Dialog.Description>
            <div className="flex justify-end gap-4">
              <Dialog.Close asChild>
                <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleBulkTransfer}
                className="rounded-md bg-danger px-4 py-2 text-white hover:bg-danger/90"
              >
                Confirm
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default PokemonGrid;
