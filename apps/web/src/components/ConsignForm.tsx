"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitConsignment, type FormState } from "@/lib/actions";
import { CheckIcon, ArrowRight, SparkleIcon } from "@/components/Icons";

const CATEGORIES = [
  "Footwear",
  "Outerwear",
  "Watches",
  "Apparel",
  "Electronics",
  "Accessories",
  "Other",
];
const CONDITIONS = ["New", "Like New", "Good", "Fair"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-quantum-500 to-quantum-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-quantum-900/40 transition hover:from-quantum-400 hover:to-quantum-500 disabled:opacity-60"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Submitting…
        </>
      ) : (
        <>
          Submit for review <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

export function ConsignForm() {
  const [state, formAction] = useFormState<FormState, FormData>(submitConsignment, null);

  if (state?.ok) {
    return (
      <div className="card animate-fade-up p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
          <CheckIcon className="h-7 w-7" />
        </div>
        <h3 className="font-display text-xl font-bold text-white">Request received!</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-stardust/60">{state.message}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/consign" className="btn-primary">
            Submit another item
          </a>
          <a href="/store" className="btn-ghost">
            Browse the store
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="card p-6 sm:p-8">
      {state?.error && (
        <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {state.error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Your name
          </label>
          <input id="name" name="name" className="input" placeholder="Jane Doe" required />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            placeholder="jane@email.com"
            required
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="title">
            Item title
          </label>
          <input
            id="title"
            name="title"
            className="input"
            placeholder="e.g. Quantum Aero Runner — Size 42"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="brand">
            Brand <span className="text-stardust/30">(optional)</span>
          </label>
          <input id="brand" name="brand" className="input" placeholder="Quantum Space X" />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="category">
            Category
          </label>
          <select id="category" name="category" className="input" defaultValue="Apparel">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-space-800">
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="condition">
            Condition
          </label>
          <select id="condition" name="condition" className="input" defaultValue="New">
            {CONDITIONS.map((c) => (
              <option key={c} value={c} className="bg-space-800">
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="askingPrice">
            Asking price (USD)
          </label>
          <input
            id="askingPrice"
            name="askingPrice"
            type="number"
            min="1"
            step="1"
            className="input"
            placeholder="180"
            required
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="label" htmlFor="imageUrl">
          Image URL <span className="text-stardust/30">(optional)</span>
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          className="input"
          placeholder="https://… (a link to a photo of your item)"
        />
      </div>

      <div className="mt-5">
        <label className="label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="input resize-none"
          placeholder="Describe the item: size, flaws, story, what's included…"
          required
        />
      </div>

      <div className="mt-7">
        <SubmitButton />
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-stardust/40">
        <SparkleIcon className="h-3.5 w-3.5" />
        Free submission · Reviewed within 24–48h
      </p>
    </form>
  );
}
