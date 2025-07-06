import { useEffect, useState } from "react";
import useGameState from "./useGameState";
import useInventory from "./useInventory";
import usePoints from "./usePoints";
import { Pokemon, NamedAPIResource } from "../types";
import { getSprite } from "../utils/getSprite";
import { levelUpPokemon } from "../utils/levelUpPokemon";
import {
  createEvolvedPokemon,
  getPossibleEvolutions,
} from "../utils/getEvolution";
import { hasEvolution } from "../utils/hasEvolution";

export const usePokemonActions = (pokemon: Pokemon) => {
  const [gameState, setGameState] = useGameState();
  const [inventory, setInventory] = useInventory();
  const [points, setPoints] = usePoints();
  const [possibleEvolutions, setPossibleEvolutions] = useState<
    NamedAPIResource[]
  >([]);
  const [canPokemonEvolve, setCanPokemonEvolve] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    hasEvolution(pokemon).then(setCanPokemonEvolve);
  }, [pokemon]);

  useEffect(() => {
    if (canPokemonEvolve) {
      getPossibleEvolutions(pokemon).then(setPossibleEvolutions);
    }
  }, [canPokemonEvolve, pokemon]);

  const { buddyPokemon } = gameState || {};
  const isBuddyPokemon =
    JSON.stringify(buddyPokemon) === JSON.stringify(pokemon);

  const setPokemon = (updatedPokemon: Pokemon) => {
    const newInventory = inventory.map((p) =>
      p.uuid === updatedPokemon.uuid ? updatedPokemon : p
    );
    setInventory(newInventory);
    if (isBuddyPokemon) {
      setGameState({
        ...gameState,
        buddyPokemon: updatedPokemon,
      });
    }
  };

  const handleMakeBuddy = () => {
    setGameState({
      ...gameState,
      buddyPokemon: pokemon,
    });
  };

  const handleRemoveBuddy = () =>
    setGameState({
      ...gameState,
      buddyPokemon: null,
    });

  // Level Up
  const levelUpCost = Math.round(3 * pokemon.stats.level ** 1.6);
  const isMaxLevel = pokemon.stats.level >= 50;
  const isLevelUpDisabled = isMaxLevel || points < levelUpCost;

  const levelUp = () => {
    if (isLevelUpDisabled) return;
    const leveledUpPokemon = levelUpPokemon(pokemon);
    setPokemon(leveledUpPokemon);
    setPoints(points - levelUpCost);
  };

  // Evolution
  const evolutionCost = 2500;
  const canEvolve = canPokemonEvolve && points >= evolutionCost;

  const evolve = async (evolvedSpeciesName: string, onClose: () => void) => {
    if (!canEvolve) return;
    const evolvedPokemon = await createEvolvedPokemon(
      pokemon,
      evolvedSpeciesName
    );
    if (!evolvedPokemon) return;

    const newInventory = inventory.map((p) =>
      p.uuid === pokemon.uuid ? evolvedPokemon : p
    );
    setInventory(newInventory);

    setPoints(points - evolutionCost);
    if (isBuddyPokemon) {
      setGameState({
        ...gameState,
        buddyPokemon: evolvedPokemon,
      });
    }
    onClose();
  };

  // Transfer
  const baseTransferStardust = 100;
  const transferStardust = Math.round(
    baseTransferStardust + pokemon.stats.level * 10
  );

  const transferPokemon = (onClose: () => void) => {
    const newInventory = inventory.filter(
      (p: Pokemon) => p.uuid !== pokemon.uuid
    );
    setInventory(newInventory);
    setPoints(Number(points) + Number(transferStardust));
    onClose();
  };

  // Sprites
  const updateSprite = async (newSprite: string | null) => {
    if (!newSprite) return;
    setPokemon({ ...pokemon, sprite: newSprite });
  };

  const set3dSprite = async () => {
    const newSprite = await getSprite({
      name: pokemon.name,
      isShiny: pokemon.isShiny ?? false,
      type: "3d",
    });
    updateSprite(newSprite);
  };

  const set2dSprite = async () => {
    const newSprite = await getSprite({
      name: pokemon.name,
      isShiny: pokemon.isShiny ?? false,
      type: "2d",
    });
    updateSprite(newSprite ?? pokemon.sprite2d ?? null);
  };

  return {
    isBuddyPokemon,
    handleMakeBuddy,
    handleRemoveBuddy,
    setPokemon,
    levelUp,
    isLevelUpDisabled,
    levelUpCost,
    evolve,
    canEvolve,
    evolutionCost,
    transferPokemon,
    transferStardust,
    set2dSprite,
    set3dSprite,
    possibleEvolutions,
  };
};
