import { PokemonState, WildPokemonState } from '../../types';
import TypeBadge from '../TypeBadge/TypeBadge';

const Pokemon = ({
  pokemonState,
  currentPokemon,
}: {
  pokemonState: PokemonState;
  currentPokemon: WildPokemonState | null;
}) => {
  if (!currentPokemon) return null;
  return (
    <div
      className={`transform flex flex-col items-center transition-all duration-150 ${
        pokemonState === 'caught'
          ? 'scale-0'
          : pokemonState === 'fled'
          ? 'translate-y-[100vh]'
          : ''
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-3 items-center text-xl font-medium p-1 text-center text-white bg-black/40 rounded-full">
          <div className="flex gap-1">
            {currentPokemon.types.map((t) => (
              <TypeBadge type={t} />
            ))}
          </div>
        </div>
        <div className="flex gap-3 items-center text-xl font-medium p-3 text-center text-white bg-black/40 rounded-full px-5">
          <h2>{currentPokemon.name}</h2>
        </div>
      </div>

      <img
        src={currentPokemon.sprite}
        alt={currentPokemon.name}
        className="w-72 aspect-square animate-bounce-slow object-contain filter drop-shadow-lg"
      />
    </div>
  );
};

export default Pokemon;
