// Generador de datos de demostración. Determinista: misma semilla, mismos datos.
// Lo sustituirá la ingesta real en /replica-backend.

import {
  BRAND_PREFIX,
  BRAND_SUFFIX,
  CATEGORY_PAIN,
  COUNTRIES,
  COUNTRY_BY_CODE,
  COUNTRY_WEIGHT,
  PLATFORMS_BY_COUNTRY,
  PRODUCT_SEEDS,
  STORE_APPS,
  STORE_THEMES,
  SUPPLIER_NAMES,
} from "./catalog";
import { isoDaysAgo } from "./dates";
import { Rng, slugify } from "./random";
import { computeScore, saturationFromAds } from "./score";
import type {
  Ad,
  AdFormat,
  AdNetwork,
  CountryCode,
  DailyPoint,
  Listing,
  PlatformId,
  ProductGroup,
  Store,
  Supplier,
  TrendKind,
} from "./types";

export const HISTORY_DAYS = 30;

export interface Dataset {
  groups: ProductGroup[];
  suppliers: Supplier[];
  listings: Listing[];
  ads: Ad[];
  stores: Store[];
}

/** Redondea un costo de proveedor a un valor habitual en cada moneda. */
function roundCost(value: number, currency: string): number {
  switch (currency) {
    case "COP":
      return Math.round(value / 100) * 100;
    case "CLP":
      return Math.round(value / 10) * 10;
    case "MXN":
    case "GTQ":
      return Math.round(value);
    default:
      return Math.round(value * 10) / 10;
  }
}

/** Precio de venta «psicológico»: 59.900 COP, 19.990 CLP, 499 MXN, 89,90 PEN, 29,99 USD. */
function nicePrice(value: number, currency: string): number {
  switch (currency) {
    case "COP":
      return Math.ceil(value / 1000) * 1000 - 100;
    case "CLP":
      return Math.ceil(value / 1000) * 1000 - 10;
    case "MXN":
      return Math.ceil(value / 10) * 10 - 1;
    case "GTQ":
      return Math.ceil(value / 5) * 5 - 1;
    case "PEN":
      return Math.ceil(value) - 0.1;
    default:
      return Math.ceil(value) - 0.01;
  }
}

function buildSuppliers(rng: Rng): Supplier[] {
  const suppliers: Supplier[] = [];
  for (const country of COUNTRIES) {
    for (const platform of PLATFORMS_BY_COUNTRY[country.code]) {
      const count = platform === "dropi" ? 4 : 2;
      for (const name of rng.sample(SUPPLIER_NAMES, count)) {
        suppliers.push({
          id: `s-${country.code.toLowerCase()}-${platform}-${slugify(name)}`,
          name,
          platform,
          country: country.code,
          rating: Math.round(rng.range(3.6, 4.95) * 10) / 10,
          deliveryRate: Math.round(rng.range(0.62, 0.86) * 100) / 100,
          dispatchHours: rng.pick([12, 24, 24, 36, 48]),
        });
      }
    }
  }
  return suppliers;
}

function salesSeries(rng: Rng, base: number, trend: TrendKind, launchIndex: number): number[] {
  const spikes = trend === "pico" ? rng.sample([20, 21, 22, 23, 24, 25, 26, 27, 28], rng.int(1, 2)) : [];
  const out: number[] = [];
  for (let i = 0; i < HISTORY_DAYS; i++) {
    const x = i / (HISTORY_DAYS - 1);
    let mult = 1;
    if (trend === "sube") mult = 0.35 + 1.25 * x;
    else if (trend === "baja") mult = 1.5 - 1.05 * x;
    else if (trend === "pico") mult = spikes.includes(i) ? rng.range(5, 9) : 0.25;
    else if (trend === "nuevo") mult = i < launchIndex ? 0 : 0.5 + 1.3 * ((i - launchIndex) / (HISTORY_DAYS - launchIndex));
    const expected = base * mult * rng.range(0.55, 1.45);
    out.push(expected < 1 ? (rng.chance(expected) ? 1 : 0) : Math.round(expected));
  }
  return out;
}

function buildListings(rng: Rng, suppliers: Supplier[]) {
  const groups: ProductGroup[] = [];
  const raw: Omit<Listing, "adsInCountry" | "saturation" | "score" | "scoreParts">[] = [];
  const popularity = new Map<string, number>();

  PRODUCT_SEEDS.forEach((seed, gi) => {
    const groupId = `g${String(gi + 1).padStart(2, "0")}`;
    groups.push({ id: groupId, name: seed.name, category: seed.category });
    const p = 0.06 + 0.94 * Math.pow(rng.next(), 1.7);
    popularity.set(groupId, p);

    let countries = COUNTRIES.filter((c) => rng.chance(COUNTRY_WEIGHT[c.code] * (0.55 + 0.5 * p)));
    if (countries.length === 0) countries = [COUNTRIES[0]];

    for (const country of countries) {
      const n = 1 + (rng.chance(0.45) ? 1 : 0) + (rng.chance(0.15) ? 1 : 0);
      const used = new Set<string>();
      for (let k = 0; k < n; k++) {
        const platform = rng.weighted(
          PLATFORMS_BY_COUNTRY[country.code].map((id) => ({ value: id, weight: id === "dropi" ? 3 : 1 })),
        ) as PlatformId;
        const options = suppliers.filter(
          (s) => s.country === country.code && s.platform === platform && !used.has(s.id),
        );
        if (options.length === 0) continue;
        const supplier = rng.pick(options);
        used.add(supplier.id);

        const cost = roundCost(seed.usd * country.fx * rng.range(0.85, 1.2), country.currency);
        const price = nicePrice((cost + country.shipping) * rng.range(1.7, 3.3), country.currency);
        const trend = rng.weighted<TrendKind>([
          { value: "sube", weight: 25 },
          { value: "estable", weight: 35 },
          { value: "baja", weight: 20 },
          { value: "pico", weight: 10 },
          { value: "nuevo", weight: 10 },
        ]);
        const launchIndex = trend === "nuevo" ? rng.int(12, 23) : 0;
        const share = k === 0 ? rng.range(0.6, 1) : rng.range(0.25, 0.7);
        const base = 42 * Math.pow(p, 1.4) * COUNTRY_WEIGHT[country.code] * share;
        const units = salesSeries(rng, base, trend, launchIndex);

        const stockRoll = rng.next();
        let stock =
          stockRoll < 0.05
            ? 0
            : stockRoll < 0.2
              ? rng.int(3, 50)
              : stockRoll < 0.6
                ? rng.int(50, 500)
                : rng.int(500, 3200);
        if (stock === 0) {
          const dry = rng.int(2, 4);
          for (let i = HISTORY_DAYS - dry; i < HISTORY_DAYS; i++) units[i] = 0;
        }

        const stocks: number[] = new Array(HISTORY_DAYS).fill(0);
        stocks[HISTORY_DAYS - 1] = stock;
        for (let i = HISTORY_DAYS - 2; i >= 0; i--) {
          const restock = rng.chance(0.06) ? rng.int(100, 600) : 0;
          stocks[i] = Math.max(0, stocks[i + 1] + units[i + 1] - restock);
        }
        if (trend === "nuevo") for (let i = 0; i < launchIndex; i++) stocks[i] = 0;

        const priceChangeDay = rng.chance(0.22) ? rng.int(HISTORY_DAYS - 10, HISTORY_DAYS - 1) : -1;
        const previousCost = roundCost(cost * rng.range(0.85, 1.15), country.currency);

        const history: DailyPoint[] = units.map((u, i) => ({
          day: isoDaysAgo(HISTORY_DAYS - 1 - i),
          units: u,
          stock: stocks[i],
          price: priceChangeDay >= 0 && i < priceChangeDay ? previousCost : cost,
        }));

        const last7 = units.slice(-7);
        const prev7 = units.slice(-14, -7);
        const sales7d = last7.reduce((a, b) => a + b, 0);
        const salesPrev7d = prev7.reduce((a, b) => a + b, 0);
        const growth =
          salesPrev7d === 0 ? (sales7d > 0 ? 100 : 0) : Math.round(((sales7d - salesPrev7d) / salesPrev7d) * 100);
        stock = stocks[HISTORY_DAYS - 1];
        const perDay = sales7d / 7;

        raw.push({
          id: `p-${country.code.toLowerCase()}-${groupId}-${k + 1}`,
          groupId,
          name: seed.name,
          category: seed.category,
          country: country.code,
          supplierId: supplier.id,
          platform,
          costPrice: cost,
          suggestedPrice: price,
          stock,
          sales7d,
          salesPrev7d,
          sales30d: units.reduce((a, b) => a + b, 0),
          daysWithSales7d: last7.filter((u) => u > 0).length,
          growth: Math.max(-100, Math.min(400, growth)),
          listedAt: trend === "nuevo" ? isoDaysAgo(HISTORY_DAYS - 1 - launchIndex) : isoDaysAgo(rng.int(35, 420)),
          trend,
          history,
          stockDays: perDay > 0 ? Math.round(stock / perDay) : stock > 0 ? 999 : 0,
        });
      }
    }
  });

  return { groups, raw, popularity };
}

function brandName(rng: Rng, taken: Set<string>): string {
  for (let tries = 0; tries < 50; tries++) {
    const name = `${rng.pick(BRAND_PREFIX)} ${rng.pick(BRAND_SUFFIX)}`;
    if (!taken.has(name)) {
      taken.add(name);
      return name;
    }
  }
  const fallback = `${rng.pick(BRAND_PREFIX)} ${rng.pick(BRAND_SUFFIX)} ${taken.size}`;
  taken.add(fallback);
  return fallback;
}

const AD_PREFIX = ["Ofertas", "Mi", "Tu", "Súper", "Todo", "Más"];

const STORES_PER_COUNTRY: Record<CountryCode, number> = { CO: 8, MX: 7, EC: 5, PE: 5, CL: 4, GT: 4, PA: 3 };

function adCopy(rng: Rng, name: string, pain: string, countryName: string): string {
  const lower = name.charAt(0).toLowerCase() + name.slice(1);
  const templates = [
    `🔥 ${name} con envío gratis y pago contra entrega. ¡Últimas unidades en ${countryName}!`,
    `¿Cansado de ${pain}? Conoce ${lower}. Pagas cuando lo recibes 📦`,
    `Lo que todos están comprando este mes: ${lower}. Hoy con ${rng.pick([20, 30, 40, 50])} % de descuento.`,
    `${name}: resultados desde el primer uso. Envío a todo ${countryName}, paga al recibir.`,
    `Oferta 2x1 solo por hoy ⏰ ${name}. Pide ya y paga en casa.`,
    `Miles de clientes felices en ${countryName}. ${name} con garantía de 30 días.`,
  ];
  return rng.pick(templates);
}

export function generateDataset(seed = "veta-demo-v1"): Dataset {
  const rng = new Rng(seed);
  const suppliers = buildSuppliers(rng);
  const { groups, raw, popularity } = buildListings(rng, suppliers);
  const groupById = new Map(groups.map((g) => [g.id, g]));

  // Tiendas (nombres y país); sus productos se completan con los anuncios.
  const taken = new Set<string>();
  const storeShells = COUNTRIES.flatMap((country) =>
    Array.from({ length: STORES_PER_COUNTRY[country.code] }, (_, i) => {
      const name = brandName(rng, taken);
      return {
        id: `t-${country.code.toLowerCase()}-${i + 1}`,
        name,
        domain: `${slugify(name)}.demo`,
        country: country.code,
      };
    }),
  );

  // Anuncios por producto y país.
  const ads: Ad[] = [];
  const pairs = new Map<string, { groupId: string; country: CountryCode }>();
  for (const l of raw) pairs.set(`${l.groupId}|${l.country}`, { groupId: l.groupId, country: l.country });
  let adIndex = 0;
  for (const { groupId, country } of pairs.values()) {
    const group = groupById.get(groupId)!;
    const p = popularity.get(groupId)!;
    const countryInfo = COUNTRY_BY_CODE[country];
    const count = rng.int(0, Math.round(1 + 13 * p * COUNTRY_WEIGHT[country]));
    const localStores = storeShells.filter((s) => s.country === country);
    for (let i = 0; i < count; i++) {
      const network = rng.weighted<AdNetwork>([
        { value: "facebook", weight: 45 },
        { value: "instagram", weight: 25 },
        { value: "tiktok", weight: 30 },
      ]);
      const format: AdFormat =
        network === "tiktok"
          ? "video"
          : rng.weighted<AdFormat>([
              { value: "video", weight: 55 },
              { value: "imagen", weight: 30 },
              { value: "carrusel", weight: 15 },
            ]);
      const store = rng.chance(0.7) ? rng.pick(localStores) : null;
      // Anunciantes sin tienda en el radar: nombres de otra familia para no confundirlos con las tiendas.
      const advertiser = store ? store.name : `${rng.pick(AD_PREFIX)} ${rng.pick(BRAND_SUFFIX)}`;
      const daysActive = Math.max(1, Math.round(1 + 119 * Math.pow(rng.next(), 2)));
      const likes = Math.round((40 + 4200 * p * rng.next()) * (network === "tiktok" ? 3 : 1));
      adIndex++;
      ads.push({
        id: `a${String(adIndex).padStart(4, "0")}`,
        groupId,
        productName: group.name,
        category: group.category,
        network,
        country,
        advertiser,
        copy: adCopy(rng, group.name, CATEGORY_PAIN[group.category], countryInfo.name),
        format,
        startedAt: isoDaysAgo(daysActive),
        daysActive,
        variants: 1 + Math.round(10 * Math.pow(rng.next(), 2)),
        likes,
        comments: Math.round(likes * rng.range(0.03, 0.12)),
        shares: Math.round(likes * rng.range(0.01, 0.08)),
        landingDomain: store ? store.domain : `${slugify(advertiser)}.demo`,
      });
    }
  }

  // Puntuación y saturación de cada producto.
  const adsByPair = new Map<string, number>();
  for (const a of ads) adsByPair.set(`${a.groupId}|${a.country}`, (adsByPair.get(`${a.groupId}|${a.country}`) ?? 0) + 1);
  const listings: Listing[] = raw.map((l) => {
    const country = COUNTRY_BY_CODE[l.country];
    const adsInCountry = adsByPair.get(`${l.groupId}|${l.country}`) ?? 0;
    const { score, parts } = computeScore({
      sales7d: l.sales7d,
      growth: l.growth,
      costPrice: l.costPrice,
      suggestedPrice: l.suggestedPrice,
      shipping: country.shipping,
      adsInCountry,
      daysWithSales7d: l.daysWithSales7d,
      stock: l.stock,
      stockDays: l.stockDays,
      countryName: country.name,
    });
    return { ...l, adsInCountry, saturation: saturationFromAds(adsInCountry), score, scoreParts: parts };
  });

  // Tiendas completas: productos que anuncian + ingresos estimados.
  const stores: Store[] = storeShells.map((shell) => {
    const country = COUNTRY_BY_CODE[shell.country];
    const own = ads.filter((a) => a.advertiser === shell.name);
    const advertised = [...new Set(own.map((a) => a.groupId))];
    const localGroups = [...new Set(listings.filter((l) => l.country === shell.country).map((l) => l.groupId))];
    const extra = rng.sample(
      localGroups.filter((g) => !advertised.includes(g)),
      Math.max(0, rng.int(3, 6) - advertised.length),
    );
    const topProducts = [...advertised, ...extra]
      .map((groupId) => {
        const group = groupById.get(groupId)!;
        const listing = listings.find((l) => l.groupId === groupId && l.country === shell.country);
        return {
          groupId,
          name: group.name,
          category: group.category,
          estUnits30d: Math.round(rng.range(20, 420) * (advertised.includes(groupId) ? 1.6 : 1)),
          price: listing?.suggestedPrice ?? 0,
        };
      })
      .sort((a, b) => b.estUnits30d - a.estUnits30d)
      .slice(0, 8);

    const trend = rng.weighted([
      { value: 1.4, weight: 3 },
      { value: 1, weight: 4 },
      { value: 0.7, weight: 2 },
    ]);
    const dailyBase = topProducts.reduce((s, p) => s + (p.estUnits30d * p.price) / 30, 0);
    const revenueHistory = Array.from({ length: HISTORY_DAYS }, (_, i) => {
      const x = i / (HISTORY_DAYS - 1);
      const mult = trend > 1 ? 0.7 + 0.6 * x : trend < 1 ? 1.3 - 0.6 * x : 1;
      return { day: isoDaysAgo(HISTORY_DAYS - 1 - i), revenue: Math.round(dailyBase * mult * rng.range(0.6, 1.4)) };
    });
    const revenue30d = revenueHistory.reduce((s, d) => s + d.revenue, 0);
    const avgPrice = topProducts.length
      ? topProducts.reduce((s, p) => s + p.price, 0) / topProducts.length
      : country.fx * 20;

    return {
      ...shell,
      theme: rng.pick(STORE_THEMES),
      apps: rng.sample(STORE_APPS, rng.int(3, 6)),
      monthlyVisits: Math.round(revenue30d / Math.max(1, avgPrice) / rng.range(0.012, 0.03)),
      activeAds: own.length,
      revenue30d,
      revenuePrev30d: Math.round(revenue30d / trend / rng.range(0.9, 1.1)),
      revenueHistory,
      topProducts,
      createdAt: isoDaysAgo(rng.int(60, 900)),
    };
  });

  return { groups, suppliers, listings, ads, stores };
}
