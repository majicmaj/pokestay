import { LogOut, Users, X } from "lucide-react"
import PokemonPouch from "../PokemonPouch/PokemonPouch"
import { useState } from "react";
import { GameState, Menus } from "../../types";

const SlidingMenus = ({
    gameState,
    handleFlee,
}: {
    gameState: GameState
    handleFlee: () => void
}) => {
    const [activeMenu, setActiveMenu] = useState<Menus>('none');


    const toggleMenu = (menu: Menus) => {
        setActiveMenu((prev) => (prev === menu ? 'none' : menu));
    };

    return <div className='absolute'>
        {/* FABs */}
        <div className='fixed top-4 left-4'>
            <button
                className='p-4 text-white drop-shadow-md rotate-180'
                onClick={handleFlee}
            >
                <LogOut className='h-8 w-8' />
            </button>
        </div>
        {gameState?.buddyPokemon && <div className="fixed bottom-6 left-6 flex flex-col gap-4 items-end z-30">
            <button
                onClick={() => toggleMenu('inventory')}
                className={`relative grid place-items-center h-14 w-14 p-4 rounded-full shadow-lg transition-all ${activeMenu === 'inventory'
                    ? 'bg-blue-500 text-white'
                    : 'bg-black/20 backdrop-blur-md text-white hover:bg-blak/30'
                    }`}
            >
                <img className='absolute min-w-16 aspect-square' src={gameState.buddyPokemon?.sprite} />
            </button>
        </div>}
        <div className="fixed bottom-6 right-6 flex flex-col gap-4 items-end z-30">
            <button
                onClick={() => toggleMenu('inventory')}
                className={`p-4 rounded-full shadow-lg transition-all ${activeMenu === 'inventory'
                    ? 'bg-blue-500 text-white'
                    : 'bg-black/20 backdrop-blur-md text-white hover:bg-blak/30'
                    }`}
            >
                <Users className="w-6 h-6" />
            </button>
        </div>
        {/* Menus */}
        <div
            className={`fixed inset-y-0 right-0 w-full bg-lime-200 bg-gradient-to-br px-2 from-lime-200 to-teal-500 backdrop-blur-md shadow-lg transform transition-all duration-300 z-40 ${activeMenu !== 'none' ? 'translate-x-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
        >
            <div className='bg-white h-full w-full text-teal-800'>
                <div className="sticky top-0 p-4 flex flex-col pt-8 justify-between items-center">
                    <h2 className="text-xl">
                        {activeMenu === 'pokedex'
                            ? 'Pokédex'
                            : activeMenu === 'inventory'
                                ? 'Pokémon'
                                : activeMenu === 'shop'
                                    ? 'Shop'
                                    : ''}
                    </h2>
                    <p className='opacity-80 text-sm'>
                        Stardust {gameState.points}
                    </p>
                </div>
                <button
                    className='absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 p-4 text-lime-200 border border-lime-200'
                    onClick={() => setActiveMenu('none')}
                >
                    <X className='h-8 w-8' />
                </button>
                <PokemonPouch
                    caughtPokemon={gameState.inventory}
                    onSelectBuddy={() => { }}
                    currentBuddy={null}
                />
            </div>
        </div>
    </div>
}

export default SlidingMenus