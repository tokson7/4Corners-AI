"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  floatingLabel?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, floatingLabel = false, type = "text", ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = props.value !== "" || props.defaultValue !== "";

    if (floatingLabel) {
      return (
        <div className="relative">
          <input
            type={type}
            className={cn(
              "peer w-full px-4 pt-6 pb-2 rounded-lg",
              "bg-white/5 border border-white/10",
              "text-foreground placeholder:text-transparent",
              "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50",
              "transition-all",
              error && "border-red-500/50 focus:ring-red-500/50",
              className
            )}
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          <label
            className={cn(
              "absolute left-4 transition-all pointer-events-none",
              focused || hasValue
                ? "top-2 text-xs text-muted-foreground"
                : "top-1/2 -translate-y-1/2 text-base text-muted-foreground",
              error && "text-red-400"
            )}
          >
            {label}
          </label>
          {error && (
            <p className="mt-1 text-xs text-red-400">{error}</p>
          )}
        </div>
      );
    }

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium mb-2 text-foreground">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full px-4 py-2 rounded-lg",
            "bg-white/5 border border-white/10",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50",
            "transition-all",
            error && "border-red-500/50 focus:ring-red-500/50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
