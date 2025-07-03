import Pokeball from "../../assets/icons/Pokeball";
import Stardust from "../../assets/icons/Stardust";

interface HeaderSectionProps {
  inventoryCount: number;
  points: number;
}

const Header: React.FC<HeaderSectionProps> = ({ inventoryCount, points }) => {
  return (
    <div className="pt-8 w-full grid grid-cols-3 gap-4 place-items-center bg-primary p-4 rounded-b-xl">
      <div className="flex items-center gap-1">
        <Pokeball className="w-6 h-6" />
        {inventoryCount}
      </div>
      <h1 className="text-md text-center font-bold">POKEMON</h1>
      <div className="flex items-center gap-1">
        <Stardust className="w-6 h-6" />
        {points}
      </div>
    </div>
  );
};

export default Header;
