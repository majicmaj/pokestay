import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Pokemon, NamedAPIResource } from "../../../types";
import { createEvolvedPokemon } from "../../../utils/getEvolution";
import { ActionButton } from "../../ui/ActionButton";
import { X } from "lucide-react";
import Stats from "./Stats";

interface EvolutionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pokemon: Pokemon;
  possibleEvolutions: NamedAPIResource[];
  onEvolve: (evolutionPreview: Pokemon) => void;
  evolutionCost: number;
  points: number;
}

const EvolutionModal: React.FC<EvolutionModalProps> = ({
  open,
  onOpenChange,
  pokemon,
  possibleEvolutions,
  onEvolve,
  evolutionCost,
  points,
}) => {
  const [evolutionPreviews, setEvolutionPreviews] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const fetchPreviews = async () => {
      setIsLoading(true);
      const previews = await Promise.all(
        possibleEvolutions.map((evo) => createEvolvedPokemon(pokemon, evo.name))
      );
      setEvolutionPreviews(previews.filter((p): p is Pokemon => p !== null));
      setIsLoading(false);
    };

    fetchPreviews();
  }, [open, possibleEvolutions, pokemon]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] overflow-y-auto max-w-4xl h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-primary p-6 text-content shadow-lg data-[state=open]:animate-contentShow">
          <Dialog.Title className="pixelated-font mb-4 text-center text-3xl font-bold">
            Evolve {pokemon.display_name}
          </Dialog.Title>
          <Dialog.Close asChild>
            <button className="absolute right-4 top-4">
              <X />
            </button>
          </Dialog.Close>
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <p>Loading evolutions...</p>
            </div>
          ) : (
            <div className="grid overflow-y-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {evolutionPreviews.map((evo) => (
                <EvolutionCard
                  key={evo.id}
                  evolution={evo}
                  onEvolve={() => onEvolve(evo)}
                  cost={evolutionCost}
                  canAfford={points >= evolutionCost}
                />
              ))}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const EvolutionCard: React.FC<{
  evolution: Pokemon;
  onEvolve: () => void;
  cost: number;
  canAfford: boolean;
}> = ({ evolution, onEvolve, cost, canAfford }) => {
  return (
    <div className="flex flex-col items-center rounded-lg bg-secondary p-4 gap-1">
      <h3 className="text-xl font-bold">{evolution.display_name}</h3>
      <img
        src={evolution.sprite}
        alt={evolution.name}
        className="size-24 object-contain pixelated"
      />
      <div className="bg-primary rounded-full px-2 flex items-center gap-2">
        <p className="font-bold">
          <span className="text-xs font-normal text-accent-content">CP</span>{" "}
          {evolution.cp}
        </p>
      </div>
      <Stats stats={evolution.stats} />
      <div className="mt-4 w-full">
        <ActionButton
          onClick={onEvolve}
          disabled={!canAfford}
          label="Evolve"
          cost={cost}
          points={cost}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        />
      </div>
    </div>
  );
};

export default EvolutionModal;
