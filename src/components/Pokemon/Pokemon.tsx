import { Sparkles } from "lucide-react";
import useCurrentPokemon from "../../hooks/useCurrentPokemon";
import { PokemonState } from "../../types";
import TypeBadge from "../TypeBadge/TypeBadge";

const Pokemon = ({
  pokemonState,
  isPokeballDisabled,
}: {
  pokemonState: PokemonState;
  isPokeballDisabled?: boolean;
}) => {
  const [currentPokemon] = useCurrentPokemon();

  if (!currentPokemon) return null;

  const { cp, isShiny } = currentPokemon || {};
  return (
    <div
      className={`transform h-full justify-center pb-4 flex flex-col items-center`}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className={`transition-all duration-150 ${
            pokemonState === "caught"
              ? "scale-0"
              : pokemonState === "fled"
              ? "translate-y-[100vh]"
              : ""
          }`}
        >
          <div className={`animate-bounce-slow flex flex-col items-center `}>
            <div className="flex gap-3 items-center text-xl font-light p-3 text-center text-white bg-black/40 rounded-full px-5">
              {isShiny && <Sparkles />}
              <h2>{currentPokemon.name}</h2>
              <p className="opacity-50">/</p>
              <p className="font-light">
                <span className="text-sm pr-1">CP</span>
                {cp}
              </p>
            </div>
            <div className="flex mt-2 gap-3 items-center text-xl font-medium text-center text-white bg-black/40 rounded-full">
              <div className="flex -space-x-2">
                {currentPokemon?.types?.map((t: string) => (
                  <TypeBadge type={t} key={t} />
                ))}
              </div>
            </div>
            <div className="mt-8 relative w-[300px] h-[300px] overflow-visible">
              <img
                src={currentPokemon.sprite}
                alt={currentPokemon.name}
                className={`relative min-w-[300px] pixelated aspect-square object-contain filter drop-shadow-lg transition-all duration-300 ${
                  isPokeballDisabled && "animate-pokemon-shrink"
                } ${
                  !isPokeballDisabled &&
                  pokemonState === "idle" &&
                  "animate-pokemon-grow"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div className='absolute bottom-0 w-[20vw] mb-4'>
        {currentPokemon.id}
        {JSON.stringify(currentPokemon.stats).replaceAll(",", ",\n")}
      </div> */}
    </div>
  );
};

export default Pokemon;

// const pokemon = {
//   "id": 22,
//   "name": "Fearow",
//   "rarity": "common",
//   "points": 15,
//   "caught": false,
//   "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/22.png",
//   "types": [
//       "normal",
//       "flying"
//   ],
//   "stats": {
//       "hp": 28,
//       "attack": 19,
//       "defense": 15,
//       "speed": 21,
//       "level": 8,
//       "maxHp": 28
//   },
//   "moves": [
//       {
//           "id": "13",
//           "name": "razor wind",
//           "type": "normal",
//           "power": 87,
//           "accuracy": 81,
//           "pp": 18,
//           "effect": {
//               "type": "speed_down",
//               "value": 11,
//               "chance": 94
//           },
//           "description": "A powerful move!"
//       },
//       {
//           "id": "17",
//           "name": "wing attack",
//           "type": "normal",
//           "power": 40,
//           "accuracy": null,
//           "pp": 5,
//           "effect": {
//               "type": "speed_down",
//               "value": 13,
//               "chance": 94
//           },
//           "description": "A powerful move!"
//       },
//       {
//           "id": "18",
//           "name": "whirlwind",
//           "type": "normal",
//           "power": null,
//           "accuracy": null,
//           "pp": 5,
//           "effect": {
//               "type": "catch_rate_up",
//               "value": 26,
//               "chance": 90
//           },
//           "description": "A powerful move!"
//       },
//       {
//           "id": "19",
//           "name": "fly",
//           "type": "normal",
//           "power": 50,
//           "accuracy": 89,
//           "pp": 10,
//           "effect": {
//               "type": "speed_down",
//               "value": 31,
//               "chance": 85
//           },
//           "description": "A powerful move!"
//       }
//   ],
//   "currentHp": 28,
//   "currentDefense": 15,
//   "currentSpeed": 21,
//   "catchModifier": 1
// }
