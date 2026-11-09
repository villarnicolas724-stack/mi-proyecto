"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import {
  Bell,
  Calculator,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Menu,
  Search,
  Settings,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { evaluateAlerts } from "@/lib/data/alerts";
import { COUNTRIES } from "@/lib/data/catalog";
import type { CountryCode } from "@/lib/data/types";
import { cn } from "@/lib/format";
import { completeStep, countryStore, useCountry, useName, useWatchlist } from "@/lib/state/stores";

const NAV = [
  { href: "/app", label: "Inicio", icon: LayoutDashboard },
  { href: "/app/mercado-libre", label: "Mercado Libre", icon: ShoppingBag },
  { href: "/app/productos", label: "Productos", icon: Search },
  { href: "/app/anuncios", label: "Anuncios", icon: Megaphone },
  { href: "/app/tiendas", label: "Tiendas", icon: Store },
  { href: "/app/seguimiento", label: "Seguimiento", icon: Bell },
  { href: "/app/calculadora", label: "Calculadora", icon: Calculator },
  { href: "/app/guia", label: "Guía y recursos", icon: GraduationCap },
] as const;

const SECONDARY = [
  { href: "/app/ajustes", label: "Ajustes", icon: Settings },
] as const;

export function CountrySelect({ id = "pais" }: { id?: string }) {
  const country = useCountry();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">
        País
      </label>
      <select
        id={id}
        value={country}
        onChange={(e) => {
          countryStore.set(e.target.value as CountryCode);
          completeStep("pais");
        }}
        className="h-10 w-full rounded-xl border border-border-strong bg-surface px-3 text-sm font-semibold text-text focus:border-primary focus:outline-none"
      >
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name} ({c.currency})
          </option>
        ))}
      </select>
    </div>
  );
}

function NavLinks({ onNavigate, alertCount }: { onNavigate?: () => void; alertCount: number }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/app" ? pathname === "/app" : pathname.startsWith(href));
  const item = (href: string, label: string, Icon: (typeof NAV)[number]["icon"], badge?: number) => (
    <li key={href}>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={isActive(href) ? "page" : undefined}
        className={cn(
          "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors",
          isActive(href) ? "bg-primary-soft text-primary-ink" : "text-text-2 hover:bg-surface-2 hover:text-text",
        )}
      >
        <Icon size={18} aria-hidden />
        <span className="flex-1">{label}</span>
        {href === "/app/mercado-libre" ? (
          <span className="rounded-full bg-success-soft px-1.5 text-[11px] font-bold text-success">REAL</span>
        ) : null}
        {badge ? (
          <span className="tabular rounded-full bg-danger px-1.5 text-xs font-bold text-white" aria-label={`${badge} alertas`}>
            {badge}
          </span>
        ) : null}
      </Link>
    </li>
  );
  return (
    <nav aria-label="Principal" className="flex flex-1 flex-col">
      <ul className="space-y-1">
        {NAV.map((n) => item(n.href, n.label, n.icon, n.href === "/app/seguimiento" ? alertCount : undefined))}
      </ul>
      <ul className="mt-auto space-y-1 border-t border-border pt-3">{SECONDARY.map((n) => item(n.href, n.label, n.icon))}</ul>
    </nav>
  );
}

function UserBox() {
  const name = useName();
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-2 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-fg" aria-hidden>
        {(name || "T").charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 text-sm">
        <div className="truncate font-semibold text-text">{name || "Tu espacio"}</div>
        <Link href="/app/ajustes" className="text-xs font-semibold text-primary-ink underline-offset-2 hover:underline">
          Uso personal · ajustes
        </Link>
      </div>
    </div>
  );
}

function DataBanner() {
  const pathname = usePathname();
  if (pathname.startsWith("/app/mercado-libre") || pathname.startsWith("/app/calculadora") || pathname.startsWith("/app/ajustes") || pathname.startsWith("/app/guia")) {
    return (
      <div className="border-b border-border bg-success-soft px-4 py-2 text-center text-xs font-medium text-text-2 sm:text-sm">
        {pathname.startsWith("/app/mercado-libre") ? (
          <>
            <strong className="font-bold text-text">Datos reales</strong> de la API oficial de Mercado Libre.
          </>
        ) : (
          <>Esta pantalla trabaja con tus propios datos.</>
        )}
      </div>
    );
  }
  return (
    <div className="border-b border-border bg-accent-soft px-4 py-2 text-center text-xs font-medium text-text-2 sm:text-sm">
      Esta pantalla usa <strong className="font-bold text-text">datos de ejemplo</strong>.{" "}
      <Link href="/app/mercado-libre" className="font-semibold text-primary-ink underline">
        Ver datos reales en Mercado Libre
      </Link>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const watch = useWatchlist();
  const alertCount = useMemo(
    () => evaluateAlerts(watch).filter((a) => a.severity !== "buena").length,
    [watch],
  );

  return (
    <div className="min-h-screen lg:flex">
      {/* Barra lateral (escritorio) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-5 border-r border-border bg-surface p-4 lg:flex">
        <Link href="/app" className="px-1 pt-1" aria-label="Veta, inicio">
          <Logo />
        </Link>
        <CountrySelect id="pais-escritorio" />
        <NavLinks alertCount={alertCount} />
        <UserBox />
      </aside>

      {/* Barra superior (móvil) */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur lg:hidden">
        <Link href="/app" aria-label="Veta, inicio">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-text hover:bg-surface-2"
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <Menu size={22} />
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Cerrar menú" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[86%] max-w-xs flex-col gap-5 overflow-y-auto bg-surface p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-surface-2"
                aria-label="Cerrar menú"
              >
                <X size={22} />
              </button>
            </div>
            <CountrySelect id="pais-movil" />
            <NavLinks onNavigate={() => setOpen(false)} alertCount={alertCount} />
            <UserBox />
          </div>
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <DataBanner />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
