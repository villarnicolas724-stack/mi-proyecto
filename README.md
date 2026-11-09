# Veta

Investigación de productos para dropshipping contra entrega en Latinoamérica: productos ganadores, anuncios, tiendas de la competencia y **cuánto ganas por pedido entregado** antes de invertir en publicidad.

Es una versión propia (marca, textos y diseño originales) inspirada en las funciones de herramientas como DropKiller, con mejoras sacadas del análisis en `replica/08-oportunidad/informe.md`.

> Esta versión usa **datos de demostración** generados en `src/lib/data/`. Ninguna cifra es real.

## Cómo arrancarla

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Verás la página principal; pulsa «Ver la demo» para entrar a la app.

## Qué hay dentro

| Pantalla | Ruta | Qué hace |
|---|---|---|
| Landing | `/` | Propuesta, funciones, precios y preguntas |
| Acceso | `/ingresar` | Registro e ingreso (simulado en el navegador) |
| Inicio | `/app` | KPIs del país, mejor puntuados, en alza, oportunidades entre países, alertas, ruta guiada |
| Productos | `/app/productos` | Buscador con filtros, atajos («Ganadores probados»…), vista tarjetas/tabla, exportar CSV |
| Detalle | `/app/productos/[id]` | Ventas y stock de 30 días, puntuación explicada, calculadora contra entrega, comparador de proveedores, dónde venderlo, anuncios, ángulos de venta |
| Anuncios | `/app/anuncios` | Biblioteca con filtros por red, formato, antigüedad y categoría |
| Tiendas | `/app/tiendas` | Radar de tiendas con ingresos estimados (en rango), productos top, apps y anuncios |
| Seguimiento | `/app/seguimiento` | Productos vigilados con alertas configurables |
| Calculadora | `/app/calculadora` | Utilidad por pedido, CPA y ROAS de equilibrio, precio mínimo |
| Guía | `/app/guia` | Ruta guiada, checklist de validación, glosario y recursos |
| Planes / Ajustes | `/app/planes`, `/app/ajustes` | Cambio de plan (simulado), país, tema claro/oscuro, borrar cuenta |

## Mejoras frente al original

1. **Calculadora contra entrega en cada producto**: devoluciones, flete de vuelta y CPA incluidos.
2. **Puntuación explicada** en seis factores, con una frase cada uno.
3. **Comparador de proveedores** del mismo producto.
4. **Oportunidades entre países**: lo que vende en un país y en otro casi nadie anuncia.
5. **Alertas**: stock bajo, ventas en alza, cambios de precio y anuncios nuevos.
6. **Ruta guiada y recursos visibles** para quien empieza.
7. **Plan gratis útil** y Pro más barato.

## Estructura

- `src/app/` — rutas (App Router).
- `src/components/screens/` — una pantalla por archivo.
- `src/components/ui/`, `product/`, `charts/` — componentes reutilizables.
- `src/lib/data/` — capa de datos. **Las pantallas solo leen de aquí**; el backend real sustituirá `generate.ts` por consultas a Supabase sin tocar pantallas.
- `src/lib/state/stores.ts` — estado del usuario (país, seguimiento, guía, plan) en `localStorage` mientras no hay backend.
- `replica/` — investigación, arquitectura, esquema SQL y plan.

## Comprobaciones

```bash
npm run lint
```

```bash
npm run build
```

## Siguiente paso

Conectar el backend real (Supabase con RLS, Stripe en modo prueba) y decidir fuentes de datos legales. Detalle en `replica/ESTADO.md`.
