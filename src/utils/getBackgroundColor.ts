import { Pokemon, WildPokemonState } from "../types";

export const getBackgroundColor = (
  currentPokemon: WildPokemonState | Pokemon | null
) => {
  if (!currentPokemon?.types?.[0]) return "bg-nature dark:bg-gray-800";
  const typeColors: Record<string, string> = {
    normal:
      "bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-700 dark:to-gray-900",
    fire: "bg-gradient-to-br from-red-400 to-orange-600 dark:from-red-700 dark:to-orange-900",
    water:
      "bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-700 dark:to-blue-900",
    grass:
      "bg-gradient-to-br from-lime-400 to-lime-600 dark:from-lime-700 dark:to-lime-900",
    electric:
      "bg-gradient-to-br from-yellow-300 to-yellow-500 dark:from-yellow-600 dark:to-yellow-800",
    ice: "bg-gradient-to-br from-cyan-300 to-cyan-500 dark:from-cyan-600 dark:to-cyan-800",
    fighting:
      "bg-gradient-to-br from-red-600 to-red-800 dark:from-red-800 dark:to-red-900",
    poison:
      "bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-700 dark:to-purple-900",
    ground:
      "bg-gradient-to-br from-amber-600 to-amber-800 dark:from-amber-800 dark:to-amber-900",
    flying:
      "bg-gradient-to-br from-indigo-300 to-indigo-500 dark:from-indigo-600 dark:to-indigo-800",
    psychic:
      "bg-gradient-to-br from-pink-400 to-pink-600 dark:from-pink-700 dark:to-pink-900",
    bug: "bg-gradient-to-br from-lime-400 to-lime-600 dark:from-lime-700 dark:to-lime-900",
    rock: "bg-gradient-to-br from-stone-400 to-stone-600 dark:from-stone-700 dark:to-stone-900",
    ghost:
      "bg-gradient-to-br from-violet-400 to-violet-600 dark:from-violet-700 dark:to-violet-900",
    dragon:
      "bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-800 dark:to-indigo-900",
    dark: "bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black",
    steel:
      "bg-gradient-to-br from-slate-400 to-slate-600 dark:from-slate-700 dark:to-slate-900",
    fairy:
      "bg-gradient-to-br from-pink-300 to-pink-500 dark:from-pink-600 dark:to-pink-800",
  };
  return (
    typeColors[currentPokemon.types[0]] ||
    "bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-700 dark:to-gray-900"
  );
};
