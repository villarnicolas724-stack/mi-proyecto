"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Eye, Megaphone, Puzzle, Search, Store as StoreIcon } from "lucide-react";
import { AreaChart } from "@/components/charts/area-chart";
import { BarList, Sparkline } from "@/components/charts/small-charts";
import { ProductThumb } from "@/components/product/bits";
import { AdCard } from "@/components/screens/ad-card";
import { Badge, Card, CardHeader, EmptyState, Input, Label, PageHeader, StatTile } from "@/components/ui/primitives";
import { COUNTRY_BY_CODE } from "@/lib/data/catalog";
import { formatShortDate } from "@/lib/data/dates";
import { getBestListing, getStore, listAds, listStores } from "@/lib/data";
import { formatCompact, formatInt, formatMoney, formatPct } from "@/lib/format";
import { useCountry } from "@/lib/state/stores";

/** Los ingresos de tiendas son estimaciones: se muestran como rango. */
function estimateRange(value: number, country: Parameters<typeof formatMoney>[1]) {
  return `${formatCompactMoney(value * 0.8, country)} – ${formatCompactMoney(value * 1.2, country)}`;
}

function formatCompactMoney(value: number, country: Parameters<typeof formatMoney>[1]) {
  const c = COUNTRY_BY_CODE[country];
  return new Intl.NumberFormat(c.locale, {
    style: "currency",
    currency: c.currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function StoreRadar() {
  const country = useCountry();
  const [query, setQuery] = useState("");
  const stores = listStores(country, query);

  return (
    <>
      <PageHeader
        title="Tiendas"
        description="Tiendas de la competencia con productos más vendidos, anuncios activos y apps. Los ingresos son estimaciones para comparar, no cifras contables."
      />
      <div className="mb-4 max-w-md">
        <Label htmlFor="store-q">Buscar tienda</Label>
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" aria-hidden />
          <Input id="store-q" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder="Nombre de la tienda" />
        </div>
      </div>

      {stores.length === 0 ? (
        <EmptyState icon={<StoreIcon size={32} />} title="No hay tiendas con ese nombre" />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {stores.map((s) => {
            const change = ((s.revenue30d - s.revenuePrev30d) / Math.max(1, s.revenuePrev30d)) * 100;
            return (
              <Link
                key={s.id}
                href={`/app/tiendas/${s.id}`}
                className="flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-card hover:border-primary"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-text">{s.name}</h2>
                    <p className="truncate text-xs text-muted">{s.domain}</p>
                  </div>
                  <Badge tone={change > 5 ? "success" : change < -5 ? "danger" : "neutral"}>{formatPct(change)}</Badge>
                </div>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted">Ingresos estimados (30 d)</div>
                    <div className="tabular text-sm font-bold text-text">{estimateRange(s.revenue30d, s.country)}</div>
                  </div>
                  <Sparkline values={s.revenueHistory.map((h) => h.revenue)} label={`Ingresos estimados de ${s.name}`} width={88} />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-text-2">
                  <span className="inline-flex items-center gap-1">
                    <Eye size={13} aria-hidden /> {formatCompact(s.monthlyVisits)} visitas/mes
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Megaphone size={13} aria-hidden /> {s.activeAds} anuncios
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Puzzle size={13} aria-hidden /> {s.apps.length} apps
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

export function StoreDetail({ id }: { id: string }) {
  const s = getStore(id)!;
  const ads = listAds({ country: s.country, sort: "dias" }).filter((a) => a.advertiser === s.name);
  const change = ((s.revenue30d - s.revenuePrev30d) / Math.max(1, s.revenuePrev30d)) * 100;

  return (
    <>
      <Link href="/app/tiendas" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-text-2 hover:text-text">
        <ArrowLeft size={16} aria-hidden /> Tiendas
      </Link>
      <PageHeader
        title={s.name}
        description={`${s.domain} · ${COUNTRY_BY_CODE[s.country].name} · tema ${s.theme} · activa desde ${formatShortDate(s.createdAt, true)}`}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Ingresos estimados (30 d)" value={formatCompactMoney(s.revenue30d, s.country)} hint={`rango ${estimateRange(s.revenue30d, s.country)}`} />
        <StatTile label="Frente a los 30 días previos" value={formatPct(change)} />
        <StatTile label="Visitas al mes" value={formatCompact(s.monthlyVisits)} hint="estimadas" />
        <StatTile label="Anuncios activos" value={formatInt(s.activeAds)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader title="Ingresos estimados por día" subtitle="Últimos 30 días" />
          <div className="p-5 pt-4">
            <AreaChart
              label={`Ingresos estimados por día de ${s.name}`}
              data={s.revenueHistory.map((h) => ({ day: h.day, value: h.revenue }))}
              format={(v) => formatMoney(v, s.country)}
              formatAxis={(v) => formatCompactMoney(v, s.country)}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Apps instaladas" subtitle="Detectadas en la tienda" />
          <ul className="flex flex-wrap gap-2 p-5 pt-3">
            {s.apps.map((a) => (
              <li key={a}>
                <Badge className="px-3 py-1 text-sm">{a}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Productos más vendidos" subtitle="Unidades estimadas en 30 días" />
        <div className="grid gap-6 p-5 pt-4 lg:grid-cols-2">
          <BarList items={s.topProducts.map((p) => ({ label: p.name, value: p.estUnits30d, hint: "u." }))} />
          <ul className="divide-y divide-border">
            {s.topProducts.map((p) => {
              const l = getBestListing(p.groupId, s.country);
              return (
                <li key={p.groupId}>
                  <Link
                    href={l ? `/app/productos/${l.id}` : "/app/productos"}
                    className="flex items-center gap-3 py-2.5 hover:opacity-80"
                  >
                    <ProductThumb category={p.category} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-text">{p.name}</div>
                      <div className="text-xs text-text-2">
                        Vende a {formatMoney(p.price, s.country)}
                        {l ? ` · costo ${formatMoney(l.costPrice, s.country)}` : ""}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>

      <h2 className="mt-8 mb-3 text-lg font-bold text-text">Sus anuncios</h2>
      {ads.length === 0 ? (
        <EmptyState icon={<Megaphone size={28} />} title="No tiene anuncios activos ahora" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {ads.slice(0, 9).map((a) => (
            <AdCard key={a.id} ad={a} />
          ))}
        </div>
      )}
    </>
  );
}
