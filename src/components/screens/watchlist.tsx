"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bell, BellRing, ChevronDown, CircleAlert, CircleCheck, Search, Trash2, TriangleAlert } from "lucide-react";
import { ProductThumb, ScoreRing, TrendBadge } from "@/components/product/bits";
import { Badge, Button, ButtonLink, Card, CardHeader, EmptyState, Label, PageHeader, Select } from "@/components/ui/primitives";
import { evaluateAlerts, type Alert, type WatchItem } from "@/lib/data/alerts";
import { COUNTRY_BY_CODE, PLATFORM_NAME } from "@/lib/data/catalog";
import { getListing } from "@/lib/data";
import { cn, formatInt } from "@/lib/format";
import { toggleWatch, updateRules, useWatchlist } from "@/lib/state/stores";

const SEVERITY = {
  critica: { tone: "danger" as const, icon: CircleAlert, label: "Urgente" },
  aviso: { tone: "warning" as const, icon: TriangleAlert, label: "Atención" },
  buena: { tone: "success" as const, icon: CircleCheck, label: "Buena noticia" },
};

function AlertRow({ a }: { a: Alert }) {
  const s = SEVERITY[a.severity];
  const Icon = s.icon;
  return (
    <li>
      <Link href={`/app/productos/${a.listingId}`} className="flex gap-3 rounded-xl border border-border p-3 hover:border-primary">
        <span
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            s.tone === "danger" ? "bg-danger-soft text-danger" : s.tone === "warning" ? "bg-warning-soft text-warning" : "bg-success-soft text-success",
          )}
        >
          <Icon size={16} aria-hidden />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-text">{a.title}</span>
            <Badge tone={s.tone}>{s.label}</Badge>
          </div>
          <div className="truncate text-sm font-medium text-text-2">{a.listingName}</div>
          <p className="text-sm text-text-2">{a.detail}</p>
        </div>
      </Link>
    </li>
  );
}

function RulesEditor({ item }: { item: WatchItem }) {
  const r = item.rules;
  const id = item.listingId;
  return (
    <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Label htmlFor={`${id}-stock`}>Stock bajo</Label>
        <Select
          id={`${id}-stock`}
          value={r.stockDays ?? "off"}
          onChange={(e) => updateRules(id, { stockDays: e.target.value === "off" ? null : Number(e.target.value) })}
        >
          <option value="off">Desactivada</option>
          <option value={5}>Menos de 5 días</option>
          <option value={10}>Menos de 10 días</option>
          <option value={15}>Menos de 15 días</option>
        </Select>
      </div>
      <div>
        <Label htmlFor={`${id}-sales`}>Ventas en alza</Label>
        <Select
          id={`${id}-sales`}
          value={r.salesUpPct ?? "off"}
          onChange={(e) => updateRules(id, { salesUpPct: e.target.value === "off" ? null : Number(e.target.value) })}
        >
          <option value="off">Desactivada</option>
          <option value={20}>+20 % semanal</option>
          <option value={30}>+30 % semanal</option>
          <option value={50}>+50 % semanal</option>
        </Select>
      </div>
      <label className="flex min-h-11 items-center gap-2 self-end text-sm font-semibold text-text">
        <input
          type="checkbox"
          className="h-5 w-5 accent-[var(--primary)]"
          checked={r.priceChange}
          onChange={(e) => updateRules(id, { priceChange: e.target.checked })}
        />
        Cambio de precio del proveedor
      </label>
      <label className="flex min-h-11 items-center gap-2 self-end text-sm font-semibold text-text">
        <input
          type="checkbox"
          className="h-5 w-5 accent-[var(--primary)]"
          checked={r.newAds}
          onChange={(e) => updateRules(id, { newAds: e.target.checked })}
        />
        Anuncios nuevos de la competencia
      </label>
    </div>
  );
}

export function Watchlist() {
  const items = useWatchlist();
  const [open, setOpen] = useState<string | null>(null);
  const alerts = useMemo(() => evaluateAlerts(items), [items]);

  return (
    <>
      <PageHeader
        title="Seguimiento"
        description="Los productos que estás vigilando y sus alertas: stock bajo, ventas en alza, cambios de precio y competencia nueva."
        actions={
          <ButtonLink href="/app/productos" variant="secondary">
            <Search size={16} aria-hidden /> Añadir productos
          </ButtonLink>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<Bell size={32} />}
          title="Aún no sigues ningún producto"
          action={<ButtonLink href="/app/productos">Buscar productos</ButtonLink>}
        >
          Abre un producto y pulsa «Seguir y activar alertas». Te avisaremos aquí si se agota, sube de precio o llega
          competencia.
        </EmptyState>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <section aria-label="Productos seguidos" className="space-y-3">
            {items.map((item) => {
              const l = getListing(item.listingId);
              if (!l) return null;
              const mine = alerts.filter((a) => a.listingId === l.id);
              const isOpen = open === l.id;
              return (
                <Card key={l.id}>
                  <div className="flex flex-wrap items-center gap-3 p-4">
                    <ProductThumb category={l.category} size="sm" />
                    <div className="min-w-0 flex-1">
                      <Link href={`/app/productos/${l.id}`} className="line-clamp-1 font-bold text-text hover:text-primary-ink">
                        {l.name}
                      </Link>
                      <div className="text-xs text-muted">
                        {COUNTRY_BY_CODE[l.country].name} · {PLATFORM_NAME[l.platform]} · {formatInt(l.sales7d)} ventas 7 d ·{" "}
                        {l.stock === 0 ? "agotado" : `stock ${formatInt(l.stock)}`}
                      </div>
                      {mine.length ? (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {mine.map((a) => (
                            <Badge key={a.id} tone={SEVERITY[a.severity].tone}>
                              {a.title}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <TrendBadge growth={l.growth} />
                    <ScoreRing score={l.score} size={40} />
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpen(isOpen ? null : l.id)}
                        aria-expanded={isOpen}
                        aria-label={`Configurar alertas de ${l.name}`}
                      >
                        <BellRing size={16} aria-hidden />
                        <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} aria-hidden />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleWatch(l.id)} aria-label={`Dejar de seguir ${l.name}`}>
                        <Trash2 size={16} aria-hidden />
                      </Button>
                    </div>
                  </div>
                  {isOpen ? <RulesEditor item={item} /> : null}
                </Card>
              );
            })}
          </section>

          <Card className="self-start xl:sticky xl:top-6">
            <CardHeader title="Alertas de hoy" subtitle={alerts.length ? `${alerts.length} avisos` : "Sin avisos"} />
            <div className="p-5 pt-3">
              {alerts.length === 0 ? (
                <p className="text-sm text-text-2">Todo en orden con tus productos.</p>
              ) : (
                <ul className="space-y-2">
                  {alerts.map((a) => (
                    <AlertRow key={a.id} a={a} />
                  ))}
                </ul>
              )}
              <p className="mt-4 text-xs text-muted">
                Próximamente: recibir estas alertas por email y WhatsApp con un resumen diario.
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
