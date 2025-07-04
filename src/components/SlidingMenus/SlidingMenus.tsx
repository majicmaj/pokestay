import { Footprints, LogOut, ScrollText, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BuddyPokemon from "./BuddyPokemon";
import EncounterLog from "./EncounterLog";
import PokemonPouch from "../PokemonPouch/PokemonPouch";
import {
  AnimatePresence,
  motion,
  PanInfo,
  useDragControls,
} from "framer-motion";

const SlidingMenus = ({ handleFlee }: { handleFlee: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeMenu = location.pathname.split("/")[1] || "none";
  const dragControls = useDragControls();

  const handleClose = () => navigate("/");

  const menuVariants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y > 200 || info.velocity.y > 200) {
      handleClose();
    }
  };

  const menuContent = {
    pouch: <PokemonPouch dragControls={dragControls} />,
    log: <EncounterLog dragControls={dragControls} />,
  };

  return (
    <div>
      {/* FABs */}
      <div className="fixed top-2 left-2">
        <button
          className="p-2 bg-black/20 rounded-full text-white drop-shadow-md"
          onClick={handleFlee}
        >
          <Footprints className="h-6 w-6" />
        </button>
      </div>

      <Link to="/log">
        <div className="fixed bottom-4 left-4 z-10 p-2 bg-black/20 rounded-full text-white drop-shadow-md">
          <ScrollText className="h-6 w-6" />
        </div>
      </Link>

      <BuddyPokemon />

      <AnimatePresence>
        {(activeMenu === "pouch" || activeMenu === "log") && (
          <motion.div
            key={activeMenu}
            className={`fixed inset-y-0 right-0 w-full bg-lime-200 bg-gradient-to-br from-lime-200 to-teal-500 px-2 shadow-lg backdrop-blur-md z-40`}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
          >
            <div
              className={`mt-2 h-full w-full overflow-hidden rounded-t-xl text-accent-content dark:bg-dark-primary dark:text-dark-text ${
                activeMenu === "pouch" ? "bg-background" : "bg-secondary"
              }`}
            >
              <Link
                to="/"
                className="z-20 absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 p-2 text-lime-200 border border-lime-200"
              >
                <X className="h-6 w-6" />
              </Link>
              {menuContent[activeMenu as keyof typeof menuContent]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlidingMenus;
