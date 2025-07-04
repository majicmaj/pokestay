import { ActionButton } from "../../ui/ActionButton";

interface ActionsProps {
  levelUp: () => void;
  isLevelUpDisabled: boolean;
  levelUpCost: number;
  points: number;
  evolve: () => void;
  canEvolve: boolean | null;
  evolutionCost: number;
}

const Actions: React.FC<ActionsProps> = ({
  levelUp,
  isLevelUpDisabled,
  levelUpCost,
  points,
  evolve,
  canEvolve,
  evolutionCost,
}) => {
  return (
    <div className="w-full bg-primary rounded-lg p-4 shadow-md flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-2">
        <ActionButton
          onClick={levelUp}
          disabled={isLevelUpDisabled}
          label="Level Up"
          cost={levelUpCost}
          points={points}
          className="bg-gradient-to-r from-lime-500 to-teal-500 text-white"
        />
        <ActionButton
          onClick={evolve}
          disabled={!canEvolve}
          label="Evolve"
          cost={evolutionCost}
          points={points}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        />
      </div>
    </div>
  );
};

export default Actions;
