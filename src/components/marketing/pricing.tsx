"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { Segmented } from "@/components/ui/chips";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/format";
import { planStore, usePlan, type PlanId } from "@/lib/state/stores";

const PLANS: {
  id: PlanId;
  name: string;
  monthly: number;
  yearly: number;
  pitch: string;
  features: string[];
  highlight?: boolean;
}[] = [
  {
    id: "gratis",
    name: "Gratis",
    monthly: 0,
    yearly: 0,
    pitch: "Para validar tu primer producto sin poner tarjeta.",
    features: [
      "15 búsquedas de productos al día",
      "Puntuación explicada y calculadora contra entrega",
      "3 productos en seguimiento con alertas",
      "Ruta guiada «Tu primer producto ganador»",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 14.99,
    yearly: 9.99,
    pitch: "Para quien ya vende y quiere encontrar el siguiente ganador antes que nadie.",
    highlight: true,
    features: [
      "Búsquedas ilimitadas en los 7 países",
      "Biblioteca de anuncios y radar de tiendas completos",
      "Seguimiento y alertas sin límite",
      "Oportunidades entre países",
      "Exportar a CSV",
    ],
  },
  {
    id: "equipo",
    name: "Equipo",
    monthly: 29.99,
    yearly: 19.99,
    pitch: "Para equipos y agencias que trabajan varias tiendas.",
    features: ["Todo lo de Pro", "3 usuarios incluidos", "Alertas por email y WhatsApp (próximamente)", "Soporte prioritario en español"],
  },
];

function price(n: number) {
  return n === 0 ? "0" : n.toFixed(2).replace(".", ",");
}

export function PricingTable({ mode }: { mode: "public" | "app" }) {
  const [billing, setBilling] = useState<"mensual" | "anual">("anual");
  const current = usePlan();

  return (
    <div>
      <div className="mb-6 flex flex-col items-center gap-2">
        <Segmented
          label="Facturación"
          hideLabel
          value={billing}
          onChange={setBilling}
          options={[
            { value: "mensual", label: "Mensual" },
            { value: "anual", label: "Anual (ahorra 33 %)" },
          ]}
        />
        <p className="text-sm text-text-2">Precios en dólares (USD). Sin permanencia: cancelas cuando quieras desde tu cuenta.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const amount = billing === "anual" ? p.yearly : p.monthly;
          const isCurrent = mode === "app" && current === p.id;
          return (
            <div
              key={p.id}
              className={cn(
                "flex flex-col rounded-2xl border bg-surface p-6 shadow-card",
                p.highlight ? "border-primary ring-1 ring-primary" : "border-border",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-text">{p.name}</h3>
                {p.highlight ? <Badge tone="primary">El más elegido</Badge> : null}
              </div>
              <p className="mt-1 min-h-10 text-sm text-text-2">{p.pitch}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="tabular text-4xl font-extrabold tracking-tight text-text">US$ {price(amount)}</span>
                <span className="text-sm text-muted">/mes</span>
              </div>
              <p className="min-h-5 text-xs text-muted">
                {amount > 0 && billing === "anual" ? `US$ ${price(amount * 12)} al año` : amount > 0 ? "Facturado cada mes" : "Para siempre"}
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-text">
                    <Check size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                {mode === "public" ? (
                  <Link
                    href="/ingresar"
                    className={cn(
                      "flex h-11 items-center justify-center rounded-xl text-sm font-semibold",
                      p.highlight ? "bg-primary text-primary-fg hover:bg-primary-hover" : "border border-border-strong text-text hover:bg-surface-2",
                    )}
                  >
                    {p.id === "gratis" ? "Empezar gratis" : `Probar ${p.name}`}
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={isCurrent}
                    onClick={() => planStore.set(p.id)}
                    className={cn(
                      "flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold disabled:cursor-default",
                      isCurrent
                        ? "bg-surface-2 text-text-2"
                        : p.highlight
                          ? "bg-primary text-primary-fg hover:bg-primary-hover"
                          : "border border-border-strong text-text hover:bg-surface-2",
                    )}
                  >
                    {isCurrent ? "Tu plan actual" : `Cambiar a ${p.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {mode === "app" ? (
        <p className="mt-4 text-center text-xs text-muted">
          Demostración: el cambio de plan es inmediato y no cobra nada. Con el backend, el pago irá por Stripe en modo prueba.
        </p>
      ) : null}
    </div>
  );
}
