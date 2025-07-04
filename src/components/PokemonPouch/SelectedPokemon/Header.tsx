import { Sparkles, UserRoundCheck, UserRoundPlus, X } from "lucide-react";
import React, { useState } from "react";
import { Pokemon } from "../../../types";
import { LEGENDARY_POKEMON_IDS } from "../../../constants/legendaryPokemonIds";
import TypeBadge from "../../TypeBadge/TypeBadge";
import { cn } from "../../../utils/cn";
import Icon from "../../../assets/icons/Icon";
import { getPokemonScale } from "../../../utils/getPokemonScale";

interface HeaderProps {
  pokemon: Pokemon;
  isBuddyPokemon: boolean;
  handleMakeBuddy: () => void;
  handleRemoveBuddy: () => void;
  setPokemon: (pokemon: Pokemon) => void;
  onClose: () => void;
}

const Header: React.FC<HeaderProps> = ({
  pokemon,
  isBuddyPokemon,
  handleMakeBuddy,
  handleRemoveBuddy,
  setPokemon,
  onClose,
}) => {
  const isLegendary = LEGENDARY_POKEMON_IDS.includes(pokemon.id);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(pokemon.display_name);

  const handleSave = () => {
    setPokemon({ ...pokemon, display_name: displayName });
    setIsEditing(false);
  };

  const handleReset = () => {
    setDisplayName(pokemon.name);
    setPokemon({ ...pokemon, display_name: pokemon.name });
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "relative aspect-square w-full grid place-items-center items-end text-white"
      )}
    >
      <div
        className="mt-4 max-w-[unset] relative aspect-square overflow-visible"
        style={{
          height: getPokemonScale(pokemon) * 100 + "vmin",
          width: getPokemonScale(pokemon) * 100 + "vmin",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="animate-bounce-slow pixelated h-full w-full aspect-square object-contain drop-shadow-lg"
        />
      </div>

      <div className="absolute top-4 w-full items-center flex flex-col gap-1">
        {/* Name */}
        <div className="font-semibold text-2xl flex items-center gap-2 bg-black/20 px-4 py-1 rounded-full truncate line-clamp-1">
          {pokemon.isShiny && <Sparkles className="w-8 h-8 text-yellow-300" />}
          {isLegendary && (
            <Icon name="legendary" className="w-8 h-8 text-orange-400" />
          )}
          {isEditing ? (
            <>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onBlur={handleSave}
                autoFocus
                className="bg-transparent text-center text-3xl font-semibold w-full"
              />
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleReset}
                className="text-sm text-red-300 hover:underline ml-2"
              >
                Reset
              </button>
            </>
          ) : (
            <span onClick={() => setIsEditing(true)} className="cursor-pointer">
              {pokemon.display_name}
            </span>
          )}
        </div>

        {/* Stats */}
        <p className="text-sm bg-black/20 px-2 rounded-full">
          {pokemon.stats.hp} HP / Lv.{pokemon.stats.level} / CP {pokemon.cp}
        </p>

        {/* Types */}
        <div className="flex gap-0 -mt-1.5">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </div>

      {/* Buddy Button */}
      <button
        onClick={isBuddyPokemon ? handleRemoveBuddy : handleMakeBuddy}
        className={`absolute top-4 right-4 justify-center rounded-full text-xl gap-2 flex items-center p-2 transition-colors active:scale-110 ${
          isBuddyPokemon
            ? "bg-accent text-accent-content"
            : "bg-black/20 text-white"
        }`}
      >
        {isBuddyPokemon ? (
          <UserRoundCheck size={24} />
        ) : (
          <UserRoundPlus size={24} />
        )}
      </button>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 bg-black/20 justify-center rounded-full text-xl gap-2 flex items-center p-2 transition-colors active:scale-110"
      >
        <X size={24} />
      </button>
    </div>
  );
};

export default Header;
