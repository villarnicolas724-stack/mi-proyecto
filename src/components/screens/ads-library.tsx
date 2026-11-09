"use client";

import { useEffect, useState } from "react";
import { Megaphone, Search } from "lucide-react";
import { AdCard } from "@/components/screens/ad-card";
import { ChipGroup, Segmented } from "@/components/ui/chips";
import { Button, EmptyState, Input, Label, PageHeader, Select } from "@/components/ui/primitives";
import { CATEGORIES, COUNTRY_BY_CODE } from "@/lib/data/catalog";
import { listAds } from "@/lib/data";
import type { AdFilters, AdFormat, AdNetwork, Category } from "@/lib/data/types";
import { formatInt } from "@/lib/format";
import { completeStep, useCountry } from "@/lib/state/stores";

type Age = "todos" | "nuevos" | "probados" | "veteranos";
const AGE: Record<Age, { min?: number; max?: number; label: string }> = {
  todos: { label: "Todos" },
  nuevos: { max: 7, label: "Nuevos (≤ 7 días)" },
  probados: { min: 14, label: "Probados (14+ días)" },
  veteranos: { min: 45, label: "Veteranos (45+ días)" },
};

const PAGE = 18;

export function AdsLibrary() {
  const country = useCountry();
  const [scope, setScope] = useState<"pais" | "todos">("pais");
  const [query, setQuery] = useState("");
  const [networks, setNetworks] = useState<AdNetwork[]>([]);
  const [formats, setFormats] = useState<AdFormat[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [age, setAge] = useState<Age>("probados");
  const [sort, setSort] = useState<NonNullable<AdFilters["sort"]>>("dias");
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    completeStep("anuncios");
  }, []);

  const ads = listAds({
    country: scope === "pais" ? country : "todos",
    query,
    networks,
    formats,
    categories,
    minDays: AGE[age].min,
    maxDays: AGE[age].max,
    sort,
  });

  const reset = () => {
    setQuery("");
    setNetworks([]);
    setFormats([]);
    setCategories([]);
    setAge("todos");
  };

  return (
    <>
      <PageHeader
        title="Anuncios"
        description="Anuncios activos de Facebook, Instagram y TikTok enlazados al producto y a su proveedor. Un anuncio que lleva semanas activo suele estar dando dinero."
      />

      <div className="mb-6 space-y-4 rounded-2xl border border-border bg-surface p-4">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
          <div>
            <Label htmlFor="ads-q">Buscar en textos, productos o anunciantes</Label>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" aria-hidden />
              <Input
                id="ads-q"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setLimit(PAGE);
                }}
                placeholder="Ej.: 2x1, contra entrega, masajeador…"
                className="pl-9"
              />
            </div>
          </div>
          <Segmented
            label="Países"
            value={scope}
            onChange={setScope}
            options={[
              { value: "pais", label: COUNTRY_BY_CODE[country].name },
              { value: "todos", label: "Todos" },
            ]}
          />
          <div>
            <Label htmlFor="ads-sort">Ordenar</Label>
            <Select id="ads-sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
              <option value="dias">Más días activos</option>
              <option value="recientes">Más recientes</option>
              <option value="interacciones">Más interacciones</option>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <ChipGroup<AdNetwork>
            label="Red"
            value={networks}
            onChange={setNetworks}
            options={[
              { value: "facebook", label: "Facebook" },
              { value: "instagram", label: "Instagram" },
              { value: "tiktok", label: "TikTok" },
            ]}
          />
          <ChipGroup<AdFormat>
            label="Formato"
            value={formats}
            onChange={setFormats}
            options={[
              { value: "video", label: "Video" },
              { value: "imagen", label: "Imagen" },
              { value: "carrusel", label: "Carrusel" },
            ]}
          />
          <Segmented
            label="Antigüedad"
            value={age}
            onChange={setAge}
            options={(Object.keys(AGE) as Age[]).map((k) => ({ value: k, label: AGE[k].label }))}
          />
        </div>
        <ChipGroup<Category>
          label="Categoría"
          value={categories}
          onChange={setCategories}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
      </div>

      <p className="mb-3 text-sm text-text-2" aria-live="polite">
        <span className="tabular font-bold text-text">{formatInt(ads.length)}</span> anuncios
      </p>

      {ads.length === 0 ? (
        <EmptyState
          icon={<Megaphone size={32} />}
          title="No hay anuncios con esos filtros"
          action={
            <Button variant="secondary" onClick={reset}>
              Quitar filtros
            </Button>
          }
        >
          Prueba con todos los países o con otra antigüedad.
        </EmptyState>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {ads.slice(0, limit).map((a) => (
            <AdCard key={a.id} ad={a} />
          ))}
        </div>
      )}

      {ads.length > limit ? (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" onClick={() => setLimit((n) => n + PAGE)}>
            Ver más ({formatInt(ads.length - limit)} restantes)
          </Button>
        </div>
      ) : null}
    </>
  );
}
