"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex origin-center items-center justify-center gap-2 text-[14px] font-medium tracking-[0.04em] transition-[background-color,border-color,box-shadow,color,opacity,transform] duration-[350ms] ease-out active:scale-[0.98] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45 disabled:hover:translate-y-0",
  {
    variants: {
      variant: {
        default: "premium-cta",
        outline: "premium-cta-secondary backdrop-blur-xl",
        ghost: "text-[#17243a] hover:bg-[#17243a]/5"
      },
      size: {
        default: "min-h-[2.875rem] px-5",
        lg: "min-h-12 px-6",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
