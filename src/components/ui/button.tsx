"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", icon, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium tracking-tight transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 hover:shadow-[0_4px_12px_rgba(11,31,58,0.06)]";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/95",
      secondary: "bg-subtle-gray text-foreground border border-hairline hover:bg-hairline/50",
      gold: "bg-gold text-primary hover:bg-gold/90",
      outline: "border border-primary text-primary hover:bg-primary/5",
      ghost: "text-foreground hover:bg-subtle-gray",
    };

    const sizes = {
      sm: "text-xs px-4 py-2 gap-1.5",
      md: "text-sm px-6 py-3 gap-2.5",
      lg: "text-base px-8 py-4 gap-3",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...(props as any)}
      >
        <span>{children}</span>
        {icon && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black/5 dark:bg-white/10 shrink-0">
            {icon}
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
