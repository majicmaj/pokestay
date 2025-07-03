import Pokeball from "../../assets/icons/Pokeball";
import Stardust from "../../assets/icons/Stardust";

interface HeaderSectionProps {
  inventoryCount: number;
  points: number;
}

const Header: React.FC<HeaderSectionProps> = ({ inventoryCount, points }) => {
  return (
    <div className="w-full flex items-center justify-between px-4 gap-4 place-items-center p-2">
      <div className="flex items-center gap-1">
        <Pokeball className="w-6 h-6" />
        {inventoryCount}
      </div>
      <div className="flex items-center gap-1">
        <Stardust className="w-6 h-6" />
        {points}
      </div>
    </div>
  );
};

export default Header;
