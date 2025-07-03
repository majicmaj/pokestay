import React, { useState } from "react";
import { Pokemon } from "../../../types";
import { Gem, Sparkles, UserRoundCheck, UserRoundPlus } from "lucide-react";
import { LEGENDARY_POKEMON_IDS } from "../../../constants/legendaryPokemonIds";
import TypeBadge from "../../TypeBadge/TypeBadge";

interface NameProps {
  pokemon: Pokemon;
  isBuddyPokemon: boolean;
  handleMakeBuddy: () => void;
  handleRemoveBuddy: () => void;
  setPokemon: (pokemon: Pokemon) => void;
}

const Name: React.FC<NameProps> = ({
  pokemon,
  isBuddyPokemon,
  handleMakeBuddy,
  handleRemoveBuddy,
  setPokemon,
}) => {
  const isLegendary = LEGENDARY_POKEMON_IDS.includes(pokemon.id);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(pokemon.display_name);

  const handleSave = () => {
    setPokemon({ ...pokemon, display_name: displayName });
    setIsEditing(false);
  };

  return (
    <>
      <div className="relative max-w-96 w-full flex py-8 mb-[-32px] max-h-96 aspect-square flex-col justify-between items-center">
        <div className="relative z-10 text-accent-content bg-secondary px-2 rounded-full">
          <span className="text-sm font-medium opacity-60 pr-1">CP</span>
          <span className="text-4xl">{pokemon.cp}</span>
        </div>
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="animate-bounce-slow pixelated absolute p-24 bottom-0 aspect-square size-96 min-w-96 object-contain"
        />
        <div className="relative flex items-center flex-col">
          <div className="font-semibold text-3xl mt-[-16px] flex items-center bg-secondary px-2 rounded-full">
            {pokemon.isShiny && <Sparkles className="w-8" />}
            {isLegendary && <Gem />}
            {isEditing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onBlur={handleSave}
                autoFocus
                className="bg-transparent text-center"
              />
            ) : (
              <span onClick={() => setIsEditing(true)}>
                {pokemon.display_name}
              </span>
            )}
            <button
              onClick={isBuddyPokemon ? handleRemoveBuddy : handleMakeBuddy}
              className={`ml-2 justify-center rounded-full text-xl border gap-2 flex items-center p-1 transition-colors active:scale-110 ${
                isBuddyPokemon
                  ? "bg-accent border-lime-300 bg-gradient-to-r from-lime-200 to-teal-200 drop-shadow-lg"
                  : "border-accent-content bg-accent/50 drop-shadow-none"
              }`}
            >
              {isBuddyPokemon ? <UserRoundCheck /> : <UserRoundPlus />}
            </button>
          </div>
          <p className="text-sm">
            {pokemon.stats.hp} HP / Lv.{pokemon.stats.level}
          </p>
        </div>
      </div>
      <div className="flex gap-1 rounded-full">
        {pokemon.types.map((type) => (
          <div key={type} className="flex flex-col items-center w-24">
            <TypeBadge key={type} type={type} />
            <p>{type.slice(0, 1).toUpperCase() + type.slice(1)}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Name;
