import React, { useState } from "react";
import { cn } from "../../../utils/cn";
import Stardust from "../../../assets/icons/Stardust";
import { formatNumber } from "../../../utils/formatNumber";
import { ArrowUp, ArrowRight, Trash2 } from "lucide-react";

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

const ActionButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
  cost?: number;
  points?: number;
  className?: string;
  isConfirming?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
}> = ({
  onClick,
  disabled,
  icon,
  label,
  cost,
  points,
  className,
  isConfirming,
  onConfirm,
  onCancel,
  confirmLabel,
}) => {
  if (isConfirming) {
    return (
      <div className="flex gap-2 w-full">
        <button
          onClick={onConfirm}
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-transform active:scale-95"
        >
          {confirmLabel}
        </button>
        <button
          onClick={onCancel}
          className="w-full flex items-center justify-center gap-2 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-transform active:scale-95"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center justify-between bg-secondary/80 p-3 rounded-lg transition-transform active:scale-95",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-bold">{label}</span>
      </div>
      {cost !== undefined && points !== undefined && (
        <div className="flex items-center gap-1 text-sm">
          <Stardust className="w-5 h-5" />
          <span className={cn(points < cost && "text-danger")}>
            {formatNumber(cost)}
          </span>
        </div>
      )}
    </button>
  );
};

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
    <div className="w-full bg-primary rounded-lg p-4 shadow-md flex flex-col gap-3">
      <h3 className="text-lg font-bold text-center mb-1">Actions</h3>
      <ActionButton
        onClick={levelUp}
        disabled={isLevelUpDisabled}
        icon={<ArrowUp size={20} />}
        label="Level Up"
        cost={levelUpCost}
        points={points}
        className="bg-gradient-to-r from-lime-500 to-teal-500 text-white"
      />
      <ActionButton
        onClick={evolve}
        disabled={!canEvolve}
        icon={<ArrowRight size={20} />}
        label="Evolve"
        cost={evolutionCost}
        points={points}
        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
      />
      <ActionButton
        onClick={() => setConfirmTransfer(true)}
        disabled={false}
        icon={<Trash2 size={20} />}
        label="Transfer"
        className="bg-gradient-to-r from-red-500 to-rose-500 text-white"
        isConfirming={confirmTransfer}
        onConfirm={transferPokemon}
        onCancel={() => setConfirmTransfer(false)}
        confirmLabel={`+${formatNumber(transferStardust)} Stardust`}
      />
    </div>
  );
};

export default Actions;
