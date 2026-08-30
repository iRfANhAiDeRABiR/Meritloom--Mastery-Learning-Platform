"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuContent = DropdownMenuPrimitive.Content;
const DropdownMenuItem = DropdownMenuPrimitive.Item;
const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};

export type DropdownContentProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>;

const DropdownMenuPanel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuContent>,
  DropdownContentProps
>(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuContent
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[220px] overflow-hidden rounded-[18px] border border-line bg-card p-2 text-ink shadow-lift backdrop-blur-md",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuPanel.displayName = "DropdownMenuPanel";

export { DropdownMenuPanel };
