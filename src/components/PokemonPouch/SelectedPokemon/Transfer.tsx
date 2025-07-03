import { useState } from "react";
import { ActionButton } from "../../ui/ActionButton";
import { Trash2 } from "lucide-react";
import { formatNumber } from "../../../utils/formatNumber";

const Transfer: React.FC<{
  transferPokemon: () => void;
  transferStardust: number;
}> = ({ transferPokemon, transferStardust }) => {
  const [confirmTransfer, setConfirmTransfer] = useState(false);
  return (
    <div className="bg-secondary rounded-lg p-4">
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

export default Transfer;
