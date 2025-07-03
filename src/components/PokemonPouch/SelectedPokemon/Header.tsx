import { Gem, Sparkles, UserRoundCheck, UserRoundPlus, X } from "lucide-react";
import React, { useState } from "react";
import { Pokemon } from "../../../types";
import { LEGENDARY_POKEMON_IDS } from "../../../constants/legendaryPokemonIds";
import TypeBadge from "../../TypeBadge/TypeBadge";
import { cn } from "../../../utils/cn";

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
        "relative w-full flex flex-col items-center p-4 pb-2 rounded-xl text-white"
      )}
    >
      <img
        src={pokemon.sprite}
        alt={pokemon.name}
        className="animate-bounce-slow pixelated w-48 h-48 object-contain drop-shadow-lg"
      />
      <div className="relative flex items-center flex-col gap-2">
        <div className="font-semibold text-3xl flex items-center gap-2 bg-black/20 px-4 py-1 rounded-full">
          {pokemon.isShiny && <Sparkles className="w-8 h-8 text-yellow-300" />}
          {isLegendary && <Gem className="w-8 h-8 text-cyan-300" />}
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
        <p className="text-sm bg-black/20 px-2 rounded-full">
          {pokemon.stats.hp} HP / Lv.{pokemon.stats.level} / CP {pokemon.cp}
        </p>
      </div>
      <div className="flex gap-2 mt-2">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
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
