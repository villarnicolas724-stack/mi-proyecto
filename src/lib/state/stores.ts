"use client";

// Estado del usuario guardado en el navegador mientras no hay backend.
// Con Supabase, estas mismas funciones leerán y escribirán en las tablas
// profiles, watches, alert_rules y guide_progress.

import { useSyncExternalStore } from "react";
import { DEFAULT_RULES, type AlertRules, type WatchItem } from "@/lib/data/alerts";
import type { CountryCode } from "@/lib/data/types";

interface LocalStore<T> {
  get: () => T;
  getServer: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
}

function createLocalStore<T>(key: string, initial: T): LocalStore<T> {
  let value = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) value = JSON.parse(raw) as T;
    } catch {
      // Almacenamiento bloqueado o dato corrupto: seguimos con el valor inicial.
    }
  }

  return {
    get() {
      load();
      return value;
    },
    getServer() {
      return initial;
    },
    set(next) {
      load();
      value = typeof next === "function" ? (next as (prev: T) => T)(value) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Sin almacenamiento: el cambio vive solo en esta pestaña.
      }
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          loaded = false;
          listener();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
  };
}

function useStore<T>(store: LocalStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}

// ---- País ----
export const countryStore = createLocalStore<CountryCode>("veta:pais", "CO");
export const useCountry = () => useStore(countryStore);

// ---- Tema ----
export type ThemeChoice = "system" | "light" | "dark";
export const themeStore = createLocalStore<ThemeChoice>("veta:tema", "system");
export const useTheme = () => useStore(themeStore);
export function applyTheme(choice: ThemeChoice) {
  themeStore.set(choice);
  if (choice === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = choice;
}

// ---- Sesión simulada ----
export interface Session {
  name: string;
  email: string;
}
export const sessionStore = createLocalStore<Session | null>("veta:sesion", null);
export const useSession = () => useStore(sessionStore);

// ---- Plan simulado ----
export type PlanId = "gratis" | "pro" | "equipo";
export const planStore = createLocalStore<PlanId>("veta:plan", "gratis");
export const usePlan = () => useStore(planStore);
export const FREE_WATCH_LIMIT = 3;

// ---- Seguimiento ----
export const watchStore = createLocalStore<WatchItem[]>("veta:seguimiento", []);
export const useWatchlist = () => useStore(watchStore);

export function isWatched(items: WatchItem[], listingId: string) {
  return items.some((i) => i.listingId === listingId);
}

/** Devuelve false si el plan gratis ya llegó a su límite. */
export function toggleWatch(listingId: string, plan: PlanId): boolean {
  const items = watchStore.get();
  if (isWatched(items, listingId)) {
    watchStore.set(items.filter((i) => i.listingId !== listingId));
    return true;
  }
  if (plan === "gratis" && items.length >= FREE_WATCH_LIMIT) return false;
  watchStore.set([...items, { listingId, addedAt: new Date().toISOString(), rules: { ...DEFAULT_RULES } }]);
  completeStep("seguir");
  return true;
}

export function updateRules(listingId: string, rules: Partial<AlertRules>) {
  watchStore.set((items) =>
    items.map((i) => (i.listingId === listingId ? { ...i, rules: { ...i.rules, ...rules } } : i)),
  );
}

// ---- Ruta guiada ----
export const GUIDE_STEPS = [
  {
    id: "pais",
    title: "Elige tu país",
    detail: "Los datos, la saturación y los precios cambian por país. Puedes cambiarlo en el menú cuando quieras.",
    href: "/app/ajustes",
  },
  {
    id: "filtrar",
    title: "Filtra productos con demanda real",
    detail: "Usa el atajo «Ganadores probados»: 10 ventas o más en 7 días, repartidas y con saturación baja.",
    href: "/app/productos",
  },
  {
    id: "detalle",
    title: "Abre un producto y lee su puntuación",
    detail: "Cada factor te dice en una frase si está bien, regular o mal.",
    href: "/app/productos",
  },
  {
    id: "calcular",
    title: "Calcula tu utilidad por pedido",
    detail: "Ajusta CPA y efectividad de entrega: si no da, descártalo antes de pautar.",
    href: "/app/calculadora",
  },
  {
    id: "anuncios",
    title: "Mira cómo lo anuncian otros",
    detail: "Saca ángulos de los anuncios que llevan más días activos.",
    href: "/app/anuncios",
  },
  {
    id: "seguir",
    title: "Sigue el producto y activa alertas",
    detail: "Te avisamos si se agota, sube de precio o llega competencia.",
    href: "/app/seguimiento",
  },
] as const;

export type GuideStepId = (typeof GUIDE_STEPS)[number]["id"];
export const guideStore = createLocalStore<Partial<Record<GuideStepId, boolean>>>("veta:guia", {});
export const useGuide = () => useStore(guideStore);

export function completeStep(id: GuideStepId) {
  if (guideStore.get()[id]) return;
  guideStore.set((g) => ({ ...g, [id]: true }));
}

export function resetGuide() {
  guideStore.set({});
}
