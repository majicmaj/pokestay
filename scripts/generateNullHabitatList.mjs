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

async function generateNullHabitatListsByGen() {
  console.log("Fetching all Pokémon species...");
  const speciesListRes = await fetch(
    "https://pokeapi.co/api/v2/pokemon-species?limit=10000"
  );
  if (!speciesListRes.ok) {
    console.error("Failed to fetch Pokémon species list.");
    return;
  }
  const speciesList = await speciesListRes.json();
  const pokemonByGeneration = {
    I: [],
    II: [],
    III: [],
    IV: [],
    V: [],
    VI: [],
    VII: [],
    VIII: [],
    IX: [],
  };

  console.log(
    `Found ${speciesList.results.length} species. Checking each for null habitat...`
  );

  // Using Promise.all to fetch details concurrently for speed
  const promises = speciesList.results.map(async (species) => {
    try {
      const speciesDetailsRes = await fetch(species.url);
      if (speciesDetailsRes.ok) {
        const speciesDetails = await speciesDetailsRes.json();
        if (speciesDetails.habitat === null) {
          const id = speciesDetails.id;
          const generation = getGenById(id);
          pokemonByGeneration[generation].push({
            name: speciesDetails.name,
            url: species.url,
          });
          process.stdout.write(`.`); // Show progress
        }
      }
    } catch (error) {
      // It's okay if some fail, we'll just skip them
    }
  });

  await Promise.all(promises);
  console.log("\n");

  const outputPath = path.resolve(
    process.cwd(),
    "src/constants/nullHabitatPokemonByGen.ts"
  );
  let fileContent = `// This file is auto-generated. Do not edit manually.
// Run \`npm run generate-null-habitat-list\` to update.
import { NamedAPIResource } from '../types';

`;

  for (const gen in pokemonByGeneration) {
    // Sort each list alphabetically
    pokemonByGeneration[gen].sort((a, b) => a.name.localeCompare(b.name));
    const constName = `NULL_HABITAT_POKEMON_GEN_${gen}`;
    fileContent += `export const ${constName}: NamedAPIResource[] = ${JSON.stringify(
      pokemonByGeneration[gen],
      null,
      2
    )};\n\n`;
    console.log(
      `Found ${pokemonByGeneration[gen].length} null-habitat Pokémon in Gen ${gen}.`
    );
  }

  fs.writeFileSync(outputPath, fileContent, "utf8");
  console.log(
    `\n✅ Successfully generated lists of Pokémon with null habitat by generation.`
  );
  console.log(`File saved to: ${outputPath}`);
}

generateNullHabitatListsByGen();
