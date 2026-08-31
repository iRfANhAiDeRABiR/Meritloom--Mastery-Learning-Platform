"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  CircleAlert,
  CircleCheck,
  Info,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const icons: ToasterProps["icons"] = {
  success: <CircleCheck className="size-[18px] shrink-0" aria-hidden="true" />,
  error: <CircleAlert className="size-[18px] shrink-0" aria-hidden="true" />,
  warning: <TriangleAlert className="size-[18px] shrink-0" aria-hidden="true" />,
  info: <Info className="size-[18px] shrink-0" aria-hidden="true" />,
  loading: <LoaderCircle className="size-[18px] shrink-0 animate-spin" aria-hidden="true" />,
};

export function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme === "dark" ? "dark" : "light") as ToasterProps["theme"];

  return (
    <Sonner
      theme={theme}
      position="top-right"
      offset={{ top: "22px", right: "22px", bottom: "22px", left: "22px" }}
      mobileOffset={{ bottom: "16px" }}
      visibleToasts={4}
      gap={10}
      closeButton
      richColors={false}
      expand={false}
      icons={icons}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "group meritloom-toast !rounded-[15px] !border !p-3.5 sm:!p-4 !gap-3 !shadow-[0_2px_10px_rgba(16,24,40,0.08),0_24px_40px_-20px_rgba(16,24,40,0.22)] dark:!shadow-[0_8px_32px_rgba(0,0,0,0.45)]",
          title: "!text-[13.5px] !font-semibold !leading-snug !tracking-tight",
          description: "!text-[12.5px] !leading-relaxed",
          actionButton:
            "!rounded-full !bg-ink !px-3.5 !py-1.5 !text-xs !font-bold !text-white hover:!bg-ink/90",
          cancelButton: "!rounded-full !border !border-line !bg-card !text-xs !font-semibold !text-ink",
          closeButton:
            "!size-7 !rounded-full !border !border-line !bg-card !text-muted hover:!text-ink hover:!border-line",
          icon: "!size-[18px]",
        },
      }}
      className="meritloom-toaster"
      {...props}
    />
  );
}
