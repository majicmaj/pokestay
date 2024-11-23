import { Sparkle, Sparkles, UserCheck, UserPlus, X } from "lucide-react"
import { Pokemon } from "../../types"
import TypeBadge from "../TypeBadge/TypeBadge"
import useGameState from "../../hooks/useGameState";

const SelectedPokemon = ({ pokemon, setSelectedPokemon }: { pokemon: Pokemon, setSelectedPokemon: (pokemon: null) => void }) => {
    const [gameState, setGameState] = useGameState();

    const handleMakeBuddy = () => setGameState({
        ...gameState,
        buddyPokemon: pokemon
    })

    const handleRemoveBuddy = () => setGameState({
        ...gameState,
        buddyPokemon: null
    })
    const { points, buddyPokemon } = gameState || {}

    const isBuddyPokemon = JSON.stringify(buddyPokemon) === JSON.stringify(pokemon)

    return <div
        className="flex flex-col items-center"
    >
        <div className="absolute top-0 w-full flex px-8 flex-col gap-4 h-full items-center">
            <div className='absolute -z-10 top-80 h-full rounded-xl w-[calc(100%-32px)] border aspect-square  bg-white drop-shadow-xl p-8' />

            <div className="relative w-96 flex pt-8 h-96 flex-col justify-between items-center">
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
                    className="pixelated absolute p-12 bottom-0 w-96 h-96 object-contain"
                />
                <div className='flex items-center flex-col'>
                    <div className="font-semibold text-3xl mt-[-16px] flex items-center">{pokemon.isShiny && <Sparkles className='w-8' />}{pokemon.name}</div>
                    <p className='text-sm'>{pokemon.stats.hp} HP / Lv.{pokemon.stats.level}</p>
                </div>
            </div>

            <div className='flex rounded-full border-2'>
                {pokemon.types.map(type => <TypeBadge key={type} type={type} />)}
            </div>

            <div className='border-b-2 border-zinc-300 w-full' />

            {/* <div className='grid grid-cols-3 place-items-center gap-4 px-4 w-full'>
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
            </div> */}

            <div className="text-center">
                <p className="text-xl">{points}</p>
                <p className='flex items-center opacity-60 text-sm'><Sparkle className='h-4 w-4' /> Stardust</p>
            </div>
            <div className='rounded-full pr-4 items-center justify-between flex gap-4 bg-lime-100/80 w-full'>
                <button onClick={() => {alert('coming soon')}} className='rounded-full text-sm text-white bg-teal-500 gap-2 flex items-center px-6 py-2'>
                    LEVEL UP
                </button>
                <div className="flex items-center gap-1">
                    <Sparkle className='h-4 w-4' />
                    <span>{Math.round(10 * (pokemon.stats.level ** 1.5))}</span>
                </div>

            </div>
            <button onClick={isBuddyPokemon ? handleRemoveBuddy : handleMakeBuddy} className='rounded-full text-sm border-2 border-teal-800 gap-2 flex items-center px-3 py-1'>
                {isBuddyPokemon ? <UserCheck className='h-6 w-6' /> : <UserPlus className='h-6 w-6' />}
                {isBuddyPokemon ? 'Current Buddy' : 'Select as Buddy'}
            </button>

        </div>


        <button
            className='absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 p-2 text-lime-200 border border-lime-200'
            onClick={() => setSelectedPokemon(null)}
        >
            <X className='h-6 w-6' />
        </button>
    </div>
}

export default SelectedPokemon