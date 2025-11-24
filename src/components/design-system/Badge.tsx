import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export const Badge = ({ children, className, ...props }: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "px-3 py-1",
        "rounded-full",
        "bg-gradient-to-r from-[rgba(6,182,212,0.125)] to-[rgba(3,105,161,0.125)]",
        "backdrop-blur-md",
        "border border-[rgba(6,182,212,0.188)]",
        "text-sm font-medium text-[#a5f3fc]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
