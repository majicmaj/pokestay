import React from "react";

const CatchTimingIndicator: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute w-full h-full rounded-full border-2 border-white opacity-75" />
      <div className="absolute rounded-full border-4 animate-catch-ring" />
    </div>
  );
};

export default CatchTimingIndicator;
