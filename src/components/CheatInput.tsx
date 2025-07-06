import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { getPokemonByName } from "../utils/getPokemonByName";
import useCurrentPokemon from "../hooks/useCurrentPokemon";

const CheatInput = () => {
  const [, setCurrentPokemon] = useCurrentPokemon();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [pokemonNames, setPokemonNames] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "`") {
      e.preventDefault();
      setIsVisible((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [handleGlobalKeyDown]);

  useEffect(() => {
    if (isVisible) {
      inputRef.current?.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    const fetchPokemonNames = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=10000"
        );
        const data = await response.json();
        setPokemonNames(data.results.map((p: { name: string }) => p.name));
      } catch (error) {
        console.error("Failed to fetch Pokemon names:", error);
      }
    };
    fetchPokemonNames();
  }, []);

  const commands = ["/encounter"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.startsWith("/")) {
      const command = value.split(" ")[0];
      if (commands.includes(command)) {
        const arg = value.split(" ")[1] || "";
        if (arg) {
          const matchingPokemon = pokemonNames
            .filter((name) => name.startsWith(arg.toLowerCase()))
            .slice(0, 5);
          setSuggestions(matchingPokemon);
        } else {
          setSuggestions([]);
        }
      } else {
        const matchingCommands = commands.filter((c) => c.startsWith(value));
        setSuggestions(matchingCommands);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const parts = inputValue.split(" ");
    if (parts.length > 1 && parts[0].startsWith("/")) {
      setInputValue(`${parts[0]} ${suggestion} `);
    } else {
      setInputValue(`${suggestion} `);
    }
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [command, ...args] = inputValue.trim().split(" ");

    if (command === "/encounter") {
      const pokemonName = args[0];
      if (pokemonName) {
        toast.info(`Attempting to encounter ${pokemonName}...`);
        const pokemon = await getPokemonByName(pokemonName);
        if (pokemon) {
          setCurrentPokemon({ ...pokemon, catchModifier: 1 });
          toast.success(`${pokemon.display_name} has appeared!`);
        } else {
          toast.error(`Could not find Pokémon: ${pokemonName}`);
        }
      } else {
        toast.warning("Please specify a Pokémon name.");
      }
    } else {
      toast.error("Unknown command.");
    }
    setInputValue("");
    setSuggestions([]);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute bottom-24 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 rounded-lg bg-black/20 p-2 shadow-lg backdrop-blur-sm">
      <form onSubmit={handleSubmit}>
        <input
          id="cheat-input"
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className="w-full rounded-md border-2 border-primary bg-secondary/50 p-2 text-content placeholder-content/50 focus:outline-none"
          placeholder="Enter cheat command..."
          autoComplete="off"
        />
      </form>
      {suggestions.length > 0 && (
        <ul className="mt-2 rounded-md border border-primary bg-secondary">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer p-2 hover:bg-accent/20"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CheatInput;
