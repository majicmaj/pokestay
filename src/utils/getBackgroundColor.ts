import { WildPokemonState } from '../types';

export const getBackgroundColor = (currentPokemon: WildPokemonState | null) => {
  if (!currentPokemon?.types?.[0]) return 'bg-nature';
  const typeColors: Record<string, string> = {
    normal: 'bg-gradient-to-br from-gray-400 to-gray-600',
    fire: 'bg-gradient-to-br from-red-400 to-orange-600',
    water: 'bg-gradient-to-br from-blue-400 to-blue-600',
    grass: 'bg-gradient-to-br from-green-400 to-green-600',
    electric: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
    ice: 'bg-gradient-to-br from-cyan-300 to-cyan-500',
    fighting: 'bg-gradient-to-br from-red-600 to-red-800',
    poison: 'bg-gradient-to-br from-purple-400 to-purple-600',
    ground: 'bg-gradient-to-br from-amber-600 to-amber-800',
    flying: 'bg-gradient-to-br from-indigo-300 to-indigo-500',
    psychic: 'bg-gradient-to-br from-pink-400 to-pink-600',
    bug: 'bg-gradient-to-br from-lime-400 to-lime-600',
    rock: 'bg-gradient-to-br from-stone-400 to-stone-600',
    ghost: 'bg-gradient-to-br from-violet-400 to-violet-600',
    dragon: 'bg-gradient-to-br from-indigo-600 to-indigo-800',
    dark: 'bg-gradient-to-br from-gray-700 to-gray-900',
    steel: 'bg-gradient-to-br from-slate-400 to-slate-600',
    fairy: 'bg-gradient-to-br from-pink-300 to-pink-500',
  };
  return typeColors[currentPokemon.types[0]] || 'bg-nature';
};
