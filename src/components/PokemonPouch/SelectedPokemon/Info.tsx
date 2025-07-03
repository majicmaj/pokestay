import React from "react";
import { Pokemon } from "../../../types";
import { capitalize } from "../../../utils/capitalize";

interface InfoProps {
  pokemon: Pokemon;
}

const Info: React.FC<InfoProps> = ({ pokemon }) => {
  return (
    <div className="flex flex-col gap-2 w-full bg-secondary rounded-lg p-2">
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-70">Caught at:</p>
        <p className="text-sm">
          {pokemon?.caughtAt
            ? new Date(pokemon?.caughtAt || "").toLocaleDateString() || "_"
            : "_"}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-70">Location:</p>
        <p className="text-sm">
          {pokemon?.caughtLocation?.city || "_"},{" "}
          {pokemon?.caughtLocation?.country || "_"}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-70">Rarity:</p>
        <p className="text-sm">{capitalize(pokemon.rarity)}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-70">ID:</p>
        <p className="text-sm">#{pokemon.id}</p>
      </div>
    </div>
  );
};

export default Info;
