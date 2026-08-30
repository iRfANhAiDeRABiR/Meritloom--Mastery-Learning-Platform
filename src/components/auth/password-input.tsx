"use client";

import * as React from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div
        className={cn(
          "relative flex h-[50px] w-full items-center rounded-[13px] border bg-card transition-all duration-200 shadow-xs",
          error
            ? "border-rose-500 ring-2 ring-rose-500/15"
            : isFocused
            ? "border-primary ring-2 ring-primary/15"
            : "border-line hover:border-line/80",
          className,
        )}
      >
        {/* Left Lock Icon */}
        <span
          className={cn(
            "pointer-events-none absolute left-4 flex items-center transition-colors duration-200",
            error
              ? "text-rose-500"
              : isFocused
              ? "text-primary"
              : "text-muted",
          )}
          aria-hidden="true"
        >
          <LockKeyhole className="size-[18px]" />
        </span>

        {/* Password Input Field */}
        <input
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className="h-full w-full bg-transparent pl-11 pr-11 text-sm text-ink placeholder:text-muted focus:outline-none"
        />

        {/* Right Show/Hide Reveal Button */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3.5 grid size-7 place-items-center rounded-lg text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
