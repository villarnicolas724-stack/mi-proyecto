"use client";

import { useId, useState } from "react";
import { formatShortDate } from "@/lib/data/dates";

export interface SeriesPoint {
  day: string;
  value: number;
}

function niceMax(v: number): number {
  if (v <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * exp;
}

/**
 * Gráfico de área de una sola serie con cruz y tooltip al pasar el ratón o el dedo.
 * Una serie = sin leyenda: el título de la tarjeta dice qué se ve.
 * Incluye una tabla oculta para lectores de pantalla.
 */
export function AreaChart({
  data,
  color = "var(--series-1)",
  height = 180,
  label,
  format = (v) => String(v),
  formatAxis,
}: {
  data: SeriesPoint[];
  color?: string;
  height?: number;
  label: string;
  format?: (v: number) => string;
  formatAxis?: (v: number) => string;
}) {
  const id = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = 200;
  const max = niceMax(Math.max(...data.map((d) => d.value)));
  const n = data.length;
  const x = (i: number) => (n <= 1 ? 0 : (i / (n - 1)) * W);
  const y = (v: number) => H - (v / max) * H;
  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const ticks = [0, max / 2, max];
  const axis = formatAxis ?? format;
  const h = hover != null ? data[hover] : null;
  const last = data[n - 1];

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHover(Math.round(frac * (n - 1)));
  }

  return (
    <figure className="w-full">
      <div className="flex gap-2">
        {/* Eje Y */}
        <div className="tabular relative w-12 shrink-0 text-right text-xs text-muted" style={{ height }} aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${(1 - t / max) * 100}%` }}>
              {axis(t)}
            </span>
          ))}
        </div>
        {/* Área de dibujo */}
        <div
          className="relative min-w-0 flex-1 touch-none"
          style={{ height }}
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHover(null)}
          aria-hidden
        >
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id={`fill-${id}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.14" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {ticks.map((t) => (
              <line
                key={t}
                x1="0"
                x2={W}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--grid)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path d={area} fill={`url(#fill-${id})`} />
            <path
              d={line}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Punto final con etiqueta directa */}
          {hover == null && last ? (
            <span
              className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface"
              style={{ left: "100%", top: `${(y(last.value) / H) * 100}%`, background: color }}
            />
          ) : null}

          {h ? (
            <>
              <span
                className="pointer-events-none absolute top-0 bottom-0 w-px bg-border-strong"
                style={{ left: `${(x(hover!) / W) * 100}%` }}
              />
              <span
                className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface"
                style={{ left: `${(x(hover!) / W) * 100}%`, top: `${(y(h.value) / H) * 100}%`, background: color }}
              />
              <div
                className="pointer-events-none absolute top-1 z-10 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs shadow-card"
                style={{
                  left: `${(x(hover!) / W) * 100}%`,
                  transform: hover! > n * 0.6 ? "translateX(calc(-100% - 8px))" : "translateX(8px)",
                }}
              >
                <div className="text-muted">{formatShortDate(h.day)}</div>
                <div className="tabular font-bold text-text">{format(h.value)}</div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      {/* Eje X */}
      <div className="mt-1.5 flex justify-between pl-14 text-xs text-muted" aria-hidden>
        <span>{data[0] ? formatShortDate(data[0].day) : ""}</span>
        <span>{data[Math.floor(n / 2)] ? formatShortDate(data[Math.floor(n / 2)].day) : ""}</span>
        <span>{last ? formatShortDate(last.day) : ""}</span>
      </div>
      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">Día</th>
            <th scope="col">Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.day}>
              <td>{formatShortDate(d.day)}</td>
              <td>{format(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
