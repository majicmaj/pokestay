import { Sparkles } from "lucide-react";
import { Pokemon } from "../../types";
import { cn } from "../../utils/cn";

interface PokemonCardProps {
  pokemon: Pokemon;
  isBuddy: boolean;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  className?: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isBuddy,
  onClick,
  onContextMenu = () => {},
  className = "",
}) => {
  return (
    <div
      className={cn(
        `flex flex-col items-center rounded-lg p-2 cursor-pointer`,
        isBuddy ? "bg-lime-200/80" : "",
        className
      )}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="z-10 mb-[-12px] bg-white/80 px-2 rounded-full">
        <span className="text-sm font-medium opacity-60 pr-1">CP</span>
        <span className="text-xl font-bold">{pokemon.cp || 0}</span>
      </div>
      <div className="h-full w-full aspect-square flex items-center justify-center">
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="pixelated w-full h-full aspect-square object-contain p-4"
        />
      </div>
      <div className="font-semibold mt-[-16px] flex items-center bg-white/80 px-2 rounded-full">
        {pokemon.isShiny && <Sparkles className="w-4" />}
        {pokemon.name}
      </div>
    </div>
  );
};

export default PokemonCard;
