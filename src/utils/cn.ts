import { twMerge } from "tailwind-merge";

export const cn = (
  ...inputs: (string | undefined | null | boolean)[]
): string => {
  return twMerge(inputs.filter(Boolean).join(" "));
};
