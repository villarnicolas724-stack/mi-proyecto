# Plan por hitos

| Hito | Pantallas | Criterio de «hecho» | Estado |
|---|---|---|---|
| H1 Esqueleto, navegación y acceso | P00, P01, layout de la app | `npm run build` pasa; se navega por todo el menú en móvil y escritorio | Hecho (acceso simulado) |
| H2 Flujo núcleo con datos de prueba | P02, P03, P04, P08, P09 | Filtrar → abrir producto → calcular utilidad → seguir → ver alerta | Hecho |
| H3 Resto del MVP | P05, P06, P07, P10, P11, P12 | Todas las pantallas con estados vacío y con datos | Hecho |
| H4 Backend real y pagos | Todas | Supabase con RLS (usuario A no ve lo de B), Stripe en modo test, ingesta diaria | Pendiente (`/replica-backend`) |
| H5 Pulido y lanzamiento | Todas | Lighthouse ≥ 90, textos revisados, marca definitiva, dominio | Pendiente |
