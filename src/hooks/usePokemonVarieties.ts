import { useEffect, useState } from "react";
import { Pokemon, NamedAPIResource } from "../types";
import { getPokemonVarieties } from "../utils/getPokemonVarieties";

export const usePokemonVarieties = (pokemon: Pokemon) => {
  const [varieties, setVarieties] = useState<NamedAPIResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVarieties = async () => {
      setIsLoading(true);
      const fetchedVarieties = await getPokemonVarieties(pokemon);
      setVarieties(fetchedVarieties);
      setIsLoading(false);
    };

    fetchVarieties();
  }, [pokemon]);

  return { varieties, isLoading };
};
