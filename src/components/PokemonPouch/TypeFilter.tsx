import { X } from "lucide-react";
import TypeBadge from "../TypeBadge/TypeBadge";

interface TypeFilterProps {
  allTypes: string[];
  selectedTypes: string[];
  toggleTypeFilter: (type: string) => void;
  setSelectedTypes: (types: string[]) => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({
  allTypes,
  selectedTypes,
  toggleTypeFilter,
  setSelectedTypes,
}) => {
  return (
    <div className="w-full p-2 justify-between overflow-auto min-h-max flex">
      <button
        onClick={() => setSelectedTypes([])}
        className="min-w-max border rounded-full border-transparent"
      >
        <X />
      </button>
      {allTypes.map((type) => (
        <button
          key={type}
          onClick={() => toggleTypeFilter(type)}
          className={`m-[-6px] min-w-max border rounded-full ${
            selectedTypes.includes(type)
              ? "border-lime-500 opacity-100 saturate-100"
              : "border-transparent opacity-80 saturate-70"
          }`}
        >
          <TypeBadge type={type} />
        </button>
      ))}
    </div>
  );
};

export default TypeFilter;
