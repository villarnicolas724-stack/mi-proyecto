# Veta

Investigación de productos para dropshipping contra entrega en Latinoamérica: productos ganadores, anuncios, tiendas de la competencia y **cuánto ganas por pedido entregado** antes de invertir en publicidad.

Es una versión propia (marca, textos y diseño originales) inspirada en las funciones de herramientas como DropKiller, con mejoras sacadas del análisis en `replica/08-oportunidad/informe.md`.

> Esta versión usa **datos de demostración** generados en `src/lib/data/`. Ninguna cifra es real.

## Cómo arrancarla

```bash
npm install
npm run dev
```

Abre http://localhost:3000: entras directamente a la app. Es para **uso personal**: sin planes, sin límites y sin registro.

En Windows con PowerShell, usa `npm.cmd install` y `npm.cmd run dev`.

## Usarla desde el móvil fuera de casa (Vercel, gratis)

1. Entra en https://vercel.com con tu cuenta de GitHub y pulsa **Add New → Project**.
2. Elige el repositorio `mi-proyecto` y, en la configuración, la rama `claude/hopeful-sagan-8w63ym`.
3. En **Environment Variables** añade `APP_PASSWORD` con una contraseña larga que solo sepas tú.
4. Pulsa **Deploy**. Vercel te da un enlace `…vercel.app`; al abrirlo te pedirá esa contraseña (una vez cada 90 días por dispositivo).

Sin `APP_PASSWORD` la app queda abierta a cualquiera que tenga el enlace: no te saltes el paso 3.

## Qué hay dentro

| Pantalla | Ruta | Qué hace |
|---|---|---|
| Acceso | `/acceso` | Contraseña, solo si `APP_PASSWORD` está definida |
| Mercado Libre | `/app/mercado-libre` | **Datos reales**: más vendidos por categoría, buscador, búsquedas en alza y calculadora con el precio real (CO, MX, CL, PE, EC, GT, PA) |
| Inicio | `/app` | KPIs del país, mejor puntuados, en alza, oportunidades entre países, alertas, ruta guiada |
| Productos | `/app/productos` | Buscador con filtros, atajos («Ganadores probados»…), vista tarjetas/tabla, exportar CSV |
| Detalle | `/app/productos/[id]` | Ventas y stock de 30 días, puntuación explicada, calculadora contra entrega, comparador de proveedores, dónde venderlo, anuncios, ángulos de venta |
| Anuncios | `/app/anuncios` | Biblioteca con filtros por red, formato, antigüedad y categoría |
| Tiendas | `/app/tiendas` | Radar de tiendas con ingresos estimados (en rango), productos top, apps y anuncios |
| Seguimiento | `/app/seguimiento` | Productos vigilados con alertas configurables |
| Calculadora | `/app/calculadora` | Utilidad por pedido, CPA y ROAS de equilibrio, precio mínimo |
| Guía | `/app/guia` | Ruta guiada, checklist de validación, glosario y recursos |
| Ajustes | `/app/ajustes` | País, nombre, tema claro/oscuro, cerrar sesión, borrar tus datos |

## Mejoras frente al original

1. **Calculadora contra entrega en cada producto**: devoluciones, flete de vuelta y CPA incluidos.
2. **Puntuación explicada** en seis factores, con una frase cada uno.
3. **Comparador de proveedores** del mismo producto.
4. **Oportunidades entre países**: lo que vende en un país y en otro casi nadie anuncia.
5. **Alertas**: stock bajo, ventas en alza, cambios de precio y anuncios nuevos.
6. **Ruta guiada y recursos visibles** para quien empieza.
7. **Enlace directo a la Biblioteca de anuncios de Meta** desde cada producto, para ver los anuncios reales.

## Datos reales de Mercado Libre

1. Crea una app gratis en el Centro de desarrolladores de Mercado Libre (los pasos salen en la pantalla **Mercado Libre**).
2. Pega el **App ID** y la **Clave secreta** en esa pantalla y pulsa **Conectar**.
3. Las claves se guardan solo en `.veta/mercadolibre.json` (ignorado por git). También puedes usar las variables `ML_CLIENT_ID` y `ML_CLIENT_SECRET`.

España no tiene Mercado Libre.

## Estructura

- `src/app/` — rutas (App Router).
- `src/components/screens/` — una pantalla por archivo.
- `src/components/ui/`, `product/`, `charts/` — componentes reutilizables.
- `src/lib/data/` — capa de datos. **Las pantallas solo leen de aquí**; el backend real sustituirá `generate.ts` por consultas a Supabase sin tocar pantallas.
- `src/lib/state/stores.ts` — tu estado (país, seguimiento, guía) en `localStorage` del navegador.
- `src/lib/ml/` y `src/app/api/ml/` — conexión con la API oficial de Mercado Libre (solo en el servidor).
- `src/proxy.ts` y `src/lib/auth.ts` — contraseña opcional (`APP_PASSWORD`).
- `replica/` — investigación, arquitectura, esquema SQL y plan.

## Comprobaciones

```bash
npm run lint
```

```bash
npm run build
```

## Siguiente paso

Conseguir datos reales con permiso: ver «Datos reales» en `replica/ESTADO.md`.
