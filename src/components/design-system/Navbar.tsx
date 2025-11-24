import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export const Navbar = ({ children, className, ...props }: NavbarProps) => {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50",
        "bg-[rgba(15,23,42,0.95)] backdrop-blur-[10px]",
        "border-b border-[rgba(6,182,212,0.125)]",
        "h-16",
        "px-4",
        "flex items-center justify-between",
        className
      )}
      {...props}
    >
      {children}
    </nav>
  );
};
