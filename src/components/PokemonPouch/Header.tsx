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
      className="w-full flex flex-col items-center pt-2 cursor-grab touch-none"
    >
      <div className="w-12 h-1.5 bg-gray-400 rounded-full mb-2" />
      <div className="w-full flex items-center justify-between px-4 gap-4 place-items-center">
        <div className="flex items-center gap-1">
          <Pokeball className="w-6 h-6" />
          {inventoryCount}
        </div>
        <div className="flex items-center gap-1">
          <Stardust className="w-6 h-6" />
          {points}
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
