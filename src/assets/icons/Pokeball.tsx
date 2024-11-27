const Pokeball = ({ className = "h-4 w-4" }: { className?: string }) => (
  <img
    className={className}
    src={
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
    }
    alt="Pokeball"
  />
);

export default Pokeball;
