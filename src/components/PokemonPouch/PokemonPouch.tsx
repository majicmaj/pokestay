import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Pokemon, WildPokemonState } from '../../types';
import TypeBadge from '../TypeBadge/TypeBadge';
import SelectedPokemon from './SelectedPokemon';

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
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)

  // console.log(caughtPokemon)
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

  return (
    <div className="h-screen overflow-auto flex flex-col">
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

      <div className="flex-1 overflow-auto px-4 flex flex-col items-center">
        {selectedPokemon && <div className='absolute top-0 grid place-items-center h-full w-full p-8 bg-black/20 filter backdrop-blur z-20'>
          <div className='h-full w-full'>
          <SelectedPokemon pokemon={selectedPokemon}
          setSelectedPokemon={setSelectedPokemon}
          />
          </div>
        </div>}
        <div className="grid max-w-[900px] gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6gap-3">
          {filteredPokemon.map((pokemon) => (
            <div
              key={`${pokemon.id}-${pokemon.stats.level}`}
              className="flex flex-col items-center"
              onClick={() => setSelectedPokemon(pokemon)}
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
              <div className="font-semibold mt-[-16px] flex items-center">{pokemon.isShiny && <Sparkles className='w-4' />}{pokemon.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default PokemonPouch;
