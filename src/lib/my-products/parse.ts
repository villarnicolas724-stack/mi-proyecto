// Lectura de tus productos desde Excel (.xlsx) o CSV.
// Todo ocurre en tu navegador: el archivo no se envía a ningún sitio.

import { COUNTRIES } from "@/lib/data/catalog";
import type { CountryCode } from "@/lib/data/types";

export interface MyProduct {
  id: string;
  name: string;
  country: CountryCode;
  category: string | null;
  supplier: string | null;
  cost: number;
  price: number;
  stock: number | null;
  sales7d: number | null;
  sales30d: number | null;
  link: string | null;
  notes: string | null;
  updatedAt: string;
}

export type Cell = string | number | boolean | Date | null | undefined;

export interface ParseResult {
  products: MyProduct[];
  errors: string[];
  ignoredColumns: string[];
}

type Field = "name" | "country" | "category" | "supplier" | "cost" | "price" | "stock" | "sales7d" | "sales30d" | "link" | "notes";

const ALIASES: Record<Field, string[]> = {
  name: ["nombre", "producto", "nombre del producto", "titulo", "name", "product"],
  country: ["pais", "country"],
  category: ["categoria", "category", "nicho"],
  supplier: ["proveedor", "supplier", "plataforma", "bodega", "tienda"],
  cost: ["costo", "coste", "precio proveedor", "precio de proveedor", "costo proveedor", "precio compra", "precio de compra", "cost"],
  price: ["precio", "precio venta", "precio de venta", "pvp", "precio sugerido", "venta", "price"],
  stock: ["stock", "inventario", "unidades", "existencias"],
  sales7d: ["ventas 7d", "ventas 7 dias", "ventas semana", "ventas semanales", "ventas_7d", "ventas"],
  sales30d: ["ventas 30d", "ventas 30 dias", "ventas mes", "ventas mensuales", "ventas_30d"],
  link: ["enlace", "link", "url", "web"],
  notes: ["notas", "nota", "comentarios", "observaciones", "notes"],
};

export const TEMPLATE_HEADERS = ["nombre", "pais", "categoria", "proveedor", "costo", "precio_venta", "stock", "ventas_7d", "ventas_30d", "enlace", "notas"];

export function templateCsv(): string {
  return [
    TEMPLATE_HEADERS.join(";"),
    "Masajeador cervical eléctrico;España;Salud y bienestar;BigBuy;12,50;39,99;150;14;52;https://ejemplo.com/producto;Probar con vídeo de oficina",
    "Lámpara de luna 3D;España;Hogar;Dropi;7,90;24,99;80;;;;",
  ].join("\r\n");
}

function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[_\-.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchField(header: string): Field | null {
  const h = norm(header);
  for (const [field, aliases] of Object.entries(ALIASES) as [Field, string[]][]) {
    if (aliases.some((a) => norm(a) === h)) return field;
  }
  return null;
}

/** Números como 1.234,56 · 1,234.56 · 45,99 · 59.900 · «$ 59.900» · «12,50 €». */
export function parseNumber(v: Cell): number | null {
  if (v == null || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v !== "string") return null;
  let s = v.replace(/[^\d.,-]/g, "");
  if (!s || !/\d/.test(s)) return null;
  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  if (lastDot >= 0 && lastComma >= 0) {
    const dec = lastDot > lastComma ? "." : ",";
    const thou = dec === "." ? "," : ".";
    s = s.split(thou).join("").replace(dec, ".");
  } else if (lastComma >= 0) {
    s = /^-?\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, "") : s.replace(",", ".");
  } else if (lastDot >= 0) {
    if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function parseCountry(v: Cell, fallback: CountryCode): CountryCode {
  if (v == null || v === "") return fallback;
  const s = norm(String(v));
  const extra: Record<string, CountryCode> = { spain: "ES", espana: "ES", mexico: "MX", peru: "PE", panama: "PA" };
  if (extra[s]) return extra[s];
  const c = COUNTRIES.find((x) => norm(x.name) === s || x.code.toLowerCase() === s);
  return c?.code ?? fallback;
}

function text(v: Cell): string | null {
  if (v == null) return null;
  const s = (v instanceof Date ? v.toISOString().slice(0, 10) : String(v)).trim();
  return s || null;
}

/** CSV con separador «;» o «,» (lo detecta), comillas y BOM de Excel. */
export function parseCsv(input: string): string[][] {
  const textIn = input.replace(/^﻿/, "");
  const firstLine = textIn.split(/\r?\n/, 1)[0] ?? "";
  const sep = (firstLine.match(/;/g)?.length ?? 0) >= (firstLine.match(/,/g)?.length ?? 0) ? ";" : firstLine.includes("\t") ? "\t" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < textIn.length; i++) {
    const ch = textIn[i];
    if (quoted) {
      if (ch === '"' && textIn[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === sep) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && textIn[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/** Convierte filas (la primera con los títulos) en productos, con errores fila a fila. */
export function rowsToProducts(rows: Cell[][], defaultCountry: CountryCode): ParseResult {
  const errors: string[] = [];
  if (rows.length < 2) return { products: [], errors: ["El archivo no tiene filas de productos debajo de los títulos."], ignoredColumns: [] };

  const headers = rows[0].map((h) => String(h ?? ""));
  const map = new Map<Field, number>();
  const ignoredColumns: string[] = [];
  headers.forEach((h, i) => {
    const f = matchField(h);
    if (f && !map.has(f)) map.set(f, i);
    else if (h.trim()) ignoredColumns.push(h.trim());
  });

  const missing = (["name", "cost", "price"] as Field[]).filter((f) => !map.has(f));
  if (missing.length) {
    const label: Record<string, string> = { name: "nombre", cost: "costo", price: "precio_venta" };
    return {
      products: [],
      errors: [`Faltan columnas obligatorias: ${missing.map((m) => label[m]).join(", ")}. Usa la plantilla como guía.`],
      ignoredColumns,
    };
  }

  const get = (r: Cell[], f: Field): Cell => (map.has(f) ? r[map.get(f)!] : undefined);
  const now = new Date().toISOString();
  const products: MyProduct[] = [];

  rows.slice(1).forEach((r, idx) => {
    const line = idx + 2;
    const name = text(get(r, "name"));
    const cost = parseNumber(get(r, "cost"));
    const price = parseNumber(get(r, "price"));
    if (!name) return errors.push(`Fila ${line}: falta el nombre.`);
    if (cost == null || cost < 0) return errors.push(`Fila ${line} («${name}»): el costo no es un número.`);
    if (price == null || price <= 0) return errors.push(`Fila ${line} («${name}»): el precio de venta no es un número.`);
    const country = parseCountry(get(r, "country"), defaultCountry);
    const intOrNull = (f: Field) => {
      const n = parseNumber(get(r, f));
      return n == null ? null : Math.max(0, Math.round(n));
    };
    products.push({
      id: `mp-${country}-${norm(name).replace(/\s/g, "-")}`,
      name,
      country,
      category: text(get(r, "category")),
      supplier: text(get(r, "supplier")),
      cost,
      price,
      stock: intOrNull("stock"),
      sales7d: intOrNull("sales7d"),
      sales30d: intOrNull("sales30d"),
      link: text(get(r, "link")),
      notes: text(get(r, "notes")),
      updatedAt: now,
    });
  });

  return { products, errors, ignoredColumns };
}

/** Lee un archivo .xlsx o .csv elegido por el usuario. */
export async function readProductsFile(file: File, defaultCountry: CountryCode): Promise<ParseResult> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx")) {
    const { readSheet } = await import("read-excel-file/universal");
    const rows = (await readSheet(file)) as Cell[][];
    return rowsToProducts(rows, defaultCountry);
  }
  if (name.endsWith(".csv") || name.endsWith(".txt")) {
    return rowsToProducts(parseCsv(await file.text()), defaultCountry);
  }
  if (name.endsWith(".xls")) {
    return {
      products: [],
      errors: ["Ese es el formato antiguo de Excel (.xls). Ábrelo en Excel y usa «Guardar como» → «Libro de Excel (.xlsx)» o «CSV»."],
      ignoredColumns: [],
    };
  }
  return { products: [], errors: ["Usa un archivo de Excel (.xlsx) o CSV."], ignoredColumns: [] };
}
