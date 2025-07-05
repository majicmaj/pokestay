import Stardust from "../../assets/icons/Stardust";
import { cn } from "../../utils/cn";
import { formatNumber } from "../../utils/formatNumber";

export const ActionButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  icon?: React.ReactNode;
  label: string;
  cost?: number;
  points?: number;
  className?: string;
  isConfirming?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: React.ReactNode | string;
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
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-bold p-3  rounded-lg transition-transform active:scale-95"
        >
          {confirmLabel}
        </button>
        <button
          onClick={onCancel}
          className="w-full flex items-center justify-center gap-2 bg-gray-500 text-white font-bold p-3 rounded-lg transition-transform active:scale-95"
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
        {icon && icon}
        <span className="font-bold min-w-max">{label}</span>
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
