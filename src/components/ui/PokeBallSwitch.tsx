import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { twMerge } from "tailwind-merge";

const PokeBallSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={twMerge(
      "relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 data-[state=checked]:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={twMerge(
        "pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0"
      )}
    >
      <div className="absolute inset-0 rounded-full border-2 border-zinc-800">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-danger rounded-t-full" />
        <div className="absolute inset-y-0 my-auto h-0.5 w-full bg-zinc-800" />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-800 bg-white" />
      </div>
    </SwitchPrimitive.Thumb>
  </SwitchPrimitive.Root>
));
PokeBallSwitch.displayName = "PokeBallSwitch";

export default PokeBallSwitch;
