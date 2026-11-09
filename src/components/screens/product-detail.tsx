"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  ArrowLeft,
  Bell,
  BellOff,
  Clock,
  ExternalLink,
  Lightbulb,
  Megaphone,
  Package,
  Star,
  Truck,
} from "lucide-react";
import { AreaChart } from "@/components/charts/area-chart";
import { RegularityDots } from "@/components/charts/small-charts";
import { ProductThumb, SaturationBadge, ScoreRing, TrendBadge } from "@/components/product/bits";
import { ProfitCalculator, defaultProfitInput } from "@/components/product/profit-calculator";
import { AdCard } from "@/components/screens/ad-card";
import { Badge, Button, ButtonLink, Card, CardHeader, StatTile } from "@/components/ui/primitives";
import { CATEGORY_ANGLES, COUNTRY_BY_CODE, PLATFORM_NAME } from "@/lib/data/catalog";
import { formatShortDate } from "@/lib/data/dates";
import { getAdsForGroup, getGroupCountrySummary, getGroupListings, getListing, getSupplier } from "@/lib/data";
import { metaAdLibraryUrl } from "@/lib/links";
import { cn, formatCompact, formatInt, formatMoney, formatUsd } from "@/lib/format";
import { completeStep, isWatched, toggleWatch, useWatchlist } from "@/lib/state/stores";

const STATUS: Record<string, { label: string; tone: "success" | "warning" | "danger" | "neutral" | "info" }> = {
  vendiendo: { label: "Vendiendo", tone: "info" },
  oportunidad: { label: "Oportunidad", tone: "success" },
  saturado: { label: "Saturado", tone: "danger" },
  "sin-proveedor": { label: "Sin proveedor", tone: "neutral" },
};

export function ProductDetail({ id }: { id: string }) {
  const l = getListing(id)!;
  const supplier = getSupplier(l.supplierId);
  const country = COUNTRY_BY_CODE[l.country];
  const watch = useWatchlist();
  const watched = isWatched(watch, l.id);

  const alternatives = getGroupListings(l.groupId)
    .filter((x) => x.country === l.country)
    .sort((a, b) => a.costPrice - b.costPrice);
  const countries = getGroupCountrySummary(l.groupId);
  const ads = getAdsForGroup(l.groupId, l.country);

  useEffect(() => {
    completeStep("detalle");
  }, []);

  const cheapest = Math.min(...alternatives.map((a) => a.costPrice));
  const mostStock = Math.max(...alternatives.map((a) => a.stock));
  const money = (n: number) => formatMoney(n, l.country);

  return (
    <>
      <Link href="/app/productos" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-text-2 hover:text-text">
        <ArrowLeft size={16} aria-hidden /> Productos
      </Link>

      {/* Cabecera */}
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-start">
        <ProductThumb category={l.category} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-1.5">
            <Badge>{l.category}</Badge>
            <Badge tone="primary">
              {PLATFORM_NAME[l.platform]} · {country.name}
            </Badge>
            <SaturationBadge level={l.saturation} />
            {l.stock === 0 ? <Badge tone="danger">Agotado</Badge> : null}
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-text sm:text-3xl">{l.name}</h1>
          <p className="mt-1 text-sm text-text-2">
            Proveedor <strong className="text-text">{supplier?.name}</strong>
            {supplier ? (
              <>
                {" "}
                · <Star size={13} className="-mt-0.5 inline text-accent" aria-hidden /> {supplier.rating.toFixed(1).replace(".", ",")} ·
                despacha en {supplier.dispatchHours} h · entrega el {Math.round(supplier.deliveryRate * 100)} %
              </>
            ) : null}{" "}
            · en catálogo desde el {formatShortDate(l.listedAt, true)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant={watched ? "secondary" : "primary"}
              onClick={() => toggleWatch(l.id)}
              aria-pressed={watched}
            >
              {watched ? <BellOff size={16} aria-hidden /> : <Bell size={16} aria-hidden />}
              {watched ? "Dejar de seguir" : "Seguir y activar alertas"}
            </Button>
            <ButtonLink href="#calculadora" variant="secondary">
              Calcular utilidad
            </ButtonLink>
            <a
              href={metaAdLibraryUrl(l.name, l.country)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border-strong bg-surface px-4 text-sm font-semibold text-text hover:bg-surface-2"
            >
              <ExternalLink size={16} aria-hidden /> Buscar anuncios reales en Meta
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <ScoreRing score={l.score} size={72} />
          <div>
            <div className="text-sm font-bold text-text">Puntuación Veta</div>
            <a href="#puntuacion" className="text-sm font-semibold text-primary-ink hover:underline">
              Ver por qué
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Ventas 7 días" value={formatInt(l.sales7d)} hint={<TrendBadge growth={l.growth} />} />
        <StatTile label="Ventas 30 días" value={formatInt(l.sales30d)} hint={`≈ ${formatCompact(l.sales30d * l.suggestedPrice)} facturados`} />
        <StatTile
          label="Stock"
          value={l.stock === 0 ? "0" : formatInt(l.stock)}
          hint={l.stock === 0 ? "Agotado" : l.stockDays < 999 ? `≈ ${l.stockDays} días` : "Sin ventas recientes"}
        />
        <StatTile label="Costo proveedor" value={money(l.costPrice)} hint={formatUsd(l.costPrice / country.fx)} />
        <StatTile label="Precio sugerido" value={money(l.suggestedPrice)} hint={`Flete ≈ ${money(country.shipping)}`} />
        <StatTile label="Anuncios activos" value={formatInt(l.adsInCountry)} hint={`en ${country.name}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Ventas diarias"
            subtitle="Unidades vendidas en los últimos 30 días"
            action={
              <div className="text-right">
                <RegularityDots units={l.history.map((h) => h.units)} />
                <div className="mt-1 text-xs text-muted">{l.daysWithSales7d} de 7 días con venta</div>
              </div>
            }
          />
          <div className="p-5 pt-4">
            <AreaChart
              label={`Ventas diarias de ${l.name}`}
              data={l.history.map((h) => ({ day: h.day, value: h.units }))}
              format={(v) => `${formatInt(v)} u.`}
              formatAxis={(v) => formatInt(v)}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Stock del proveedor" subtitle="Unidades disponibles cada día" />
          <div className="p-5 pt-4">
            <AreaChart
              label={`Stock de ${l.name}`}
              color="var(--series-2)"
              data={l.history.map((h) => ({ day: h.day, value: h.stock }))}
              format={(v) => `${formatInt(v)} u.`}
              formatAxis={(v) => formatCompact(v)}
            />
          </div>
        </Card>
      </div>

      {/* Puntuación explicada */}
      <Card id="puntuacion" className="mt-6 scroll-mt-6">
        <CardHeader
          title={`Por qué puntúa ${l.score} de 100`}
          subtitle="Seis factores, cada uno explicado. Úsalos para decidir, no solo el número."
        />
        <ul className="grid gap-3 p-5 pt-4 md:grid-cols-2 xl:grid-cols-3">
          {l.scoreParts.map((p) => (
            <li key={p.key} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-text">{p.label}</span>
                <Badge tone={p.verdict === "bien" ? "success" : p.verdict === "regular" ? "warning" : "danger"}>
                  {p.verdict === "bien" ? "Bien" : p.verdict === "regular" ? "Regular" : "Flojo"}
                </Badge>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-surface-2" aria-hidden>
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${(p.points / p.max) * 100}%` }} />
                </div>
                <span className="tabular text-xs font-semibold text-text-2">
                  {p.points}/{p.max}
                </span>
              </div>
              <p className="mt-2 text-sm text-text-2">{p.explanation}</p>
            </li>
          ))}
        </ul>
      </Card>

      {/* Calculadora */}
      <Card id="calculadora" className="mt-6 scroll-mt-6">
        <CardHeader
          title="¿Cuánto ganas por pedido?"
          subtitle="Calculado para contra entrega: incluye devoluciones y el flete de vuelta. Cambia cualquier valor."
        />
        <div className="p-5 pt-4">
          <ProfitCalculator
            country={l.country}
            initial={defaultProfitInput(l.country, {
              price: l.suggestedPrice,
              cost: l.costPrice,
              deliveryRate: supplier ? Math.round(supplier.deliveryRate * 100) : 72,
            })}
          />
        </div>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Comparador de proveedores */}
        <Card>
          <CardHeader
            title="Otros proveedores con este producto"
            subtitle={`El mismo producto en ${country.name}, del más barato al más caro.`}
          />
          <div className="overflow-x-auto p-5 pt-3">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="text-left text-xs font-semibold text-muted">
                <tr>
                  <th scope="col" className="py-2 pr-3">Proveedor</th>
                  <th scope="col" className="py-2 pr-3 text-right">Costo</th>
                  <th scope="col" className="py-2 pr-3 text-right">Stock</th>
                  <th scope="col" className="py-2 pr-3 text-right">Ventas 7 d</th>
                  <th scope="col" className="py-2 text-right">Entrega</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {alternatives.map((a) => {
                  const s = getSupplier(a.supplierId);
                  return (
                    <tr key={a.id} className={cn(a.id === l.id && "bg-primary-soft/60")}>
                      <td className="py-2.5 pr-3">
                        <Link href={`/app/productos/${a.id}`} className="font-semibold text-text hover:text-primary-ink">
                          {s?.name}
                        </Link>
                        <div className="text-xs text-muted">
                          {PLATFORM_NAME[a.platform]}
                          {a.id === l.id ? " · estás viendo este" : ""}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {a.costPrice === cheapest && alternatives.length > 1 ? <Badge tone="success">Más barato</Badge> : null}
                          {a.stock === mostStock && alternatives.length > 1 && a.stock > 0 ? <Badge tone="info">Más stock</Badge> : null}
                        </div>
                      </td>
                      <td className="tabular py-2.5 pr-3 text-right font-semibold">{money(a.costPrice)}</td>
                      <td className={cn("tabular py-2.5 pr-3 text-right", a.stock === 0 && "font-semibold text-danger")}>
                        {a.stock === 0 ? "Agotado" : formatInt(a.stock)}
                      </td>
                      <td className="tabular py-2.5 pr-3 text-right">{formatInt(a.sales7d)}</td>
                      <td className="tabular py-2.5 text-right">{s ? `${Math.round(s.deliveryRate * 100)} %` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {alternatives.length === 1 ? (
              <p className="mt-3 text-sm text-text-2">Solo un proveedor lo tiene en {country.name}: depende de su stock.</p>
            ) : null}
          </div>
        </Card>

        {/* Dónde venderlo */}
        <Card>
          <CardHeader title="Dónde venderlo" subtitle="Cómo está este producto en cada país." />
          <div className="overflow-x-auto p-5 pt-3">
            <table className="w-full min-w-[480px] text-sm">
              <thead className="text-left text-xs font-semibold text-muted">
                <tr>
                  <th scope="col" className="py-2 pr-3">País</th>
                  <th scope="col" className="py-2 pr-3 text-right">Ventas 7 d</th>
                  <th scope="col" className="py-2 pr-3 text-right">Anuncios</th>
                  <th scope="col" className="py-2 pr-3 text-right">Mejor costo</th>
                  <th scope="col" className="py-2">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {countries.map((c) => (
                  <tr key={c.country} className={cn(c.country === l.country && "bg-primary-soft/60")}>
                    <td className="py-2.5 pr-3 font-semibold text-text">{COUNTRY_BY_CODE[c.country].name}</td>
                    <td className="tabular py-2.5 pr-3 text-right">{c.listings ? formatInt(c.sales7d) : "—"}</td>
                    <td className="tabular py-2.5 pr-3 text-right">{c.listings ? formatInt(c.ads) : "—"}</td>
                    <td className="tabular py-2.5 pr-3 text-right">{c.bestCostUsd != null ? formatUsd(c.bestCostUsd) : "—"}</td>
                    <td className="py-2.5">
                      <Badge tone={STATUS[c.status].tone}>{STATUS[c.status].label}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-muted">
              «Oportunidad»: hay proveedor, poca competencia y vende menos de la mitad que en el mejor país.
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Megaphone size={18} aria-hidden /> Anuncios de este producto
              </span>
            }
            subtitle={`${ads.length} activos en ${country.name}, los más antiguos primero (los que más aguantan suelen ser rentables).`}
            action={
              <Link href="/app/anuncios" className="text-sm font-semibold text-primary-ink hover:underline">
                Biblioteca
              </Link>
            }
          />
          <div className="grid gap-3 p-5 pt-3 md:grid-cols-2">
            {ads.length === 0 ? (
              <p className="text-sm text-text-2">Nadie lo anuncia todavía en {country.name}. Puede ser tu ventaja… o que aún no está probado.</p>
            ) : (
              ads.slice(0, 4).map((a) => <AdCard key={a.id} ad={a} compact />)
            )}
          </div>
        </Card>
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Lightbulb size={18} className="text-accent" aria-hidden /> Ángulos de venta
              </span>
            }
            subtitle="Ideas para tus creativos en esta categoría."
          />
          <ul className="space-y-2 p-5 pt-3">
            {CATEGORY_ANGLES[l.category].map((a) => (
              <li key={a} className="rounded-xl bg-surface-2 p-3 text-sm text-text">
                {a}
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-border p-5 text-sm text-text-2">
            <div className="flex items-center gap-2">
              <Truck size={16} aria-hidden /> Flete promedio en {country.name}: {money(country.shipping)}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} aria-hidden /> Despacho del proveedor: {supplier?.dispatchHours ?? "—"} h
            </div>
            <div className="flex items-center gap-2">
              <Package size={16} aria-hidden /> Unidades vendidas en 30 días: {formatInt(l.sales30d)}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
