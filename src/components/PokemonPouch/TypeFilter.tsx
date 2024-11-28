import TypeBadge from "../TypeBadge/TypeBadge";

interface TypeFilterProps {
  allTypes: string[];
  selectedTypes: string[];
  toggleTypeFilter: (type: string) => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({
  allTypes,
  selectedTypes,
  toggleTypeFilter,
}) => {
  return (
    <div className="w-full px-4 justify-between flex">
      {allTypes.map((type) => (
        <button
          key={type}
          onClick={() => toggleTypeFilter(type)}
          className={`m-[-6px] border rounded-full ${
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
