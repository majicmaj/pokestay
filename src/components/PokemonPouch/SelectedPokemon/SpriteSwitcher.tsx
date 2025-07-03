import React from "react";
import { cn } from "../../../utils/cn";

interface SpriteSwitcherProps {
  set3dSprite: () => void;
  set2dSprite: () => void;
  // Add a prop to determine the current sprite type if available
  // Example: currentSprite: '2d' | '3d';
}

const SpriteSwitcher: React.FC<SpriteSwitcherProps> = ({
  set3dSprite,
  set2dSprite,
}) => {
  return (
    <div className="w-full bg-primary rounded-lg p-4 shadow-md flex flex-col items-center gap-2">
      <h3 className="text-lg font-bold text-center mb-2">Sprite Style</h3>
      <div className="flex items-center justify-center gap-4 w-full">
        <button
          onClick={set2dSprite}
          className={cn(
            "w-full bg-secondary text-content font-bold py-2 px-4 rounded-lg transition-transform active:scale-95"
            // Example for active state: { 'bg-accent': currentSprite === '2d' }
          )}
        >
          2D
        </button>
        <button
          onClick={set3dSprite}
          className={cn(
            "w-full bg-secondary text-content font-bold py-2 px-4 rounded-lg transition-transform active:scale-95"
            // Example for active state: { 'bg-accent': currentSprite === '3d' }
          )}
        >
          3D
        </button>
      </div>
    </div>
  );
};

export default SpriteSwitcher;
