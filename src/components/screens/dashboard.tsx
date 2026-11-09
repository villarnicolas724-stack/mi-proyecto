"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Bell, Flame, Globe, Megaphone, Search, TrendingUp } from "lucide-react";
import { BarList } from "@/components/charts/small-charts";
import { ProductThumb, ScoreRing, TrendBadge } from "@/components/product/bits";
import { ProductCard } from "@/components/product/product-card";
import { Badge, Button, ButtonLink, Card, CardHeader, PageHeader, StatTile } from "@/components/ui/primitives";
import { evaluateAlerts } from "@/lib/data/alerts";
import { COUNTRY_BY_CODE } from "@/lib/data/catalog";
import { getBestListing, getDashboard } from "@/lib/data";
import { formatCompact, formatInt, formatPct } from "@/lib/format";
import { GUIDE_STEPS, completeStep, useCountry, useGuide, useSession, useWatchlist } from "@/lib/state/stores";

const NETWORK_LABEL = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok" } as const;

export function Dashboard() {
  const country = useCountry();
  const session = useSession();
  const guide = useGuide();
  const watch = useWatchlist();
  const d = useMemo(() => getDashboard(country), [country]);
  const alerts = useMemo(() => evaluateAlerts(watch), [watch]);
  const countryName = COUNTRY_BY_CODE[country].name;
  const done = GUIDE_STEPS.filter((s) => guide[s.id]).length;
  const next = GUIDE_STEPS.find((s) => !guide[s.id]);
  const growthAll = d.totalSalesPrev7d ? ((d.totalSales7d - d.totalSalesPrev7d) / d.totalSalesPrev7d) * 100 : 0;

  return (
    <>
      <PageHeader
        title={session ? `Hola, ${session.name.split(" ")[0]}` : "Hoy en " + countryName}
        description={`Lo que se está moviendo en ${countryName} esta semana.`}
        actions={
          <ButtonLink href="/app/productos">
            <Search size={16} aria-hidden /> Buscar productos
          </ButtonLink>
        }
      />

      {/* Ruta guiada */}
      {done < GUIDE_STEPS.length && next ? (
        <Card className="mb-6 overflow-hidden">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="text-xs font-bold tracking-wide text-primary-ink uppercase">
                Tu primer producto ganador · paso {done + 1} de {GUIDE_STEPS.length}
              </div>
              <h2 className="mt-1 text-lg font-bold text-text">{next.title}</h2>
              <p className="text-sm text-text-2">{next.detail}</p>
              <div className="mt-3 h-2 w-full max-w-sm rounded-full bg-surface-2" aria-hidden>
                <div className="h-2 rounded-full bg-primary" style={{ width: `${(done / GUIDE_STEPS.length) * 100}%` }} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {next.id === "pais" ? (
                <Button onClick={() => completeStep("pais")}>
                  Sí, vendo en {countryName} <ArrowRight size={16} aria-hidden />
                </Button>
              ) : (
                <ButtonLink href={next.href}>
                  Ir al paso <ArrowRight size={16} aria-hidden />
                </ButtonLink>
              )}
              <ButtonLink href="/app/guia" variant="secondary">
                Ver la guía
              </ButtonLink>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Productos rastreados" value={formatInt(d.totalListings)} hint={`en ${countryName}`} />
        <StatTile
          label="Ventas de la semana"
          value={formatCompact(d.totalSales7d)}
          hint={<span>{formatPct(growthAll)} vs. semana anterior</span>}
        />
        <StatTile
          label="En alza"
          value={formatInt(d.risingCount)}
          hint="+30 % o más y 10+ ventas"
          icon={<TrendingUp size={16} aria-hidden />}
        />
        <StatTile
          label="Anuncios nuevos"
          value={formatInt(d.newAds7d)}
          hint={`de ${formatInt(d.activeAds)} activos`}
          icon={<Megaphone size={16} aria-hidden />}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-text">
              <Flame size={18} className="text-accent" aria-hidden /> Mejor puntuados
            </h2>
            <Link href="/app/productos" className="text-sm font-semibold text-primary-ink hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {d.top.map((l) => (
              <ProductCard key={l.id} listing={l} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Alertas"
              subtitle={watch.length ? `${watch.length} productos en seguimiento` : "Sigue productos para recibir avisos"}
              action={<Bell size={18} className="text-muted" aria-hidden />}
            />
            <div className="p-5 pt-3">
              {alerts.length === 0 ? (
                <p className="text-sm text-text-2">
                  {watch.length ? "Todo en orden por ahora." : "Aún no sigues ningún producto."}{" "}
                  <Link href="/app/seguimiento" className="font-semibold text-primary-ink hover:underline">
                    Ir a Seguimiento
                  </Link>
                </p>
              ) : (
                <ul className="space-y-2">
                  {alerts.slice(0, 4).map((a) => (
                    <li key={a.id}>
                      <Link href={`/app/productos/${a.listingId}`} className="block rounded-xl bg-surface-2 p-3 hover:bg-border">
                        <Badge tone={a.severity === "critica" ? "danger" : a.severity === "aviso" ? "warning" : "success"}>
                          {a.title}
                        </Badge>
                        <div className="mt-1 truncate text-sm font-semibold text-text">{a.listingName}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Ventas por categoría" subtitle="Unidades vendidas en los últimos 7 días" />
            <div className="p-5 pt-4">
              <BarList items={d.byCategory.slice(0, 7).map((c) => ({ label: c.category, value: c.sales7d }))} />
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Globe size={18} className="text-primary-ink" aria-hidden /> Oportunidades entre países
              </span>
            }
            subtitle={`Ya venden fuerte en otro país y en ${countryName} casi nadie los anuncia.`}
          />
          <div className="p-5 pt-3">
            {d.opportunities.length === 0 ? (
              <p className="text-sm text-text-2">Esta semana no hay oportunidades claras en {countryName}.</p>
            ) : (
              <ul className="divide-y divide-border">
                {d.opportunities.map((o) => (
                  <li key={o.groupId}>
                    <Link href={`/app/productos/${o.listingHere!.id}`} className="flex items-center gap-3 py-3 hover:opacity-80">
                      <ProductThumb category={o.category} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-text">{o.name}</div>
                        <div className="text-xs text-text-2">
                          {formatInt(o.salesThere)} ventas en {COUNTRY_BY_CODE[o.fromCountry].name} · aquí{" "}
                          {formatInt(o.salesHere)} ventas y {o.adsHere} {o.adsHere === 1 ? "anuncio" : "anuncios"}
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-muted" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="En alza esta semana"
            subtitle="Mayor crecimiento con al menos 10 ventas"
            action={
              <Link href="/app/productos" className="text-sm font-semibold text-primary-ink hover:underline">
                Ver más
              </Link>
            }
          />
          <div className="p-5 pt-3">
            {d.rising.length === 0 ? (
              <p className="text-sm text-text-2">Nada despega esta semana en {countryName}.</p>
            ) : (
              <ul className="divide-y divide-border">
                {d.rising.map((l) => (
                  <li key={l.id}>
                    <Link href={`/app/productos/${l.id}`} className="flex items-center gap-3 py-3 hover:opacity-80">
                      <ProductThumb category={l.category} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-text">{l.name}</div>
                        <div className="text-xs text-text-2">{formatInt(l.sales7d)} ventas en 7 días</div>
                      </div>
                      <TrendBadge growth={l.growth} />
                      <ScoreRing score={l.score} size={40} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Anuncios que acaban de salir"
          subtitle="Competencia nueva en los últimos días"
          action={
            <Link href="/app/anuncios" className="text-sm font-semibold text-primary-ink hover:underline">
              Biblioteca de anuncios
            </Link>
          }
        />
        <div className="grid gap-3 p-5 pt-3 sm:grid-cols-2 lg:grid-cols-4">
          {d.freshAds.map((a) => {
            const l = getBestListing(a.groupId, a.country);
            return (
              <Link
                key={a.id}
                href={l ? `/app/productos/${l.id}` : "/app/anuncios"}
                className="rounded-xl border border-border p-3 hover:border-primary"
              >
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="font-semibold text-text-2">{NETWORK_LABEL[a.network]}</span>
                  <span>
                    {a.daysActive} {a.daysActive === 1 ? "día" : "días"}
                  </span>
                </div>
                <div className="mt-1 line-clamp-1 text-sm font-semibold text-text">{a.productName}</div>
                <p className="mt-1 line-clamp-2 text-xs text-text-2">{a.copy}</p>
              </Link>
            );
          })}
        </div>
      </Card>
    </>
  );
}
