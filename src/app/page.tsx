import {
  ArrowRight,
  Bell,
  Calculator,
  Globe,
  GraduationCap,
  Megaphone,
  Scale,
  Search,
  Store,
  Users,
} from "lucide-react";
import { RegularityDots, Sparkline } from "@/components/charts/small-charts";
import { PricingTable } from "@/components/marketing/pricing";
import { SiteFooter, SiteHeader } from "@/components/marketing/site-header";
import { ProductThumb, SaturationBadge, ScoreRing, TrendBadge } from "@/components/product/bits";
import { Badge, ButtonLink } from "@/components/ui/primitives";
import { COUNTRIES, COUNTRY_BY_CODE } from "@/lib/data/catalog";
import { getSupplier, listListings } from "@/lib/data";
import { calculateProfit } from "@/lib/data/profit";
import { formatInt, formatMoney } from "@/lib/format";

const DIFFERENTIATORS = [
  {
    icon: Calculator,
    title: "Cuánto ganas, no solo cuánto vende",
    text: "Cada producto trae su calculadora contra entrega: devoluciones, flete de vuelta y publicidad incluidos. Ves la utilidad por pedido entregado antes de pautar.",
  },
  {
    icon: GraduationCap,
    title: "Una puntuación que se explica",
    text: "Demanda, impulso, margen, saturación, regularidad y stock. Cada factor te dice en una frase si está bien o mal y por qué.",
  },
  {
    icon: Scale,
    title: "Compara proveedores del mismo producto",
    text: "El mismo producto en varios proveedores: el más barato, el que tiene más stock y el que mejor entrega.",
  },
  {
    icon: Globe,
    title: "Oportunidades entre países",
    text: "Detecta lo que ya funciona en México o Colombia y en tu país casi nadie anuncia todavía.",
  },
  {
    icon: Bell,
    title: "Alertas que te ahorran dinero",
    text: "Te avisamos si un producto que sigues se va a agotar, si el proveedor sube el precio o si llega competencia.",
  },
  {
    icon: Users,
    title: "Pensado para quien empieza",
    text: "Ruta guiada hasta tu primer producto ganador, glosario y checklist. Todo visible, nada escondido.",
  },
];

const MODULES = [
  { icon: Search, title: "Productos", text: "Ventas diarias, stock, precio, tendencia y saturación de cada producto de los proveedores." },
  { icon: Megaphone, title: "Anuncios", text: "Facebook, Instagram y TikTok, con días activos, variantes e interacciones, enlazados al producto." },
  { icon: Store, title: "Tiendas", text: "Productos más vendidos, anuncios y apps de las tiendas de tu competencia, con ingresos estimados." },
  { icon: Bell, title: "Seguimiento", text: "Tu lista de productos vigilados con alertas configurables." },
];

const FAQ = [
  {
    q: "¿De dónde salen los datos?",
    a: "De los catálogos públicos de los proveedores de dropshipping de cada país, de las bibliotecas públicas de anuncios y de tiendas que cualquiera puede visitar. Las ventas y los ingresos de tiendas son estimaciones y así se indican. Esta versión todavía usa datos de demostración.",
  },
  {
    q: "¿En qué países funciona?",
    a: `${COUNTRIES.map((c) => c.name).join(", ")}. Cada país tiene su moneda, sus fletes y su propia medida de saturación.`,
  },
  {
    q: "¿Necesito tarjeta para empezar?",
    a: "No. El plan Gratis no pide tarjeta y te deja validar productos con la calculadora y la puntuación explicada.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. No hay permanencia: cancelas desde tu cuenta y no se vuelve a cobrar.",
  },
  {
    q: "¿Qué es la efectividad de entrega y por qué importa tanto?",
    a: "Es el porcentaje de pedidos contra entrega que el cliente recibe y paga. Un producto que vende mucho pero se devuelve mucho puede hacerte perder dinero; por eso la calculadora la tiene en cuenta.",
  },
];

export default function Home() {
  const hero = listListings({ country: "CO", minSales7d: 30, minStock: 200, sort: "score" })[0];
  const supplier = getSupplier(hero.supplierId);
  const profit = calculateProfit({
    price: hero.suggestedPrice,
    cost: hero.costPrice,
    shipping: COUNTRY_BY_CODE.CO.shipping,
    returnShipping: COUNTRY_BY_CODE.CO.shipping,
    cpa: 16400,
    deliveryRate: supplier ? Math.round(supplier.deliveryRate * 100) : 72,
    feePct: 0,
    extraCost: 0,
  });

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Badge tone="primary" className="mb-4">
              Dropshipping contra entrega · 7 países de Latinoamérica
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-text sm:text-5xl">
              Encuentra productos que venden. <span className="text-primary-ink">Y que te dejan dinero.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-text-2">
              Veta rastrea ventas, stock y anuncios de los productos de tus proveedores y te dice cuánto ganas por pedido
              entregado, con devoluciones incluidas, antes de gastar en publicidad.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/ingresar" size="lg">
                Empezar gratis <ArrowRight size={18} aria-hidden />
              </ButtonLink>
              <ButtonLink href="/app" size="lg" variant="secondary">
                Ver la demo
              </ButtonLink>
            </div>
            <p className="mt-3 text-sm text-muted">Sin tarjeta · sin permanencia · en español</p>
          </div>

          {/* Vista previa de producto */}
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-card" aria-label="Ejemplo de ficha de producto">
            <div className="flex items-start gap-3">
              <ProductThumb category={hero.category} />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-muted">Ejemplo · Colombia</div>
                <div className="font-bold text-text">{hero.name}</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <TrendBadge growth={hero.growth} />
                  <SaturationBadge level={hero.saturation} />
                </div>
              </div>
              <ScoreRing score={hero.score} size={56} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl bg-surface-2 p-3 text-sm">
              <div>
                <div className="text-xs text-muted">Ventas 7 días</div>
                <div className="tabular font-bold text-text">{formatInt(hero.sales7d)}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Costo</div>
                <div className="tabular font-bold text-text">{formatMoney(hero.costPrice, "CO")}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Precio</div>
                <div className="tabular font-bold text-text">{formatMoney(hero.suggestedPrice, "CO")}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-muted">Días con venta</div>
                <RegularityDots units={hero.history.map((h) => h.units)} />
              </div>
              <Sparkline values={hero.history.map((h) => h.units)} label="Ventas de 30 días" width={140} height={40} />
            </div>
            <div className="mt-4 rounded-2xl border border-primary/40 bg-primary-soft p-4">
              <div className="text-sm font-semibold text-primary-ink">Utilidad por pedido entregado</div>
              <div className="tabular text-3xl font-extrabold text-text">{formatMoney(profit.profitPerDelivered, "CO")}</div>
              <div className="text-xs text-text-2">
                con {Math.round((profit.delivered / profit.orders) * 100)} % de entregas, devoluciones y CPA de{" "}
                {formatMoney(16400, "CO")}
              </div>
            </div>
          </div>
        </section>

        {/* Diferenciadores */}
        <section id="funciones" className="scroll-mt-20 border-y border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-text">Lo que ves en Veta y en otras herramientas no</h2>
            <p className="mt-2 max-w-2xl text-text-2">
              Saber qué vende es el principio. Lo que decide si ganas dinero es el margen después de devoluciones, la
              competencia en tu país y que el proveedor no se quede sin stock.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {DIFFERENTIATORS.map((d) => (
                <div key={d.title}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-ink">
                    <d.icon size={22} aria-hidden />
                  </div>
                  <h3 className="mt-3 font-bold text-text">{d.title}</h3>
                  <p className="mt-1 text-sm text-text-2">{d.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Módulos */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-text">Todo lo que necesitas para investigar</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m) => (
              <div key={m.title} className="rounded-2xl border border-border bg-surface p-5">
                <m.icon size={22} className="text-primary-ink" aria-hidden />
                <h3 className="mt-3 font-bold text-text">{m.title}</h3>
                <p className="mt-1 text-sm text-text-2">{m.text}</p>
              </div>
            ))}
          </div>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              ["Filtra", "Elige país y usa el atajo «Ganadores probados»."],
              ["Valida", "Lee la puntuación, compara proveedores y calcula tu utilidad."],
              ["Lanza y vigila", "Sigue el producto: te avisamos si algo cambia."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4 rounded-2xl bg-surface-2 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-fg">
                  {i + 1}
                </span>
                <div>
                  <div className="font-bold text-text">{t}</div>
                  <div className="text-sm text-text-2">{d}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Precios */}
        <section id="precios" className="scroll-mt-20 border-y border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-text">Precios claros</h2>
            <p className="mx-auto mt-2 mb-8 max-w-xl text-center text-text-2">Empieza gratis. Pasa a Pro cuando tengas tu primer ganador.</p>
            <PricingTable mode="public" />
          </div>
        </section>

        {/* Preguntas */}
        <section id="preguntas" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-text">Preguntas frecuentes</h2>
          <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none font-bold text-text marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="text-primary-ink transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-2 text-sm text-text-2">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-primary p-8 text-center text-primary-fg">
            <h2 className="text-2xl font-extrabold">Tu próximo producto ganador está en los datos</h2>
            <p className="mt-2 opacity-90">Crea tu cuenta gratis y sigue la ruta guiada.</p>
            <ButtonLink href="/ingresar" variant="secondary" size="lg" className="mt-5">
              Empezar gratis
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
