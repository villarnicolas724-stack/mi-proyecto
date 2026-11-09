# Estado del proyecto Replica

| Campo | Valor |
|---|---|
| App de referencia | DropKiller (dropkiller.com): investigación de productos ganadores y espía de anuncios para dropshipping en Latinoamérica |
| Nombre provisional | **Veta** («dar con la veta»: encontrar el filón). Pendiente de `/replica-brand` (comprobar marca y dominio) |
| Plataforma | Web (escritorio y móvil) |
| Stack | Next.js 16 (App Router) + TypeScript + Tailwind 4 · después Supabase + Stripe + Vercel |
| Fase en curso | **H2 terminado**: flujo núcleo completo con datos de demostración |
| Fecha | 2026-11-09 |

## Fases

- [x] Recon (`01-recon/`) — hecho con fuentes públicas (búsquedas web). La web de DropKiller y Trustpilot no se pudieron abrir directamente desde este entorno: la red los bloquea.
- [x] Oportunidad (`08-oportunidad/`) — adelantado para decidir el «mejor que el original» antes de construir.
- [x] Arquitectura (`02-arquitectura/`) — stack, esquema SQL con RLS, plan por hitos.
- [x] Diseño (tokens en `src/app/globals.css`) — dirección propia: verde azulado + ámbar, tipografía Plus Jakarta Sans.
- [x] Build H1–H2 — todas las pantallas núcleo con datos de demostración (`src/lib/data/`).
- [ ] Backend (`/replica-backend`) — Supabase (auth + tablas + RLS), Stripe, ingesta real de datos.
- [ ] Test, diff, marca definitiva, lanzamiento, despliegue.

## Decisiones tomadas

1. **Se replica la función, no la obra.** Nombre, logo, textos, colores e iconos son propios. Nada del original.
2. **Datos de demostración deterministas** (generador con semilla en `src/lib/data/generate.ts`). Las pantallas solo llaman a `src/lib/data/index.ts`; el backend cambiará esa capa sin tocar pantallas.
3. **Fecha de referencia fija** (`REFERENCE_DATE`) para que las páginas se prerendericen igual en servidor y cliente.
4. **Seguimiento y alertas** guardados en `localStorage` mientras no haya backend.
5. **Diferenciadores elegidos** (ver `08-oportunidad/informe.md`): rentabilidad real contra entrega, puntuación explicada, comparador de proveedores, oportunidades entre países, alertas, ruta guiada y plan gratis útil.

## Huecos abiertos

- No observado: el interior de la app original (pantallas exactas, filtros completos). Se infirió de su web pública, blog y ficha de la extensión.
- **Origen de los datos reales**: el original rastrea catálogos de proveedores (Dropi, Aliclick, Mastershop), la Biblioteca de anuncios de Meta y tiendas Shopify. Hay que decidir fuentes legales: APIs oficiales, acuerdos con proveedores o extensión que lee lo que el propio usuario ve. **Nada de APIs privadas ni de saltarse condiciones de uso.**
- Comprobación legal del nombre «Veta» (OEPM, EUIPO, SIC Colombia, IMPI México) y del dominio.
- TikTok Shop y extensión de Chrome: fuera del MVP (prioridad Should).
