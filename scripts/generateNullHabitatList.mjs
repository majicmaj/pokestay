import fs from "fs";
import path from "path";

function getGenById(id) {
  if (id <= 151) return "I";
  if (id <= 251) return "II";
  if (id <= 386) return "III";
  if (id <= 493) return "IV";
  if (id <= 649) return "V";
  if (id <= 721) return "VI";
  if (id <= 809) return "VII";
  if (id <= 905) return "VIII";
  return "IX";
}

async function generateEtherPokemonLists() {
  console.log("Fetching all Pokémon species...");
  const speciesListRes = await fetch(
    "https://pokeapi.co/api/v2/pokemon-species?limit=10000"
  );
  if (!speciesListRes.ok) {
    throw new Error("Failed to fetch Pokémon species list.");
  }
  const speciesList = await speciesListRes.json();
  const etherPokemon = {};

  console.log(
    `Found ${speciesList.results.length} species. Categorizing by type and generation...`
  );

  const promises = speciesList.results.map(async (species) => {
    try {
      const speciesDetailsRes = await fetch(species.url);
      if (speciesDetailsRes.ok) {
        const speciesDetails = await speciesDetailsRes.json();
        if (speciesDetails.habitat === null) {
          const pokemonRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${speciesDetails.id}`
          );
          if (pokemonRes.ok) {
            const pokemonData = await pokemonRes.json();
            const id = pokemonData.id;
            const generation = getGenById(id);
            const types = pokemonData.types.map((t) => t.type.name);

            if (!etherPokemon[generation]) {
              etherPokemon[generation] = {};
            }

            types.forEach((type) => {
              if (!etherPokemon[generation][type]) {
                etherPokemon[generation][type] = [];
              }
              etherPokemon[generation][type].push({
                name: pokemonData.name,
                url: species.url,
              });
            });
            process.stdout.write(`.`);
          }
        }
      }
    } catch (error) {
      // Ignore errors and continue
    }
  });

  await Promise.all(promises);
  console.log("\n");

  const outputPath = path.resolve(
    process.cwd(),
    "src/constants/etherPokemon.ts"
  );
  let fileContent = `// This file is auto-generated. Do not edit manually.
// Run \`npm run generate-null-habitat-list\` to update.
import { NamedAPIResource } from '../types';

export const ETHER_POKEMON: Record<string, Record<string, NamedAPIResource[]>> = ${JSON.stringify(
    etherPokemon,
    null,
    2
  )};
`;

  fs.writeFileSync(outputPath, fileContent, "utf8");
  console.log(`\n✅ Successfully generated Ether Pokémon lists.`);
  console.log(`File saved to: ${outputPath}`);
}

generateEtherPokemonLists();
