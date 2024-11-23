import { WildPokemonState } from "../../types";
import { getBackgroundColor } from "../../utils/getBackgroundColor";

const Background = ({currentPokemon} : {currentPokemon: WildPokemonState | null}) => {
    const bgColor = getBackgroundColor(currentPokemon) || 'bg-white';

    return (
    <div className='absolute h-screen w-screen overflow-hidden'>
        <div className={`${bgColor} h-1/2 top-0 w-full absolute`} />
        <div className={`bg-gradient-to-b top-0 absolute from-sky-200/90 to-blue-300/90 h-1/2 w-full`} />
        <div className={`${bgColor} h-[500vw] w-[1000vw] absolute top-1/3 rounded-t-full -translate-x-1/2 left-1/2`} />
  </div>
  )
}

export default Background