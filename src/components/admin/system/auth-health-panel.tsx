"use client";

import { CheckCircle2, KeyRound, Shield, XCircle } from "lucide-react";
import type { AuthHealth } from "@/lib/system-health/types";

interface AuthHealthPanelProps {
  auth: AuthHealth;
}

export function AuthHealthPanel({ auth }: AuthHealthPanelProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-6">
      <div>
        <h2 className="font-display text-base font-bold text-ink">
          Authentication Subsystem Health
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">
          Supabase Auth integration, Google OAuth provider configuration, and session security.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* 1. Supabase Auth Status */}
        <div className="rounded-xl border border-line bg-surface-elevated/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-muted">Supabase Auth API</span>
            {auth.supabaseAuthReachable ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                <CheckCircle2 className="size-3.5" /> Reachable
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-rose-500">
                <XCircle className="size-3.5" /> Unreachable
              </span>
            )}
          </div>
          <div className="mt-3 text-lg font-bold text-ink">
            {auth.supabaseAuthReachable ? "Connected" : "Disconnected"}
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            Session probe responded successfully
          </p>
        </div>

        {/* 2. Google OAuth Provider */}
        <div className="rounded-xl border border-line bg-surface-elevated/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-muted">Google OAuth Provider</span>
            {auth.googleProviderConfigured ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                <CheckCircle2 className="size-3.5" /> Configured
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                Not configured
              </span>
            )}
          </div>
          <div className="mt-3 text-lg font-bold text-ink">
            {auth.googleProviderConfigured ? "Active (PKCE)" : "Pending Setup"}
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            Sign-up and sign-in OAuth callback handler active
          </p>
        </div>

        {/* 3. Recent Auth Errors */}
        <div className="rounded-xl border border-line bg-surface-elevated/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-muted">Recent Auth Errors (1h)</span>
            <Shield className="size-4 text-purple-500" />
          </div>
          <div className="mt-3 text-lg font-bold text-ink">
            {auth.recentAuthErrorsCount}
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            {auth.recentAuthErrorsCount === 0
              ? "Zero authentication failures detected"
              : "Includes expired sessions or invalid credentials"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-line/60 bg-surface-elevated/20 p-4 text-xs text-ink-muted space-y-2">
        <div className="flex items-center gap-2 font-semibold text-ink">
          <KeyRound className="size-4 text-primary" />
          <span>Security & Privacy Guarantee</span>
        </div>
        <p className="leading-relaxed">
          Operational health telemetry never records or inspects OAuth authorization codes, access tokens, refresh tokens, or user credentials. Only aggregate HTTP status codes and response timings are measured.
        </p>
      </div>
    </div>
  );
}
