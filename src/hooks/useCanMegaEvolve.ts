import { useEffect, useState } from "react";
import { Pokemon } from "../types";
import { getMegaEvolutions } from "../utils/getMegaEvolutions";

const useCanMegaEvolve = (pokemon: Pokemon) => {
  const [canMegaEvolve, setCanMegaEvolve] = useState<boolean | null>(null);

  useEffect(() => {
    if (!pokemon) {
      setCanMegaEvolve(false);
      return;
    }
    getMegaEvolutions(pokemon).then((megas) => {
      setCanMegaEvolve(megas.length > 0);
    });
  }, [pokemon]);

  return canMegaEvolve;
};

export default useCanMegaEvolve;
