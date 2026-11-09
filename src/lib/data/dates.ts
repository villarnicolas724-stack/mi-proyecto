import { REFERENCE_DATE } from "./catalog";

const DAY_MS = 86_400_000;
const REF_MS = Date.UTC(
  Number(REFERENCE_DATE.slice(0, 4)),
  Number(REFERENCE_DATE.slice(5, 7)) - 1,
  Number(REFERENCE_DATE.slice(8, 10)),
);

/** Fecha ISO (yyyy-mm-dd) a `daysAgo` días de la fecha de referencia. */
export function isoDaysAgo(daysAgo: number): string {
  return new Date(REF_MS - daysAgo * DAY_MS).toISOString().slice(0, 10);
}

/** Días entre una fecha ISO y la fecha de referencia. */
export function daysSince(iso: string): number {
  const ms = Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
  return Math.round((REF_MS - ms) / DAY_MS);
}

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** «8 nov» o «8 nov 2025». */
export function formatShortDate(iso: string, withYear = false): string {
  const d = Number(iso.slice(8, 10));
  const m = MONTHS[Number(iso.slice(5, 7)) - 1];
  return withYear ? `${d} ${m} ${iso.slice(0, 4)}` : `${d} ${m}`;
}
