import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4;
}

export const Heading = ({ children, level = 1, className, ...props }: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const styles = {
    1: "text-4xl font-bold bg-gradient-to-r from-white via-[#22d3ee] to-white bg-clip-text text-transparent",
    2: "text-3xl font-bold text-white",
    3: "text-2xl font-bold text-white",
    4: "text-xl font-bold text-white",
  };

  return (
    <Tag className={cn(styles[level], className)} {...props}>
      {children}
    </Tag>
  );
};

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  variant?: "default" | "lead" | "label-small" | "label-smaller";
}

export const Text = ({ children, variant = "default", className, ...props }: TextProps) => {
  const variantStyles = {
    default: "text-base text-white",
    lead: "text-lg text-[rgba(165,243,252,0.7)]",
    "label-small": "text-sm font-medium text-[#a5f3fc]",
    "label-smaller": "text-xs text-[#5eead4]",
  };

  return (
    <p className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </p>
  );
};
