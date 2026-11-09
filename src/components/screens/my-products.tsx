"use client";

import { useRef, useState } from "react";
import {
  Calculator,
  CircleAlert,
  CircleCheck,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Loader2,
  Megaphone,
  Package,
  Plus,
  Trash2,
  TriangleAlert,
  Upload,
} from "lucide-react";
import { ProfitCalculator, defaultProfitInput } from "@/components/product/profit-calculator";
import { Segmented } from "@/components/ui/chips";
import { Badge, Button, Card, CardHeader, EmptyState, Input, Label, PageHeader, Select } from "@/components/ui/primitives";
import { CATEGORIES, COUNTRIES, COUNTRY_BY_CODE } from "@/lib/data/catalog";
import { calculateProfit } from "@/lib/data/profit";
import type { CountryCode } from "@/lib/data/types";
import { formatInt, formatMoney } from "@/lib/format";
import { metaAdLibraryUrl } from "@/lib/links";
import { parseNumber, readProductsFile, templateCsv, type MyProduct, type ParseResult } from "@/lib/my-products/parse";
import { myProductsStore, removeMyProduct, upsertMyProducts, useCountry, useMyProducts } from "@/lib/state/stores";

type Sort = "utilidad" | "margen" | "ventas" | "nombre";

function analyse(p: MyProduct) {
  const input = defaultProfitInput(p.country, { price: p.price, cost: p.cost });
  const r = calculateProfit(input);
  const c = COUNTRY_BY_CODE[p.country];
  const multiple = p.price / Math.max(0.01, p.cost + c.shipping);
  const perDay = p.sales7d ? p.sales7d / 7 : p.sales30d ? p.sales30d / 30 : 0;
  const stockDays = p.stock != null && perDay > 0 ? Math.round(p.stock / perDay) : null;
  return { r, input, multiple, stockDays };
}

function download(name: string, content: string, type: string) {
  const blob = new Blob(["﻿" + content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCsv(list: MyProduct[]) {
  const head = ["nombre", "pais", "categoria", "proveedor", "costo", "precio_venta", "stock", "ventas_7d", "ventas_30d", "enlace", "notas"];
  const esc = (v: string | number | null) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const num = (n: number | null) => (n == null ? "" : String(n).replace(".", ","));
  const rows = list.map((p) =>
    [p.name, COUNTRY_BY_CODE[p.country].name, p.category, p.supplier, num(p.cost), num(p.price), p.stock, p.sales7d, p.sales30d, p.link, p.notes]
      .map((v) => esc(v as string))
      .join(";"),
  );
  download("veta-mis-productos.csv", [head.join(";"), ...rows].join("\r\n"), "text/csv;charset=utf-8");
}

// ---------- Añadir a mano ----------

function AddForm({ country, onClose }: { country: CountryCode; onClose: () => void }) {
  const [f, setF] = useState({ name: "", country, category: "", supplier: "", cost: "", price: "", stock: "", sales7d: "", link: "" });
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cost = parseNumber(f.cost);
    const price = parseNumber(f.price);
    if (!f.name.trim()) return setError("Escribe el nombre del producto.");
    if (cost == null) return setError("El costo tiene que ser un número.");
    if (price == null || price <= 0) return setError("El precio de venta tiene que ser un número.");
    const int = (v: string) => {
      const n = parseNumber(v);
      return n == null ? null : Math.max(0, Math.round(n));
    };
    upsertMyProducts([
      {
        id: `mp-${f.country}-${f.name.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-")}`,
        name: f.name.trim(),
        country: f.country as CountryCode,
        category: f.category || null,
        supplier: f.supplier.trim() || null,
        cost,
        price,
        stock: int(f.stock),
        sales7d: int(f.sales7d),
        sales30d: null,
        link: f.link.trim() || null,
        notes: null,
        updatedAt: new Date().toISOString(),
      },
    ]);
    onClose();
  }

  const cur = COUNTRY_BY_CODE[f.country as CountryCode].currency;
  return (
    <Card className="mb-6">
      <CardHeader title="Añadir un producto" subtitle="Solo son obligatorios el nombre, el costo y el precio de venta." />
      <form onSubmit={submit} className="grid gap-3 p-5 pt-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Label htmlFor="mp-name">Nombre *</Label>
          <Input id="mp-name" value={f.name} onChange={set("name")} autoFocus />
        </div>
        <div>
          <Label htmlFor="mp-country">País</Label>
          <Select id="mp-country" value={f.country} onChange={set("country")}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="mp-cat">Categoría</Label>
          <Select id="mp-cat" value={f.category} onChange={set("category")}>
            <option value="">Sin categoría</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="mp-cost">Costo del proveedor * ({cur})</Label>
          <Input id="mp-cost" inputMode="decimal" value={f.cost} onChange={set("cost")} />
        </div>
        <div>
          <Label htmlFor="mp-price">Precio de venta * ({cur})</Label>
          <Input id="mp-price" inputMode="decimal" value={f.price} onChange={set("price")} />
        </div>
        <div>
          <Label htmlFor="mp-stock">Stock</Label>
          <Input id="mp-stock" inputMode="numeric" value={f.stock} onChange={set("stock")} />
        </div>
        <div>
          <Label htmlFor="mp-sales">Ventas en 7 días</Label>
          <Input id="mp-sales" inputMode="numeric" value={f.sales7d} onChange={set("sales7d")} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="mp-supplier">Proveedor</Label>
          <Input id="mp-supplier" value={f.supplier} onChange={set("supplier")} placeholder="Ej.: BigBuy, Dropi…" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="mp-link">Enlace</Label>
          <Input id="mp-link" type="url" value={f.link} onChange={set("link")} placeholder="https://…" />
        </div>
        {error ? (
          <p className="rounded-xl bg-danger-soft p-3 text-sm font-medium text-danger sm:col-span-2 lg:col-span-4" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
          <Button type="submit">
            <Plus size={16} aria-hidden /> Añadir
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}

// ---------- Vista previa de la importación ----------

function ImportPreview({ result, fileName, onDone }: { result: ParseResult; fileName: string; onDone: (msg: string | null) => void }) {
  const ok = result.products.length;
  return (
    <Card className="mb-6">
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <FileSpreadsheet size={18} aria-hidden /> {fileName}
          </span>
        }
        subtitle={ok ? `${ok} productos listos para añadir.` : "No se pudo leer ningún producto."}
      />
      <div className="space-y-3 p-5 pt-3 text-sm">
        {result.errors.length ? (
          <div className="rounded-xl bg-warning-soft p-3 text-warning">
            <div className="flex items-center gap-2 font-bold">
              <TriangleAlert size={16} aria-hidden /> {result.errors.length === 1 ? "1 aviso" : `${result.errors.length} avisos`}
            </div>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              {result.errors.slice(0, 8).map((e) => (
                <li key={e}>{e}</li>
              ))}
              {result.errors.length > 8 ? <li>… y {result.errors.length - 8} más.</li> : null}
            </ul>
          </div>
        ) : null}
        {result.ignoredColumns.length ? (
          <p className="text-text-2">Columnas que Veta no usa (se ignoran): {result.ignoredColumns.join(", ")}.</p>
        ) : null}
        {ok ? (
          <ul className="max-h-48 divide-y divide-border overflow-y-auto rounded-xl border border-border">
            {result.products.slice(0, 50).map((p) => (
              <li key={p.id} className="flex justify-between gap-3 px-3 py-2">
                <span className="truncate text-text">{p.name}</span>
                <span className="tabular shrink-0 text-text-2">
                  {formatMoney(p.cost, p.country)} → {formatMoney(p.price, p.country)} · {COUNTRY_BY_CODE[p.country].name}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {ok ? (
            <Button
              onClick={() => {
                const { added, updated } = upsertMyProducts(result.products);
                const n = (k: number, one: string, many: string) => `${k} ${k === 1 ? one : many}`;
                const parts = [added ? n(added, "producto nuevo", "productos nuevos") : null, updated ? n(updated, "actualizado", "actualizados") : null];
                onDone(`Listo: ${parts.filter(Boolean).join(" y ")}.`);
              }}
            >
              <CircleCheck size={16} aria-hidden /> Añadir a Veta
            </Button>
          ) : null}
          <Button variant="ghost" onClick={() => onDone(null)}>
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ---------- Pantalla ----------

export function MyProductsScreen() {
  const country = useCountry();
  const all = useMyProducts();
  const fileRef = useRef<HTMLInputElement>(null);
  const [scope, setScope] = useState<"pais" | "todos">("pais");
  const [sort, setSort] = useState<Sort>("utilidad");
  const [adding, setAdding] = useState(false);
  const [reading, setReading] = useState(false);
  const [preview, setPreview] = useState<{ result: ParseResult; fileName: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [calcId, setCalcId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setReading(true);
    setNotice(null);
    try {
      setPreview({ result: await readProductsFile(file, country), fileName: file.name });
    } catch (err) {
      setPreview({
        result: { products: [], errors: [`No se pudo leer el archivo: ${err instanceof Error ? err.message : String(err)}`], ignoredColumns: [] },
        fileName: file.name,
      });
    } finally {
      setReading(false);
    }
  }

  const list = all
    .filter((p) => scope === "todos" || p.country === country)
    .map((p) => ({ p, a: analyse(p) }))
    .sort((x, y) => {
      if (sort === "nombre") return x.p.name.localeCompare(y.p.name, "es");
      if (sort === "ventas") return (y.p.sales7d ?? -1) - (x.p.sales7d ?? -1);
      if (sort === "margen") return y.a.multiple - x.a.multiple;
      // Utilidad: comparar en dólares para poder mezclar países.
      return y.a.r.profitPerDelivered / COUNTRY_BY_CODE[y.p.country].fx - x.a.r.profitPerDelivered / COUNTRY_BY_CODE[x.p.country].fx;
    });

  const c = COUNTRY_BY_CODE[country];
  const defaults = defaultProfitInput(country);

  return (
    <>
      <PageHeader
        title="Mis productos"
        description="Tus productos reales: impórtalos desde Excel o CSV (de BigBuy, Dropi o donde los encuentres) o añádelos a mano. Veta calcula cuánto te dejaría cada uno."
        actions={
          <>
            <input ref={fileRef} type="file" accept=".xlsx,.csv,.txt,.xls" className="hidden" onChange={onFile} aria-hidden tabIndex={-1} />
            <Button onClick={() => fileRef.current?.click()} disabled={reading}>
              {reading ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Upload size={16} aria-hidden />} Importar Excel o CSV
            </Button>
            <Button variant="secondary" onClick={() => setAdding(true)}>
              <Plus size={16} aria-hidden /> Añadir a mano
            </Button>
            <Button variant="ghost" onClick={() => download("plantilla-veta.csv", templateCsv(), "text/csv;charset=utf-8")}>
              <Download size={16} aria-hidden /> Plantilla
            </Button>
          </>
        }
      />

      {notice ? (
        <p className="mb-4 flex items-center gap-2 rounded-xl bg-success-soft p-3 text-sm font-medium text-success" role="status">
          <CircleCheck size={16} aria-hidden /> {notice}
        </p>
      ) : null}
      {preview ? (
        <ImportPreview
          result={preview.result}
          fileName={preview.fileName}
          onDone={(msg) => {
            setPreview(null);
            setNotice(msg);
          }}
        />
      ) : null}
      {adding ? <AddForm country={country} onClose={() => setAdding(false)} /> : null}

      {all.length === 0 ? (
        <EmptyState icon={<FileSpreadsheet size={32} />} title="Todavía no tienes productos propios">
          <ol className="mt-2 space-y-1 text-left">
            <li>
              1. Pulsa <strong>Plantilla</strong> y ábrela con Excel.
            </li>
            <li>2. Rellena una fila por producto: nombre, costo y precio de venta (lo demás es opcional).</li>
            <li>
              3. Guarda y pulsa <strong>Importar Excel o CSV</strong>.
            </li>
          </ol>
          <p className="mt-3">Valen archivos .xlsx o .csv con cualquier orden de columnas.</p>
        </EmptyState>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <Segmented
              label="Países"
              hideLabel
              value={scope}
              onChange={setScope}
              options={[
                { value: "pais", label: `Solo ${c.name}` },
                { value: "todos", label: `Todos (${all.length})` },
              ]}
            />
            <div className="flex items-center gap-2">
              <label htmlFor="mp-sort" className="sr-only">
                Ordenar por
              </label>
              <Select id="mp-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 w-auto">
                <option value="utilidad">Más utilidad por pedido</option>
                <option value="margen">Más margen</option>
                <option value="ventas">Más ventas</option>
                <option value="nombre">Nombre</option>
              </Select>
              <Button variant="ghost" size="sm" onClick={() => exportCsv(all)}>
                <Download size={14} aria-hidden /> Exportar
              </Button>
            </div>
          </div>

          <p className="mb-4 text-xs text-muted">
            Utilidad estimada con los valores típicos de {c.name}: flete {formatMoney(defaults.shipping, country)}, CPA{" "}
            {formatMoney(defaults.cpa, country)} y {defaults.deliveryRate} % de entregas. Pulsa «Calcular» para poner los tuyos.
          </p>

          {list.length === 0 ? (
            <EmptyState icon={<Package size={28} />} title={`No tienes productos de ${c.name}`}>
              Cambia a «Todos» o elige otro país en el menú.
            </EmptyState>
          ) : (
            <ul className="space-y-3">
              {list.map(({ p, a }) => {
                const verdict =
                  a.r.verdict === "gana"
                    ? { tone: "success" as const, text: "Rentable", Icon: CircleCheck }
                    : a.r.verdict === "justo"
                      ? { tone: "warning" as const, text: "Margen justo", Icon: TriangleAlert }
                      : { tone: "danger" as const, text: "Pierde dinero", Icon: CircleAlert };
                return (
                  <li key={p.id}>
                    <Card>
                      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-bold text-text">{p.name}</h2>
                            <Badge tone={verdict.tone}>
                              <verdict.Icon size={12} aria-hidden /> {verdict.text}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-xs text-muted">
                            {[COUNTRY_BY_CODE[p.country].name, p.supplier, p.category].filter(Boolean).join(" · ")}
                          </p>
                          {p.notes ? <p className="mt-1 text-sm text-text-2">{p.notes}</p> : null}
                        </div>
                        <dl className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm sm:grid-cols-6">
                          <div>
                            <dt className="text-xs text-muted">Costo</dt>
                            <dd className="tabular font-semibold text-text">{formatMoney(p.cost, p.country)}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted">Venta</dt>
                            <dd className="tabular font-semibold text-text">{formatMoney(p.price, p.country)}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted">Margen</dt>
                            <dd className="tabular font-semibold text-text">{a.multiple.toFixed(1).replace(".", ",")}×</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted">Utilidad/pedido</dt>
                            <dd className={`tabular font-extrabold ${a.r.profitPerDelivered < 0 ? "text-danger" : "text-success"}`}>
                              {formatMoney(a.r.profitPerDelivered, p.country)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted">Ventas 7 d</dt>
                            <dd className="tabular font-semibold text-text">{p.sales7d != null ? formatInt(p.sales7d) : "—"}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted">Stock</dt>
                            <dd className="tabular font-semibold text-text">
                              {p.stock != null ? formatInt(p.stock) : "—"}
                              {a.stockDays != null ? <span className="font-normal text-muted"> · {a.stockDays} d</span> : null}
                            </dd>
                          </div>
                        </dl>
                        <div className="flex flex-wrap gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            aria-expanded={calcId === p.id}
                            className={calcId === p.id ? "border-primary text-primary-ink ring-1 ring-primary" : undefined}
                            onClick={() => setCalcId(calcId === p.id ? null : p.id)}
                          >
                            <Calculator size={14} aria-hidden /> {calcId === p.id ? "Cerrar" : "Calcular"}
                          </Button>
                          <a
                            href={metaAdLibraryUrl(p.name, p.country)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-text-2 hover:bg-surface-2"
                            title="Buscar anuncios reales en Meta"
                          >
                            <Megaphone size={14} aria-hidden /> Anuncios
                          </a>
                          {p.link ? (
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-text-2 hover:bg-surface-2"
                            >
                              <ExternalLink size={14} aria-hidden /> Enlace
                            </a>
                          ) : null}
                          <Button size="sm" variant="ghost" onClick={() => removeMyProduct(p.id)} aria-label={`Borrar ${p.name}`}>
                            <Trash2 size={14} aria-hidden />
                          </Button>
                        </div>
                      </div>
                      {calcId === p.id ? (
                        <div className="border-t border-border p-4">
                          <ProfitCalculator key={p.id} country={p.country} initial={a.input} />
                        </div>
                      ) : null}
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            {confirmClear ? (
              <>
                <span className="text-sm text-text-2">¿Borrar tus {all.length} productos de este navegador?</span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    myProductsStore.set([]);
                    setConfirmClear(false);
                  }}
                >
                  Sí, borrar todos
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setConfirmClear(true)}>
                <Trash2 size={14} aria-hidden /> Borrar todos
              </Button>
            )}
            <span className="text-xs text-muted">Se guardan en este navegador. Usa «Exportar» para tener una copia.</span>
          </div>
        </>
      )}
    </>
  );
}
