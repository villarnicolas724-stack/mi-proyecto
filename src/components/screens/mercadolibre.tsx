"use client";

import { useEffect, useState } from "react";
import {
  Calculator,
  CircleAlert,
  CircleCheck,
  ExternalLink,
  KeyRound,
  Loader2,
  RefreshCw,
  Search,
  ShoppingBag,
  TrendingUp,
  Truck,
  Unplug,
} from "lucide-react";
import { ProfitCalculator, defaultProfitInput } from "@/components/product/profit-calculator";
import { Segmented } from "@/components/ui/chips";
import { Badge, Button, Card, CardHeader, EmptyState, Input, Label, PageHeader, Select } from "@/components/ui/primitives";
import { COUNTRY_BY_CODE } from "@/lib/data/catalog";
import type { CountryCode } from "@/lib/data/types";
import { formatInt, formatMoney } from "@/lib/format";
import { mlSite, type MlCategory, type MlProduct, type MlStatus } from "@/lib/ml/sites";
import { useCountry } from "@/lib/state/stores";

type Tab = "vendidos" | "buscar" | "tendencias";

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { error?: string }).error ?? `Error ${res.status}`);
  return body as T;
}

function price(p: MlProduct, country: CountryCode) {
  if (p.price == null) return "Sin precio";
  return p.currency && p.currency !== COUNTRY_BY_CODE[country].currency
    ? `${p.price} ${p.currency}`
    : formatMoney(p.price, country);
}

// ---------------- Conexión ----------------

function DEV_PORTAL(country: CountryCode) {
  const tld: Partial<Record<CountryCode, string>> = { CO: "com.co", MX: "com.mx", CL: "cl", PE: "com.pe", EC: "com.ec" };
  return `https://developers.mercadolibre.${tld[country] ?? "com.co"}/devcenter`;
}

function Connect({ country, status, onDone }: { country: CountryCode; status: MlStatus | null; onDone: () => void }) {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(status?.error ?? null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await getJson("/api/ml/config", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ clientId, clientSecret }),
      });
      setClientSecret("");
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card>
        <CardHeader title="Conecta Mercado Libre (una sola vez)" subtitle="Unos 10 minutos. Es gratis y no necesitas vender en Mercado Libre." />
        <ol className="space-y-3 p-5 pt-4 text-sm text-text">
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary-ink">1</span>
            <div>
              Entra en el{" "}
              <a href={DEV_PORTAL(country)} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-ink underline">
                Centro de desarrolladores de Mercado Libre <ExternalLink size={12} className="inline" aria-hidden />
              </a>{" "}
              e inicia sesión con tu cuenta normal de Mercado Libre (o créala).
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary-ink">2</span>
            <div>
              Pulsa <strong>«Crear aplicación»</strong>. Ponle de nombre <em>Veta personal</em> y una descripción corta, por ejemplo
              «Investigación de productos para uso personal».
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary-ink">3</span>
            <div>
              En <strong>«URI de redirect»</strong> escribe <code className="rounded bg-surface-2 px-1">https://localhost</code>. En
              permisos deja los que vienen por defecto (solo lectura basta).
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary-ink">4</span>
            <div>
              Guarda. En la página de tu app verás el <strong>App ID</strong> (solo números) y la <strong>Clave secreta</strong>{" "}
              (Secret Key). Cópialos en el formulario de la derecha.
            </div>
          </li>
        </ol>
        <p className="border-t border-border p-5 text-xs text-muted">
          Las claves se guardan solo en tu ordenador, en la carpeta <code>.veta</code> del proyecto. No se suben a GitHub ni se
          envían a nadie salvo a Mercado Libre.
        </p>
      </Card>

      <Card className="self-start">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <KeyRound size={18} aria-hidden /> Tus credenciales
            </span>
          }
        />
        <form onSubmit={save} className="space-y-4 p-5 pt-4">
          <div>
            <Label htmlFor="ml-id">App ID</Label>
            <Input id="ml-id" inputMode="numeric" autoComplete="off" value={clientId} onChange={(e) => setClientId(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="ml-secret">Clave secreta (Secret Key)</Label>
            <Input
              id="ml-secret"
              type="password"
              autoComplete="off"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              required
            />
          </div>
          {error ? (
            <p className="rounded-xl bg-danger-soft p-3 text-sm font-medium text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <CircleCheck size={16} aria-hidden />}
            {saving ? "Comprobando con Mercado Libre…" : "Conectar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

// ---------------- Productos ----------------

function ProductGrid({
  products,
  country,
  onCalc,
}: {
  products: MlProduct[];
  country: CountryCode;
  onCalc: (p: MlProduct) => void;
}) {
  if (products.length === 0)
    return <EmptyState icon={<ShoppingBag size={28} />} title="Mercado Libre no devolvió productos para esta consulta" />;
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => (
        <article key={p.id} className="flex gap-3 rounded-2xl border border-border bg-surface p-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
            {p.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.thumbnail} alt="" className="h-full w-full object-contain" loading="lazy" referrerPolicy="no-referrer" />
            ) : null}
            {p.position ? (
              <span className="absolute top-1 left-1 rounded-full bg-primary px-1.5 text-xs font-bold text-primary-fg">#{p.position}</span>
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-semibold text-text">{p.title}</h3>
            <div className="tabular mt-1 text-base font-extrabold text-text">{price(p, country)}</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {p.soldQuantity != null ? <Badge tone="success">+{formatInt(p.soldQuantity)} vendidos (aprox.)</Badge> : null}
              {p.freeShipping ? (
                <Badge tone="info">
                  <Truck size={12} aria-hidden /> Envío gratis
                </Badge>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.price != null ? (
                <Button size="sm" variant="secondary" onClick={() => onCalc(p)}>
                  <Calculator size={14} aria-hidden /> Calcular
                </Button>
              ) : null}
              {p.permalink ? (
                <a
                  href={p.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-primary-ink hover:bg-surface-2"
                >
                  Ver en Mercado Libre <ExternalLink size={13} aria-hidden />
                </a>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function Loading({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 py-10 text-sm text-text-2" role="status">
      <Loader2 size={18} className="animate-spin" aria-hidden /> {text}
    </div>
  );
}

function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-wrap items-start gap-3 rounded-2xl bg-danger-soft p-4 text-sm text-danger" role="alert">
      <CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden />
      <p className="flex-1 font-medium">{message}</p>
      {onRetry ? (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          <RefreshCw size={14} aria-hidden /> Reintentar
        </Button>
      ) : null}
    </div>
  );
}

function BestSellers({ country, onCalc }: { country: CountryCode; onCalc: (p: MlProduct) => void }) {
  const [categories, setCategories] = useState<MlCategory[] | null>(null);
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState<MlProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let alive = true;
    getJson<{ categories: MlCategory[] }>(`/api/ml/categorias?pais=${country}`)
      .then((d) => {
        if (!alive) return;
        setCategories(d.categories);
        setCategory((c) => (d.categories.some((x) => x.id === c) ? c : (d.categories[0]?.id ?? "")));
        setError(null);
      })
      .catch((e: Error) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [country, reload]);

  useEffect(() => {
    if (!category) return;
    let alive = true;
    getJson<{ products: MlProduct[] }>(`/api/ml/mas-vendidos?pais=${country}&categoria=${category}`)
      .then((d) => {
        if (!alive) return;
        setProducts(d.products);
        setError(null);
      })
      .catch((e: Error) => alive && setError(e.message));
    return () => {
      alive = false;
      setProducts(null);
    };
  }, [country, category, reload]);

  return (
    <div className="space-y-4">
      {categories ? (
        <div className="max-w-sm">
          <Label htmlFor="ml-cat">Categoría</Label>
          <Select id="ml-cat" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      ) : null}
      {error ? (
        <ErrorBox message={error} onRetry={() => setReload((n) => n + 1)} />
      ) : !categories || !products ? (
        <Loading text="Pidiendo los más vendidos a Mercado Libre…" />
      ) : (
        <ProductGrid products={products} country={country} onCalc={onCalc} />
      )}
    </div>
  );
}

function SearchTab({
  country,
  initial,
  onCalc,
}: {
  country: CountryCode;
  initial: string;
  onCalc: (p: MlProduct) => void;
}) {
  const [q, setQ] = useState(initial);
  const [submitted, setSubmitted] = useState(initial.trim());
  const [result, setResult] = useState<{ query: string; products?: MlProduct[]; error?: string } | null>(null);

  useEffect(() => {
    if (submitted.length < 2) return;
    let alive = true;
    getJson<{ products: MlProduct[] }>(`/api/ml/buscar?pais=${country}&q=${encodeURIComponent(submitted)}`)
      .then((d) => alive && setResult({ query: submitted, products: d.products }))
      .catch((e: Error) => alive && setResult({ query: submitted, error: e.message }));
    return () => {
      alive = false;
    };
  }, [country, submitted]);

  const loading = submitted.length >= 2 && result?.query !== submitted;
  const products = !loading ? result?.products : undefined;
  const error = !loading ? result?.error : undefined;
  const run = (query: string) => setSubmitted(query.trim());

  return (
    <div className="space-y-4">
      <form
        className="flex max-w-xl gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(q);
        }}
      >
        <label htmlFor="ml-q" className="sr-only">
          Buscar en Mercado Libre
        </label>
        <Input id="ml-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ej.: masajeador cervical" />
        <Button type="submit" disabled={loading}>
          <Search size={16} aria-hidden /> Buscar
        </Button>
      </form>
      {error ? <ErrorBox message={error} /> : null}
      {loading ? <Loading text="Buscando en Mercado Libre…" /> : null}
      {products && !loading ? <ProductGrid products={products} country={country} onCalc={onCalc} /> : null}
    </div>
  );
}

function TrendsTab({ country, onPick }: { country: CountryCode; onPick: (k: string) => void }) {
  const [trends, setTrends] = useState<{ keyword: string; url: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getJson<{ trends: { keyword: string; url: string }[] }>(`/api/ml/tendencias?pais=${country}`)
      .then((d) => alive && setTrends(d.trends))
      .catch((e: Error) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [country]);

  if (error) return <ErrorBox message={error} />;
  if (!trends) return <Loading text="Pidiendo las búsquedas en alza…" />;
  return (
    <div>
      <p className="mb-3 text-sm text-text-2">
        Lo que más está buscando la gente en Mercado Libre {COUNTRY_BY_CODE[country].name} ahora. Toca una para ver los productos.
      </p>
      <ol className="flex flex-wrap gap-2">
        {trends.map((t, i) => (
          <li key={t.keyword}>
            <button
              type="button"
              onClick={() => onPick(t.keyword)}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border-strong bg-surface px-3 text-sm font-medium text-text hover:border-primary"
            >
              <span className="tabular text-xs font-bold text-muted">{i + 1}</span> {t.keyword}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------------- Pantalla ----------------

export function MercadoLibreScreen() {
  const country = useCountry();
  const site = mlSite(country);
  const [status, setStatus] = useState<MlStatus | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("vendidos");
  const [searchSeed, setSearchSeed] = useState("");
  const [calc, setCalc] = useState<MlProduct | null>(null);
  const [check, setCheck] = useState(0);

  useEffect(() => {
    let alive = true;
    getJson<MlStatus>("/api/ml/config")
      .then((s) => alive && setStatus(s))
      .catch(() => alive && setStatus({ configured: false, source: null, ok: false }))
      .finally(() => alive && setChecking(false));
    return () => {
      alive = false;
    };
  }, [check]);

  async function disconnect() {
    await fetch("/api/ml/config", { method: "DELETE" });
    setStatus({ configured: false, source: null, ok: false });
  }

  return (
    <>
      <PageHeader
        title="Mercado Libre"
        description="Datos reales de Mercado Libre: los más vendidos por categoría, precios actuales y lo que más busca la gente."
        actions={
          status?.ok ? (
            <div className="flex items-center gap-2">
              <Badge tone="success">
                <CircleCheck size={13} aria-hidden /> Conectado
              </Badge>
              {status.source === "archivo" ? (
                <Button variant="ghost" size="sm" onClick={disconnect}>
                  <Unplug size={14} aria-hidden /> Desconectar
                </Button>
              ) : null}
            </div>
          ) : null
        }
      />

      {!site ? (
        <EmptyState icon={<ShoppingBag size={32} />} title={`Mercado Libre no opera en ${COUNTRY_BY_CODE[country].name}`}>
          Elige un país de Latinoamérica en el selector «País» del menú para ver sus datos reales.
        </EmptyState>
      ) : checking ? (
        <Loading text="Comprobando la conexión…" />
      ) : !status?.ok ? (
        <Connect country={country} status={status} onDone={() => setCheck((n) => n + 1)} />
      ) : (
        <>
          <div className="mb-5">
            <Segmented<Tab>
              label="Qué ver"
              hideLabel
              value={tab}
              onChange={setTab}
              options={[
                { value: "vendidos", label: "Más vendidos" },
                { value: "buscar", label: "Buscar" },
                { value: "tendencias", label: "Búsquedas en alza" },
              ]}
            />
          </div>

          {calc ? (
            <Card className="mb-6">
              <CardHeader
                title={`¿Cuánto ganarías vendiendo «${calc.title}»?`}
                subtitle="El precio es el real de Mercado Libre. Pon el costo de tu proveedor, tu flete y tu CPA."
                action={
                  <Button variant="ghost" size="sm" onClick={() => setCalc(null)}>
                    Cerrar
                  </Button>
                }
              />
              <div className="p-5 pt-4">
                <ProfitCalculator
                  key={calc.id}
                  country={country}
                  initial={defaultProfitInput(country, { price: calc.price ?? undefined })}
                />
              </div>
            </Card>
          ) : null}

          {tab === "vendidos" ? <BestSellers key={country} country={country} onCalc={setCalc} /> : null}
          {tab === "buscar" ? <SearchTab key={`${country}-${searchSeed}`} country={country} initial={searchSeed} onCalc={setCalc} /> : null}
          {tab === "tendencias" ? (
            <TrendsTab
              key={country}
              country={country}
              onPick={(k) => {
                setSearchSeed(k);
                setTab("buscar");
              }}
            />
          ) : null}

          <p className="mt-6 flex items-center gap-1.5 text-xs text-muted">
            <TrendingUp size={13} aria-hidden /> Datos de la API oficial de Mercado Libre en el momento de la consulta. Las unidades
            vendidas son aproximadas.
          </p>
        </>
      )}
    </>
  );
}
