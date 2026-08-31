/**
 * Centralized Legal & Compliance Configuration for Meritloom.
 *
 * IMPORTANT:
 * This configuration holds dates and operator placeholders for legal pages.
 * Any fields that are not yet officially determined (such as specific legal entity
 * or governing jurisdiction) remain null and are gracefully omitted or phrased
 * conservatively in public policies.
 */
export interface LegalConfig {
  /** Displayed date of policy publication/updates */
  privacyLastUpdated: string;
  termsLastUpdated: string;

  /** Optional legal entity or operator name (if registered) */
  operatorName: string | null;

  /** Optional designated contact/support email */
  supportEmail: string | null;

  /** Optional governing law jurisdiction (pending formal legal counsel) */
  jurisdiction: string | null;

  /** Minimum age recommendation if established by operator */
  minimumAge: number | null;
}

export const legalConfig: LegalConfig = {
  privacyLastUpdated: "2026-08-31",
  termsLastUpdated: "2026-08-31",
  operatorName: null,
  supportEmail: null,
  jurisdiction: null,
  minimumAge: null,
};
