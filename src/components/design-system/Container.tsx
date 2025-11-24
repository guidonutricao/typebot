import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Container = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div
      className={cn("max-w-[72rem] mx-auto px-6", className)}
      {...props}
    >
      {children}
    </div>
  );
};
