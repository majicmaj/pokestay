import React from "react";
import { Pokemon } from "../../../types";

interface StatsProps {
  stats: Pokemon["stats"];
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="bg-primary p-4 rounded-xl grid grid-cols-3 place-items-center gap-4 px-2 pb-4 w-full">
      <div className="grid place-items-center">
        <p className="font-bold text-md">{stats.attack}</p>
        <p className="opacity-80 text-sm">Attack</p>
      </div>
      <div className="grid place-items-center">
        <p className="font-bold text-md">{stats.defense}</p>
        <p className="opacity-80 text-sm">Defense</p>
      </div>
      <div className="grid place-items-center">
        <p className="font-bold text-md">{stats.speed}</p>
        <p className="opacity-80 text-sm">Speed</p>
      </div>
    </div>
  );
};

export default Stats;
