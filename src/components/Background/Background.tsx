import { WildPokemonState } from "../../types";
import { getBackgroundColor } from "../../utils/getBackgroundColor";

const Background = ({currentPokemon} : {currentPokemon: WildPokemonState | null}) => {
    const bgColor = getBackgroundColor(currentPokemon);

    return (
    <div className='absolute h-screen w-screen overflow-hidden border border-blue-500'>
        <div className={`bg-sky-500 bg-gradient-to-b from-sky-200 to-blue-300 h-1/2 w-full`} />
        <div className={`${bgColor} h-[500vw] w-[500vw] absolute top-1/3 rounded-t-full -translate-x-1/2 left-1/2`} />
  </div>
  )
}

export default Background