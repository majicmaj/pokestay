import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Pokemon } from '../../types';
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
  // const [searchTerm, setSearchTerm] = useState('');
  // const [sortBy, setSortBy] = useState<'level' | 'recent' | 'name'>('recent');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)

  // console.log(caughtPokemon)
  const sortedPokemon = [...caughtPokemon]
  // ?.sort((a, b) => {
  //   switch (sortBy) {
  //     case 'level':
  //       return b.stats.level - a.stats.level;
  //     case 'name':
  //       return a.name.localeCompare(b.name);
  //     case 'recent':
  //     default:
  //       return 0; // Assumes the array is already in chronological order
  //   }
  // });

  const filteredPokemon = sortedPokemon
  // .filter(pokemon =>
  //   pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   pokemon.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
  // );

  return (
    <div className="h-screen overflow-auto flex flex-col">
        {selectedPokemon && <div className='absolute top-0 left-0 grid place-items-center h-full w-full p-8 bg-black/20 filter backdrop-blur z-20'>
          <div className='h-full w-full'>
          <SelectedPokemon pokemon={selectedPokemon}
          setSelectedPokemon={setSelectedPokemon}
          />
          </div>
        </div>}
      <h1 className='text-md py-8 text-center'>POKEMON</h1>
        <div className="grid max-w-[900px] pb-24 gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6gap-3">
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
                  className="pixelated w-full h-full aspect-square object-contain"
                />
              </div>
              <div className="font-semibold mt-[-16px] flex items-center">{pokemon.isShiny && <Sparkles className='w-4' />}{pokemon.name}</div>
            </div>
          ))}
        </div>

    </div>
  );
};


export default PokemonPouch;
