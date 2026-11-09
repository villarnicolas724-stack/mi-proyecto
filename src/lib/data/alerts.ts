// Reglas de alerta del módulo Seguimiento. En la demo se evalúan en el navegador
// con los datos del día; con backend se evaluarán tras cada ingesta diaria.

import { formatMoney } from "@/lib/format";
import { getAdsForGroup, getListing } from "./index";
import type { Listing } from "./types";

export interface AlertRules {
  /** Avisar cuando el stock alcance para menos de N días. null = desactivada. */
  stockDays: number | null;
  /** Avisar cuando las ventas suban más de N % semana contra semana. */
  salesUpPct: number | null;
  /** Avisar si el proveedor cambia el precio. */
  priceChange: boolean;
  /** Avisar si aparecen anuncios nuevos (últimos 3 días). */
  newAds: boolean;
}

export const DEFAULT_RULES: AlertRules = { stockDays: 10, salesUpPct: 30, priceChange: true, newAds: true };

export interface WatchItem {
  listingId: string;
  addedAt: string;
  rules: AlertRules;
}

export type AlertSeverity = "critica" | "aviso" | "buena";

export interface Alert {
  id: string;
  listingId: string;
  listingName: string;
  type: "stock" | "ventas" | "precio" | "anuncios";
  severity: AlertSeverity;
  title: string;
  detail: string;
}

function priceChange(l: Listing): { from: number; to: number } | null {
  const recent = l.history.slice(-10);
  const first = recent[0].price;
  const last = recent[recent.length - 1].price;
  return first !== last ? { from: first, to: last } : null;
}

export function evaluateAlerts(items: WatchItem[]): Alert[] {
  const alerts: Alert[] = [];
  for (const item of items) {
    const l = getListing(item.listingId);
    if (!l) continue;
    const r = item.rules;
    if (r.stockDays != null && (l.stock === 0 || l.stockDays < r.stockDays)) {
      alerts.push({
        id: `${l.id}-stock`,
        listingId: l.id,
        listingName: l.name,
        type: "stock",
        severity: "critica",
        title: l.stock === 0 ? "Agotado" : "Stock bajo",
        detail:
          l.stock === 0
            ? "El proveedor se quedó sin unidades. Pausa los anuncios o cambia de proveedor."
            : `Quedan ${l.stock} unidades: unos ${l.stockDays} días al ritmo actual.`,
      });
    }
    if (r.salesUpPct != null && l.growth >= r.salesUpPct && l.sales7d >= 5) {
      alerts.push({
        id: `${l.id}-ventas`,
        listingId: l.id,
        listingName: l.name,
        type: "ventas",
        severity: "buena",
        title: "Ventas en alza",
        detail: `+${l.growth} % frente a la semana anterior (${l.sales7d} ventas en 7 días).`,
      });
    }
    if (r.priceChange) {
      const change = priceChange(l);
      if (change) {
        alerts.push({
          id: `${l.id}-precio`,
          listingId: l.id,
          listingName: l.name,
          type: "precio",
          severity: change.to > change.from ? "aviso" : "buena",
          title: change.to > change.from ? "El proveedor subió el precio" : "El proveedor bajó el precio",
          detail: `De ${formatMoney(change.from, l.country)} a ${formatMoney(change.to, l.country)}. Revisa tu margen en la calculadora.`,
        });
      }
    }
    if (r.newAds) {
      const fresh = getAdsForGroup(l.groupId, l.country).filter((a) => a.daysActive <= 3);
      if (fresh.length > 0) {
        alerts.push({
          id: `${l.id}-anuncios`,
          listingId: l.id,
          listingName: l.name,
          type: "anuncios",
          severity: "aviso",
          title: fresh.length === 1 ? "Un anuncio nuevo" : `${fresh.length} anuncios nuevos`,
          detail: "Llegó competencia en los últimos 3 días. Mira sus ángulos en la biblioteca de anuncios.",
        });
      }
    }
  }
  const order: Record<AlertSeverity, number> = { critica: 0, aviso: 1, buena: 2 };
  return alerts.sort((a, b) => order[a.severity] - order[b.severity]);
}
