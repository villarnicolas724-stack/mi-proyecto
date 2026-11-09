// Tipos de la capa de datos. Tienen la misma forma que replica/02-arquitectura/esquema.sql
// para que el backend real pueda sustituir los datos de demostración sin tocar pantallas.

export type CountryCode = "CO" | "MX" | "EC" | "PE" | "CL" | "GT" | "PA";

export type Category =
  | "Belleza"
  | "Hogar"
  | "Cocina"
  | "Tecnología"
  | "Salud y bienestar"
  | "Mascotas"
  | "Bebés"
  | "Deportes"
  | "Herramientas"
  | "Accesorios"
  | "Vehículos";

export type PlatformId = "dropi" | "aliclick" | "mastershop";

export interface Country {
  code: CountryCode;
  name: string;
  currency: string;
  locale: string;
  /** Unidades de moneda local por 1 USD (valor fijo de demostración). */
  fx: number;
  /** Flete típico contra entrega en moneda local. */
  shipping: number;
}

export interface Platform {
  id: PlatformId;
  name: string;
}

export interface Supplier {
  id: string;
  name: string;
  platform: PlatformId;
  country: CountryCode;
  rating: number;
  /** Efectividad de entrega 0..1 (pedidos entregados / despachados). */
  deliveryRate: number;
  dispatchHours: number;
}

export interface ProductGroup {
  id: string;
  name: string;
  category: Category;
}

export type TrendKind = "sube" | "baja" | "estable" | "pico" | "nuevo";

export interface DailyPoint {
  /** Fecha ISO yyyy-mm-dd */
  day: string;
  units: number;
  stock: number;
  price: number;
}

export interface ScorePart {
  key: "demanda" | "impulso" | "margen" | "saturacion" | "regularidad" | "stock";
  label: string;
  points: number;
  max: number;
  verdict: "bien" | "regular" | "mal";
  explanation: string;
}

export interface Listing {
  id: string;
  groupId: string;
  name: string;
  category: Category;
  country: CountryCode;
  supplierId: string;
  platform: PlatformId;
  costPrice: number;
  suggestedPrice: number;
  stock: number;
  sales7d: number;
  salesPrev7d: number;
  sales30d: number;
  daysWithSales7d: number;
  /** Variación de ventas 7 días frente a los 7 anteriores, en %. */
  growth: number;
  listedAt: string;
  trend: TrendKind;
  history: DailyPoint[];
  /** Anuncios activos de este producto en el país. */
  adsInCountry: number;
  saturation: SaturationLevel;
  score: number;
  scoreParts: ScorePart[];
  /** Días que alcanza el stock al ritmo de ventas actual. */
  stockDays: number;
}

export type SaturationLevel = "baja" | "media" | "alta";

export type AdNetwork = "facebook" | "instagram" | "tiktok";
export type AdFormat = "video" | "imagen" | "carrusel";

export interface Ad {
  id: string;
  groupId: string;
  productName: string;
  category: Category;
  network: AdNetwork;
  country: CountryCode;
  advertiser: string;
  copy: string;
  format: AdFormat;
  startedAt: string;
  daysActive: number;
  variants: number;
  likes: number;
  comments: number;
  shares: number;
  landingDomain: string;
}

export interface Store {
  id: string;
  name: string;
  domain: string;
  country: CountryCode;
  theme: string;
  apps: string[];
  monthlyVisits: number;
  activeAds: number;
  revenue30d: number;
  revenuePrev30d: number;
  revenueHistory: { day: string; revenue: number }[];
  topProducts: { groupId: string; name: string; category: Category; estUnits30d: number; price: number }[];
  createdAt: string;
}

export interface ProductFilters {
  country: CountryCode;
  query?: string;
  categories?: Category[];
  platforms?: PlatformId[];
  minPrice?: number;
  maxPrice?: number;
  minSales7d?: number;
  minStock?: number;
  saturation?: SaturationLevel[];
  trend?: "todas" | "sube" | "baja";
  minRegularity?: number;
  sort?: "score" | "sales7d" | "growth" | "margin" | "recent";
}

export interface AdFilters {
  country: CountryCode | "todos";
  query?: string;
  networks?: AdNetwork[];
  categories?: Category[];
  formats?: AdFormat[];
  minDays?: number;
  maxDays?: number;
  sort?: "recientes" | "dias" | "interacciones";
}
