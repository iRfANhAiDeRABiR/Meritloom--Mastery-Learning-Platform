"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PracticeResetDialogProps {
  onClose: () => void;
  onConfirmReset: () => void;
}

export function PracticeResetDialog({ onClose, onConfirmReset }: PracticeResetDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-6 shadow-2xl space-y-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
          <RotateCcw className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-ink">
            Reset your code?
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            This will restore the original starter code for this practice activity. Any unsaved edits will be cleared.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl border-line text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700"
          >
            Reset code
          </Button>
        </div>
      </div>
    </div>
  );
}
