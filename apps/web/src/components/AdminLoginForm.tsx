"use client";

import { useFormState, useFormStatus } from "react-dom";
import { adminLogin, type FormState } from "@/lib/actions";
import { LogoMark } from "./Logo";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-quantum-500 to-quantum-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-quantum-900/40 transition hover:from-quantum-400 hover:to-quantum-500 disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Enter admin"}
    </button>
  );
}

export function AdminLoginForm() {
  const [state, formAction] = useFormState<FormState, FormData>(adminLogin, null);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-fit">
            <LogoMark className="h-12 w-12" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin portal</h1>
          <p className="mt-1 text-sm text-stardust/50">Quantum Space X · operations</p>
        </div>

        <form action={formAction} className="card p-6">
          {state && !state.ok && (
            <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {state.message}
            </div>
          )}
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            placeholder="••••••••"
            autoFocus
          />
          <div className="mt-5">
            <Submit />
          </div>
          <p className="mt-3 text-center text-xs text-stardust/30">
            Demo password: <span className="font-mono text-stardust/50">quantumx-admin</span>
          </p>
        </form>
      </div>
    </div>
  );
}
