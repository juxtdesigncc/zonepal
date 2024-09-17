import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BoundedProps {
  as?: React.ElementType;
  size?: "small" | "base" | "wide" | "widest"; 
  className?: string;
  children: ReactNode;
}

export function Bounded({
  as: Comp = "div",
  size = "base",
  className = "",
  children,
}: BoundedProps) {
  return (
    <Comp className={cn("px-4 py-8 md:px-6 md:py-10 lg:py-12", className)}>
      <div
        className={cn(
          "mx-auto w-full",
          size === "small" && "max-w-xl",
          size === "base" && "max-w-3xl",
          size === "wide" && "max-w-4xl",
          size === "widest" && "max-w-6xl",
        )}
      >
        {children}
      </div>
    </Comp>
  );
}
