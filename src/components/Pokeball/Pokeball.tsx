import React, { useEffect, useRef, useState } from "react";
import { useSound } from "../../context/SoundProvider";
import useCurrentPokemon from "../../hooks/useCurrentPokemon";
import { getPokemonScale } from "../../utils/getPokemonScale";

interface PokeballProps {
  onClick: (throwSpeed: number, duration: number) => void;
  type: "pokeball" | "greatball" | "ultraball" | "masterball";
  disabled: boolean;
}

const getThrowAnimation = (
  throwSpeed: number,
  throwDirection: "left" | "right"
) => {
  const direction = throwDirection === "left" ? "-left" : "-right";

  if (throwSpeed > 5) return `excellent-throw${direction}`;
  if (throwSpeed > 3) return `great-throw${direction}`;
  if (throwSpeed > 1) return `nice-throw`;

  return "throw";
};

const Pokeball: React.FC<PokeballProps> = ({ onClick, type, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  // const [startTime, setStartTime] = useState(0);
  const [recentPositions, setRecentPositions] = useState<
    { time: number; y: number; x: number }[]
  >([]);
  const { soundEnabled, volume } = useSound();
  const [currentPokemon] = useCurrentPokemon();

  const ballRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const CONSTANT_MODIFIER = 1.2; // Adjust this value to tweak the throw speed

  const colors = {
    pokeball: { top: "bg-red-500", bottom: "bg-white" },
    greatball: { top: "bg-blue-500", bottom: "bg-white" },
    ultraball: { top: "bg-yellow-500", bottom: "bg-white" },
    masterball: { top: "bg-purple-500", bottom: "bg-white" },
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || disabled) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const currentTime = performance.now();
      setPosition({
        x: clientX - startPos.x,
        y: clientY - startPos.y,
      });

      // Update recent positions for the last 0.05 seconds
      setRecentPositions((prev) => [
        ...prev.filter((p) => currentTime - p.time <= 50),
        { time: currentTime, y: clientY, x: clientX },
      ]);
    };

    // e: MouseEvent | TouchEvent
    const handleMouseUp = () => {
      if (!isDragging || disabled) return;

      const endTime = performance.now();
      const validPositions = recentPositions.filter(
        (p) => endTime - p.time <= 50
      );
      const firstPosition = validPositions[0];
      const lastPosition = validPositions[validPositions.length - 1];

      let throwSpeed = 0;
      let throwDirection: "left" | "right" = "right";

      if (firstPosition && lastPosition) {
        const distanceY = firstPosition.y - lastPosition.y;
        const distanceX = lastPosition.x - firstPosition.x; // Horizontal direction
        const duration = lastPosition.time - firstPosition.time;

        throwSpeed = distanceY / duration;
        throwDirection = distanceX > 0 ? "right" : "left"; // Determine curve direction
        // console.log({distanceX, throwDirection})
      }

      throwSpeed *= CONSTANT_MODIFIER;

      if (throwSpeed > 0.5) {
        let duration = 1; // default duration
        if (currentPokemon && ballRef.current) {
          const scale = getPokemonScale(currentPokemon);
          const minScale = 0.125;
          const maxScale = 1.25;

          const minImpactHeight = 15; // vh
          const maxImpactHeight = 45; // vh
          const impactHeight =
            minImpactHeight +
            ((scale - minScale) / (maxScale - minScale)) *
              (maxImpactHeight - minImpactHeight);

          const arcHeight = impactHeight * 1.2;

          ballRef.current.style.setProperty(
            "--throw-impact-height",
            `-${impactHeight}vh`
          );
          ballRef.current.style.setProperty(
            "--throw-arc-height",
            `-${arcHeight}vh`
          );

          // Calculate dynamic duration
          const minDuration = 0.8; // seconds
          const maxDuration = 2; // seconds
          const dynamicDuration =
            minDuration +
            ((scale - minScale) / (maxScale - minScale)) *
              (maxDuration - minDuration);
          duration = dynamicDuration;

          // Calculate dynamic impact scale
          const minImpactScale = 0.6; // Ball appears larger for smaller pokemon
          const maxImpactScale = 0.1; // Ball appears smaller for larger pokemon
          const impactScale =
            minImpactScale -
            ((scale - minScale) / (maxScale - minScale)) *
              (minImpactScale - maxImpactScale);

          ballRef.current.style.setProperty(
            "--throw-impact-scale",
            `${impactScale}`
          );

          const throwAnimation = getThrowAnimation(throwSpeed, throwDirection);
          ballRef.current.style.animation = `${throwAnimation} ${duration}s ease-out`;
        } else if (ballRef.current) {
          // Fallback for when there's no pokemon
          const throwAnimation = getThrowAnimation(throwSpeed, throwDirection);
          ballRef.current.style.animation = `${throwAnimation} 1s ease-out`;
        }

        if (soundEnabled) {
          const audio = new Audio(
            "https://raw.githubusercontent.com/Superviral/Pokemon-GO-App-Assets-and-Images/master/Shared%20Assets/Converted%20AudioClip%20(WAV%20Format)/se_go_ball_throw%20%23000936_0.wav"
          );
          audio.volume = volume;
          audio.play();
        }
        onClick(throwSpeed, duration);
      }

      setIsDragging(false);
      setPosition({ x: 0, y: 0 });
      setRecentPositions([]);

      if (ballRef.current) {
        ballRef.current.style.transition = "transform 0.2s ease-out";
        ballRef.current.style.transform = "translate(0px, 0px)";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [
    isDragging,
    startPos,
    recentPositions,
    onClick,
    disabled,
    volume,
    soundEnabled,
    currentPokemon,
  ]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    if (ballRef.current) {
      ballRef.current.style.transition = "none";
      ballRef.current.style.animation = "none";
    }

    // setStartTime(performance.now());
    setIsDragging(true);
    setStartPos({
      x: clientX - position.x,
      y: clientY - position.y,
    });
    setRecentPositions([]);
  };

  return (
    <div
      ref={containerRef}
      className={`absolute bottom-4 size-24 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-grab"
      }`}
    >
      <div
        ref={ballRef}
        className={`size-24 rounded-full overflow-hidden relative
          ${
            isDragging && !disabled
              ? "cursor-grabbing"
              : disabled
              ? "cursor-not-allowed"
              : "cursor-grab"
          } 
          touch-none select-none transition-opacity duration-300`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          touchAction: "none",
        }}
      >
        {/* Top half */}
        <div
          className={`absolute top-0 left-0 right-0 h-1/2 ${colors[type].top}`}
        ></div>
        {/* Bottom half */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1/2 ${colors[type].bottom}`}
        ></div>
        {/* Center band */}
        <div className="absolute w-full h-2 bg-gray-800 top-1/2 -translate-y-1/2" />
        {/* Center button */}
        <div className="absolute size-8 rounded-full border-[6px] border-gray-800 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute size-full rounded-full bg-gray-300 border-[5px] border-gray-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
};

export default Pokeball;
