# Modelo de datos

*Observada* = descrita en fuentes públicas · *inferida* = deducida de lo que muestran las pantallas · *supuesta* = decisión nuestra.

| Entidad | Campos (tipo) | Relaciones | Público/privado | Origen |
|---|---|---|---|---|
| Country | code (text), name, currency (text) | 1:N Listing, Ad, Store | Público | Observada (filtro por país) |
| Platform | id (text: dropi, aliclick, mastershop), name | 1:N Supplier | Público | Observada |
| Supplier (proveedor/bodega) | id, name, platform_id, country, rating (numeric), delivery_rate (numeric), dispatch_hours (int) | N:1 Platform, 1:N Listing | Público | Inferida |
| ProductGroup (producto canónico) | id, name, category, tags (text[]) | 1:N Listing, 1:N Ad | Público | Supuesta: agrupa el mismo producto vendido por varios proveedores y países |
| Listing (producto en un proveedor) | id, group_id, supplier_id, country, cost_price (numeric), suggested_price (numeric), stock (int), sales_7d (int), sales_30d (int), listed_at (date) | N:1 ProductGroup, N:1 Supplier, 1:N ListingDaily | Público | Observada (ventas, stock, precio) |
| ListingDaily | listing_id, day (date), units_sold (int), stock (int), price (numeric) | N:1 Listing | Público | Inferida (historial 30 días) |
| Ad | id, group_id, network (facebook, instagram, tiktok), country, advertiser, copy (text), format, started_at (date), days_active (int), variants (int), likes, comments, shares (int), landing_domain | N:1 ProductGroup | Público | Observada |
| Store | id, name, domain, country, platform, theme, apps (text[]), monthly_visits (int), active_ads (int) | 1:N StoreDaily, N:M ProductGroup | Público | Observada (Store Radar) |
| StoreDaily | store_id, day, est_revenue (numeric) | N:1 Store | Público | Observada (historial de ingresos) |
| Profile | user_id, name, country, currency, plan, created_at | 1:1 auth.users | Privado | Supuesta |
| Watch (seguimiento) | user_id, listing_id, created_at, baseline_sales_7d, baseline_stock, baseline_price | N:1 Profile, N:1 Listing | Privado | Observada (módulo Seguimiento) |
| AlertRule | user_id, listing_id, type (stock_low, sales_up, price_change, new_ad), threshold (numeric), enabled | N:1 Watch | Privado | Supuesta (mejora) |
| AlertEvent | user_id, rule_id, fired_at, payload (jsonb), read_at | N:1 AlertRule | Privado | Supuesta (mejora) |
| GuideProgress | user_id, step (text), done_at | N:1 Profile | Privado | Supuesta (mejora) |
| Subscription | user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end | 1:1 Profile | Privado | Supuesta |

## Lo que calcula el servidor

- Puntuación Veta por listing (0–100) y sus componentes: demanda, impulso, margen, saturación, regularidad y salud del stock.
- Tendencia: ventas de los últimos 7 días frente a los 7 anteriores.
- Saturación por país: anuncios activos + vendedores del mismo grupo en ese país.
- Disparo de alertas tras cada ingesta diaria.
- Ingresos estimados de tiendas (siempre marcados como estimación).
