import React, { useState } from "react";
import { cn } from "../../../utils/cn";
import Stardust from "../../../assets/icons/Stardust";
import { formatNumber } from "../../../utils/formatNumber";

interface ActionsProps {
  levelUp: () => void;
  isLevelUpDisabled: boolean;
  levelUpCost: number;
  points: number;
  evolve: () => void;
  canEvolve: boolean | null;
  evolutionCost: number;
  transferPokemon: () => void;
  transferStardust: number;
}

const Actions: React.FC<ActionsProps> = ({
  levelUp,
  isLevelUpDisabled,
  levelUpCost,
  points,
  evolve,
  canEvolve,
  evolutionCost,
  transferPokemon,
  transferStardust,
}) => {
  const [confirmTransfer, setConfirmTransfer] = useState(false);

  return (
    <>
      {/* Level Up */}
      <div className="rounded-full pr-4 items-center justify-between flex gap-4 bg-secondary/80 w-full">
        <button
          onClick={levelUp}
          disabled={isLevelUpDisabled}
          className={`rounded-full w-40 justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-lime-500 to-teal-500 gap-2 flex items-center px-8 py-3 ${
            isLevelUpDisabled && "opacity-50 cursor-not-allowed"
          }`}
        >
          LEVEL UP
        </button>
        <div className="flex flex-1 items-center gap-1">
          <Stardust className="w-6 h-6" />
          <span className={`${isLevelUpDisabled && "text-danger"}`}>
            {formatNumber(levelUpCost)}
          </span>
          <span className="opacity-70">/ {formatNumber(points)}</span>
        </div>
      </div>
      {/* Evolution */}
      <div className="rounded-full pr-4 items-center justify-between flex gap-4 bg-secondary/80 w-full">
        <button
          onClick={evolve}
          disabled={!canEvolve}
          className={cn(
            `rounded-full w-40 justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-pink-500 to-purple-500 gap-2 flex items-center px-8 py-3`,
            !canEvolve && "opacity-50 cursor-not-allowed"
          )}
        >
          EVOLVE
        </button>
        <div className="flex flex-1 items-center gap-1">
          <Stardust className="w-6 h-6" />
          <span className={`${!canEvolve && "text-danger"}`}>
            {formatNumber(evolutionCost)}
          </span>
          <span className="opacity-70">/ {formatNumber(points)}</span>
        </div>
      </div>
      {/* Transfer */}
      <div className="rounded-full pr-4 items-center justify-between flex gap-4 bg-secondary/80 w-full">
        {!confirmTransfer && (
          <button
            onClick={() => setConfirmTransfer(true)}
            className={`rounded-full w-40 justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-red-500 to-rose-500 gap-2 flex items-center px-8 py-3`}
          >
            TRANSFER
          </button>
        )}
        {confirmTransfer && (
          <>
            <button
              onClick={transferPokemon}
              className={`rounded-full w-40 justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-red-500 to-rose-500 gap-2 flex items-center px-8 py-3`}
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmTransfer(false)}
              className={`rounded-full w-40 justify-center text-xl font-medium text-white bg-teal-500 bg-gradient-to-r from-lime-500 to-teal-500 gap-2 flex items-center px-8 py-3`}
            >
              CANCEL
            </button>
          </>
        )}
        <div className="flex flex-1 items-center gap-1">
          <Stardust className="w-6 h-6" />
          <span>+ {formatNumber(transferStardust)}</span>
        </div>
      </div>
    </>
  );
};

export default Actions;
