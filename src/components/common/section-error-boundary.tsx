"use client";

import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionErrorBoundaryProps {
  title?: string;
  fallbackMessage?: string;
  children: React.ReactNode;
  className?: string;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
}

export class SectionErrorBoundary extends React.Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[SectionErrorBoundary caught]", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border border-line bg-card/60 p-6 text-center shadow-xs min-h-[160px]",
            this.props.className,
          )}
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 mb-2">
            <AlertCircle className="size-4" aria-hidden="true" />
          </div>

          <h4 className="text-sm font-bold text-ink">
            {this.props.title || "This section is temporarily unavailable"}
          </h4>

          <p className="mt-1 text-xs text-ink-muted max-w-sm">
            {this.props.fallbackMessage || "We encountered an issue loading this information."}
          </p>

          <Button
            onClick={this.handleRetry}
            variant="outline"
            size="sm"
            className="mt-3 gap-1.5 text-xs"
          >
            <RotateCcw className="size-3 text-primary" aria-hidden="true" />
            <span>Try again</span>
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

