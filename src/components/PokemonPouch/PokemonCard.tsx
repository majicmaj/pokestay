import { Sparkles } from "lucide-react";

interface PokemonCardProps {
  pokemon: {
    name: string;
    cp: number;
    sprite: string;
    isShiny: boolean;
    stats: { level: number };
  };
  isBuddy: boolean;
  onClick: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isBuddy,
  onClick,
}) => {
  return (
    <div
      className={`flex flex-col items-center ${
        isBuddy ? "bg-lime-200/80" : ""
      } rounded-lg p-2 cursor-pointer`}
      onClick={onClick}
    >
      <div className="mb-[-12px]">
        <span className="text-sm font-medium opacity-60 pr-1">CP</span>
        <span className="text-xl font-bold">{pokemon.cp}</span>
      </div>
      <div className="h-full w-full aspect-square flex items-center justify-center">
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="pixelated w-full h-full aspect-square object-contain"
        />
      </div>
      <div className="font-semibold mt-[-16px] flex items-center">
        {pokemon.isShiny && <Sparkles className="w-4" />}
        {pokemon.name}
      </div>
    </div>
  );
};

export default PokemonCard;
