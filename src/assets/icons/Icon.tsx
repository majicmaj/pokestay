import { cn } from "../../utils/cn";
import Legendary from "./legendary.svg?react";

const Icon = ({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) => {
  switch (name) {
    case "legendary":
      return <Legendary className={cn("text-inherit size-6", className)} />;
    default:
      return null;
  }
};

export default Icon;
