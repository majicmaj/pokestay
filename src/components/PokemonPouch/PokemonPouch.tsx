import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Pokemon } from '../../types';
import SelectedPokemon from './SelectedPokemon';
import useGameState from '../../hooks/useGameState';

interface PokemonPouchProps {
  // onSelectBuddy: (pokemon: Pokemon) => void;
  // currentBuddy: Pokemon | null;
}

type SortBy = 'level' | 'recent' | 'name' | 'cp' | 'id'
const PokemonPouch: React.FC<PokemonPouchProps> = ({
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)

  const [gameState] = useGameState()
  const {buddyPokemon, inventory = []} = gameState || {}

  const sortedPokemon = [...inventory]?.sort((a, b) => {
    switch (sortBy) {
      case 'cp':
        return (b.cp || 0) - (a.cp || 0);
      case 'id':
        return a.id - b.id;
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
    pokemon.types.some((type: string) => type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-screen overflow-auto flex flex-col">
        {selectedPokemon && <div className='absolute top-0 left-0 grid place-items-center h-full w-full p-8 bg-black/20 filter backdrop-blur z-20'>
          <div className='h-full w-full'>
          <SelectedPokemon pokemon={selectedPokemon}
          setSelectedPokemon={setSelectedPokemon}
          />
          </div>
        </div>}
      {/* <h1 className='text-md pt-8 text-center'>POKEMON</h1> */}
      <div className='flex flex-col text-center pt-4' onClick={() => setSelectedPokemon(buddyPokemon)}>
          <span className='font-medium underline'>
            {buddyPokemon?.name || "None"}
          </span>
          <span className='font-light text-sm opacity-60 pr-2'>Current Buddy</span>
          </div>
      <div className='p-4 flex flex-col gap-2'>
        <input 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='px-3 py-1 bg-lime-200 w-full rounded-full'
        />
        <div className='flex w-full gap-4 text-sm'>
          <p className='opacity-60'>Sort By</p>
          <button className={sortBy === 'cp' ? 'underline' : ''} onClick={() => setSortBy('cp')}>CP</button>
          <button className={sortBy === 'level' ? 'underline' : ''} onClick={() => setSortBy('level')}>Level</button>
          <button className={sortBy === 'name' ? 'underline' : ''} onClick={() => setSortBy('name')}>Name</button>
          <button className={sortBy === 'id' ? 'underline' : ''} onClick={() => setSortBy('id')}>ID</button>
          <button className={sortBy === 'recent' ? 'underline' : ''} onClick={() => setSortBy('recent')}>Recent</button>
        </div>
      </div>
        <div className="grid max-w-[900px] pb-24 pt-4 gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6gap-3">
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
