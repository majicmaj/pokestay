import React, { useState, useRef, useEffect } from 'react';

interface PokeballProps {
  onClick: (throwSpeed: number) => void;
  type: 'pokeball' | 'greatball' | 'ultraball' | 'masterball';
  disabled: boolean;
}

const getThrowAnimation = (throwSpeed: number) => {
  if (throwSpeed > 5) return 'excellent-throw';
  if (throwSpeed > 3) return 'great-throw';
  if (throwSpeed > 1) return 'nice-throw';

  return 'throw';
};

const Pokeball: React.FC<PokeballProps> = ({ onClick, type, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(0);
  const [recentPositions, setRecentPositions] = useState<{ time: number; y: number }[]>([]);

  const ballRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const CONSTANT_MODIFIER = 1.2; // Adjust this value to tweak the throw speed

  const colors = {
    pokeball: { top: 'bg-red-500', bottom: 'bg-white' },
    greatball: { top: 'bg-blue-500', bottom: 'bg-white' },
    ultraball: { top: 'bg-yellow-500', bottom: 'bg-white' },
    masterball: { top: 'bg-purple-500', bottom: 'bg-white' },
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || disabled) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const currentTime = performance.now();
      setPosition({
        x: clientX - startPos.x,
        y: clientY - startPos.y,
      });

      // Update recent positions for the last 0.05 seconds
      setRecentPositions((prev) => [
        ...prev.filter((p) => currentTime - p.time <= 50),
        { time: currentTime, y: clientY },
      ]);
    };

    const handleMouseUp = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || disabled) return;

      const endTime = performance.now();
      const clientY =
        'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;

      // Calculate throw distance and speed based on the last 0.05 seconds
      const validPositions = recentPositions.filter((p) => endTime - p.time <= 50);
      const firstPosition = validPositions[0];
      const lastPosition = validPositions[validPositions.length - 1];

      let throwSpeed = 0;

      if (firstPosition && lastPosition) {
        const distance = firstPosition.y - lastPosition.y;
        const duration = lastPosition.time - firstPosition.time;
        throwSpeed = distance / duration;
      }

      throwSpeed *= CONSTANT_MODIFIER; // Apply the constant modifier

      if (throwSpeed > 0) {
        onClick(throwSpeed);

        if (ballRef.current) {
          const throwAnimation = getThrowAnimation(throwSpeed);
          ballRef.current.style.animation = `${throwAnimation} 1s ease-in`;
        }
      }

      setIsDragging(false);
      setPosition({ x: 0, y: 0 });
      setRecentPositions([]);

      if (ballRef.current) {
        ballRef.current.style.transition = 'transform 0.2s ease-out';
        ballRef.current.style.transform = 'translate(0px, 0px)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, startPos, recentPositions, onClick, disabled]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (ballRef.current) {
      ballRef.current.style.transition = 'none';
      ballRef.current.style.animation = 'none';
    }

    setStartTime(performance.now());
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
      className={`mb-8 w-32 h-32 ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-grab'
      }`}
    >
      <div
        ref={ballRef}
        className={`w-32 h-32 rounded-full overflow-hidden relative
          ${
            isDragging && !disabled
              ? 'cursor-grabbing'
              : disabled
              ? 'cursor-not-allowed'
              : 'cursor-grab'
          } 
          touch-none select-none transition-opacity duration-300`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          touchAction: 'none',
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
        <div className="absolute w-full h-3 bg-gray-800 top-1/2 -translate-y-1/2"></div>
        {/* Center button */}
        <div className="absolute w-12 h-12 rounded-full bg-white border-8 border-gray-800 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute w-5 h-5 rounded-full bg-gray-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default Pokeball;
