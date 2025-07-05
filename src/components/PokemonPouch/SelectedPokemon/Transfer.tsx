import { useState } from "react";
import { ActionButton } from "../../ui/ActionButton";
import { Trash2 } from "lucide-react";
import { formatNumber } from "../../../utils/formatNumber";
import Stardust from "../../../assets/icons/Stardust";

export function Transfer({ onTransfer }: { onTransfer: () => void }) {
  const [confirmTransfer, setConfirmTransfer] = useState(false);
  return (
    <div className="bg-card rounded-lg p-4">
      <h2 className="text-lg font-bold mb-2">Transfer Pokémon</h2>
      <p className="text-sm mb-4">
        Are you sure you want to transfer this Pokémon? This action cannot be
      </p>
      <ActionButton
        onClick={() => setConfirmTransfer(true)}
        disabled={false}
        icon={<Trash2 size={20} />}
        label="Transfer"
        className="bg-gradient-to-r from-red-500 to-rose-500 text-white"
        isConfirming={confirmTransfer}
        onConfirm={onTransfer}
        onCancel={() => setConfirmTransfer(false)}
        confirmLabel={
          <div className="flex items-center gap-1">
            <Stardust className="w-5 h-5" />+{formatNumber(0)}
          </div>
        }
      />
    </div>
  );
}
