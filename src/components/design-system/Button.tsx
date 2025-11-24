import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "icon-small";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children?: ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "md",
  icon,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) => {
  const baseStyles = "font-medium transition-all duration-200 focus:outline-none inline-flex items-center justify-center gap-2";

  const variantStyles = {
    primary: cn(
      "bg-gradient-to-r from-[#06b6d4] to-[#0369a1]",
      "text-white text-sm font-medium",
      "rounded-md shadow-[0_10px_15px_-3px_rgba(6,182,212,0.5)]",
      "hover:from-[#0891b2] hover:to-[#0369a1]",
      "focus:outline-2 focus:outline-[#a5f3fc] focus:outline-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none"
    ),
    secondary: cn(
      "bg-transparent border border-[rgba(6,182,212,0.2)]",
      "text-gray-300",
      "rounded-md",
      "hover:bg-[rgba(15,23,42,0.3)] hover:text-white",
      "focus:outline-2 focus:outline-[#a5f3fc] focus:outline-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none"
    ),
    "icon-small": cn(
      "w-5 h-5 p-0",
      "bg-[rgba(30,41,59,0.56)] border border-[rgba(55,65,81,0.5)]",
      "text-[#22d3ee]",
      "rounded",
      "hover:bg-[rgba(30,41,59,0.69)] hover:text-[#a5f3fc]",
      "disabled:opacity-50 disabled:pointer-events-none"
    ),
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const appliedSizeStyles = variant === "icon-small" ? "" : sizeStyles[size];

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], appliedSizeStyles, className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
};
