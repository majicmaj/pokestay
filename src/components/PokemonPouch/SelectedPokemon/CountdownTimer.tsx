import { useEffect, useState } from "react";

const CountdownTimer = ({ revertAt }: { revertAt: number }) => {
  const calculateRemainingTime = () => {
    const now = Date.now();
    const remaining = revertAt - now;

    if (remaining <= 0) {
      return "00:00:00";
    }

    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revertAt]);

  return <span>{remainingTime}</span>;
};

export default CountdownTimer;
