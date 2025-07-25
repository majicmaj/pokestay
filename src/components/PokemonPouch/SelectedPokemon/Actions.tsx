import { Pokemon } from "../../../types";
import { ActionButton } from "../../ui/ActionButton";
import CountdownTimer from "./CountdownTimer";
import FormSwitcher from "./FormSwitcher";

interface ActionsProps {
  pokemon: Pokemon;
  onOpenLevelUpModal: () => void;
  isLevelUpDisabled: boolean;
  levelUpCost: number;
  points: number;
  onOpenEvolutionModal: () => void;
  canEvolve: boolean | null;
  evolutionCost: number;
  onOpenFormSwitchModal: () => void;
  canMegaEvolve: boolean | null;
  onOpenMegaEvolutionModal: () => void;
  megaEvolutionCost: number;
  activeMega: { revertAt: number } | undefined;
}

const Actions: React.FC<ActionsProps> = ({
  pokemon,
  onOpenLevelUpModal,
  isLevelUpDisabled,
  levelUpCost,
  points,
  onOpenEvolutionModal,
  canEvolve,
  evolutionCost,
  onOpenFormSwitchModal,
  canMegaEvolve,
  onOpenMegaEvolutionModal,
  megaEvolutionCost,
  activeMega,
}) => {
  return (
    <div className="w-full bg-primary rounded-lg p-4 shadow-md flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-2">
        <ActionButton
          onClick={onOpenLevelUpModal}
          disabled={isLevelUpDisabled}
          label="Level Up"
          cost={levelUpCost}
          points={points}
          className="bg-gradient-to-r from-lime-500 to-teal-500 text-white"
        />
        <ActionButton
          onClick={onOpenEvolutionModal}
          disabled={!canEvolve}
          label="Evolve"
          cost={evolutionCost}
          points={points}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        />
        {activeMega ? (
          <ActionButton
            onClick={() => {}}
            disabled={true}
            label={<CountdownTimer revertAt={activeMega.revertAt} />}
            className="bg-secondary text-content"
          />
        ) : (
          canMegaEvolve && (
            <ActionButton
              onClick={onOpenMegaEvolutionModal}
              disabled={!canMegaEvolve}
              label="Mega Evolve"
              cost={megaEvolutionCost}
              points={points}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white"
            />
          )
        )}
        <FormSwitcher onOpenModal={onOpenFormSwitchModal} pokemon={pokemon} />
      </div>
    </div>
  );
};

export default Actions;
