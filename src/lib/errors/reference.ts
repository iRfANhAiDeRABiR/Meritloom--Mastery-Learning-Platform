/**
 * Generates and formats safe, opaque error reference identifiers.
 * Example outputs: ERR-A91F2C, ML-E82B14
 */

export function formatErrorDigest(digest?: string | null): string {
  if (!digest || typeof digest !== "string") {
    return generateErrorReference();
  }

  const clean = digest.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (clean.length >= 6) {
    return `ERR-${clean.slice(0, 8)}`;
  }

  return `ERR-${clean.padEnd(6, "0")}`;
}

export function generateErrorReference(prefix = "ERR"): string {
  // Use crypto if available (Node or browser), or timestamp fallback
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    const raw = crypto.randomUUID().replace(/-/g, "").toUpperCase();
    return `${prefix}-${raw.slice(0, 8)}`;
  }

  const timestampPart = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timestampPart.slice(-6)}`;
}

export function isValidErrorReference(ref?: string | null): boolean {
  if (!ref || typeof ref !== "string") return false;
  return /^[A-Z0-9_-]{4,32}$/i.test(ref.trim());
}

