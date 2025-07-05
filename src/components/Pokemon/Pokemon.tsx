import { Sparkles } from "lucide-react";
import useCurrentPokemon from "../../hooks/useCurrentPokemon";
import { type Pokemon, PokemonState } from "../../types";
import TypeBadge from "../TypeBadge/TypeBadge";
import { cn } from "../../utils/cn";
import { LEGENDARY_POKEMON_IDS } from "../../constants/legendaryPokemonIds";
import Icon from "../../assets/icons/Icon";
import { getTypeColor } from "../../utils/getTypeColor";
import CatchTimingIndicator from "../CatchTimingIndicator/CatchTimingIndicator";

const getScale = (pokemon: Pokemon) => {
  const height = pokemon?.height || 10; // Default to 1m (10dm) if no height
  const minHeight = 1; // Joltik
  const maxHeight = 200; // Eternatus

  const minScale = 0.2;
  const maxScale = 1.25;

  // Use a logarithmic scale to better handle the wide range of Pokémon heights
  const logHeight = Math.log10(Math.max(minHeight, height));
  const logMinHeight = Math.log10(minHeight);
  const logMaxHeight = Math.log10(maxHeight);

  const scale =
    minScale +
    ((logHeight - logMinHeight) / (logMaxHeight - logMinHeight)) *
      (maxScale - minScale);

  return Math.min(maxScale, Math.max(minScale, scale)); // Clamp the value
};

const Pokemon = ({
  pokemonState,
  isPokeballDisabled,
  isShrinking,
}: {
  pokemonState: PokemonState;
  isPokeballDisabled?: boolean;
  isShrinking?: boolean;
}) => {
  const [currentPokemon] = useCurrentPokemon();

  if (!currentPokemon) return <div className="h-full w-full" />;

  const { cp, isShiny, id } = currentPokemon || {};

  const isLegendary = LEGENDARY_POKEMON_IDS.includes(id);

  const primaryType = currentPokemon?.types?.[0] || "normal";
  const typeColor = getTypeColor(primaryType);

  const legendaryStyles = isLegendary
    ? {
        textShadow: `0 0 1px #ffffff80, 0 0 10px ${typeColor}80, 0 0 15px ${typeColor}80, 0 0 8px ${typeColor}80, 0 0 10px ${typeColor}80, 0 0 12px ${typeColor}80, 0 0 15px ${typeColor}80`,
        boxShadow: `0 0 1px #ffffff40, 0 0 12px ${typeColor}40, 0 0 16px ${typeColor}40, 0 0 1px #ffffff80, 0 0 3px ${typeColor}80, 0 0 6px ${typeColor}80, 0 0 8px ${typeColor}80`,
        backgroundColor: `${typeColor}40`,
      }
    : {};

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
          <div className={cn(`animate-bounce-slow relative`)}>
            <div className="h-[100vmin] max-h-[calc(100vmin-16rem)] w-[100vmin] flex justify-center items-end aspect-sqaure overlfow-visible">
              <div
                className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
                style={{
                  bottom: 30 + getScale(currentPokemon) * 50 + "vmin",
                }}
              >
                <div
                  className={cn(
                    "flex relative gap-3 items-center text-xl font-light p-3 text-center text-white bg-black/40 rounded-full px-5"
                  )}
                  style={legendaryStyles}
                >
                  {isShiny && <Sparkles />}
                  {isLegendary && <Icon name="legendary" />}
                  <h2 className="truncate">{currentPokemon.name}</h2>
                  <p className="opacity-50">/</p>
                  <p className="font-light">
                    <span className="text-sm pr-1">CP</span>
                    {cp}
                  </p>
                </div>
                {(isLegendary || isShiny) && (
                  <div className="flex gap-2 text-sm font-light text-white bg-black/40 rounded-full px-3 py-1">
                    {isLegendary && (
                      <span className="text-orange-500 pixelated-font font-thin">
                        Legendary!!
                      </span>
                    )}
                    {isShiny && (
                      <span className="text-yellow-500 pixelated-font font-thin">
                        Shiny!
                      </span>
                    )}
                  </div>
                )}
                <div className="flex gap-3 items-center text-xl font-medium text-center text-white bg-black/40 rounded-full">
                  <div className="flex -space-x-2">
                    {currentPokemon?.types?.map((t: string) => (
                      <TypeBadge type={t} key={t} />
                    ))}
                  </div>
                </div>
              </div>
              <div
                className="mt-4 max-w-[unset] relative aspect-square overflow-visible"
                style={{
                  height: getScale(currentPokemon) * 100 + "vmin",
                  width: getScale(currentPokemon) * 100 + "vmin",

                  // transform: `scale(${getScale(currentPokemon)})`,
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                <img
                  src={currentPokemon.sprite}
                  alt={currentPokemon.name}
                  className={cn(
                    `relative w-full pixelated aspect-square object-contain filter drop-shadow-lg transition-all duration-300`,
                    isShrinking && "animate-pokemon-shrink",
                    !isPokeballDisabled &&
                      pokemonState === "idle" &&
                      "animate-pokemon-grow"
                  )}
                />
                {pokemonState === "idle" && <CatchTimingIndicator />}
              </div>
            </div>
          </div>
        </div>
      </div>
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
