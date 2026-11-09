import { COUNTRY_BY_CODE } from "@/lib/data/catalog";
import type { CountryCode } from "@/lib/data/types";

const moneyFormatters = new Map<string, Intl.NumberFormat>();

/** Importe en la moneda local del país: «$ 59.900», «S/ 89,90», «Q 199». */
export function formatMoney(amount: number, country: CountryCode): string {
  const c = COUNTRY_BY_CODE[country];
  const decimals = c.currency === "USD" || c.currency === "PEN" || c.currency === "EUR" ? 2 : 0;
  const key = `${c.locale}|${c.currency}|${decimals}`;
  let f = moneyFormatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat(c.locale, {
      style: "currency",
      currency: c.currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    moneyFormatters.set(key, f);
  }
  return f.format(Number.isFinite(amount) ? amount : 0);
}

const intFormatter = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });
const compactFormatter = new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 1 });

export function formatInt(n: number): string {
  return intFormatter.format(Math.round(n));
}

export function formatCompact(n: number): string {
  return compactFormatter.format(n);
}

export function formatUsd(n: number): string {
  return `US$ ${n.toFixed(2).replace(".", ",")}`;
}

export function formatPct(n: number, withSign = true): string {
  const rounded = Math.round(n);
  const sign = withSign && rounded > 0 ? "+" : "";
  return `${sign}${rounded} %`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
