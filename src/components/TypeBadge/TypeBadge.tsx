import Bug from "../../assets/types/Bug.png";
import Dark from "../../assets/types/Dark.png";
import Dragon from "../../assets/types/Dragon.png";
import Electric from "../../assets/types/Electric.png";
import Fairy from "../../assets/types/Fairy.png";
import Fight from "../../assets/types/Fight.png";
import Fire from "../../assets/types/Fire.png";
import Flying from "../../assets/types/Flying.png";
import Ghost from "../../assets/types/Ghost.png";
import Grass from "../../assets/types/Grass.png";
import Ground from "../../assets/types/Ground.png";
import Ice from "../../assets/types/Ice.png";
import Normal from "../../assets/types/Normal.png";
import Poison from "../../assets/types/Poison.png";
import Psychic from "../../assets/types/Psychic.png";
import Rock from "../../assets/types/Rock.png";
import Steel from "../../assets/types/Steel.png";
import Water from "../../assets/types/Water.png";
import { cn } from "../../utils/cn";

const TYPES_MAP = {
  bug: Bug,
  dark: Dark,
  dragon: Dragon,
  electric: Electric,
  fairy: Fairy,
  fighting: Fight,
  fire: Fire,
  flying: Flying,
  ghost: Ghost,
  grass: Grass,
  ground: Ground,
  ice: Ice,
  normal: Normal,
  poison: Poison,
  psychic: Psychic,
  rock: Rock,
  steel: Steel,
  water: Water,
};

const TypeBadge = ({
  type,
  className,
}: {
  type: string;
  className?: string;
}) => {
  if (!(type in TYPES_MAP)) return null;
  const src = TYPES_MAP[type as keyof typeof TYPES_MAP];
  return <img className={cn("h-10 w-10", className)} src={src} />;
};

export default TypeBadge;
