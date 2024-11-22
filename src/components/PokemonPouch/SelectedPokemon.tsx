import { Sparkles, UserCheck, UserPlus, X } from "lucide-react"
import { Pokemon } from "../../types"
import TypeBadge from "../TypeBadge/TypeBadge"
import useGameState from "../../hooks/useGameState";

const SelectedPokemon = ({ pokemon, setSelectedPokemon }: { pokemon: Pokemon, setSelectedPokemon: (pokemon: null) => void }) => {
    const [gameState, setGameState] = useGameState();

    const handleMakeBuddy = () => setGameState({
        ...gameState,
        buddyPokemon: pokemon
    })

    const isBuddyPokemon = JSON.stringify(gameState.buddyPokemon) === JSON.stringify(pokemon)

    console.log(gameState)
    return <div
        className="flex flex-col items-center"
    >
        <div className="absolute top-0 w-full flex px-8 flex-col gap-8 h-full items-center">
            <div className='absolute -z-10 top-80 h-full rounded-xl w-[calc(100%-32px)] border aspect-square  bg-white drop-shadow-xl p-8' />

            <div className="w-full flex pt-8 aspect-square flex-col justify-between items-center">
                <div className='text-white'>
                    <span className="text-sm font-medium opacity-60 pr-1">
                        CP
                    </span>
                    <span className="text-4xl">
                        {pokemon.cp}
                    </span>
                </div>
                <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    className="absolute p-12 -top-8 w-full aspect-square object-contain"
                />
                <div className='flex items-center flex-col'>
                    <div className="font-semibold text-3xl mt-[-16px] flex items-center">{pokemon.isShiny && <Sparkles className='w-8' />}{pokemon.name}</div>
                    <p className='text-sm'>{pokemon.stats.hp} HP / Lv.{pokemon.stats.level}</p>
                </div>
            </div>

            <div className='flex px-2 rounded-full bg-black/15'>
                {pokemon.types.map(type => <TypeBadge key={type} type={type} />)}
            </div>

            <div className='border-b-2 border-zinc-300 w-full' />

            <div className='grid grid-cols-3 place-items-center gap-4 px-4 w-full'>
                <div className='grid place-items-center'>
                    <p className='font-bold text-xl'>{pokemon.stats.attack}</p>
                    <p className='opacity-80'>Attack</p>
                </div>
                <div className='grid place-items-center'>
                    <p className='font-bold text-xl'>{pokemon.stats.defense}</p>
                    <p className='opacity-80'>Defense</p>
                </div>
                <div className='grid place-items-center'>
                    <p className='font-bold text-xl'>{pokemon.stats.speed}</p>
                    <p className='opacity-80'>Speed</p>
                </div>

            </div>
            
            <button onClick={handleMakeBuddy} className='rounded-full border-2 border-teal-800 gap-2 flex items-center px-3 py-1'>
                {isBuddyPokemon ? <UserCheck className='h-8 w-8'/> : <UserPlus className='h-8 w-8' />} 
                {isBuddyPokemon ? 'Current Buddy' : 'Select as Buddy'}
            </button>
        </div>


        <button
            className='absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 p-4 text-lime-200 border border-lime-200'
            onClick={() => setSelectedPokemon(null)}
        >
            <X className='h-8 w-8' />
        </button>
    </div>
}

export default SelectedPokemon