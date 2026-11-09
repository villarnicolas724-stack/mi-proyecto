# Informe de oportunidad

## Muestra y límites (léelo primero)

- **Muestra pequeña:** unas 63 reseñas en Trustpilot (4,3/5, mayoría de 5 estrellas), 6 en Whop (todas de 5) y 53 valoraciones de la extensión en Chrome (4,7/5). Solo dos quejas concretas llegaron a los resúmenes de búsqueda. El detalle está en `resenas.csv`.
- **Conclusión honesta:** DropKiller está bien valorado y sus quejas son menores. **Las reseñas no muestran un hueco grande.** Una copia «igual pero más barata» no basta. La ventaja tiene que salir de resolver mejor el trabajo del usuario: pasar de «este producto vende» a «este producto me deja dinero a mí, en mi país, con contra entrega».

## Top problemas y arreglos

Ordenados por frecuencia × intensidad. Los marcados *(mercado)* no vienen de reseñas del original sino de cómo trabaja el dropshipper contra entrega en Latinoamérica (guías públicas del nicho).

| # | Problema | Evidencia | Arreglo en Veta | Esfuerzo | MVP |
|---|---|---|---|---|---|
| 1 | Cuesta sacarle partido: piden tutoriales más paso a paso | Reseña de Trustpilot | Ruta guiada de 5 pasos dentro de la app, con progreso, y cada pantalla explica sus números | S | Sí |
| 2 | Bonos prometidos que no se encuentran | Reseña de un usuario con plan anual | Página «Recursos» de primer nivel en el menú, nada escondido | S | Sí |
| 3 | «Vende mucho» no es «me deja dinero»: en contra entrega se devuelve el 20–35 % de los pedidos *(mercado)* | Guías de margen mínimo de 2,5× sobre costo + flete | Calculadora contra entrega integrada en cada producto: utilidad por pedido entregado, ROAS de equilibrio, precio mínimo | M | Sí |
| 4 | Puntuaciones o rankings opacos: el principiante no sabe por qué un producto «es ganador» *(mercado)* | Las guías del propio original enseñan reglas a mano (≥10 ventas en 7 días, repartidas) | Puntuación Veta desglosada en 6 factores con frase explicativa; regularidad de ventas calculada sola | M | Sí |
| 5 | El mismo producto lo venden varios proveedores con precio y stock distintos *(mercado)* | Catálogos multiproveedor (Dropi, Aliclick, Mastershop) | Comparador de proveedores en el detalle: el más barato, el de más stock, el mejor valorado | M | Sí |
| 6 | Quedarse sin stock con anuncios encendidos *(mercado)* | El original destaca el seguimiento de stock | Alertas de stock bajo, subida de ventas, cambio de precio y anuncio nuevo | M | Sí (sin email aún) |
| 7 | Saturación: un producto que funciona en México puede estar saturado en Colombia | FAQ del original | Panel «Dónde venderlo»: saturación por país y oportunidades en países donde aún no está | M | Sí |
| 8 | Precio para quien empieza | Descuentos y cupones circulando; plan básico de 18,99 USD | Plan gratis útil y Pro más barato que Basic | S | Sí |
| 9 | Ingresos de tiendas son estimaciones | El propio original lo avisa | Mostrarlo siempre como rango con la palabra «estimado» | S | Sí |
| 10 | Exportar y trabajar fuera de la app | Petición frecuente en herramientas del sector | Exportar CSV del buscador | S | Sí |

## Lo que los usuarios aman (no romperlo)

- Ahorro de tiempo en la búsqueda de productos e investigación de mercado.
- Todo en español y pensado para Latinoamérica.
- Soporte que responde rápido.
- Sin permanencia.
- Datos de proveedores locales (contra entrega), no solo AliExpress.

## Segmentos desatendidos

- **Principiantes** que no saben leer los datos (la queja de los tutoriales).
- **Quien vende en varios países** y quiere arbitrar entre ellos.
- **Quien no quiere pagar todavía**: un plan gratis que sirva de verdad.

## Posicionamiento

1. «Para dropshippers de contra entrega en Latinoamérica que no saben si un producto que vende les va a dejar dinero, Veta es el buscador de productos que te dice cuánto ganas por pedido entregado, a diferencia de las herramientas que solo enseñan cuánto vende.»
2. «Para principiantes que se pierden entre tablas de datos, Veta es la herramienta que te lleva de la mano hasta tu primer producto ganador, a diferencia de las que te dejan solo con un buscador.»
3. «Para quien vende en varios países, Veta encuentra el producto que ya funciona en uno y aún no ha llegado al otro.»

**Recomendado: la 1**, con la 2 como forma de entrar (ruta guiada). La rentabilidad real es el dato que el usuario necesita para decidir y el que menos se ve en las herramientas actuales. Además, es medible («¿cuánto me queda por pedido?») y fácil de enseñar en anuncios.

## Precio orientativo

| Plan | Precio | Incluye |
|---|---|---|
| Gratis | 0 | 15 búsquedas al día, detalle con calculadora, 3 productos en seguimiento |
| Pro | 14,99 USD/mes · 9,99 USD/mes anual | Todo ilimitado, anuncios, tiendas, alertas |
| Equipo | 29,99 USD/mes | 3 usuarios, exportación CSV, soporte prioritario |

Comprobar a fecha de hoy los precios de la competencia antes de lanzar.

## Riesgos

- **Los datos son el producto.** El original tiene más de un millón de productos indexados. Conseguir ventas y stock reales de los proveedores de forma legal (APIs oficiales, acuerdos o una extensión que lea lo que ve el propio usuario) es el mayor reto y la razón de que haya pocos competidores.
- **Condiciones de uso** de Meta, TikTok, Shopify y los proveedores: cualquier recogida de datos debe respetarlas. No usar APIs privadas.
- **Competidor bien valorado** con extensión gratuita de unos 30 000 usuarios: la diferenciación tiene que verse en la primera sesión (calculadora y ruta guiada).
- **Precio bajo** limita el presupuesto de adquisición: depender de contenido (YouTube, TikTok) y referidos.
