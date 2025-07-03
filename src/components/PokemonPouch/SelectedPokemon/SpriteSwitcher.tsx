import React from "react";

interface SpriteSwitcherProps {
  set3dSprite: () => void;
  set2dSprite: () => void;
}

const SpriteSwitcher: React.FC<SpriteSwitcherProps> = ({
  set3dSprite,
  set2dSprite,
}) => {
  return (
    <>
      <p>Update Sprite</p>
      <div className="flex items-center justify-between gap-1">
        <button
          onClick={set3dSprite}
          className="text-sm text-link hover:underline"
        >
          3D
        </button>
        /
        <button
          onClick={set2dSprite}
          className={"text-sm text-link hover:underline"}
        >
          2D
        </button>
      </div>
    </>
  );
};

export default SpriteSwitcher;
