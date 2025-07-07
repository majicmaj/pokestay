import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Pokemon, NamedAPIResource } from "../../../types";
import { createPokemonFromApi } from "../../../utils/createPokemonFromApi";
import { ActionButton } from "../../ui/ActionButton";
import { X } from "lucide-react";
import Stats from "./Stats";
import TypeBadge from "../../TypeBadge/TypeBadge";

interface FormSwitchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pokemon: Pokemon;
  varieties: NamedAPIResource[];
  onSwitch: (formName: string) => void;
  switchCost: number;
  points: number;
}

const FormSwitchModal: React.FC<FormSwitchModalProps> = ({
  open,
  onOpenChange,
  pokemon,
  varieties,
  onSwitch,
  switchCost,
  points,
}) => {
  const [previews, setPreviews] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const fetchPreviews = async () => {
      setIsLoading(true);
      const fetchedPreviews = await Promise.all(
        varieties.map(async (variety) => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${variety.name}`
          );
          const apiData = await response.json();
          return createPokemonFromApi(apiData, {
            level: pokemon.stats.level,
            ivs: pokemon.ivs,
            isShiny: pokemon.isShiny,
          });
        })
      );
      setPreviews(
        fetchedPreviews.filter((p): p is Pokemon => p !== null) as Pokemon[]
      );
      setIsLoading(false);
    };

    fetchPreviews();
  }, [open, varieties, pokemon]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] overflow-y-auto max-w-4xl h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-primary p-6 text-content shadow-lg data-[state=open]:animate-contentShow">
          <Dialog.Title className="pixelated-font mb-4 text-center text-3xl font-bold">
            Switch {pokemon.display_name}'s Form
          </Dialog.Title>
          <Dialog.Close asChild>
            <button className="absolute right-4 top-4">
              <X />
            </button>
          </Dialog.Close>
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <p>Loading forms...</p>
            </div>
          ) : (
            <div className="grid overflow-y-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {previews.map((preview) => (
                <FormCard
                  key={preview.id}
                  form={preview}
                  onSwitch={() => onSwitch(preview.name)}
                  cost={switchCost}
                  canAfford={points >= switchCost}
                  isCurrentForm={preview.name === pokemon.name}
                />
              ))}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const FormCard: React.FC<{
  form: Pokemon;
  onSwitch: () => void;
  cost: number;
  canAfford: boolean;
  isCurrentForm: boolean;
}> = ({ form, onSwitch, cost, canAfford, isCurrentForm }) => {
  return (
    <div className="flex flex-col items-center rounded-lg bg-secondary p-4 gap-1">
      <h3 className="text-xl font-bold">{form.display_name}</h3>
      <img
        src={form.sprite}
        alt={form.name}
        className="size-24 object-contain pixelated"
      />
      <div className="bg-primary rounded-full px-2 flex items-center gap-2">
        <p className="font-bold">
          <span className="text-xs font-normal text-accent-content">CP</span>{" "}
          {form.cp}
        </p>
      </div>
      <div className="flex items-center -space-x-2">
        {form.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
      <Stats stats={form.stats} />
      <div className="mt-4 w-full">
        <ActionButton
          onClick={onSwitch}
          disabled={!canAfford || isCurrentForm}
          label={isCurrentForm ? "Current Form" : "Switch"}
          cost={cost}
          points={cost}
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white"
        />
      </div>
    </div>
  );
};

export default FormSwitchModal;
