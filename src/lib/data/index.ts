// Capa de datos: el único sitio del que leen las pantallas.
// Hoy devuelve datos de demostración; con el backend real, estas funciones
// pasarán a consultar Supabase con la misma firma.

import { CATEGORIES, COUNTRIES, COUNTRY_BY_CODE } from "./catalog";
import { generateDataset, type Dataset } from "./generate";
import type {
  Ad,
  AdFilters,
  Category,
  CountryCode,
  Listing,
  ProductFilters,
  SaturationLevel,
  Store,
  Supplier,
} from "./types";

let cache: Dataset | null = null;
function data(): Dataset {
  if (!cache) cache = generateDataset();
  return cache;
}

export function getCountry(code: CountryCode) {
  return COUNTRY_BY_CODE[code];
}

export function getCountries() {
  return COUNTRIES;
}

export function getSupplier(id: string): Supplier | undefined {
  return data().suppliers.find((s) => s.id === id);
}

export function getListing(id: string): Listing | undefined {
  return data().listings.find((l) => l.id === id);
}

export function getAllListingIds(): string[] {
  return data().listings.map((l) => l.id);
}

export function getAllStoreIds(): string[] {
  return data().stores.map((s) => s.id);
}

/** Margen bruto sobre el precio sugerido, descontando el flete. */
export function grossMarginPct(l: Listing): number {
  const shipping = COUNTRY_BY_CODE[l.country].shipping;
  return ((l.suggestedPrice - l.costPrice - shipping) / l.suggestedPrice) * 100;
}

export function listListings(f: ProductFilters): Listing[] {
  const q = f.query?.trim().toLowerCase();
  const result = data().listings.filter((l) => {
    if (l.country !== f.country) return false;
    if (q && !l.name.toLowerCase().includes(q)) return false;
    if (f.categories?.length && !f.categories.includes(l.category)) return false;
    if (f.platforms?.length && !f.platforms.includes(l.platform)) return false;
    if (f.minPrice != null && l.suggestedPrice < f.minPrice) return false;
    if (f.maxPrice != null && l.suggestedPrice > f.maxPrice) return false;
    if (f.minSales7d != null && l.sales7d < f.minSales7d) return false;
    if (f.minStock != null && l.stock < f.minStock) return false;
    if (f.saturation?.length && !f.saturation.includes(l.saturation)) return false;
    if (f.trend === "sube" && l.growth <= 10) return false;
    if (f.trend === "baja" && l.growth >= -10) return false;
    if (f.minRegularity != null && l.daysWithSales7d < f.minRegularity) return false;
    return true;
  });

  const sort = f.sort ?? "score";
  return result.sort((a, b) => {
    switch (sort) {
      case "sales7d":
        return b.sales7d - a.sales7d;
      case "growth":
        return b.growth - a.growth;
      case "margin":
        return grossMarginPct(b) - grossMarginPct(a);
      case "recent":
        return b.listedAt.localeCompare(a.listedAt);
      default:
        return b.score - a.score || b.sales7d - a.sales7d;
    }
  });
}

/** El mismo producto en todos los proveedores y países. */
export function getGroupListings(groupId: string): Listing[] {
  return data().listings.filter((l) => l.groupId === groupId);
}

export interface CountrySummary {
  country: CountryCode;
  listings: number;
  sales7d: number;
  ads: number;
  saturation: SaturationLevel | null;
  bestCostUsd: number | null;
  status: "vendiendo" | "oportunidad" | "saturado" | "sin-proveedor";
}

/** Panel «Dónde venderlo»: cómo está el producto en cada país. */
export function getGroupCountrySummary(groupId: string): CountrySummary[] {
  const all = getGroupListings(groupId);
  const maxSales = Math.max(0, ...COUNTRIES.map((c) => sumSales(all.filter((l) => l.country === c.code))));
  return COUNTRIES.map((c) => {
    const here = all.filter((l) => l.country === c.code);
    if (here.length === 0) {
      return {
        country: c.code,
        listings: 0,
        sales7d: 0,
        ads: 0,
        saturation: null,
        bestCostUsd: null,
        status: "sin-proveedor" as const,
      };
    }
    const ads = here[0].adsInCountry;
    const sales7d = sumSales(here);
    const saturation = here[0].saturation;
    const status =
      saturation === "alta"
        ? ("saturado" as const)
        : saturation === "baja" && sales7d < maxSales * 0.5
          ? ("oportunidad" as const)
          : ("vendiendo" as const);
    return {
      country: c.code,
      listings: here.length,
      sales7d,
      ads,
      saturation,
      bestCostUsd: Math.min(...here.map((l) => l.costPrice / c.fx)),
      status,
    };
  });
}

function sumSales(ls: Listing[]) {
  return ls.reduce((s, l) => s + l.sales7d, 0);
}

export function listAds(f: AdFilters): Ad[] {
  const q = f.query?.trim().toLowerCase();
  const result = data().ads.filter((a) => {
    if (f.country !== "todos" && a.country !== f.country) return false;
    if (q && !`${a.productName} ${a.copy} ${a.advertiser}`.toLowerCase().includes(q)) return false;
    if (f.networks?.length && !f.networks.includes(a.network)) return false;
    if (f.categories?.length && !f.categories.includes(a.category)) return false;
    if (f.formats?.length && !f.formats.includes(a.format)) return false;
    if (f.minDays != null && a.daysActive < f.minDays) return false;
    if (f.maxDays != null && a.daysActive > f.maxDays) return false;
    return true;
  });
  const sort = f.sort ?? "recientes";
  return result.sort((a, b) => {
    if (sort === "dias") return b.daysActive - a.daysActive;
    if (sort === "interacciones") return b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares);
    return a.daysActive - b.daysActive;
  });
}

export function getAdsForGroup(groupId: string, country?: CountryCode): Ad[] {
  return data()
    .ads.filter((a) => a.groupId === groupId && (!country || a.country === country))
    .sort((a, b) => b.daysActive - a.daysActive);
}

export function listStores(country: CountryCode | "todos", query = ""): Store[] {
  const q = query.trim().toLowerCase();
  return data()
    .stores.filter((s) => (country === "todos" || s.country === country) && (!q || s.name.toLowerCase().includes(q)))
    .sort((a, b) => b.revenue30d - a.revenue30d);
}

export function getStore(id: string): Store | undefined {
  return data().stores.find((s) => s.id === id);
}

/** Mejor listing de un grupo en un país (para enlazar desde anuncios y tiendas). */
export function getBestListing(groupId: string, country: CountryCode): Listing | undefined {
  return getGroupListings(groupId)
    .filter((l) => l.country === country)
    .sort((a, b) => b.score - a.score)[0];
}

export interface Opportunity {
  groupId: string;
  name: string;
  category: Category;
  fromCountry: CountryCode;
  salesThere: number;
  salesHere: number;
  adsHere: number;
  listingHere?: Listing;
}

/** Productos que ya funcionan en otro país y aquí apenas se anuncian. */
export function getCrossCountryOpportunities(country: CountryCode, limit = 5): Opportunity[] {
  const out: Opportunity[] = [];
  for (const g of data().groups) {
    const all = getGroupListings(g.id);
    const here = all.filter((l) => l.country === country);
    if (here.length === 0) continue;
    const best = here.sort((a, b) => b.score - a.score)[0];
    if (best.saturation !== "baja" || best.stock === 0) continue;
    let fromCountry: CountryCode | null = null;
    let salesThere = 0;
    for (const c of COUNTRIES) {
      if (c.code === country) continue;
      const s = sumSales(all.filter((l) => l.country === c.code));
      if (s > salesThere) {
        salesThere = s;
        fromCountry = c.code;
      }
    }
    const salesHere = sumSales(here);
    if (!fromCountry || salesThere < 25 || salesHere > salesThere * 0.5) continue;
    out.push({
      groupId: g.id,
      name: g.name,
      category: g.category,
      fromCountry,
      salesThere,
      salesHere,
      adsHere: best.adsInCountry,
      listingHere: best,
    });
  }
  return out.sort((a, b) => b.salesThere - a.salesThere).slice(0, limit);
}

export function getDashboard(country: CountryCode) {
  const listings = data().listings.filter((l) => l.country === country);
  const ads = data().ads.filter((a) => a.country === country);
  const rising = listings.filter((l) => l.growth >= 30 && l.sales7d >= 10);
  const byCategory = CATEGORIES.map((category) => ({
    category,
    sales7d: listings.filter((l) => l.category === category).reduce((s, l) => s + l.sales7d, 0),
  }))
    .filter((c) => c.sales7d > 0)
    .sort((a, b) => b.sales7d - a.sales7d);

  return {
    totalListings: listings.length,
    totalSales7d: listings.reduce((s, l) => s + l.sales7d, 0),
    totalSalesPrev7d: listings.reduce((s, l) => s + l.salesPrev7d, 0),
    risingCount: rising.length,
    newAds7d: ads.filter((a) => a.daysActive <= 7).length,
    activeAds: ads.length,
    top: [...listings].sort((a, b) => b.score - a.score).slice(0, 6),
    rising: rising.sort((a, b) => b.growth - a.growth).slice(0, 5),
    byCategory,
    opportunities: getCrossCountryOpportunities(country, 4),
    freshAds: [...ads].sort((a, b) => a.daysActive - b.daysActive || b.likes - a.likes).slice(0, 4),
  };
}

export { COUNTRIES, CATEGORIES } from "./catalog";
export type * from "./types";
