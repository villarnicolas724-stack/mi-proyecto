/** Búsqueda pública en la Biblioteca de anuncios de Meta (se abre en su web). */
export function metaAdLibraryUrl(query: string, country: string) {
  const params = new URLSearchParams({
    active_status: "active",
    ad_type: "all",
    country,
    q: query,
    search_type: "keyword_unordered",
  });
  return `https://www.facebook.com/ads/library/?${params.toString()}`;
}
