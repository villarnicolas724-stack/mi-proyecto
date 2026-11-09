"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/format";

/** Selección múltiple con chips. Accesible como grupo de casillas. */
export function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T[];
  onChange: (next: T[]) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold text-text">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = value.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              role="checkbox"
              aria-checked={active}
              onClick={() => onChange(active ? value.filter((v) => v !== o.value) : [...value, o.value])}
              className={cn(
                "inline-flex min-h-9 items-center gap-1 rounded-full border px-3 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary-soft text-primary-ink"
                  : "border-border-strong bg-surface text-text-2 hover:bg-surface-2",
              )}
            >
              {active ? <Check size={14} aria-hidden /> : null}
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Control segmentado (una sola opción). */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  hideLabel,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
  hideLabel?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      {hideLabel ? null : <div className="mb-1.5 text-sm font-semibold text-text">{label}</div>}
      <div className="inline-flex flex-wrap rounded-xl border border-border-strong bg-surface-2 p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-9 rounded-lg px-3 text-sm font-semibold transition-colors",
              value === o.value ? "bg-surface text-text shadow-card" : "text-text-2 hover:text-text",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
