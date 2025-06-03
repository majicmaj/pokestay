type SortBy = "level" | "recent" | "name" | "cp" | "id";

interface SearchAndSortProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
}

const SearchAndSort: React.FC<SearchAndSortProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
}) => {
  const sortOptions: SortBy[] = ["cp", "level", "name", "id", "recent"];

  return (
    <div className="w-full p-4 px-8 flex flex-col gap-4">
      <input
        value={searchTerm}
        autoFocus
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-1 bg-lime-200 w-full rounded-full"
        placeholder="Search Pokemon"
      />
      <div className="flex w-full gap-4 text-sm">
        {sortOptions.map((option) => (
          <button
            key={option}
            className={sortBy === option ? "underline" : ""}
            onClick={() => setSortBy(option)}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndSort;
