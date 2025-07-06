import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, X } from "lucide-react";
import { Pokemon } from "../../../types";
import { levelUpPokemon } from "../../../utils/levelUpPokemon";
import { ActionButton } from "../../ui/ActionButton";

interface LevelUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pokemon: Pokemon;
  onConfirm: () => void;
  cost: number;
  points: number;
}

const StatRow: React.FC<{
  label: string;
  current: number | undefined;
  next: number | undefined;
}> = ({ label, current, next }) => (
  <div className="flex justify-between items-center text-lg">
    <span className="font-semibold">{label}</span>
    <div className="flex items-center gap-2">
      <span>{current ?? 0}</span>
      <ArrowRight className="w-4 h-4 text-green-500" />
      <span className="font-bold text-green-400">{next ?? 0}</span>
    </div>
  </div>
);

const LevelUpModal: React.FC<LevelUpModalProps> = ({
  open,
  onOpenChange,
  pokemon,
  onConfirm,
  cost,
  points,
}) => {
  const nextLevelPokemon = levelUpPokemon(pokemon);
  const canAfford = points >= cost;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-primary p-6 text-content shadow-lg data-[state=open]:animate-contentShow">
          <Dialog.Title className="pixelated-font mb-4 text-center text-3xl font-bold">
            Level Up
          </Dialog.Title>
          <Dialog.Close asChild>
            <button className="absolute right-4 top-4">
              <X />
            </button>
          </Dialog.Close>

          <div className="flex flex-col items-center gap-4">
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className="size-28 object-contain pixelated"
            />
            <div className="grid grid-cols-2 gap-2 text-center text-2xl font-bold">
              <div>
                <span>Lvl {pokemon.stats.level}</span>
              </div>
              <div>
                <span className="text-green-400">
                  Lvl {nextLevelPokemon.stats.level}
                </span>
              </div>
            </div>
            <div className="w-full space-y-2 rounded-lg bg-secondary p-4">
              <StatRow
                label="CP"
                current={pokemon.cp ?? 0}
                next={nextLevelPokemon.cp ?? 0}
              />
              <StatRow
                label="HP"
                current={pokemon.stats.hp}
                next={nextLevelPokemon.stats.hp}
              />
              <StatRow
                label="Attack"
                current={pokemon.stats.attack}
                next={nextLevelPokemon.stats.attack}
              />
              <StatRow
                label="Defense"
                current={pokemon.stats.defense}
                next={nextLevelPokemon.stats.defense}
              />
            </div>
            <ActionButton
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              disabled={!canAfford}
              label="Level Up"
              cost={cost}
              points={points}
              className="w-full bg-gradient-to-r from-lime-500 to-teal-500 text-white"
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LevelUpModal;
