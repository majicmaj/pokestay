import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "../../context/SoundProvider";

const SoundButton = () => {
  const { soundEnabled, toggleSound } = useSound();
  return (
    <button
      onClick={toggleSound}
      className="text-white absolute right-14 top-2 p-2 bg-black/20 rounded-full z-10"
    >
      {soundEnabled ? <Volume2 /> : <VolumeX />}
    </button>
  );
};

export default SoundButton;
