import { useEffect, useState } from "react";
import { Pokemon } from "../types";
import { hasEvolution } from "../utils/hasEvolution";

const useCanEvolve = (pokemon: Pokemon) => {
  const [canEvolve, setCanEvolve] = useState<boolean | null>(null);
  useEffect(() => {
    hasEvolution(pokemon).then(setCanEvolve);
  }, [pokemon]);

  return canEvolve;
};

export default useCanEvolve;
