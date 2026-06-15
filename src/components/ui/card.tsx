import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  outerClassName?: string;
}

export function Card({ className, outerClassName, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-subtle-gray border border-hairline/80 p-1.5 rounded-[1.5rem]",
        outerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "bg-white border border-hairline/40 p-6 md:p-8 rounded-[calc(1.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_8px_rgba(15,23,42,0.01)] h-full flex flex-col justify-between",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-bold font-display tracking-tight text-foreground leading-snug",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm text-slate-500 leading-relaxed max-w-[65ch]",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm text-foreground flex-grow", className)} {...props} />;
}
