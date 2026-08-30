"use client";

import * as React from "react";
import Image from "next/image";
import { Camera, Loader2, Trash2 } from "lucide-react";

import { removeAvatarAction, uploadAvatarAction } from "@/lib/actions/profile";

interface AvatarUploaderProps {
  currentAvatarUrl: string | null;
  fullName: string;
  onAvatarChange: (newUrl: string | null) => void;
}

export function AvatarUploader({
  currentAvatarUrl,
  fullName,
  onAvatarChange,
}: AvatarUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Generate initials fallback from fullName
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name[0] || "L").toUpperCase();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);

    // Client-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Please select a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image must be 5 MB or smaller.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    const result = await uploadAvatarAction(formData);

    if (result.success && result.avatarUrl) {
      onAvatarChange(result.avatarUrl);
    } else {
      setErrorMessage(result.error || "Failed to upload image.");
    }

    setIsUploading(false);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    setErrorMessage(null);
    setIsUploading(true);
    const result = await removeAvatarAction();
    if (result.success) {
      onAvatarChange(null);
    } else {
      setErrorMessage(result.error || "Failed to remove photo.");
    }
    setIsUploading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        {/* Avatar Display */}
        <div className="relative size-20 sm:size-24 rounded-full overflow-hidden border-2 border-line bg-surface flex items-center justify-center shrink-0 shadow-soft">
          {currentAvatarUrl ? (
            <Image
              src={currentAvatarUrl}
              alt={fullName}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-xl sm:text-2xl font-extrabold text-primary select-none">
              {getInitials(fullName)}
            </span>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
              <Loader2 className="size-6 animate-spin" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Action Buttons & Format details */}
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="sr-only"
              id="avatar-upload-input"
              aria-label="Upload new profile picture"
            />

            {/* Trigger Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-line bg-card px-3 text-xs font-bold text-ink hover:border-primary/40 hover:text-primary transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <Camera className="size-3.5" aria-hidden="true" />
              <span>Change photo</span>
            </button>

            {/* Remove Button (if avatar exists) */}
            {currentAvatarUrl && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-xs font-bold text-muted hover:border-rose-500/40 hover:text-rose-500 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-muted">
            JPG, PNG or WebP • Max 5 MB
          </p>

          {errorMessage && (
            <p className="text-xs font-semibold text-rose-500 animate-in fade-in-0 duration-150">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
