import { formatInt } from "@/lib/format";

/** Mini gráfico de línea para tarjetas. El valor y la tendencia van también en texto al lado. */
export function Sparkline({
  values,
  width = 96,
  height = 32,
  color = "var(--series-1)",
  label,
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  label: string;
}) {
  const max = Math.max(1, ...values);
  const n = values.length;
  const pad = 3;
  const pts = values.map((v, i) => [
    pad + (i / Math.max(1, n - 1)) * (width - pad * 2),
    pad + (1 - v / max) * (height - pad * 2),
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width - pad},${height} L${pad},${height} Z`;
  const [lx, ly] = pts[pts.length - 1] ?? [0, 0];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <title>{label}</title>
      <path d={area} fill={color} opacity="0.1" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill={color} stroke="var(--surface)" strokeWidth="2" />
    </svg>
  );
}

/** Barras horizontales de una sola serie, con el valor al final de cada barra. */
export function BarList({
  items,
  format = formatInt,
  color = "var(--series-1)",
}: {
  items: { label: string; value: number; hint?: string }[];
  format?: (v: number) => string;
  color?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.label} className="group" title={`${item.label}: ${format(item.value)}`}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium text-text">{item.label}</span>
            <span className="tabular shrink-0 font-semibold text-text-2">
              {format(item.value)}
              {item.hint ? <span className="ml-1 font-normal text-muted">{item.hint}</span> : null}
            </span>
          </div>
          <div className="h-3 w-full rounded-r bg-surface-2">
            <div
              className="h-3 rounded-r-[4px] transition-opacity group-hover:opacity-80"
              style={{ width: `${Math.max(2, (item.value / max) * 100)}%`, background: color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Siete casillas: un día con venta = casilla llena. Hace visible la regla de «ventas repartidas». */
export function RegularityDots({ units }: { units: number[] }) {
  const days = units.slice(-7);
  const withSales = days.filter((u) => u > 0).length;
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Vendió ${withSales} de los últimos 7 días`}>
      {days.map((u, i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-[3px] ${u > 0 ? "bg-primary" : "border border-border-strong bg-transparent"}`}
        />
      ))}
    </div>
  );
}
