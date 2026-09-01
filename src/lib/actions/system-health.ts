"use server";

import { requireAdmin } from "@/lib/auth/admin";
import { getFullSystemHealthDashboard } from "@/lib/system-health/queries";
import { runDatabaseIntegrityAudit } from "@/lib/system-health/database";
import { runSecurityAuditChecks } from "@/lib/system-health/security";
import type { TimeRange } from "@/lib/system-health/types";

export async function refreshSystemHealthAction(range: TimeRange = "24h") {
  await requireAdmin();
  try {
    const data = await getFullSystemHealthDashboard(range);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to refresh system health",
    };
  }
}

export async function runDatabaseIntegrityCheckAction() {
  await requireAdmin();
  try {
    const result = await runDatabaseIntegrityAudit();
    return { success: true, result };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to run database integrity checks",
    };
  }
}

export async function runSecurityAuditAction() {
  await requireAdmin();
  try {
    const result = await runSecurityAuditChecks();
    return { success: true, result };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to run security audit",
    };
  }
}
