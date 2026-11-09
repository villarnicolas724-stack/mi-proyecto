"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, LayoutGrid, RotateCcw, Search, SlidersHorizontal, Table2 } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ProductThumb, SaturationBadge, ScoreRing, TrendBadge } from "@/components/product/bits";
import { RegularityDots } from "@/components/charts/small-charts";
import { ChipGroup, Segmented } from "@/components/ui/chips";
import { Button, EmptyState, Input, Label, PageHeader, Select } from "@/components/ui/primitives";
import { CATEGORIES, COUNTRY_BY_CODE, PLATFORM_NAME, PLATFORMS_BY_COUNTRY } from "@/lib/data/catalog";
import { grossMarginPct, listListings } from "@/lib/data";
import type { Category, Listing, PlatformId, ProductFilters, SaturationLevel } from "@/lib/data/types";
import { cn, formatInt, formatMoney, formatPct } from "@/lib/format";
import { completeStep, useCountry } from "@/lib/state/stores";

type Filters = Omit<ProductFilters, "country">;

const EMPTY: Filters = {
  query: "",
  categories: [],
  platforms: [],
  saturation: [],
  trend: "todas",
  sort: "score",
};

const PRESETS: { id: string; label: string; hint: string; filters: Filters }[] = [
  {
    id: "probados",
    label: "Ganadores probados",
    hint: "10+ ventas en 7 días, vendidas en 4 días o más, saturación baja o media",
    filters: { ...EMPTY, minSales7d: 10, minRegularity: 4, saturation: ["baja", "media"], minStock: 50 },
  },
  {
    id: "alza",
    label: "En alza",
    hint: "Ventas subiendo y al menos 10 en la semana",
    filters: { ...EMPTY, trend: "sube", minSales7d: 10, sort: "growth" },
  },
  {
    id: "margen",
    label: "Margen alto",
    hint: "Ordenado por margen con al menos 5 ventas",
    filters: { ...EMPTY, minSales7d: 5, sort: "margin" },
  },
  {
    id: "nuevos",
    label: "Recién llegados",
    hint: "Los últimos productos añadidos por los proveedores",
    filters: { ...EMPTY, sort: "recent" },
  },
];

const PAGE = 24;

function toCsv(rows: Listing[]): string {
  const head = [
    "id",
    "producto",
    "categoria",
    "pais",
    "plataforma",
    "costo",
    "precio_sugerido",
    "ventas_7d",
    "variacion_pct",
    "dias_con_venta_7d",
    "stock",
    "anuncios",
    "saturacion",
    "puntuacion",
  ];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return [
    head.join(","),
    ...rows.map((l) =>
      [
        l.id,
        l.name,
        l.category,
        l.country,
        PLATFORM_NAME[l.platform],
        l.costPrice,
        l.suggestedPrice,
        l.sales7d,
        l.growth,
        l.daysWithSales7d,
        l.stock,
        l.adsInCountry,
        l.saturation,
        l.score,
      ]
        .map(esc)
        .join(","),
    ),
  ].join("\n");
}

export function ProductFinder() {
  const country = useCountry();
  const [filters, setFilters] = useState<Filters>(PRESETS[0].filters);
  const [preset, setPreset] = useState<string | null>(PRESETS[0].id);
  const [view, setView] = useState<"tarjetas" | "tabla">("tarjetas");
  const [limit, setLimit] = useState(PAGE);
  const [showFilters, setShowFilters] = useState(false);

  const platforms = PLATFORMS_BY_COUNTRY[country];
  const effective: ProductFilters = {
    ...filters,
    country,
    platforms: filters.platforms?.filter((p) => platforms.includes(p)),
  };
  // Filtrar unos cientos de productos en memoria es instantáneo; con backend será una consulta paginada.
  const results = listListings(effective);
  const currency = COUNTRY_BY_CODE[country].currency;

  function update(patch: Partial<Filters>) {
    setFilters((f) => ({ ...f, ...patch }));
    setPreset(null);
    setLimit(PAGE);
    completeStep("filtrar");
  }

  function applyPreset(id: string) {
    const p = PRESETS.find((x) => x.id === id)!;
    setFilters(p.filters);
    setPreset(id);
    setLimit(PAGE);
    completeStep("filtrar");
  }

  function exportCsv() {
    const blob = new Blob(["﻿" + toCsv(results)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `veta-productos-${country.toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const panel = (
    <div className="space-y-5">
      <div>
        <Label htmlFor="q">Buscar</Label>
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" aria-hidden />
          <Input
            id="q"
            placeholder="Ej.: masajeador, freidora…"
            value={filters.query ?? ""}
            onChange={(e) => update({ query: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>
      <ChipGroup<Category>
        label="Categoría"
        options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        value={filters.categories ?? []}
        onChange={(categories) => update({ categories })}
      />
      <ChipGroup<PlatformId>
        label="Proveedor"
        options={platforms.map((p) => ({ value: p, label: PLATFORM_NAME[p] }))}
        value={filters.platforms ?? []}
        onChange={(p) => update({ platforms: p })}
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="min">Precio mín. ({currency})</Label>
          <Input
            id="min"
            type="number"
            inputMode="numeric"
            min={0}
            value={filters.minPrice ?? ""}
            onChange={(e) => update({ minPrice: e.target.value === "" ? undefined : Number(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="max">Precio máx. ({currency})</Label>
          <Input
            id="max"
            type="number"
            inputMode="numeric"
            min={0}
            value={filters.maxPrice ?? ""}
            onChange={(e) => update({ maxPrice: e.target.value === "" ? undefined : Number(e.target.value) })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="sales">Ventas en 7 días</Label>
        <Select
          id="sales"
          value={filters.minSales7d ?? 0}
          onChange={(e) => update({ minSales7d: Number(e.target.value) || undefined })}
        >
          {[0, 5, 10, 25, 50, 100].map((v) => (
            <option key={v} value={v}>
              {v === 0 ? "Cualquiera" : `${v} o más`}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="reg">Días con ventas (de 7)</Label>
        <Select
          id="reg"
          value={filters.minRegularity ?? 0}
          onChange={(e) => update({ minRegularity: Number(e.target.value) || undefined })}
        >
          <option value={0}>Cualquiera</option>
          <option value={3}>3 o más</option>
          <option value={4}>4 o más</option>
          <option value={5}>5 o más (muy regular)</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="stock">Stock mínimo</Label>
        <Select
          id="stock"
          value={filters.minStock ?? 0}
          onChange={(e) => update({ minStock: Number(e.target.value) || undefined })}
        >
          {[0, 50, 200, 1000].map((v) => (
            <option key={v} value={v}>
              {v === 0 ? "Cualquiera" : `${formatInt(v)} unidades`}
            </option>
          ))}
        </Select>
      </div>
      <ChipGroup<SaturationLevel>
        label="Saturación"
        options={[
          { value: "baja", label: "Baja" },
          { value: "media", label: "Media" },
          { value: "alta", label: "Alta" },
        ]}
        value={filters.saturation ?? []}
        onChange={(saturation) => update({ saturation })}
      />
      <Segmented
        label="Tendencia"
        options={[
          { value: "todas", label: "Todas" },
          { value: "sube", label: "Sube" },
          { value: "baja", label: "Baja" },
        ]}
        value={filters.trend ?? "todas"}
        onChange={(trend) => update({ trend })}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setFilters(EMPTY);
          setPreset(null);
        }}
      >
        <RotateCcw size={14} aria-hidden /> Limpiar filtros
      </Button>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Productos"
        description={`Productos de proveedores en ${COUNTRY_BY_CODE[country].name} con ventas, stock, saturación y puntuación explicada.`}
        actions={
          <Button variant="secondary" onClick={exportCsv} disabled={results.length === 0}>
            <Download size={16} aria-hidden /> Exportar CSV
          </Button>
        }
      />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Atajos de búsqueda">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p.id)}
            aria-pressed={preset === p.id}
            title={p.hint}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              preset === p.id
                ? "border-primary bg-primary text-primary-fg"
                : "border-border-strong bg-surface text-text-2 hover:bg-surface-2",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      {preset ? <p className="-mt-2 mb-4 text-sm text-muted">{PRESETS.find((p) => p.id === preset)!.hint}.</p> : null}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Button
            variant="secondary"
            className="w-full lg:hidden"
            onClick={() => setShowFilters((s) => !s)}
            aria-expanded={showFilters}
            aria-controls="panel-filtros"
          >
            <SlidersHorizontal size={16} aria-hidden /> {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          </Button>
          <div
            id="panel-filtros"
            className={cn(
              "mt-3 rounded-2xl border border-border bg-surface p-4 lg:mt-0 lg:block lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto",
              showFilters ? "block" : "hidden",
            )}
          >
            {panel}
          </div>
        </aside>

        <section aria-label="Resultados" className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-2" aria-live="polite">
              <span className="tabular font-bold text-text">{formatInt(results.length)}</span> productos
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="sr-only">
                Ordenar por
              </label>
              <Select
                id="sort"
                value={filters.sort ?? "score"}
                onChange={(e) => update({ sort: e.target.value as Filters["sort"] })}
                className="h-10 w-auto"
              >
                <option value="score">Mejor puntuación</option>
                <option value="sales7d">Más vendidos (7 días)</option>
                <option value="growth">Mayor crecimiento</option>
                <option value="margin">Mayor margen</option>
                <option value="recent">Más recientes</option>
              </Select>
              <div className="flex rounded-xl border border-border-strong p-0.5" role="group" aria-label="Vista">
                <button
                  type="button"
                  aria-pressed={view === "tarjetas"}
                  onClick={() => setView("tarjetas")}
                  className={cn("rounded-lg p-2", view === "tarjetas" ? "bg-surface-2 text-text" : "text-muted")}
                  aria-label="Ver como tarjetas"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  aria-pressed={view === "tabla"}
                  onClick={() => setView("tabla")}
                  className={cn("rounded-lg p-2", view === "tabla" ? "bg-surface-2 text-text" : "text-muted")}
                  aria-label="Ver como tabla"
                >
                  <Table2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            <EmptyState
              icon={<Search size={32} />}
              title="Ningún producto cumple todos los filtros"
              action={
                <Button variant="secondary" onClick={() => setFilters(EMPTY)}>
                  Quitar filtros
                </Button>
              }
            >
              Prueba a bajar el mínimo de ventas o a incluir más niveles de saturación.
            </EmptyState>
          ) : view === "tarjetas" ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {results.slice(0, limit).map((l) => (
                <ProductCard key={l.id} listing={l} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="bg-surface-2 text-left text-xs font-semibold text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3">Producto</th>
                    <th scope="col" className="px-3 py-3 text-right">Puntuación</th>
                    <th scope="col" className="px-3 py-3 text-right">Ventas 7 d</th>
                    <th scope="col" className="px-3 py-3">Tendencia</th>
                    <th scope="col" className="px-3 py-3">Regularidad</th>
                    <th scope="col" className="px-3 py-3 text-right">Costo</th>
                    <th scope="col" className="px-3 py-3 text-right">Margen</th>
                    <th scope="col" className="px-3 py-3 text-right">Stock</th>
                    <th scope="col" className="px-3 py-3">Saturación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {results.slice(0, limit).map((l) => (
                    <tr key={l.id} className="hover:bg-surface-2">
                      <td className="px-4 py-2.5">
                        <Link href={`/app/productos/${l.id}`} className="flex items-center gap-3 font-semibold text-text hover:text-primary-ink">
                          <ProductThumb category={l.category} size="sm" />
                          <span className="line-clamp-2">{l.name}</span>
                        </Link>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex justify-end">
                          <ScoreRing score={l.score} size={38} />
                        </div>
                      </td>
                      <td className="tabular px-3 py-2.5 text-right font-semibold">{formatInt(l.sales7d)}</td>
                      <td className="px-3 py-2.5">
                        <TrendBadge growth={l.growth} />
                      </td>
                      <td className="px-3 py-2.5">
                        <RegularityDots units={l.history.map((h) => h.units)} />
                      </td>
                      <td className="tabular px-3 py-2.5 text-right">{formatMoney(l.costPrice, l.country)}</td>
                      <td className="tabular px-3 py-2.5 text-right">{formatPct(grossMarginPct(l), false)}</td>
                      <td className={cn("tabular px-3 py-2.5 text-right", l.stock === 0 && "font-semibold text-danger")}>
                        {l.stock === 0 ? "Agotado" : formatInt(l.stock)}
                      </td>
                      <td className="px-3 py-2.5">
                        <SaturationBadge level={l.saturation} short />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {results.length > limit ? (
            <div className="mt-4 flex justify-center">
              <Button variant="secondary" onClick={() => setLimit((n) => n + PAGE)}>
                Ver más ({formatInt(results.length - limit)} restantes)
              </Button>
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}
