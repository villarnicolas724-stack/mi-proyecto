# Stack

| Capa | Tecnología | Por qué | Alternativa descartada |
|---|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript estricto | Landing con SEO y app en el mismo proyecto; prerender de páginas | Vite + React (sin SEO de serie) |
| Estilos | Tailwind CSS 4 + variables CSS (tokens en `src/app/globals.css`) | Rápido, tema claro y oscuro con tokens | CSS Modules |
| Iconos | lucide-react (licencia ISC) | Libres, consistentes | Iconos propios del original (prohibido) |
| Gráficos | SVG propio (`src/components/charts/`) | Sin dependencias, control total de accesibilidad y tema | Recharts |
| Datos (ahora) | Generador determinista en `src/lib/data/` | Permite construir todas las pantallas antes del backend | — |
| Datos (después) | Supabase: Postgres + Auth + RLS | Plan gratis, autenticación incluida, RLS por usuario | Firebase (sin SQL) |
| Ingesta | Tareas programadas (Supabase Cron o Vercel Cron) que cargan `listing_daily` | Sin servidor propio | Colas y workers (excesivo) |
| Pagos | Stripe Checkout + portal del cliente + webhook | Suscripciones sin permanencia | Pasarelas locales (se pueden sumar después: Mercado Pago, Wompi) |
| Hosting | Vercel | Despliegue con un push | Servidor propio |
| Email (después) | Resend | Alertas y resumen diario | — |

Precios y límites de los planes gratuitos: **comprobar a fecha de hoy**; cambian a menudo.
