import Pokeball from "../../assets/icons/Pokeball";
import Stardust from "../../assets/icons/Stardust";
import { motion, DragControls } from "framer-motion";

interface HeaderSectionProps {
  inventoryCount: number;
  points: number;
  dragControls: DragControls;
}

const Header: React.FC<HeaderSectionProps> = ({
  inventoryCount,
  points,
  dragControls,
}) => {
  return (
    <motion.div
      onPointerDown={(e) => dragControls.start(e)}
      className="w-full flex flex-col items-center pt-3 pb-2 cursor-grab touch-none sticky top-0 bg-secondary z-20"
    >
      <div className="w-12 h-1.5 bg-gray-400 rounded-full mb-2" />
      <div className="w-full flex items-center justify-end px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-primary px-3 py-1 rounded-full">
            <Pokeball className="w-5 h-5" />
            <span className="font-semibold">{inventoryCount}</span>
          </div>
          <div className="flex items-center gap-2 bg-primary px-3 py-1 rounded-full">
            <Stardust className="w-5 h-5" />
            <span className="font-semibold">{points}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
