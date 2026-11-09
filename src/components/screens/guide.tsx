"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CircleCheck, Gift, ListChecks, RotateCcw } from "lucide-react";
import { Button, Card, CardHeader, PageHeader } from "@/components/ui/primitives";
import { cn } from "@/lib/format";
import { GUIDE_STEPS, resetGuide, useGuide } from "@/lib/state/stores";

const CHECKLIST = [
  "Tiene 10 ventas o más en los últimos 7 días, repartidas en 4 días o más.",
  "Las ventas suben o se mantienen; no vienen de un solo pico.",
  "El precio de venta es al menos 2,5 veces el costo más el flete.",
  "La calculadora da utilidad positiva con una efectividad de entrega del 65 %.",
  "Saturación baja o media en tu país, o tienes un ángulo distinto.",
  "El stock alcanza para 15 días o hay un segundo proveedor.",
  "Encuentras al menos dos anuncios con más de 14 días activos (señal de que es rentable).",
];

const GLOSSARY = [
  { t: "Contra entrega", d: "El cliente paga al recibir. Más ventas, pero parte de los pedidos se devuelven." },
  { t: "Efectividad de entrega", d: "Porcentaje de pedidos que se entregan y se cobran." },
  { t: "CPA", d: "Costo por adquisición: lo que pagas en anuncios por cada pedido." },
  { t: "ROAS", d: "Retorno de la inversión publicitaria: ventas cobradas ÷ gasto en anuncios." },
  { t: "Saturación", d: "Cuántos vendedores anuncian ya el mismo producto en tu país." },
  { t: "Regularidad", d: "En cuántos de los últimos 7 días hubo ventas. Más días = demanda más fiable." },
];

export function Guide() {
  const guide = useGuide();
  const done = GUIDE_STEPS.filter((s) => guide[s.id]).length;
  const pct = Math.round((done / GUIDE_STEPS.length) * 100);

  return (
    <>
      <PageHeader
        title="Guía y recursos"
        description="Todo lo que necesitas para sacarle partido a Veta, en un solo sitio. Sin bonos escondidos."
      />

      <Card>
        <CardHeader
          title="Tu primer producto ganador"
          subtitle={`${done} de ${GUIDE_STEPS.length} pasos · ${pct} %`}
          action={
            done > 0 ? (
              <Button variant="ghost" size="sm" onClick={resetGuide}>
                <RotateCcw size={14} aria-hidden /> Empezar de nuevo
              </Button>
            ) : null
          }
        />
        <div className="px-5 pt-3">
          <div className="h-2 w-full rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso de la guía">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <ol className="space-y-2 p-5">
          {GUIDE_STEPS.map((s, i) => {
            const ok = !!guide[s.id];
            return (
              <li key={s.id}>
                <Link
                  href={s.href}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border p-4 transition-colors hover:border-primary",
                    ok ? "border-border bg-surface-2" : "border-border bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      ok ? "bg-success-soft text-success" : "bg-primary-soft text-primary-ink",
                    )}
                    aria-hidden
                  >
                    {ok ? <CircleCheck size={18} /> : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className={cn("font-bold", ok ? "text-text-2 line-through decoration-1" : "text-text")}>{s.title}</div>
                    <div className="text-sm text-text-2">{s.detail}</div>
                  </div>
                  <span className="sr-only">{ok ? "Hecho" : "Pendiente"}</span>
                  <ArrowRight size={16} className="text-muted" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ol>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <ListChecks size={18} aria-hidden /> Checklist para validar un producto
              </span>
            }
            subtitle="Si falla más de uno, busca otro."
          />
          <ul className="space-y-2 p-5 pt-3 text-sm">
            {CHECKLIST.map((c) => (
              <li key={c}>
                <label className="flex cursor-pointer gap-3 rounded-xl p-2 hover:bg-surface-2">
                  <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--primary)]" />
                  <span className="text-text">{c}</span>
                </label>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <BookOpen size={18} aria-hidden /> Glosario
              </span>
            }
            subtitle="Las palabras que vas a ver en la app."
          />
          <dl className="space-y-3 p-5 pt-3 text-sm">
            {GLOSSARY.map((g) => (
              <div key={g.t}>
                <dt className="font-bold text-text">{g.t}</dt>
                <dd className="text-text-2">{g.d}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <Gift size={18} className="text-accent" aria-hidden /> Recursos incluidos en tu plan
            </span>
          }
          subtitle="Siempre aquí, a un clic desde el menú."
        />
        <div className="grid gap-3 p-5 pt-3 md:grid-cols-3">
          {[
            { t: "Calculadora contra entrega", d: "Utilidad real por pedido, CPA y ROAS de equilibrio.", href: "/app/calculadora" },
            { t: "Oportunidades entre países", d: "Productos que ya venden en otro país y aquí no.", href: "/app" },
            { t: "Atajo «Ganadores probados»", d: "El filtro que aplica las reglas de esta guía.", href: "/app/productos" },
          ].map((r) => (
            <Link key={r.t} href={r.href} className="rounded-xl border border-border p-4 hover:border-primary">
              <div className="font-bold text-text">{r.t}</div>
              <div className="mt-1 text-sm text-text-2">{r.d}</div>
            </Link>
          ))}
        </div>
      </Card>
    </>
  );
}
