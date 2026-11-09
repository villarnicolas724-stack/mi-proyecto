// Consultas a Mercado Libre convertidas al formato que usa Veta.

import { mlGet } from "./client";
import type { MlCategory, MlProduct } from "./sites";

interface ItemBody {
  id: string;
  title?: string;
  price?: number | null;
  currency_id?: string | null;
  permalink?: string | null;
  thumbnail?: string | null;
  sold_quantity?: number | null;
  shipping?: { free_shipping?: boolean } | null;
}

interface ProductBody {
  id: string;
  name?: string;
  permalink?: string | null;
  pictures?: { url?: string; secure_url?: string }[];
  buy_box_winner?: { price?: number; currency_id?: string; sold_quantity?: number; shipping?: { free_shipping?: boolean } } | null;
}

function https(url: string | null | undefined): string | null {
  return url ? url.replace(/^http:\/\//, "https://") : null;
}

function fromItem(b: ItemBody, position?: number): MlProduct {
  return {
    id: b.id,
    title: b.title ?? b.id,
    price: b.price ?? null,
    currency: b.currency_id ?? null,
    permalink: b.permalink ?? null,
    thumbnail: https(b.thumbnail),
    soldQuantity: typeof b.sold_quantity === "number" ? b.sold_quantity : null,
    freeShipping: Boolean(b.shipping?.free_shipping),
    position,
  };
}

function fromProduct(b: ProductBody, position?: number): MlProduct {
  const w = b.buy_box_winner;
  return {
    id: b.id,
    title: b.name ?? b.id,
    price: w?.price ?? null,
    currency: w?.currency_id ?? null,
    permalink: b.permalink ?? null,
    thumbnail: https(b.pictures?.[0]?.secure_url ?? b.pictures?.[0]?.url),
    soldQuantity: typeof w?.sold_quantity === "number" ? w.sold_quantity : null,
    freeShipping: Boolean(w?.shipping?.free_shipping),
    position,
  };
}

export async function getCategories(site: string): Promise<MlCategory[]> {
  const data = await mlGet<{ id: string; name: string }[]>(`/sites/${site}/categories`);
  return data.map((c) => ({ id: c.id, name: c.name }));
}

/** Más vendidos de una categoría (endpoint «highlights» de Mercado Libre). */
export async function getBestSellers(site: string, categoryId: string): Promise<MlProduct[]> {
  const data = await mlGet<{ content?: { id: string; position: number; type: string }[] }>(
    `/highlights/${site}/category/${encodeURIComponent(categoryId)}`,
  );
  const content = (data.content ?? []).slice(0, 20);
  const itemIds = content.filter((c) => c.type === "ITEM").map((c) => c.id);
  const productIds = content.filter((c) => c.type !== "ITEM").map((c) => c.id);

  const byId = new Map<string, MlProduct>();
  const pos = new Map(content.map((c) => [c.id, c.position]));

  if (itemIds.length) {
    const items = await mlGet<{ code: number; body: ItemBody }[]>(
      `/items?ids=${itemIds.join(",")}&attributes=id,title,price,currency_id,permalink,thumbnail,sold_quantity,shipping`,
    );
    for (const it of items) if (it.code === 200) byId.set(it.body.id, fromItem(it.body, pos.get(it.body.id)));
  }
  const products = await Promise.allSettled(productIds.map((id) => mlGet<ProductBody>(`/products/${id}`)));
  products.forEach((r) => {
    if (r.status === "fulfilled") byId.set(r.value.id, fromProduct(r.value, pos.get(r.value.id)));
  });

  return content.map((c) => byId.get(c.id)).filter((p): p is MlProduct => Boolean(p));
}

export async function searchItems(site: string, q: string): Promise<MlProduct[]> {
  const data = await mlGet<{ results?: ItemBody[] }>(
    `/sites/${site}/search?q=${encodeURIComponent(q)}&limit=24`,
  );
  return (data.results ?? []).map((r) => fromItem(r));
}

export async function getTrends(site: string): Promise<{ keyword: string; url: string }[]> {
  const data = await mlGet<{ keyword: string; url: string }[]>(`/trends/${site}`);
  return data.slice(0, 30);
}
