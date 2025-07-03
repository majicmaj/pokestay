import React from "react";
import { Pokemon } from "../../../types";
import { capitalize } from "../../../utils/capitalize";

interface InfoProps {
  pokemon: Pokemon;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between text-sm">
    <p className="opacity-70">{label}</p>
    <p>{value}</p>
  </div>
);

const Info: React.FC<InfoProps> = ({ pokemon }) => {
  return (
    <div className="flex flex-col gap-2 w-full bg-primary rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-bold text-center mb-2">Details</h3>
      <InfoRow
        label="Caught Date"
        value={
          pokemon?.caughtAt
            ? new Date(pokemon.caughtAt).toLocaleDateString()
            : "Unknown"
        }
      />
      <InfoRow
        label="Location"
        value={`${pokemon?.caughtLocation?.city || "Unknown"}, ${
          pokemon?.caughtLocation?.country || ""
        }`}
      />
      <InfoRow label="Rarity" value={capitalize(pokemon.rarity)} />
      <InfoRow label="Pokédex ID" value={`#${pokemon.id}`} />
    </div>
  );
};

export default Info;
