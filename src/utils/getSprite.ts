import { isValidImageUrl } from "./isValidImageUrl";

type GetSpriteOptions = {
  name: string;
  isShiny: boolean;
  type: "2d" | "3d";
};

export const getSprite = async ({
  name,
  isShiny,
  type,
}: GetSpriteOptions): Promise<string | null> => {
  const isMega = name.toLowerCase().includes("-mega");
  const nameClean = isMega
    ? name.toLowerCase()
    : name.toLowerCase().replace(/-/g, "");
  const nameWithoutForm = name.toLowerCase().split("-")[0];

  const baseUrl =
    type === "3d"
      ? `https://play.pokemonshowdown.com/sprites/xyani${
          isShiny ? "-shiny/" : "/"
        }`
      : `https://play.pokemonshowdown.com/sprites/gen5/`;

  const extension = type === "3d" ? ".gif" : ".png";

  const spriteUrl = `${baseUrl}${nameClean}${extension}`;

  if (await isValidImageUrl(spriteUrl)) {
    return spriteUrl;
  }

  // If it has a dash and the first attempt failed, try without the form
  if (name.includes("-")) {
    const fallbackUrl = `${baseUrl}${nameWithoutForm}${extension}`;
    if (await isValidImageUrl(fallbackUrl)) {
      return fallbackUrl;
    }
  }

  return null;
};
