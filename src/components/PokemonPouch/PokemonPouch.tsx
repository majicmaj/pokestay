import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Pokemon } from '../../types';
import TypeBadge from '../TypeBadge/TypeBadge';

interface PokemonPouchProps {
  caughtPokemon: Pokemon[];
  onSelectBuddy: (pokemon: Pokemon) => void;
  currentBuddy: Pokemon | null;
}
const PokemonPouch: React.FC<PokemonPouchProps> = ({
  caughtPokemon = [],
  // onSelectBuddy,
  // currentBuddy,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'level' | 'recent' | 'name'>('recent');

  console.log(caughtPokemon)
  const sortedPokemon = [...caughtPokemon]?.sort((a, b) => {
    switch (sortBy) {
      case 'level':
        return b.stats.level - a.stats.level;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'recent':
      default:
        return 0; // Assumes the array is already in chronological order
    }
  });

  const filteredPokemon = sortedPokemon.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pokemon.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // const getTypeColor = (type: string) => {
  //   const colors: Record<string, string> = {
  //     normal: 'bg-gray-400',
  //     fire: 'bg-red-500',
  //     water: 'bg-blue-500',
  //     electric: 'bg-yellow-400',
  //     grass: 'bg-green-500',
  //     ice: 'bg-cyan-400',
  //     fighting: 'bg-red-600',
  //     poison: 'bg-purple-500',
  //     ground: 'bg-amber-600',
  //     flying: 'bg-indigo-400',
  //     psychic: 'bg-pink-500',
  //     bug: 'bg-lime-500',
  //     rock: 'bg-stone-500',
  //     ghost: 'bg-violet-500',
  //     dragon: 'bg-indigo-600',
  //     dark: 'bg-gray-700',
  //     steel: 'bg-slate-500',
  //     fairy: 'bg-pink-400',
  //   };
  //   return colors[type] || 'bg-gray-400';
  // };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or type..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-lime-300/50 placeholder:text-teal-800placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('recent')}
            className={`px-3 py-1 rounded-full text-sm ${sortBy === 'recent'
              ? 'bg-white/30'
              : 'bg-white/10  hover:bg-white/20'
              }`}
          >
            Recent
          </button>
          <button
            onClick={() => setSortBy('level')}
            className={`px-3 py-1 rounded-full text-sm ${sortBy === 'level'
              ? 'bg-white/30'
              : 'bg-white/10 hover:bg-white/20'
              }`}
          >
            Level
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-3 py-1 rounded-full text-sm ${sortBy === 'name'
              ? 'bg-white/30'
              : 'bg-white/10 hover:bg-white/20'
              }`}
          >
            Name
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col items-center">
        <div className="grid max-w-[900px] gap-[4%] grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6gap-3">
          {filteredPokemon.map((pokemon) => (
            <div
              key={`${pokemon.id}-${pokemon.stats.level}`}
              className="flex flex-col items-center"
            >
              <div className='mb-[-12px]'>
                <span className="text-sm font-medium opacity-60 pr-1">
                  CP
                </span>

                <span className="text-xl font-bold">
                  {pokemon.cp}
                </span>
              </div>
              <div className="h-full w-full aspect-square flex items-center justify-center">
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="w-full h-full aspect-square object-contain"
                />
              </div>
              <div className="font-semibold">{pokemon.name}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {pokemon.types.map((type) => (
                  <TypeBadge type={type} />
                ))}
              </div>

              <div className="mt-2">
                {/* <button
                  onClick={() => onSelectBuddy(pokemon)}
                  className={`w-full px-2 py-1 rounded text-sm flex items-center justify-center gap-1 ${currentBuddy?.id === pokemon.id
                    ? 'bg-blue-500'
                    : 'bg-white/10 hover:bg-white/20'
                    }`}
                >
                  <Users className="w-4 h-4" />
                  {currentBuddy?.id === pokemon.id ? 'My Buddy' : 'Make Buddy'}
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default PokemonPouch;
