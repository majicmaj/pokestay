import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { twMerge } from "tailwind-merge";

const PokemonSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={twMerge(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-600">
      <SliderPrimitive.Range className="absolute h-full bg-green-500" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-zinc-800 bg-white shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
      <div className="relative h-full w-full">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-danger rounded-t-full" />
        <div className="absolute inset-y-0 my-auto h-0.5 w-full bg-zinc-800" />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-800 bg-white" />
      </div>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
PokemonSlider.displayName = "PokemonSlider";

export default PokemonSlider;
