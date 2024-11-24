import { PokemonMove, WildPokemonState } from "../types";
import { calculateCP } from "./calculateCp";
import { getPokemonId } from "./getPokemonId";

const POINTS_RARITY_MAP = {
  'common': 100,
  'uncommon': 150,
  'rare': 300,
  'legendary': 1000,
}

export const getRandomPokemon = async (
  ): Promise<WildPokemonState> => {
    // Get random Pokémon ID based on rarity
  
    const isLegendary = (Math.random() * 100) < 1
    // const isLegendary = true
    const pokemonId = getPokemonId(isLegendary);
  
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );
      const data = await response.json();
  
      const speciesRes = await fetch (
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
      )
      const speciesData = await speciesRes.json();
      const { 
        capture_rate, 
        // is_baby,
        // is_legendary,
        // is_mythical,
       } = speciesData || {}
  
      // Generate random level based on rarity
      const levelRanges = {
        common: { min: 1, max: 16 },
        uncommon: { min: 17, max: 30 },
        rare: { min: 30, max: 40 },
        legendary: { min: 40, max: 50 },
      };
  
      let rarity: 'common' | 'uncommon' | 'rare' | 'legendary' = 'common'
    
      const captureRate = (capture_rate / 255)
      
      if (isLegendary) rarity = 'legendary';
      else if (captureRate < 0.1) rarity = 'rare';
      else if (captureRate < 0.5)
        rarity = 'uncommon';
  
      const range = levelRanges[rarity];
      // const range = { min: 49, max: 50 }
  
      const level =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  
      const [hp, attack, defense, spAttack, spDefense, speed] = data?.stats || []
      const baseAttack = (attack.base_stat + spAttack.base_stat) / 1.5
      const baseDefense = (defense.base_stat + spDefense.base_stat) / 1.5
  
      const baseStats = {
        hp: Math.floor(hp.base_stat * Math.sqrt(level)),
        attack: Math.floor((baseAttack * Math.sqrt(level))),
        defense: Math.floor((baseDefense * Math.sqrt(level))),
        speed: Math.floor((speed.base_stat * Math.sqrt(level))),
      };
  
      const cp = calculateCP(baseStats)
  
  
      // Get moves from API
      const moves: PokemonMove[] = data.moves.slice(0, 4).map((move: any) => ({
        id: move.move.url.split('/').slice(-2, -1)[0],
        name: move.move.name.replace('-', ' '),
        type: data.types[0].type.name,
        power: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 20 : null,
        accuracy:
          Math.random() > 0.3 ? Math.floor(Math.random() * 30) + 70 : null,
        pp: Math.floor(Math.random() * 15) + 5,
        effect: {
          type: ['damage', 'defense_down', 'speed_down', 'catch_rate_up'][
            Math.floor(Math.random() * 4)
          ] as any,
          value: Math.floor(Math.random() * 30) + 10,
          chance: Math.floor(Math.random() * 30) + 70,
        },
        description: 'A powerful move!',
      }));
  
      const isShiny = (Math.random() * 512) < 1
      const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isShiny ? "shiny/" : "" }${pokemonId}.png`
      
      const pokemon: WildPokemonState = {
        id: pokemonId,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        rarity,
        points: POINTS_RARITY_MAP[rarity] || 100,
        caught: false,
        cp,
        sprite,
        types: data.types.map((t: any) => t.type.name),
        stats: {
          ...baseStats,
          level,
          maxHp: baseStats.hp,
        },
        moves,
        catchModifier: captureRate,
        isShiny,
      };
  
      return pokemon;
    } catch (error) {
      console.error('Failed to fetch Pokémon:', error);
      throw error;
    }
  };