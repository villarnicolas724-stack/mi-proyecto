"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react";
import { Badge, Input, Label } from "@/components/ui/primitives";
import { COUNTRY_BY_CODE } from "@/lib/data/catalog";
import { calculateProfit, type ProfitInput } from "@/lib/data/profit";
import type { CountryCode } from "@/lib/data/types";
import { formatInt, formatMoney, formatPct } from "@/lib/format";
import { completeStep } from "@/lib/state/stores";

/** Redondeo «local» para valores por defecto (100 COP, 10 CLP, 1 MXN, 0,5 USD…). */
function roundLocal(value: number, country: CountryCode): number {
  const cur = COUNTRY_BY_CODE[country].currency;
  const step = cur === "COP" ? 100 : cur === "CLP" ? 10 : cur === "USD" || cur === "PEN" || cur === "EUR" ? 0.5 : 1;
  return Math.round(value / step) * step;
}

export function defaultProfitInput(
  country: CountryCode,
  partial: { price?: number; cost?: number; deliveryRate?: number } = {},
): ProfitInput {
  const c = COUNTRY_BY_CODE[country];
  return {
    price: partial.price ?? roundLocal(30 * c.fx, country),
    cost: partial.cost ?? roundLocal(9 * c.fx, country),
    shipping: c.shipping,
    returnShipping: c.shipping,
    cpa: roundLocal(4 * c.fx, country),
    deliveryRate: partial.deliveryRate ?? Math.round(((c.deliveryRange[0] + c.deliveryRange[1]) / 2) * 100),
    feePct: 0,
    extraCost: 0,
  };
}

function NumberField({
  id,
  label,
  value,
  onChange,
  hint,
  suffix,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
  suffix?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className={suffix ? "pr-10" : undefined}
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
        {suffix ? (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted">{suffix}</span>
        ) : null}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function ProfitCalculator({ country, initial }: { country: CountryCode; initial: ProfitInput }) {
  const [v, setV] = useState<ProfitInput>(initial);
  const r = calculateProfit(v);
  const money = (n: number) => formatMoney(n, country);
  const currency = COUNTRY_BY_CODE[country].currency;

  function set<K extends keyof ProfitInput>(key: K, value: ProfitInput[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
    completeStep("calcular");
  }

  const verdict =
    r.verdict === "gana"
      ? { tone: "success" as const, icon: <CircleCheck size={14} aria-hidden />, text: "Rentable" }
      : r.verdict === "justo"
        ? { tone: "warning" as const, icon: <TriangleAlert size={14} aria-hidden />, text: "Margen justo" }
        : { tone: "danger" as const, icon: <CircleAlert size={14} aria-hidden />, text: "Pierdes dinero" };

  const breakdown = [
    { label: `Ingresos (${formatInt(r.delivered)} entregados)`, value: r.revenue, sign: 1 },
    { label: "Costo de producto", value: r.productCost, sign: -1 },
    { label: `Fletes (ida + ${formatInt(r.returned)} devoluciones)`, value: r.shippingCost, sign: -1 },
    { label: "Publicidad (100 pedidos × CPA)", value: r.adCost, sign: -1 },
    ...(r.fees > 0 ? [{ label: "Comisiones", value: r.fees, sign: -1 }] : []),
    ...(r.extra > 0 ? [{ label: "Otros costos", value: r.extra, sign: -1 }] : []),
  ];

  const scenarios = [-10, 0, 10].map((delta) => {
    const rate = Math.min(100, Math.max(0, v.deliveryRate + delta));
    return { rate, profit: calculateProfit({ ...v, deliveryRate: rate }).profitPerDelivered };
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <form className="grid grid-cols-2 gap-3" onSubmit={(e) => e.preventDefault()} aria-label="Datos del cálculo">
        <NumberField id="calc-price" label={`Precio de venta (${currency})`} value={v.price} onChange={(n) => set("price", n)} />
        <NumberField id="calc-cost" label="Costo del proveedor" value={v.cost} onChange={(n) => set("cost", n)} />
        <NumberField id="calc-ship" label="Flete de envío" value={v.shipping} onChange={(n) => set("shipping", n)} />
        <NumberField
          id="calc-ret"
          label="Flete de devolución"
          value={v.returnShipping}
          onChange={(n) => set("returnShipping", n)}
          hint="Lo pagas si el cliente no recibe."
        />
        <NumberField
          id="calc-cpa"
          label="CPA (publicidad por pedido)"
          value={v.cpa}
          onChange={(n) => set("cpa", n)}
          hint="Lo que te cuesta en anuncios cada pedido."
        />
        <NumberField id="calc-fee" label="Comisión" value={v.feePct} onChange={(n) => set("feePct", n)} suffix="%" />
        <div className="col-span-2">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="calc-rate">Efectividad de entrega</Label>
            <span className="tabular text-sm font-bold text-text">{v.deliveryRate} %</span>
          </div>
          <input
            id="calc-rate"
            type="range"
            min={30}
            max={100}
            step={1}
            value={v.deliveryRate}
            onChange={(e) => set("deliveryRate", Number(e.target.value))}
            className="w-full"
            aria-describedby="calc-rate-hint"
          />
          <p id="calc-rate-hint" className="text-xs text-muted">
            De cada 100 pedidos, cuántos se entregan y pagan. {COUNTRY_BY_CODE[country].deliveryHint}
          </p>
        </div>
        <NumberField
          id="calc-extra"
          label="Otros costos por pedido"
          value={v.extraCost}
          onChange={(n) => set("extraCost", n)}
          hint="Empaque, regalo, llamada de confirmación…"
        />
      </form>

      <div className="rounded-2xl bg-surface-2 p-5" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-text-2">Utilidad por pedido entregado</span>
          <Badge tone={verdict.tone}>
            {verdict.icon} {verdict.text}
          </Badge>
        </div>
        <div className={`tabular mt-1 text-4xl font-extrabold tracking-tight ${r.profit < 0 ? "text-danger" : "text-text"}`}>
          {money(r.profitPerDelivered)}
        </div>
        <p className="mt-1 text-sm text-text-2">
          {money(r.profit)} por cada 100 pedidos · margen {formatPct(r.marginPct, false)} sobre ventas
        </p>

        <dl className="mt-4 space-y-1.5 text-sm">
          {breakdown.map((b) => (
            <div key={b.label} className="flex justify-between gap-3">
              <dt className="text-text-2">{b.label}</dt>
              <dd className={`tabular font-semibold ${b.sign < 0 ? "text-text-2" : "text-text"}`}>
                {b.sign < 0 ? "− " : ""}
                {money(b.value)}
              </dd>
            </div>
          ))}
          <div className="flex justify-between gap-3 border-t border-border-strong pt-1.5">
            <dt className="font-bold text-text">Utilidad (100 pedidos)</dt>
            <dd className={`tabular font-extrabold ${r.profit < 0 ? "text-danger" : "text-success"}`}>{money(r.profit)}</dd>
          </div>
        </dl>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-surface p-2.5">
            <div className="text-xs text-muted">CPA máximo</div>
            <div className="tabular text-sm font-bold text-text">{money(r.breakEvenCpa)}</div>
          </div>
          <div className="rounded-xl bg-surface p-2.5">
            <div className="text-xs text-muted">ROAS mínimo</div>
            <div className="tabular text-sm font-bold text-text">
              {Number.isFinite(r.breakEvenRoas) ? r.breakEvenRoas.toFixed(2).replace(".", ",") : "—"}
            </div>
          </div>
          <div className="rounded-xl bg-surface p-2.5">
            <div className="text-xs text-muted">Precio mínimo</div>
            <div className="tabular text-sm font-bold text-text">
              {Number.isFinite(r.breakEvenPrice) ? money(r.breakEvenPrice) : "—"}
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted">Valores para no perder dinero, con el resto de datos fijos.</p>

        <div className="mt-4">
          <div className="text-xs font-semibold text-text-2">Si la efectividad cambia</div>
          <div className="mt-1.5 grid grid-cols-3 gap-2 text-center text-sm">
            {scenarios.map((s) => (
              <div key={s.rate} className="rounded-xl border border-border bg-surface p-2">
                <div className="text-xs text-muted">{s.rate} %</div>
                <div className={`tabular font-bold ${s.profit < 0 ? "text-danger" : "text-text"}`}>{money(s.profit)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
