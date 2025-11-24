import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-[rgba(14,41,63,0.31)]",
        "border border-[rgba(6,182,212,0.125)]",
        "rounded-lg",
        "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
        "p-6",
        "text-white",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
