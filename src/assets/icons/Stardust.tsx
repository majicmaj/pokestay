import StardustIcon from "./stardust.png";
const Stardust = ({ className = "h-4 w-4" }: { className?: string }) => (
  <img className={className} src={StardustIcon} alt="Stardust" />
);

export default Stardust;
