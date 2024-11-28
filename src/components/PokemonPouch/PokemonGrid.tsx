import PokemonCard from "./PokemonCard";

interface Pokemon {
  id: number;
  name: string;
  cp: number;
  sprite: string;
  types: string[];
  isShiny: boolean;
  stats: { level: number };
}

interface PokemonGridProps {
  pokemonList: Pokemon[];
  buddyIndex: number;
  setCurrentIndex: (index: number) => void;
}

const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemonList,
  buddyIndex,
  setCurrentIndex,
}) => {
  return (
    <div className="grid max-w-[900px] px-4 pb-24 pt-4 gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {pokemonList.map((pokemon, i) => (
        <PokemonCard
          key={`${pokemon.id}-${pokemon.stats.level}`}
          pokemon={pokemon}
          isBuddy={buddyIndex === i}
          onClick={() => setCurrentIndex(i)}
        />
      ))}
    </div>
  );
};

export default PokemonGrid;
