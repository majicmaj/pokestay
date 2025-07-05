import React from "react";
import { Pokemon } from "../../../types";

interface StatsProps {
  stats: Pokemon["stats"];
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="bg-primary rounded-xl p-4 shadow-md w-full">
      <div className="grid grid-cols-4 place-items-center gap-4">
        <div className="grid place-items-center">
          <p className="font-bold text-md">{stats.hp}</p>
          <p className="text-foreground/60 text-sm">HP</p>
        </div>
        <div className="grid place-items-center">
          <p className="font-bold text-md">{stats.attack}</p>
          <p className="text-foreground/60 text-sm">Attack</p>
        </div>
        <div className="grid place-items-center">
          <p className="font-bold text-md">{stats.defense}</p>
          <p className="text-foreground/60 text-sm">Defense</p>
        </div>
        <div className="grid place-items-center">
          <p className="font-bold text-md">{stats.speed}</p>
          <p className="text-foreground/60 text-sm">Speed</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
