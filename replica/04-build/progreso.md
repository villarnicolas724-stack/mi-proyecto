# Progreso del build

Comprobado el 2026-11-09: `npm run lint` sin errores, `npm run build` genera 377 páginas, y un recorrido con Playwright en escritorio (1440 px) y móvil (iPhone 13) sin errores de consola ni scroll horizontal.

| ID | Pantalla | Estado | Notas y desviaciones del recon |
|---|---|---|---|
| P00 | Landing | Hecho | Ejemplo real de la demo con su utilidad por pedido |
| P01 | Ingresar / Registro | Hecho (simulado) | Sesión en `localStorage`; Google OAuth llega con Supabase |
| P02 | Inicio | Hecho | Añade ruta guiada, oportunidades entre países y alertas |
| P03 | Productos | Hecho | Atajos de búsqueda, vista tabla, exportar CSV |
| P04 | Detalle de producto | Hecho | Puntuación explicada, calculadora, comparador, «Dónde venderlo», ángulos |
| P05 | Anuncios | Hecho | Miniatura por categoría hasta tener creativos reales |
| P06–P07 | Tiendas | Hecho | Ingresos siempre como rango estimado |
| P08 | Seguimiento | Hecho | Reglas por producto; límite de 3 en Gratis |
| P09 | Calculadora | Hecho | Escenarios de efectividad ±10 puntos |
| P10 | Guía y recursos | Hecho | Los pasos se marcan solos al usar cada función |
| P11 | Planes | Hecho (simulado) | Sin cobro; Stripe en `/replica-backend` |
| P12 | Ajustes | Hecho | Tema claro/oscuro/sistema y borrado de cuenta con confirmación |
| P13–P14 | TikTok Shop, extensión | Pendiente | Prioridad Should |
