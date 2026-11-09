-- Esquema de Veta para Supabase (Postgres). Pendiente de aplicar en /replica-backend.
-- Datos de mercado: lectura pública para usuarios autenticados, escritura solo desde el servidor (service_role).
-- Datos de usuario: cada usuario lee y escribe solo lo suyo (RLS).

create extension if not exists "pgcrypto";

-- Países que cubre la herramienta.
create table countries (
  code text primary key,            -- 'CO', 'MX'...
  name text not null,
  currency text not null            -- 'COP', 'MXN'...
);

-- Plataformas de proveedores (catálogos de dropshipping).
create table platforms (
  id text primary key,              -- 'dropi', 'aliclick', 'mastershop'
  name text not null
);

-- Proveedor o bodega dentro de una plataforma.
create table suppliers (
  id uuid primary key default gen_random_uuid(),
  platform_id text not null references platforms(id),
  country text not null references countries(code),
  name text not null,
  rating numeric(2,1),
  delivery_rate numeric(4,3),       -- efectividad de entrega 0..1
  dispatch_hours int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Producto canónico: agrupa el mismo producto en varios proveedores y países.
create table product_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Producto concreto en un proveedor.
create table listings (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references product_groups(id) on delete cascade,
  supplier_id uuid not null references suppliers(id) on delete cascade,
  country text not null references countries(code),
  cost_price numeric(12,2) not null,
  suggested_price numeric(12,2),
  stock int not null default 0,
  sales_7d int not null default 0,          -- calculado en la ingesta
  sales_prev_7d int not null default 0,
  sales_30d int not null default 0,
  days_with_sales_7d int not null default 0,
  score int not null default 0,             -- puntuación Veta 0..100
  score_parts jsonb not null default '{}',  -- desglose explicado
  listed_at date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index listings_country_score on listings (country, score desc);
create index listings_country_sales on listings (country, sales_7d desc);
create index listings_group on listings (group_id);

-- Historial diario por producto (gráficos de 30 días).
create table listing_daily (
  listing_id uuid not null references listings(id) on delete cascade,
  day date not null,
  units_sold int not null,
  stock int not null,
  price numeric(12,2) not null,
  primary key (listing_id, day)
);

-- Anuncios públicos asociados a un producto.
create table ads (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references product_groups(id) on delete set null,
  network text not null check (network in ('facebook','instagram','tiktok')),
  country text not null references countries(code),
  advertiser text not null,
  copy text not null,
  format text not null check (format in ('video','imagen','carrusel')),
  started_at date not null,
  last_seen_at date not null,
  variants int not null default 1,
  likes int not null default 0,
  comments int not null default 0,
  shares int not null default 0,
  landing_domain text,
  created_at timestamptz not null default now()
);
create index ads_country_started on ads (country, started_at desc);
create index ads_group on ads (group_id);

-- Tiendas analizadas (Radar de tiendas). Ingresos siempre estimados.
create table stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null unique,
  country text not null references countries(code),
  platform text not null default 'shopify',
  theme text,
  apps text[] not null default '{}',
  monthly_visits int,
  active_ads int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table store_daily (
  store_id uuid not null references stores(id) on delete cascade,
  day date not null,
  est_revenue numeric(14,2) not null,
  primary key (store_id, day)
);

create table store_products (
  store_id uuid not null references stores(id) on delete cascade,
  group_id uuid not null references product_groups(id) on delete cascade,
  est_units_30d int,
  primary key (store_id, group_id)
);

-- ===== Datos de usuario =====

create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  country text references countries(code),
  plan text not null default 'gratis' check (plan in ('gratis','pro','equipo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Productos seguidos, con la foto del momento en que se empezaron a seguir.
create table watches (
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references listings(id) on delete cascade,
  baseline_sales_7d int not null,
  baseline_stock int not null,
  baseline_price numeric(12,2) not null,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table alert_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references listings(id) on delete cascade,
  type text not null check (type in ('stock_low','sales_up','price_change','new_ad')),
  threshold numeric,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
create index alert_rules_user on alert_rules (user_id);

create table alert_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rule_id uuid not null references alert_rules(id) on delete cascade,
  fired_at timestamptz not null default now(),
  payload jsonb not null default '{}',
  read_at timestamptz
);
create index alert_events_user_fired on alert_events (user_id, fired_at desc);

create table guide_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  step text not null,
  done_at timestamptz not null default now(),
  primary key (user_id, step)
);

-- Lo escribe solo el webhook de Stripe (service_role).
create table subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null,
  status text not null,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

-- ===== RLS =====
alter table countries enable row level security;
alter table platforms enable row level security;
alter table suppliers enable row level security;
alter table product_groups enable row level security;
alter table listings enable row level security;
alter table listing_daily enable row level security;
alter table ads enable row level security;
alter table stores enable row level security;
alter table store_daily enable row level security;
alter table store_products enable row level security;
alter table profiles enable row level security;
alter table watches enable row level security;
alter table alert_rules enable row level security;
alter table alert_events enable row level security;
alter table guide_progress enable row level security;
alter table subscriptions enable row level security;

-- Datos de mercado: lectura para usuarios con sesión. Sin políticas de escritura: solo service_role escribe.
create policy "lectura mercado" on countries for select to authenticated using (true);
create policy "lectura mercado" on platforms for select to authenticated using (true);
create policy "lectura mercado" on suppliers for select to authenticated using (true);
create policy "lectura mercado" on product_groups for select to authenticated using (true);
create policy "lectura mercado" on listings for select to authenticated using (true);
create policy "lectura mercado" on listing_daily for select to authenticated using (true);
create policy "lectura mercado" on ads for select to authenticated using (true);
create policy "lectura mercado" on stores for select to authenticated using (true);
create policy "lectura mercado" on store_daily for select to authenticated using (true);
create policy "lectura mercado" on store_products for select to authenticated using (true);

-- Datos propios.
create policy "perfil propio" on profiles for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "seguimiento propio" on watches for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "reglas propias" on alert_rules for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "alertas propias: leer" on alert_events for select to authenticated
  using (user_id = auth.uid());
create policy "alertas propias: marcar leídas" on alert_events for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "guía propia" on guide_progress for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "suscripción propia: leer" on subscriptions for select to authenticated
  using (user_id = auth.uid());

-- Nota: el límite del plan gratis (3 seguimientos) se comprueba en el servidor o con un trigger, no solo en la interfaz.
