import Link from "next/link";
import { Package } from "lucide-react";
import { Sparkline } from "@/components/charts/small-charts";
import { PLATFORM_NAME } from "@/lib/data/catalog";
import type { Listing } from "@/lib/data/types";
import { formatInt, formatMoney } from "@/lib/format";
import { ProductThumb, SaturationBadge, ScoreRing, TrendBadge } from "./bits";

export function ProductCard({ listing: l }: { listing: Listing }) {
  return (
    <Link
      href={`/app/productos/${l.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-card transition-colors hover:border-primary"
    >
      <div className="flex items-start gap-3">
        <ProductThumb category={l.category} />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-bold text-text group-hover:text-primary-ink">{l.name}</h3>
          <p className="mt-0.5 text-xs text-muted">
            {l.category} · {PLATFORM_NAME[l.platform]}
          </p>
        </div>
        <ScoreRing score={l.score} size={46} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-muted">Ventas 7 d</div>
          <div className="tabular text-sm font-bold text-text">{formatInt(l.sales7d)}</div>
        </div>
        <div>
          <div className="text-muted">Costo</div>
          <div className="tabular text-sm font-bold text-text">{formatMoney(l.costPrice, l.country)}</div>
        </div>
        <div>
          <div className="text-muted">Venta sug.</div>
          <div className="tabular text-sm font-bold text-text">{formatMoney(l.suggestedPrice, l.country)}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <TrendBadge growth={l.growth} />
          <SaturationBadge level={l.saturation} short />
        </div>
        <Sparkline values={l.history.map((h) => h.units)} label={`Ventas de 30 días de ${l.name}`} width={80} height={28} />
      </div>

      <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-xs text-text-2">
        <Package size={14} aria-hidden />
        {l.stock === 0 ? (
          <span className="font-semibold text-danger">Agotado</span>
        ) : (
          <span>
            Stock <span className="tabular font-semibold text-text">{formatInt(l.stock)}</span>
            {l.stockDays < 999 ? <span className="text-muted"> · {l.stockDays} días</span> : null}
          </span>
        )}
      </div>
    </Link>
  );
}
