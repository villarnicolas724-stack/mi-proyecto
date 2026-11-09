// Países de Veta que tienen Mercado Libre, con su código de sitio.
// España no tiene Mercado Libre.

import type { CountryCode } from "@/lib/data/types";

export const ML_SITE: Partial<Record<CountryCode, string>> = {
  CO: "MCO",
  MX: "MLM",
  CL: "MLC",
  PE: "MPE",
  EC: "MEC",
  GT: "MGT",
  PA: "MPA",
};

export function mlSite(country: CountryCode): string | null {
  return ML_SITE[country] ?? null;
}

export interface MlProduct {
  id: string;
  title: string;
  price: number | null;
  currency: string | null;
  permalink: string | null;
  thumbnail: string | null;
  /** Unidades vendidas según Mercado Libre (aproximado; puede no venir). */
  soldQuantity: number | null;
  freeShipping: boolean;
  position?: number;
}

export interface MlCategory {
  id: string;
  name: string;
}

export interface MlStatus {
  configured: boolean;
  source: "archivo" | "variables" | null;
  ok: boolean;
  error?: string;
}
