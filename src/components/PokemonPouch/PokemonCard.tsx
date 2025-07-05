import { Sparkles } from "lucide-react";
import { Pokemon } from "../../types";
import { cn } from "../../utils/cn";
import { LEGENDARY_POKEMON_IDS } from "../../constants/legendaryPokemonIds";
import Icon from "../../assets/icons/Icon";

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
  const isLegendary = LEGENDARY_POKEMON_IDS.includes(pokemon.id);
  return (
    <div
      className={cn(
        `flex flex-col items-center rounded-lg p-2 cursor-pointer bg-primary`,
        isBuddy ? "bg-accent/80" : "",
        className
      )}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="z-10 bg-card px-2 rounded-full text-center">
        <div>
          <span className="text-sm font-medium opacity-60 pr-1">CP</span>
          <span className="text-xl font-bold text-foreground">
            {pokemon.cp || 0}
          </span>
        </div>
      </div>
      <div className="text-xs opacity-60">#{pokemon.id}</div>
      <div className="h-full w-full aspect-square flex items-center justify-center">
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="pixelated w-full h-full aspect-square object-contain p-4"
        />
      </div>
      <div className="relative text-center">
        <div className="inline-block">
          <h2 className="font-semibold mt-[-16px] flex items-center bg-card px-2 rounded-full gap-1">
            {pokemon.name}
            {pokemon.isShiny && (
              <Sparkles className="w-4 h-4 text-yellow-400" />
            )}
            {isLegendary && (
              <Icon name="legendary" className="w-4 text-orange-400" />
            )}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
