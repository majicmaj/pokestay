import React from "react";
import { cn } from "../../../utils/cn";

interface SpriteSwitcherProps {
  set3dSprite: () => void;
  set2dSprite: () => void;
  currentSprite: "2d" | "3d";
  isShiny: boolean;
  onToggleShiny: () => void;
  hasGenderDifference: boolean;
  onToggleGender: () => void;
}

const SpriteSwitcher: React.FC<SpriteSwitcherProps> = ({
  set3dSprite,
  set2dSprite,
  currentSprite,
  isShiny,
  onToggleShiny,
  hasGenderDifference,
  onToggleGender,
}) => {
  return (
    <div className="w-full bg-primary rounded-lg p-4 shadow-md flex flex-col items-center gap-2">
      <h3 className="text-sm text-center mb-2">Sprite Style</h3>
      <div className="flex items-center justify-center gap-2 w-full">
        <button
          onClick={set2dSprite}
          className={cn(
            "w-full bg-card text-foreground font-bold py-2 px-4 rounded-lg transition-transform active:scale-95",
            currentSprite === "2d" && "bg-accent"
          )}
        >
          2D
        </button>
        <button
          onClick={set3dSprite}
          className={cn(
            "w-full bg-card text-foreground font-bold py-2 px-4 rounded-lg transition-transform active:scale-95",
            currentSprite === "3d" && "bg-accent"
          )}
        >
          3D
        </button>
        <button
          onClick={onToggleShiny}
          className={cn(
            "w-full bg-card text-foreground font-bold py-2 px-4 rounded-lg transition-transform active:scale-95",
            isShiny && "ring-2 ring-yellow-400"
          )}
        >
          Shiny
        </button>
        <button
          onClick={onToggleGender}
          className={cn(
            "w-full bg-card text-foreground font-bold py-2 px-4 rounded-lg transition-transform active:scale-95",
            "disabled:opacity-50"
          )}
          disabled={!hasGenderDifference}
        >
          Gender
        </button>
      </div>
    </div>
  );
};

export default SpriteSwitcher;
